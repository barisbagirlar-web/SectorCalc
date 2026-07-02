#!/usr/bin/env npx tsx
/**
 * SectorCalc Formula Governance — full inventory + risk + contract gap (Phase 2).
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildAuditPriorities,
  buildContractGapReport,
} from "../src/lib/formula-governance/formula-contract-gap";
import {
  buildFormulaInventory,
  summarizeInventory,
} from "../src/lib/formula-governance/inventory";
import { runGovernanceAudit } from "../src/lib/formula-governance/audit-runner";

const rootDir = process.cwd();
const cacheDir = join(rootDir, "scripts/.cache");
mkdirSync(cacheDir, { recursive: true });

const inventory = buildFormulaInventory(rootDir);
const summary = summarizeInventory(inventory);
const gapReport = buildContractGapReport(inventory);
const priorities = buildAuditPriorities(inventory, 20);
const auditReport = runGovernanceAudit({ rootDir, strict: false });

const launchBlockers = [
  ...new Set([...gapReport.launchBlockers, ...auditReport.launchBlockers]),
];

writeFileSync(join(cacheDir, "formula-inventory.json"), JSON.stringify(inventory, null, 2));
writeFileSync(
  join(cacheDir, "formula-risk-report.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      summary,
      first20AuditPriorities: priorities.map((entry) => ({
        toolId: entry.toolId,
        slug: entry.slug,
        name: entry.name,
        tier: entry.tier,
        suggestedRiskLevel: entry.suggestedRiskLevel,
        suggestedDecisionImpact: entry.suggestedDecisionImpact,
        hasContract: entry.hasContract,
        riskFlags: entry.riskFlags,
      })),
      launchBlockers,
    },
    null,
    2,
  ),
);
writeFileSync(join(cacheDir, "formula-formula-contract-gap.json"), JSON.stringify(gapReport, null, 2));

console.log("Formula Inventory Report (Phase 2)");
console.log("=================================");
console.log(`Total tools found: ${summary.total}`);
console.log(`Free tools: ${summary.free}`);
console.log(`Premium tools: ${summary.premium}`);
console.log(`Premium schema tools: ${summary.premiumSchema}`);
console.log(`Critical tools: ${summary.critical}`);
console.log(`High tools: ${summary.high}`);
console.log(`Medium tools: ${summary.medium}`);
console.log(`Low tools: ${summary.low}`);
console.log(`Critical missing contracts: ${summary.criticalMissingContracts.length}`);
console.log(`High missing contracts: ${summary.highMissingContracts.length}`);
console.log("");
console.log("First 20 audit priorities:");
for (const item of priorities) {
  console.log(
    `- [${item.suggestedRiskLevel}] ${item.slug} (${item.tier}, contract=${item.hasContract ? "yes" : "no"})`,
  );
}
console.log("");
console.log("Launch blockers:");
for (const slug of launchBlockers.slice(0, 30)) {
  console.log(`- ${slug}`);
}
console.log("");
console.log("Cache files:");
console.log("- scripts/.cache/formula-inventory.json");
console.log("- scripts/.cache/formula-risk-report.json");
console.log("- scripts/.cache/formula-formula-contract-gap.json");
