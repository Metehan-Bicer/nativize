import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { scanProject, scanText, ALL_RULES } from '../skills/nativize/scripts/scan.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fx = (name) => join(here, 'fixtures', name);
const rules = (r) => new Set(r.findings.map((f) => f.rule));

test('finds the usual tells in a sloppy React Native screen', () => {
  const r = scanProject(fx('slop-rn'));
  const found = rules(r);
  for (const id of ['gradient-chrome', 'ai-purple', 'font-scaling-off', 'emoji-ui', 'glow-shadow', 'fixed-screen-height', 'no-press-feedback', 'marketing-copy', 'shouty-labels', 'off-ramp-font-size', 'no-dark-mode']) {
    assert.ok(found.has(id), `expected ${id}`);
  }
  assert.ok(r.score < 40, `score ${r.score} should be low`);
});

test('a native looking React Native screen scores high', () => {
  const r = scanProject(fx('clean-rn'));
  assert.equal(r.uiFiles, 1);
  assert.deepEqual(r.findings, []);
  assert.equal(r.score, 100);
});

test('finds the usual tells in a sloppy SwiftUI view', () => {
  const r = scanProject(fx('slop-swift'));
  const found = rules(r);
  for (const id of ['gradient-chrome', 'ai-purple', 'font-scaling-off', 'emoji-ui', 'glow-shadow', 'no-press-feedback', 'custom-back', 'shouty-labels', 'marketing-copy', 'off-ramp-font-size']) {
    assert.ok(found.has(id), `expected ${id}`);
  }
});

test('reports file and line', () => {
  const [f] = scanText("const a = 1;\n<LinearGradient colors={x} />", 'Screen.tsx', 'rn');
  assert.equal(f.rule, 'gradient-chrome');
  assert.equal(f.line, 2);
});

test('ignores comments and black shadows', () => {
  const found = scanText("// <LinearGradient />\nconst s = { shadowColor: '#000', shadowOpacity: 0.1 };", 'a.tsx', 'rn');
  assert.deepEqual(found, []);
});

test('a dynamic type range is allowed, a fixed size is not', () => {
  assert.equal(scanText('.dynamicTypeSize(...DynamicTypeSize.accessibility2)', 'a.swift', 'swift').length, 0);
  assert.equal(scanText('.dynamicTypeSize(.large)', 'a.swift', 'swift')[0].rule, 'font-scaling-off');
});

test('every rule has a title, a fix and a severity', () => {
  for (const r of Object.values(ALL_RULES)) {
    assert.ok(r.title && r.fix && ['high', 'medium', 'low'].includes(r.severity), r.id);
  }
});

test('CLI exits non zero below --min-score', () => {
  const cli = join(here, '..', 'skills', 'nativize', 'scripts', 'scan.mjs');
  assert.throws(() => execFileSync('node', [cli, fx('slop-rn'), '--min-score', '80'], { stdio: 'pipe' }));
  execFileSync('node', [cli, fx('clean-rn'), '--min-score', '80'], { stdio: 'pipe' });
});

test('near black shadows are not glow, saturated ones are', async () => {
  const { isGlowColor } = await import('../skills/nativize/scripts/scan.mjs');
  for (const c of ['#000', '#0F1419', 'rgba(0,0,0,0.2)', '#333333', 'black']) assert.equal(isGlowColor(c), false, c);
  for (const c of ['#7C3AED', '#22D3EE', 'rgba(236, 72, 153, 0.8)', 'purple']) assert.equal(isGlowColor(c), true, c);
});

test('emoji in share text and imports are not flagged', () => {
  assert.deepEqual(scanText("shareMessage: (t) => `🎁 ${t}`,", 'i18n.ts', 'rn'), []);
  assert.deepEqual(scanText("import { LinearGradient } from 'expo-linear-gradient';", 'a.tsx', 'rn'), []);
});
