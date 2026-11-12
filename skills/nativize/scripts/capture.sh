#!/usr/bin/env bash
# nativize capture: screenshots of the current simulator or emulator screen in three conditions.
# Usage: capture.sh <label> [out-dir]
#   label    a folder name such as "before" or "after"
#   out-dir  where to write (default: ./nativize-shots)
# Writes <out-dir>/<label>/{default,largest-text,dark}.png and restores the device settings afterwards.
# iOS uses the booted simulator (xcrun simctl); Android uses the connected emulator (adb).
set -euo pipefail

label="${1:?usage: capture.sh <label> [out-dir]}"
out="${2:-nativize-shots}/$label"
mkdir -p "$out"
settle() { sleep "${NATIVIZE_SETTLE:-1.5}"; }

if command -v xcrun >/dev/null 2>&1 && xcrun simctl list devices booted 2>/dev/null | grep -q Booted; then
  shot() { xcrun simctl io booted screenshot --type=png "$1" >/dev/null 2>&1; }
  orig_size=$(xcrun simctl ui booted content_size 2>/dev/null || echo large)
  orig_look=$(xcrun simctl ui booted appearance 2>/dev/null || echo light)
  restore() { xcrun simctl ui booted content_size "$orig_size" >/dev/null 2>&1 || true; xcrun simctl ui booted appearance "$orig_look" >/dev/null 2>&1 || true; }
  trap restore EXIT
  xcrun simctl ui booted content_size large; xcrun simctl ui booted appearance light; settle
  shot "$out/default.png"
  xcrun simctl ui booted content_size accessibility-extra-extra-extra-large; settle
  shot "$out/largest-text.png"
  xcrun simctl ui booted content_size large; xcrun simctl ui booted appearance dark; settle
  shot "$out/dark.png"
elif command -v adb >/dev/null 2>&1 && adb get-state >/dev/null 2>&1; then
  shot() { adb exec-out screencap -p > "$1"; }
  orig_scale=$(adb shell settings get system font_scale | tr -d '\r')
  restore() { adb shell settings put system font_scale "${orig_scale:-1.0}" >/dev/null 2>&1 || true; adb shell cmd uimode night no >/dev/null 2>&1 || true; }
  trap restore EXIT
  adb shell settings put system font_scale 1.0; adb shell cmd uimode night no >/dev/null; settle
  shot "$out/default.png"
  adb shell settings put system font_scale 2.0; settle
  shot "$out/largest-text.png"
  adb shell settings put system font_scale 1.0; adb shell cmd uimode night yes >/dev/null; settle
  shot "$out/dark.png"
else
  echo "No booted iOS simulator or Android emulator found. Start the app first, then run capture.sh again." >&2
  exit 1
fi

echo "Saved $out/default.png, $out/largest-text.png, $out/dark.png"
