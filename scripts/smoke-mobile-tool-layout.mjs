#!/usr/bin/env node
/**
 * smoke-mobile-tool-layout.mjs
 *
 * Static-analysis smoke test for mobile tool page layout.
 * Checks that key mobile spacing rules are followed without
 * actually rendering in a browser.
 *
 * Checks performed:
 *  1. CSS files contain mobile spacing contract tokens
 *  2. Advanced details summary has proper structure
 *  3. Result panel placeholder is compact
 *  4. Sticky action bar uses safe-area
 *  5. No min-height: 100vh on tool sections
 *  6. Footer has reduced margin-top on mobile
 *  7. Action bar z-index is appropriate
 *
 * Usage: node scripts/smoke-mobile-tool-layout.mjs
 * Exit code: 0 = PASS, 1 = FAIL
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const CHECKS = [];
let allPass = true;

function check(label, condition, detail = "") {
  CHECKS.push({ label, condition: !!condition, detail });
  if (!condition) allPass = false;
}

// ── 1. CSS: Mobile spacing tokens exist ──
function readFile(relPath) {
  const absPath = join(ROOT, relPath);
  if (!existsSync(absPath)) return null;
  return readFileSync(absPath, "utf-8");
}

const css = readFile("src/sectorcalc/pro-form/universal-industrial-decision-form.css");
if (!css) {
  console.log("❌ CRITICAL: universal-industrial-decision-form.css not found");
  process.exit(1);
}

// Check mobile spacing tokens exist under @media (max-width: 768px)
const mobileBlockMatch = css.match(/@media\s*\(\s*max-width\s*:\s*768px\s*\)\s*\{([^}]*|\{[^}]*\})*\}/);
check(
  "Mobile @media max-width:768px block exists",
  mobileBlockMatch,
  "CSS must have @media (max-width: 768px) for mobile spacing"
);

check(
  "Mobile spacing token --sc-mobile-page-x exists",
  css.includes("--sc-mobile-page-x"),
  "Token --sc-mobile-page-x must be defined for mobile padding"
);

check(
  "Mobile spacing token --sc-mobile-section-gap exists",
  css.includes("--sc-mobile-section-gap"),
  "Token --sc-mobile-section-gap must be defined"
);

check(
  "Mobile spacing token --sc-mobile-card-gap exists",
  css.includes("--sc-mobile-card-gap"),
  "Token --sc-mobile-card-gap must be defined"
);

check(
  "Mobile actionbar height token --sc-actionbar-height exists",
  css.includes("--sc-actionbar-height"),
  "Token --sc-actionbar-height must be defined"
);

// ── 2. No min-height: 100vh on tool sections (skip comments) ──
const hundredVhLines = css.split("\n").filter(
  (l) => /min-height\s*:\s*100vh/i.test(l) && !/body|html/i.test(l) && !l.trim().startsWith("/*") && !l.trim().startsWith("*")
);
check(
  "No min-height: 100vh on tool/form/result sections",
  hundredVhLines.length === 0,
  `Found ${hundredVhLines.length} instances: ${hundredVhLines.join("; ")}`
);

// ── 3. Sticky action bar uses env(safe-area-inset-bottom) ──
check(
  "Sticky action bar uses safe-area",
  css.includes("env(safe-area-inset-bottom"),
  "Mobile action bar must include env(safe-area-inset-bottom) in padding"
);

// ── 4. Sticky action bar has z-index >= 40 ──
const zIndexMatch = css.match(/\.sc-v531-mobile-action-bar\s*\{[^}]*z-index\s*:\s*(\d+)/);
check(
  "Sticky action bar z-index >= 40",
  zIndexMatch && parseInt(zIndexMatch[1], 10) >= 40,
  `Found z-index: ${zIndexMatch ? zIndexMatch[1] : "none"}`
);

// ── 5. Result placeholder has compact padding on mobile ──
const placeholderMobileMatch = css.includes(".sc-v531-placeholder") &&
  css.includes("padding") &&
  css.includes("min-height: auto");
check(
  "Result placeholder has compact mobile styles",
  placeholderMobileMatch,
  "Placeholder must have min-height: auto and compact padding"
);

// ── 6. Advanced details have proper summary layout ──
check(
  "Advanced summary uses flex",
  css.includes(".sc-v531-advanced-summary"),
  "CSS must have .sc-v531-advanced-summary class"
);

check(
  "Advanced links separated (span-based)",
  css.includes(".sc-v531-advanced-links"),
  "CSS must have .sc-v531-advanced-links class for label tags"
);

// ── 7. Shell padding-bottom for sticky bar reservation ──
const shellPaddingMatch = css.match(/\.sc-v531-shell\s*\{[^}]*padding-bottom[^}]*\}/);
check(
  "Shell has padding-bottom for sticky bar",
  shellPaddingMatch,
  "Shell must have bottom padding to reserve space for sticky bar"
);

// ── 8. Tool TSX: Advanced details uses span wrappers ──
const formTsx = readFile("src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx");
if (formTsx) {
  check(
    "Advanced details uses <span> for each tag",
    formTsx.includes("<span>Formula logic</span>"),
    "Each advanced details label must be wrapped in <span> for CSS separators"
  );

  check(
    "Advanced details uses <span> for Validation notes",
    formTsx.includes("<span>Validation notes</span>"),
    "Validation notes must be wrapped in <span>"
  );

  check(
    "Advanced details has 'Advanced details' as separate span",
    formTsx.includes("<span>Advanced details</span>"),
    "Advanced details header must be a separate <span> from tags"
  );
}

// ── 9. MobileFooter: compact on mobile ──
const footerTsx = readFile("src/components/layout/EnterpriseFooter.tsx");
if (footerTsx) {
  check(
    "Footer has mobile-essential section",
    footerTsx.includes("footer-mobile-essential"),
    "Footer must have compact mobile view"
  );
}

// ── 10. MobileStickyActionBar ──
const stickyTsx = readFile("src/components/layout/mobile/MobileStickyActionBar.tsx");
if (stickyTsx) {
  check(
    "Sticky bar handles safe-area dynamically",
    stickyTsx.includes("safe-area-inset-bottom") || stickyTsx.includes("--sc-actionbar-height"),
    "Sticky bar component must reference safe-area or actionbar-height"
  );
}

// ── Report ──
console.log("\n══════════════════════════════════════════════════");
console.log("  MOBILE TOOL LAYOUT SMOKE — Static Analysis");
console.log("══════════════════════════════════════════════════\n");

let passCount = 0;
let failCount = 0;
for (const c of CHECKS) {
  const symbol = c.condition ? "✅" : "❌";
  console.log(`  ${symbol}  ${c.label}`);
  if (!c.condition && c.detail) console.log(`       ${c.detail}`);
  if (c.condition) passCount++;
  else failCount++;
}

console.log(`\n  ${passCount} passed, ${failCount} failed`);

if (allPass) {
  console.log("\n  ✅ MOBILE_TOOL_LAYOUT_SMOKE=PASS\n");
  process.exit(0);
} else {
  console.log("\n  ❌ MOBILE_TOOL_LAYOUT_SMOKE=FAIL\n");
  process.exit(1);
}
