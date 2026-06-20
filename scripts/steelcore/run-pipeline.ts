#!/usr/bin/env npx tsx
import { execSync } from "node:child_process";
import path from "node:path";
import {
  measureFallbackRate,
  validateAllSchemas,
  writeHealthLog,
  STEELCORE_HEALTH_LOG,
  STEELCORE_VERSION,
} from "@/lib/steelcore";

function run(command: string): void {
  execSync(command, { stdio: "inherit", cwd: process.cwd() });
}

function main(): void {
  const withGenerate = process.argv.includes("--with-generate");
  const withBuild = process.argv.includes("--with-build");
  const withTests = !process.argv.includes("--skip-tests");
  const strict = process.argv.includes("--strict");
  const enforceBoundaries = process.argv.includes("--enforce-boundaries");
  const useAi = process.argv.includes("--ai");

  console.log(`SectorCalc SteelCore Engine v${STEELCORE_VERSION}`);

  const report = validateAllSchemas();
  if (strict && report.invalid > 0) {
    throw new Error(`${report.invalid} invalid schemas`);
  }

  run("npx tsx scripts/steelcore/auto-fix-schemas.ts");
  if (useAi) run("npx tsx scripts/steelcore/auto-fix-schemas.ts --ai");
  if (withGenerate) run("npm run generate:all");
  run("npm run generate:tests");
  if (withTests) {
    run("npm run test:generated");
    run("npm run test:generated:unit");
  }
  run(`npx tsx scripts/steelcore/self-heal.ts${useAi ? " --ai" : ""}`);
  if (withBuild) run("npm run build:next");
  if (enforceBoundaries) {
    run("node scripts/steelcore/enforce-boundaries.mjs");
  }

  writeHealthLog({ validation: validateAllSchemas(), fallback: measureFallbackRate() });
  console.log(`Pipeline complete. Health: ${path.relative(process.cwd(), STEELCORE_HEALTH_LOG)}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
