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
};

/** Critical tools awaiting oracle module registration or file implementation. */
const ORACLE_PENDING_TOOL_IDS: readonly string[] = [
  "free-traffic.break-even-calculator",
  "free-traffic.salary-cost-calculator",
  "free-traffic.cash-flow-gap-calculator",
  "free-traffic.machine-time-calculator",
  "revenue-premium.cnc-quote-risk-analyzer",
];

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
