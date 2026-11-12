#!/usr/bin/env node
// nativize scan: finds code-level tells of an AI-made mobile UI in React Native, Expo and SwiftUI projects.
// No dependencies. Usage: node scan.mjs [project-root] [--json] [--min-score N]

import { readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const SKIP_DIRS = new Set([
  "node_modules", ".git", ".expo", "ios", "android", "Pods", "build", "dist", "DerivedData",
  ".next", "coverage", "vendor", ".turbo", "web-build", "__tests__", "test", "tests",
]);
const RN_EXT = new Set([".tsx", ".jsx", ".ts", ".js"]);
const SWIFT_EXT = new Set([".swift"]);
const WEIGHT = { high: 6, medium: 3, low: 1 };
const MAX_PER_RULE_PER_FILE = 5;

// iOS text styles and the Material 3 type scale; sizes outside both are usually typed in by feel.
const RAMP = new Set([11, 12, 13, 14, 15, 16, 17, 20, 22, 24, 28, 32, 34, 36, 45, 57]);
const AI_PURPLES = "8B5CF6|7C3AED|6D28D9|6366F1|4F46E5|A855F7|9333EA|C084FC|EC4899|D946EF|818CF8|A78BFA";
const EMOJI = /\p{Extended_Pictographic}/u;
// Text meant for other apps (share sheets, notifications) may carry emoji on purpose.
const OUTBOUND_TEXT = /\b(?:share\w*|message|notification\w*|title:\s*`)\s*[:=(]/i;

// A shadow is a glow when its color is saturated or light; near black and gray shadows are normal.
export function isGlowColor(value) {
  const v = value.trim().replace(/^["'{\s]+|["'}\s,]+$/g, "");
  if (/^(black|transparent)$/i.test(v)) return false;
  let r, g, b;
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})(?:[0-9a-f]{2})?$/i);
  const rgb = v.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].replace(/./g, "$&$&") : hex[1];
    [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  } else if (rgb) {
    [r, g, b] = rgb.slice(1, 4).map(Number);
  } else {
    return /^(?:purple|violet|indigo|magenta|fuchsia|pink|cyan|teal|blue)$/i.test(v);
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const sat = max === 0 ? 0 : (max - min) / max;
  return lum > 0.25 && sat > 0.35;
}
const STRING_WITH_EMOJI = /(["'`])(?:(?!\1).)*\p{Extended_Pictographic}(?:(?!\1).)*\1|>[^<{}]*\p{Extended_Pictographic}[^<{}]*</u;

// Line rules: test(line) returns true when the line shows the tell.
export const LINE_RULES = [
  {
    id: "gradient-chrome", severity: "high", stacks: ["rn", "swift"],
    title: "Gradient used on chrome",
    fix: "Use a flat system background or the single accent color; keep gradients for real content only.",
    test: (l) => !/^\s*<\//.test(l) && /\bLinearGradient\b|expo-linear-gradient|react-native-linear-gradient|\bRadialGradient\b|\bAngularGradient\b/.test(l),
  },
  {
    id: "ai-purple", severity: "medium", stacks: ["rn", "swift"],
    title: "Default AI purple, violet or pink",
    fix: "Pick one accent from the product's own world and use system colors for the rest.",
    test: (l) =>
      new RegExp(`#(${AI_PURPLES})\\b`, "i").test(l) ||
      /\b(?:Color|foregroundStyle|foregroundColor|tint|background)\(?\s*\.(?:purple|indigo)\b/.test(l) ||
      /colors:\s*\[[^\]]*\.(?:purple|indigo)\b/.test(l),
  },
  {
    id: "font-scaling-off", severity: "high", stacks: ["rn", "swift"],
    title: "Font scaling turned off",
    fix: "Let text scale. Cap with maxFontSizeMultiplier or a DynamicTypeSize range only where layout would break.",
    test: (l) => /allowFontScaling\s*(?:=\s*\{\s*false\s*\}|:\s*false)/.test(l) || /\.dynamicTypeSize\(\s*\.[a-zA-Z0-9]+\s*\)/.test(l),
  },
  {
    id: "emoji-ui", severity: "medium", stacks: ["rn", "swift"],
    title: "Emoji used as UI text or icon",
    fix: "Use one icon family (SF Symbols, Material Symbols) and plain labels.",
    test: (l, prev = "") => EMOJI.test(l) && STRING_WITH_EMOJI.test(l) && !OUTBOUND_TEXT.test(l) && !OUTBOUND_TEXT.test(prev),
  },
  {
    id: "glow-shadow", severity: "medium", stacks: ["rn", "swift"],
    title: "Colored glow shadow",
    fix: "Remove colored shadows. Separate surfaces with background layers, not glow.",
    test: (l) =>
      (() => { const m = l.match(/shadowColor\s*[:=]\s*\{?\s*["']([^"']+)["']/); return !!m && isGlowColor(m[1]); })() ||
      /\.shadow\(\s*color:\s*(?:\.(?:purple|indigo|pink|blue|cyan|teal|mint|accentColor)|Color\((?!\.black))/.test(l),
  },
  {
    id: "fixed-screen-height", severity: "medium", stacks: ["rn", "swift"],
    title: "Layout sized for one phone",
    fix: "Let content scroll and pin the primary action; test the smallest phone at the largest text size.",
    test: (l) => /Dimensions\.get\(\s*["']window["']\s*\)\.height\s*\*/.test(l) || /\bheight\s*:\s*[5-9]\d{2}\b/.test(l) || /\.frame\([^)]*height:\s*[5-9]\d{2}\b/.test(l),
  },
  {
    id: "custom-tab-bar", severity: "medium", stacks: ["rn"],
    title: "Custom tab bar",
    fix: "Use the native tab bar (Expo Router Tabs / native tabs, bottom-tabs default rendering).",
    test: (l) => /\btabBar\s*=\s*\{/.test(l),
  },
  {
    id: "custom-back", severity: "medium", stacks: ["rn", "swift"],
    title: "Custom back button",
    fix: "Keep the system back button so the swipe back gesture keeps working.",
    test: (l) => /\.navigationBarBackButtonHidden\(\s*true\s*\)/.test(l) || /\bheaderLeft\s*[:=]/.test(l),
  },
  {
    id: "no-press-feedback", severity: "low", stacks: ["rn", "swift"],
    title: "Tappable without visible feedback",
    fix: "Use Pressable with a pressed style, or a SwiftUI Button with a style.",
    test: (l) => /\bTouchableWithoutFeedback\b/.test(l) || /\.onTapGesture\s*\{/.test(l),
  },
  {
    id: "marketing-copy", severity: "medium", stacks: ["rn", "swift"],
    title: "Marketing voice inside the app",
    fix: "Short, specific copy. Buttons say what happens.",
    test: (l) => /(["'`>])[^"'`<]*\b(?:unlock your|supercharge|level up your|your journey|unleash|game[- ]changer|let'?s go!|get started!|transform your)/i.test(l),
  },
  {
    id: "off-ramp-font-size", severity: "medium", stacks: ["rn", "swift"],
    title: "Font size off the platform type ramp",
    fix: "Use the iOS text styles or the Material type scale (11, 12, 13, 15, 17, 20, 22, 28, 34 on iOS).",
    test: (l) => {
      const sizes = [...l.matchAll(/\bfontSize\s*:\s*(\d+(?:\.\d+)?)\b|\.system\(\s*size:\s*(\d+(?:\.\d+)?)/g)].map((m) => Number(m[1] ?? m[2]));
      return sizes.some((n) => !RAMP.has(n));
    },
  },
  {
    id: "looping-motion", severity: "low", stacks: ["rn", "swift"],
    title: "Looping animation in the chrome",
    fix: "Remove pulses and shimmer from chrome; respect Reduce Motion.",
    test: (l) => /\bwithRepeat\(|\bAnimated\.loop\(|\.repeatForever\(/.test(l),
  },
  {
    id: "shouty-labels", severity: "low", stacks: ["rn", "swift"],
    title: "All caps tracked labels",
    fix: "Sentence case; let the platform decide where caps belong.",
    test: (l) => /textTransform\s*:\s*["']uppercase["']/.test(l) || /\.textCase\(\s*\.uppercase\s*\)/.test(l),
  },
];

// File rules look at the whole file and return a count (0 means no finding) and the first line.
export const FILE_RULES = [
  {
    id: "typed-font-sizes", severity: "low", stacks: ["rn", "swift"],
    title: "Many font sizes typed in by hand",
    fix: "Define one type ramp (or use text styles) and reuse it so Dynamic Type works.",
    threshold: 10,
    pattern: /\bfontSize\s*:\s*\d+|\.font\(\s*\.system\(\s*size:\s*\d+/g,
  },
  {
    id: "shadow-everywhere", severity: "low", stacks: ["rn", "swift"],
    title: "Shadows on many elements",
    fix: "iOS separates content with background layers; keep at most one elevated element per screen.",
    threshold: 4,
    pattern: /\bshadowOpacity\s*:|\belevation\s*:\s*[1-9]|\.shadow\(/g,
  },
  {
    id: "hardcoded-colors", severity: "low", stacks: ["swift"],
    title: "Colors defined inline",
    fix: "Use semantic system colors and asset catalog colors with dark variants.",
    threshold: 5,
    pattern: /Color\(\s*red:|Color\(\s*hex:|Color\(\s*"#/g,
  },
];

function stackOf(file) {
  const ext = extname(file);
  if (SWIFT_EXT.has(ext)) return "swift";
  if (RN_EXT.has(ext)) return "rn";
  return null;
}

function isComment(line) {
  const t = line.trim();
  return t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("import ");
}

function looksLikeUi(text, stack) {
  if (stack === "swift") return /import\s+SwiftUI/.test(text);
  return /from\s+["']react-native["']|from\s+["']expo-|StyleSheet\.create|<View\b|<Text\b/.test(text);
}

export function walk(root) {
  const out = [];
  const visit = (dir) => {
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (e.name.startsWith(".") && e.name !== ".") { if (e.isDirectory()) continue; }
      const p = join(dir, e.name);
      if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) visit(p); }
      else if (stackOf(p) && !/\.(test|spec|d)\.[jt]sx?$/.test(e.name)) out.push(p);
    }
  };
  if (statSync(root).isFile()) return [root];
  visit(root);
  return out;
}

export function scanText(text, file, stack) {
  const findings = [];
  const lines = text.split("\n");
  const perRule = new Map();
  lines.forEach((line, i) => {
    if (isComment(line)) return;
    for (const rule of LINE_RULES) {
      if (!rule.stacks.includes(stack) || !rule.test(line, lines[i - 1] ?? "")) continue;
      const n = (perRule.get(rule.id) ?? 0) + 1;
      perRule.set(rule.id, n);
      if (n <= MAX_PER_RULE_PER_FILE) findings.push({ rule: rule.id, file, line: i + 1, snippet: line.trim().slice(0, 120) });
    }
  });
  for (const rule of FILE_RULES) {
    if (!rule.stacks.includes(stack)) continue;
    const matches = [...text.matchAll(rule.pattern)];
    if (matches.length >= rule.threshold) {
      const line = text.slice(0, matches[0].index).split("\n").length;
      findings.push({ rule: rule.id, file, line, count: matches.length, snippet: `${matches.length} occurrences` });
    }
  }
  return findings;
}

export function scanProject(root) {
  root = resolve(root);
  const files = walk(root);
  const findings = [];
  let uiFiles = 0;
  let darkModeAware = false;
  for (const f of files) {
    const stack = stackOf(f);
    let text;
    try { text = readFileSync(f, "utf8"); } catch { continue; }
    if (/useColorScheme|PlatformColor|DynamicColorIOS|colorScheme|Color\(\.system|\.primary\b|\.secondary\b/.test(text)) darkModeAware = true;
    if (!looksLikeUi(text, stack)) continue;
    uiFiles++;
    for (const x of scanText(text, f, stack)) findings.push({ ...x, file: relative(root, x.file) || x.file });
  }
  try {
    const app = readFileSync(join(root, "app.json"), "utf8");
    if (/"userInterfaceStyle"\s*:\s*"automatic"/.test(app)) darkModeAware = true;
  } catch {}
  if (uiFiles > 0 && !darkModeAware) {
    findings.push({ rule: "no-dark-mode", file: ".", line: 0, snippet: "no color scheme handling found" });
  }
  return { root, uiFiles, findings, score: score(findings, uiFiles) };
}

export const PROJECT_RULES = [
  {
    id: "no-dark-mode", severity: "medium", stacks: ["rn", "swift"],
    title: "Dark mode not handled",
    fix: "Use system colors or useColorScheme, and check every screen in dark mode.",
  },
];

export const ALL_RULES = Object.fromEntries([...LINE_RULES, ...FILE_RULES, ...PROJECT_RULES].map((r) => [r.id, r]));

export function score(findings, uiFiles) {
  const penalty = findings.reduce((s, f) => s + WEIGHT[ALL_RULES[f.rule].severity], 0);
  const budget = Math.max(1, uiFiles) * 8;
  return Math.round((100 * budget) / (budget + penalty));
}

function report({ root, uiFiles, findings, score: s }) {
  const byRule = new Map();
  for (const f of findings) {
    if (!byRule.has(f.rule)) byRule.set(f.rule, []);
    byRule.get(f.rule).push(f);
  }
  const order = { high: 0, medium: 1, low: 2 };
  const rules = [...byRule.keys()].sort((a, b) => order[ALL_RULES[a].severity] - order[ALL_RULES[b].severity] || byRule.get(b).length - byRule.get(a).length);
  const out = [];
  out.push(`nativize scan  ${root}`);
  out.push(`${uiFiles} UI files, ${findings.length} findings, score ${s}/100`);
  out.push("");
  for (const id of rules) {
    const r = ALL_RULES[id];
    const list = byRule.get(id);
    out.push(`[${r.severity}] ${r.title} (${list.length})`);
    for (const f of list.slice(0, 6)) out.push(`  ${f.file}${f.line ? `:${f.line}` : ""}  ${f.snippet}`);
    if (list.length > 6) out.push(`  … ${list.length - 6} more`);
    out.push(`  fix: ${r.fix}`);
    out.push("");
  }
  if (!findings.length) out.push("No code-level tells found. Still check the screens at the largest text size and in dark mode.");
  return out.join("\n");
}

function main(argv) {
  const args = argv.slice(2);
  const json = args.includes("--json");
  const minIdx = args.indexOf("--min-score");
  const min = minIdx >= 0 ? Number(args[minIdx + 1]) : null;
  const root = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--min-score") ?? ".";
  const result = scanProject(root);
  console.log(json ? JSON.stringify(result, null, 2) : report(result));
  if (min !== null && result.score < min) process.exitCode = 1;
}

// Run as a CLI also when called through a symlink such as node_modules/.bin/nativize (npx).
const invoked = (() => { try { return pathToFileURL(realpathSync(process.argv[1] ?? "")).href; } catch { return ""; } })();
if (import.meta.url === invoked) main(process.argv);
