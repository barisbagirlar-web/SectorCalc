#!/usr/bin/env node
/**
 * Global Reference Engine — Component Integration Script
 *
 * This script verifies that all components can correctly import and use
 * the Global Reference Engine. It performs static analysis checks without
 * modifying any files.
 *
 * Usage:
 *   npx tsx scripts/verify-reference-integration.ts
 *
 * Exit codes:
 *   0 — All checks pass
 *   1 — Integration issues found
 */

import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = process.cwd();
const COMPONENT_DIRS = [
  "src/components/calculators",
  "src/components/universal-pro-tool",
];

const ISSUES: Array<{ file: string; issue: string }> = [];

function scanFile(filePath: string): void {
  const content = fs.readFileSync(filePath, "utf8");
  const relativePath = path.relative(ROOT, filePath);

  // Check if file has inline reference arrays that should be in YAML
  const inlineDataPatterns = [
    /const\s+MAT_DB\s*[=:]/,
    /const\s+CONCRETE_GRADE_OPTIONS\s*[=:]/,
    /const\s+YOUNG_MODULUS_OPTIONS\s*[=:]/,
    /const\s+GRADE_OPTIONS\s*[=:]/,
  ];

  for (const pattern of inlineDataPatterns) {
    if (pattern.test(content)) {
      // Check if GlobalReferenceInput is already imported
      const hasImport = content.includes("GlobalReferenceInput") ||
        content.includes("reference-engine");
      const status = hasImport ? "⚠ INTEGRATED" : "❌ NOT INTEGRATED";
      ISSUES.push({
        file: relativePath,
        issue: `${status} — inline reference data pattern found: ${pattern}`,
      });
    }
  }

  // Check if registry is imported
  if (content.includes("MAT_DB") && !content.includes("reference-registry")) {
    ISSUES.push({
      file: relativePath,
      issue: "⚠ Inline MAT_DB found without reference-registry import",
    });
  }
}

function main(): void {
  console.log("🔍 Global Reference Engine — Integration Verification");
  console.log("=".repeat(60));

  // Check the generated registry exists
  const registryPath = path.join(ROOT, "src/generated/reference-registry.ts");
  if (!fs.existsSync(registryPath)) {
    console.error("❌ MISSING: src/generated/reference-registry.ts");
    console.error("   Run: npm run prebuild\n");
    process.exit(1);
  }
  console.log("✅ Registry: src/generated/reference-registry.ts exists");

  // Count bindings
  const registryContent = fs.readFileSync(registryPath, "utf8");
  const bindingCount = (registryContent.match(/toolId:/g) || []).length;
  console.log(`   Binding count: ${bindingCount}`);

  // Check YAML files
  const yamlFiles: string[] = [];
  function findYamlFiles(dir: string): void {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) findYamlFiles(fullPath);
      else if (entry.name.endsWith(".yaml") || entry.name.endsWith(".yml"))
        yamlFiles.push(fullPath);
    }
  }
  findYamlFiles(path.join(ROOT, "references"));
  console.log(`   YAML files: ${yamlFiles.length}`);

  // Check component files
  console.log("\n📄 Component scan:");
  for (const dir of COMPONENT_DIRS) {
    const fullDir = path.join(ROOT, dir);
    if (!fs.existsSync(fullDir)) continue;
    for (const entry of fs.readdirSync(fullDir)) {
      if (entry.endsWith(".tsx") || entry.endsWith(".ts")) {
        scanFile(path.join(fullDir, entry));
      }
    }
  }

  // Report
  if (ISSUES.length === 0) {
    console.log("\n✅ All components integrated with Global Reference Engine.");
    console.log("   No inline reference data issues detected.\n");
    process.exit(0);
  }

  console.log(`\n⚠  ${ISSUES.length} integration issue(s) found:\n`);
  for (const issue of ISSUES) {
    console.log(`   ${issue.file}`);
    console.log(`     ${issue.issue}\n`);
  }

  console.log("\n📋 Migration needed in these files to use GlobalReferenceInput:");
  console.log("   1. Add import: import { GlobalReferenceInput, registry }");  
  console.log('      from "@/lib/reference-engine";');
  console.log("   2. Replace inline MAT_DB with registry binding");
  console.log("   3. Replace numeric inputs with GlobalReferenceInput where binding exists\n");
  process.exit(ISSUES.some(i => i.issue.includes("❌")) ? 1 : 0);
}

main();
