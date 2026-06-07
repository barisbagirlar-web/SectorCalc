#!/usr/bin/env npx tsx
/**
 * SectorCalc Formula Governance — inventory scan (Phase 1 baseline).
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildFormulaInventory,
  summarizeInventory,
} from "../src/lib/formula-governance/inventory";
import { suggestRiskLevel } from "../src/lib/formula-governance/risk-rules";

const rootDir = process.cwd();
const cacheDir = join(rootDir, "scripts/.cache");
mkdirSync(cacheDir, { recursive: true });

const inventory = buildFormulaInventory(rootDir);
const summary = summarizeInventory(inventory);

const suspicious = inventory.filter((entry) => {
  if (entry.hasContract) {
    return false;
  }
  const risk = suggestRiskLevel({
    slug: entry.slug,
    name: entry.name,
    inputKeys: entry.inputKeys,
  });
  return risk === "critical" || risk === "high";
});

const priorities = suspicious
  .sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.suggestedRiskLevel] - order[b.suggestedRiskLevel];
  })
  .slice(0, 20);

writeFileSync(join(cacheDir, "formula-inventory.json"), JSON.stringify(inventory, null, 2));
writeFileSync(
  join(cacheDir, "formula-risk-report.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      summary,
      suspiciousCount: suspicious.length,
      first20AuditPriorities: priorities,
    },
    null,
    2,
  ),
);

console.log("Formula Inventory Report");
console.log("------------------------");
console.log(`Total tools found: ${summary.total}`);
console.log(`Critical tools: ${summary.critical}`);
console.log(`High tools: ${summary.high}`);
console.log(`Missing contracts: ${summary.missingContracts.length}`);
console.log(`Critical without contract: ${summary.criticalMissingContracts.length}`);
console.log("");
console.log("First 20 audit priorities:");
for (const item of priorities) {
  console.log(`- [${item.suggestedRiskLevel}] ${item.slug}`);
}
console.log("");
console.log(`Cache: scripts/.cache/formula-inventory.json`);
