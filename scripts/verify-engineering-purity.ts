#!/usr/bin/env tsx
/**
 * CI/CD Engineering Metric & English Purity Gate
 * ================================================
 *
 * Verifies that the .de TLD site maintains "Pure English Engineering" standards:
 * - No German/European number formatting (1.500,00 → must be 1,500.00)
 * - No German technical term leakage (Zoll, Stück, Gewicht, Toleranz)
 * - No Euro currency symbol in calculation results
 *
 * Exit code: 0 = PASS, 1 = BLOCKED
 *
 * Usage: npx tsx scripts/verify-engineering-purity.ts
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

// European/German number format: dots as thousands-separator, comma as decimal
// e.g., "1.500,00" — forbidden. Global/US format is "1,500.00"
const EUROPEAN_NUMBER_FORMAT = /\d{1,3}(?:\.\d{3})+(?:\,\d+)/;

// German technical terms that must NOT appear in pure-English engineering content
const GERMAN_TECHNICAL_LEAKAGE = [
  /\bZoll\b/i,
  /\bGewicht\b/i,
  /\bToleranz\b/i,
  /\bWerkzeug\b/i,
  /\bBauteil\b/i,
  /\bZeichnung\b/i,
  /\bAbmessung\b/i,
  /\bDurchmesser\b/i,
  /\bBerechnung\b/i,
  /\bErgebnis\b/i,
  /\bEingabe\b/i,
  /\bAusgabe\b/i,
  /\bEinheit\b/i,
  /\bWerkstoff\b/i,
];

const SKIP_FILES = [
  "translation-fallback",
  "admin-case-study-editor-messages",
  "calculator-surface-residue",
  "seven-muda-rev5",
  "semantic-search",
  "breakdown-chart-dimensions",
];

// Euro symbol — Global engineering calculations default to USD or unitless.
// EXCEPTION: Financial calculators, i18n files, and multi-currency forms legitimately
// support EUR. Only flag EUR in non-financial, non-i18n contexts.
const EURO_CURRENCY_SYMBOL = /\u20AC/;

const EUR_LEGITIMATE_PATHS = [
  "BuyLeaseKeep",
  "MachineHourlyRate",
  "FinancialImpact",
  "ProDecision",
  "ProReport",
  "CncStochasticPremium",
  "CalculatorUnitCurrency",
  "stochastic-engine",
  "CaseStudyAdmin",
  "Claude2Landing",
  "case-studies",
  "formula-governance",
  "premium-decision-engine",
  "revenue-tools",
  "risk-engine",
  "formula-constraint-engine",
  "generated-tools",
  "features/tools",
  "industrial-formulas",
  "translation-fallback",
  "admin-case-study-editor-messages",
  "calculator-surface-residue",
  "seven-muda-rev5",
  "semantic-search",
  "breakdown-chart-dimensions",
  "UniversalIndustrialDecisionForm",
];

const SCAN_DIRS = [
  path.join(ROOT, "src/app"),
  path.join(ROOT, "src/components"),
  path.join(ROOT, "src/lib"),
  path.join(ROOT, "src/sectorcalc"),
];

function walkDir(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
      results.push(...walkDir(fullPath));
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

function isSourceFile(filePath: string): boolean {
  return /\.(tsx?|jsx?|mjs)$/.test(filePath);
}

interface Violation {
  file: string;
  line: number;
  pattern: string;
}

function scanFile(filePath: string): Violation[] {
  const violations: Violation[] = [];

  // Skip i18n, locale, and search infrastructure files entirely
  if (SKIP_FILES.some((p) => filePath.includes(p))) return violations;

  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. European number format
    const euroNumMatch = EUROPEAN_NUMBER_FORMAT.exec(line);
    if (euroNumMatch) {
      violations.push({
        file: filePath,
        line: i + 1,
        pattern: `European number format: "${euroNumMatch[0]}" (use Global/US: 1,500.00)`,
      });
    }

    // 2. German technical term leakage
    for (const pattern of GERMAN_TECHNICAL_LEAKAGE) {
      if (pattern.test(line)) {
        violations.push({
          file: filePath,
          line: i + 1,
          pattern: `German technical term: "${line.trim().slice(0, 60)}"`,
        });
        break;
      }
    }

    // 3. Euro symbol — only flag in non-financial, non-i18n contexts
    if (EURO_CURRENCY_SYMBOL.test(line)) {
      const isLegitimate = EUR_LEGITIMATE_PATHS.some((p) => filePath.includes(p));
      if (!isLegitimate) {
        violations.push({
          file: filePath,
          line: i + 1,
          pattern: "Euro currency symbol (\u20AC) in non-financial context — verify",
        });
      }
    }

    if (violations.length >= 50) break;
  }

  return violations;
}

function main(): void {
  console.log("Engineering Metric & English Purity Gate");
  console.log("=".repeat(60));

  const allViolations: Violation[] = [];
  let filesScanned = 0;

  for (const dir of SCAN_DIRS) {
    const files = walkDir(dir).filter(isSourceFile);
    for (const file of files) {
      filesScanned++;
      const fileViolations = scanFile(file);
      allViolations.push(...fileViolations);
      if (allViolations.length >= 50) break;
    }
    if (allViolations.length >= 50) break;
  }

  console.log(`  Files scanned: ${filesScanned}`);

  if (allViolations.length > 0) {
    console.error(`\n[BLOCKED] Engineering Purity violations (${allViolations.length}):\n`);
    for (const v of allViolations.slice(0, 20)) {
      console.error(`  \u2717 ${v.file}:${v.line} — ${v.pattern}`);
    }
    if (allViolations.length > 20) {
      console.error(`  ... and ${allViolations.length - 20} more violations`);
    }
    console.error("");
    process.exit(1);
  }

  console.log("[PASS] Engineering Metric & English Purity Verified.");
  console.log("[PASS] Zero European locale leakage. Pure English Engineering standard enforced.");
  process.exit(0);
}

main();
