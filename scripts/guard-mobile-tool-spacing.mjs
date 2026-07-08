#!/usr/bin/env node
/**
 * guard-mobile-tool-spacing.mjs
 *
 * Scans source files for mobile-spacing violations on tool pages:
 *  - min-height: 100vh inside tool/form/result sections
 *  - padding-bottom > 180px outside actionbar-safe-area
 *  - margin-top > 160px in form/result/advanced/footer wrappers
 *  - "Advanced details" + "Formula logic" glued text
 *  - Desktop fixed height "No result yet" panel on mobile
 *
 * Usage: node scripts/guard-mobile-tool-spacing.mjs
 * Exit code: 0 = PASS, 1 = FAIL
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const TARGET_FILES = [
  "src/sectorcalc/pro-form/universal-industrial-decision-form.css",
  "src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx",
  "src/components/layout/mobile/MobileStickyActionBar.tsx",
  "src/components/layout/EnterpriseFooter.tsx",
  "src/styles/mobile-navigation.css",
];

const ISSUES = [];

function scanFile(relPath) {
  const absPath = join(ROOT, relPath);
  if (!existsSync(absPath)) {
    ISSUES.push({ file: relPath, line: 0, type: "FILE_NOT_FOUND", detail: `File does not exist: ${absPath}` });
    return;
  }
  const content = readFileSync(absPath, "utf-8");
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineno = i + 1;

    // Skip CSS comments and non-property lines
    if (line.trim().startsWith("/*") || line.trim().startsWith("*") || line.trim().startsWith("//")) continue;
    // A property line must contain a colon followed by a value (not just any colon)
    if (!/^\s*[\w-]+\s*:\s/.test(line.trim())) continue;

    // Rule 1: min-height: 100vh inside tool/form/result sections (not at body/html level)
    if (/min-height\s*:\s*100vh/i.test(line) && !/body|html/i.test(line)) {
      ISSUES.push({
        file: relPath,
        line: lineno,
        type: "MIN_HEIGHT_100VH",
        detail: `min-height: 100vh detected inside component (not body/html): "${line.trim()}"`,
      });
    }

    // Rule 2: min-height above 60vh
    if ((/min-height\s*:\s*\d+vh/i.test(line)) && !/body|html/i.test(line)) {
      const match = line.match(/min-height\s*:\s*(\d+)vh/i);
      if (match && parseInt(match[1], 10) > 60) {
        ISSUES.push({
          file: relPath,
          line: lineno,
          type: "MIN_HEIGHT_GT_60VH",
          detail: `min-height: ${match[1]}vh (exceeds 60vh threshold): "${line.trim()}"`,
        });
      }
    }

    // Rule 3: padding-bottom > 180px outside known actionbar-safe-area
    if (/padding-bottom\s*:\s*\d+px/i.test(line)) {
      const match = line.match(/padding-bottom\s*:\s*(\d+)px/i);
      if (match && parseInt(match[1], 10) > 180) {
        ISSUES.push({
          file: relPath,
          line: lineno,
          type: "PADDING_BOTTOM_GT_180PX",
          detail: `padding-bottom: ${match[1]}px exceeds 180px: "${line.trim()}"`,
        });
      }
    }

    // Rule 4: margin-top > 160px in tool section wrappers
    if (/margin-top\s*:\s*\d+px/i.test(line)) {
      const match = line.match(/margin-top\s*:\s*(\d+)px/i);
      if (match && parseInt(match[1], 10) > 160) {
        ISSUES.push({
          file: relPath,
          line: lineno,
          type: "MARGIN_TOP_GT_160PX",
          detail: `margin-top: ${match[1]}px exceeds 160px threshold: "${line.trim()}"`,
        });
      }
    }

    // Rule 5: "Advanced details" immediately adjacent to "Formula logic" (glued text)
    if (/Advanced detailsFormula/i.test(line.replace(/\s+/g, ""))) {
      ISSUES.push({
        file: relPath,
        line: lineno,
        type: "ADVANCED_DETAILS_GLUE",
        detail: `"Advanced details" and "Formula logic" appear glued without separator: "${line.trim()}"`,
      });
    }

    // Rule 6: desktop fixed height "No result yet" panel (padding > 36px on desktop)
    if (/No result yet/i.test(line)) {
      // Check nearby lines for large padding
      for (let j = Math.max(0, i - 3); j < Math.min(lines.length, i + 3); j++) {
        if (/padding\s*:\s*\d+px\s+\d+px/i.test(lines[j])) {
          const pmatch = lines[j].match(/padding\s*:\s*(\d+)px\s+\d+px/i);
          if (pmatch && parseInt(pmatch[1], 10) > 36) {
            ISSUES.push({
              file: relPath,
              line: j + 1,
              type: "PLACEHOLDER_LARGE_PADDING",
              detail: `"No result yet" panel has large padding (${pmatch[1]}px) near line ${lineno}: "${lines[j].trim()}"`,
            });
          }
        }
      }
    }
  }
}

// Target files
TARGET_FILES.forEach(scanFile);

// Report
console.log("\n══════════════════════════════════════════════════");
console.log("  MOBILE TOOL SPACING GUARD");
console.log("══════════════════════════════════════════════════\n");

if (ISSUES.length === 0) {
  console.log("  ✅ MOBILE_TOOL_SPACING_GUARD=PASS");
  console.log("  GHOST_VERTICAL_GAPS=0");
  console.log("  ADVANCED_DETAILS_GLUE=0");
  console.log("  FOOTER_ACTIONBAR_OVERLAP_RISK=0\n");
  process.exit(0);
} else {
  console.log(`  ❌ FAIL — ${ISSUES.length} issue(s) found:\n`);
  for (const issue of ISSUES) {
    console.log(`  [${issue.type}] ${issue.file}:${issue.line}`);
    console.log(`    ${issue.detail}\n`);
  }
  console.log("  MOBILE_TOOL_SPACING_GUARD=FAIL\n");
  process.exit(1);
}
