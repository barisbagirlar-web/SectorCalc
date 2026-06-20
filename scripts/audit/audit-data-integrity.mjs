#!/usr/bin/env node
/**
 * audit:data-integrity — Data Integrity Audit
 *
 * Scans all schemas and generated files for:
 *   - Missing or empty slugs
 *   - Uncategorized tools (no sector/category)
 *   - Schemas with no inputs
 *   - Duplicate slugs
 *   - Orphaned generated files (no matching schema)
 *   - Empty formula blocks
 *
 * Usage: node scripts/audit/audit-data-integrity.mjs
 */
import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");
const GENERATED_DIR = join(ROOT, "generated");
const REPORT_PATH = join(ROOT, "scripts/.cache/data-integrity-report.json");

function main() {
  console.log("=".repeat(60));
  console.log("DATA INTEGRITY AUDIT");
  console.log("=".repeat(60));

  const findings = [];
  let pass = true;

  // 1. Scan all schema files
  if (!existsSync(SCHEMAS_DIR)) {
    console.error("ERROR: Schemas directory not found:", SCHEMAS_DIR);
    process.exit(1);
  }

  const schemaFiles = readdirSync(SCHEMAS_DIR).filter(f => f.endsWith("-schema.json"));
  console.log(`\n[1] ${schemaFiles.length} schema files found`);
  const slugs = [];

  for (const file of schemaFiles) {
    const slug = file.replace(/-schema\.json$/, "");
    slugs.push(slug);

    try {
      const raw = JSON.parse(readFileSync(join(SCHEMAS_DIR, file), "utf8"));

      // Check slug
      if (!slug || slug.trim() === "") {
        findings.push({ severity: "ERROR", file, field: "slug", msg: "Empty slug" });
        pass = false;
      }

      // Check toolName
      if (!raw.toolName || typeof raw.toolName !== "string" || raw.toolName.trim() === "") {
        findings.push({ severity: "ERROR", file, field: "toolName", msg: "Missing or empty toolName" });
        pass = false;
      }

      // Check sector/category
      if (!raw.sector && !raw.sectorSlug) {
        findings.push({ severity: "WARN", file, field: "sector", msg: "No sector assigned — tool will not appear in sector pages" });
      }
      if (!raw.category && !raw.categorySlug) {
        findings.push({ severity: "WARN", file, field: "category", msg: "No category assigned — tool will not appear in category pages" });
      }

      // Check inputs
      const inputs = raw.inputs || [];
      if (!Array.isArray(inputs) || inputs.length === 0) {
        findings.push({ severity: "ERROR", file, field: "inputs", msg: "No inputs defined — calculator cannot function" });
        pass = false;
      } else {
        // Check each input
        for (const input of inputs) {
          if (!input.id || typeof input.id !== "string" || input.id.trim() === "") {
            findings.push({ severity: "ERROR", file, field: "input.id", msg: "Input missing id" });
            pass = false;
          }
          if (!input.label && !input.labelKey) {
            findings.push({ severity: "WARN", file, field: "input.label", msg: `Input "${input.id}" missing label` });
          }
        }
      }

      // Check formulas
      const formulas = raw.formulas || {};
      if (typeof formulas !== "object" || Object.keys(formulas).length === 0) {
        findings.push({ severity: "ERROR", file, field: "formulas", msg: "No formulas defined" });
        pass = false;
      } else {
        for (const [key, expr] of Object.entries(formulas)) {
          if (!expr || typeof expr !== "string" || expr.trim() === "") {
            findings.push({ severity: "ERROR", file, field: `formula.${key}`, msg: "Empty formula expression" });
            pass = false;
          }
        }
      }

      // Check output
      const outputs = raw.outputs || {};
      if (typeof outputs !== "object" || Object.keys(outputs).length === 0) {
        findings.push({ severity: "WARN", file, field: "outputs", msg: "No outputs defined" });
      } else if (!outputs.primary && !outputs.main) {
        findings.push({ severity: "WARN", file, field: "outputs.primary", msg: "No primary output defined" });
      }

    } catch (err) {
      findings.push({ severity: "ERROR", file, field: "parse", msg: `JSON parse error: ${err.message.slice(0, 100)}` });
      pass = false;
    }
  }

  // 2. Check for duplicate slugs
  console.log("[2] Checking for duplicate slugs");
  const seen = {};
  for (const slug of slugs) {
    if (seen[slug]) {
      findings.push({ severity: "ERROR", slug, field: "duplicate", msg: `Duplicate slug: ${slug}` });
      pass = false;
    }
    seen[slug] = true;
  }

  // 3. Check orphaned generated files
  console.log("[3] Checking for orphaned generated files");
  if (existsSync(GENERATED_DIR)) {
    const generatedFiles = readdirSync(GENERATED_DIR).filter(f =>
      f.endsWith(".ts") && f !== "index.ts" && !f.startsWith(".")
    );
    for (const file of generatedFiles) {
      const expectedSlug = file.replace(/-calculator\.ts$/, "").replace(/\.ts$/, "");
      if (!slugs.includes(expectedSlug)) {
        findings.push({ severity: "WARN", file, field: "orphan", msg: `Generated file "${file}" has no matching schema "${expectedSlug}"` });
      }
    }
  }

  // Summary
  console.log("\n--- Summary ---");
  const errors = findings.filter(f => f.severity === "ERROR");
  const warns = findings.filter(f => f.severity === "WARN");
  console.log(`Findings: ${errors.length} errors, ${warns.length} warnings`);

  for (const f of findings.slice(0, 30)) {
    console.log(`  ${f.severity === "ERROR" ? "✗" : "⚠"} [${f.severity}] ${f.file || f.slug || "(global)"}: ${f.msg}`);
  }
  if (findings.length > 30) {
    console.log(`  ... and ${findings.length - 30} more findings`);
  }

  console.log(`\n${pass ? "✅" : "❌"} DATA INTEGRITY: ${pass ? "ALL CHECKS PASSED" : "ISSUES FOUND"}`);

  const report = {
    timestamp: new Date().toISOString(),
    totalSchemas: schemaFiles.length,
    passed: pass,
    errorCount: errors.length,
    warningCount: warns.length,
    findings: findings.slice(0, 100), // cap report size
  };
  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");
  console.log(`Report: ${REPORT_PATH}`);

  process.exit(pass ? 0 : 1);
}

main();
