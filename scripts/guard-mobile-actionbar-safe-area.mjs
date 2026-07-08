#!/usr/bin/env node
// SectorCalc Guard: Mobile Action Bar Safe Area
// Verifies mobile sticky bar has proper safe-area padding and doesn't overlap content.
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const failures = [];

const cssFile = path.join(ROOT, "src/sectorcalc/pro-form/universal-industrial-decision-form.css");
const cssContent = fs.readFileSync(cssFile, "utf8");

// 1. Mobile action bar must use safe-area-inset-bottom
if (!cssContent.includes("safe-area-inset-bottom")) {
  failures.push("CSS must use env(safe-area-inset-bottom) for mobile bar");
}

// 2. Must have --sc-actionbar-height variable
if (!cssContent.includes("--sc-actionbar-height")) {
  failures.push("CSS must define --sc-actionbar-height variable");
}

// 3. Mobile action bar must be positioned fixed at bottom
// Check for the key CSS properties anywhere in the file (they exist in .sc-v531-mobile-action-bar)
if (!cssContent.includes("position: fixed")) {
  failures.push("CSS must have position: fixed (for mobile action bar)");
}
if (!cssContent.includes("bottom: 0")) {
  failures.push("CSS must have bottom: 0 (for mobile action bar)");
}
if (!cssContent.includes("z-index: 40")) {
  failures.push("CSS must have z-index: 40 (for mobile action bar)");
}

// 4. Last section must have bottom margin to avoid sticky bar overlap
if (!cssContent.includes("margin-bottom: calc(var(--sc-actionbar-height")) {
  failures.push("Last section must have bottom margin to avoid sticky bar overlap");
}

// 5. Mobile shell padding must account for action bar height
if (!cssContent.includes("calc(var(--sc-actionbar-height, 88px) + env(safe-area-inset-bottom")) {
  failures.push("Shell padding must include actionbar height + safe-area");
}

if (failures.length > 0) {
  console.error("MOBILE_ACTIONBAR_SAFE_AREA=FAIL\n" + failures.join("\n"));
  process.exit(1);
}
console.log("MOBILE_ACTIONBAR_SAFE_AREA=PASS");
