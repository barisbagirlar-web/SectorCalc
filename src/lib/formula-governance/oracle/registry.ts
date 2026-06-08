/**
 * Oracle registry — independent reference models for critical formulas.
 * Phase 4: finance oracles registered in finance-oracles.ts.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

/** toolId → oracle module filename under src/lib/formula-governance/oracle/ */
const ORACLE_MODULE_BY_TOOL: Record<string, string> = {
  "free-traffic.loan-payment-calculator": "finance-oracles.ts",
  "free-traffic.mortgage-calculator": "finance-oracles.ts",
  "free-traffic.interest-calculator": "finance-oracles.ts",
  "free-traffic.compound-interest-calculator": "finance-oracles.ts",
  "free-traffic.profit-margin-calculator": "finance-oracles.ts",
  "free-traffic.rent-vs-buy-calculator": "rent-vs-buy-oracle.ts",
  "free-traffic.break-even-calculator": "business-oracles.ts",
  "free-traffic.salary-cost-calculator": "business-oracles.ts",
  "free-traffic.cash-flow-gap-calculator": "business-oracles.ts",
  "free-traffic.machine-time-calculator": "operations-oracles.ts",
  "revenue-premium.cnc-quote-risk-analyzer": "operations-oracles.ts",
  "revenue-free.project-cost-calculator": "batch-free-oracles.ts",
  "revenue-free.cleaning-cost-calculator": "batch-free-oracles.ts",
  "free-traffic.food-cost-calculator": "batch-free-oracles.ts",
  "revenue-free.product-margin-calculator": "batch-free-oracles.ts",
  "free-traffic.welding-cost-estimator": "batch-free-oracles.ts",
  "revenue-premium.change-order-impact-analyzer": "batch-premium-oracles.ts",
  "revenue-premium.office-cleaning-bid-optimizer": "batch-premium-oracles.ts",
  "revenue-premium.menu-profit-leak-detector": "batch-premium-oracles.ts",
  "revenue-premium.return-profit-erosion-tool": "batch-premium-oracles.ts",
  "revenue-premium.welding-bid-risk-analyzer": "batch-premium-oracles.ts",
  "free-traffic.sample-size-calculator": "batch-free-batch2-oracles.ts",
  "revenue-free.hvac-tonnage-rule-check": "batch-free-batch2-oracles.ts",
  "revenue-free.electrical-labor-estimator": "batch-free-batch2-oracles.ts",
  "revenue-free.lawn-care-cost-check": "batch-free-batch2-oracles.ts",
  "revenue-free.repair-time-vs-price-check": "batch-free-batch2-oracles.ts",
  "revenue-free.print-job-cost-check": "batch-free-batch2-oracles.ts",
  "revenue-premium.plumbing-job-margin-verdict": "batch-free-batch2-oracles.ts",
  "revenue-free.cabinet-cost-estimator": "batch-free-batch2-oracles.ts",
  "revenue-free.roofing-square-cost-check": "batch-free-batch2-oracles.ts",
  "free-traffic.laser-cutting-time-check": "batch-free-batch2-oracles.ts",
};

/** Critical tools awaiting oracle module registration or file implementation. */
const ORACLE_PENDING_TOOL_IDS: readonly string[] = [];

export function getOracleModuleFilename(toolId: string): string | undefined {
  return ORACLE_MODULE_BY_TOOL[toolId];
}

export function getOracleRelativePath(toolId: string): string | undefined {
  const file = ORACLE_MODULE_BY_TOOL[toolId];
  if (!file) {
    return undefined;
  }
  return join("src/lib/formula-governance/oracle", file);
}

export function isOracleRegistered(toolId: string): boolean {
  return toolId in ORACLE_MODULE_BY_TOOL;
}

export function hasOracleForTool(toolId: string, rootDir: string = process.cwd()): boolean {
  const relative = getOracleRelativePath(toolId);
  if (!relative) {
    return false;
  }
  return existsSync(join(rootDir, relative));
}

export function isOraclePending(toolId: string): boolean {
  if (!ORACLE_PENDING_TOOL_IDS.includes(toolId)) {
    return false;
  }
  return !hasOracleForTool(toolId);
}

export function listRegisteredOracleToolIds(): readonly string[] {
  return Object.keys(ORACLE_MODULE_BY_TOOL);
}

export function listPendingOracleToolIds(): readonly string[] {
  return ORACLE_PENDING_TOOL_IDS.filter((toolId) => isOraclePending(toolId));
}

export function listImplementedOracleToolIds(rootDir: string = process.cwd()): readonly string[] {
  return listRegisteredOracleToolIds().filter((toolId) => hasOracleForTool(toolId, rootDir));
}

export function listFinanceOracleToolIds(): readonly string[] {
  return listRegisteredOracleToolIds().filter((id) => ORACLE_MODULE_BY_TOOL[id] === "finance-oracles.ts");
}
