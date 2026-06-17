#!/usr/bin/env npx tsx
import { execSync } from "node:child_process";
import {
  autoFixSchemas,
  measureFallbackRate,
  shouldTriggerSelfHeal,
  writeHealingLog,
  STEELCORE_HEALING_LOG,
} from "@/lib/steelcore";

function main(): void {
  const metrics = measureFallbackRate();
  writeHealingLog(metrics);
  console.log(`Fallback rate: ${metrics.ratePercent.toFixed(2)}% (${metrics.fallbackCount}/${metrics.total})`);
  if (!shouldTriggerSelfHeal(metrics)) {
    console.log("System healthy.");
    return;
  }
  const fixReport = autoFixSchemas({ onlyInvalid: false });
  console.log(`Self-heal fixed ${fixReport.fixed} schemas. Log: ${STEELCORE_HEALING_LOG}`);
  if (process.argv.includes("--ai")) {
    execSync("npx tsx scripts/steelcore/auto-fix-schemas.ts --ai", { stdio: "inherit" });
  }
}

main();
