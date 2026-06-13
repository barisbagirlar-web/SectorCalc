#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { ROOT } from "./lib/activation-paths.mjs";
import {
  applyFactoryPlan,
  generateToolFiles,
  wireContractsRegistry,
  loadFactoryInputs,
} from "./lib/premium-backfill-factory-lib.mjs";
import { buildQualityScanReport } from "./lib/quality-backfill-scan-lib.mjs";

const P77_PREMIUM_SLUGS = [
  "auto-repair-comeback-cost",
  "carbon-footprint-compliance-risk",
  "cbam-compliance-verdict",
  "cbam-exposure-quick-check",
  "electrical-panel-rework-cost",
  "legal-interest-fee-calculator-pro",
];

const CONTRACTS_FILE = `${ROOT}/src/lib/formula-governance/contracts.ts`;

function main() {
  const { schemas } = loadFactoryInputs();
  const generated = [];
  const testFiles = [];
  const failed = [];
  let contractsContent = fs.readFileSync(CONTRACTS_FILE, "utf8");
  const registryEntries = [];

  for (const slug of P77_PREMIUM_SLUGS) {
    const schema = schemas.get(slug);
    if (!schema) {
      failed.push({ slug, reason: "Schema missing" });
      continue;
    }

    try {
      const tool = { slug, toolClass: "A CLASS" };
      const files = generateToolFiles(tool, schema);
      fs.writeFileSync(files.contractPath, files.contract, "utf8");
      fs.writeFileSync(files.validationPath, files.validation, "utf8");
      fs.writeFileSync(files.calculatorPath, files.calculator, "utf8");
      fs.writeFileSync(files.testPath, files.test, "utf8");
      registryEntries.push(files);
      generated.push(slug);
      testFiles.push(files.testPath);
    } catch (error) {
      failed.push({
        slug,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (registryEntries.length > 0) {
    contractsContent = wireContractsRegistry(contractsContent, registryEntries);
    fs.writeFileSync(CONTRACTS_FILE, contractsContent, "utf8");
  }

  const passed = [];
  for (const testFile of testFiles) {
    const slug = testFile.split("/").pop()?.replace(".test.ts", "") ?? "unknown";
    try {
      execFileSync("npx", ["vitest", "run", testFile.replace(`${ROOT}/`, "")], {
        cwd: ROOT,
        stdio: "pipe",
        encoding: "utf8",
      });
      passed.push(slug);
    } catch (error) {
      failed.push({
        slug,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  buildQualityScanReport();

  console.log("P77 premium closure apply");
  console.log(`generated: ${generated.join(", ") || "(none)"}`);
  console.log(`vitest passed: ${passed.join(", ") || "(none)"}`);
  if (failed.length > 0) {
    console.log("failed:");
    for (const item of failed) {
      console.log(`  - ${item.slug}: ${item.reason.slice(0, 200)}`);
    }
    process.exitCode = 1;
  }
}

main();
