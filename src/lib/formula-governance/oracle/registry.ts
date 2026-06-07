/**
 * Oracle registry — independent reference models for critical formulas.
 * Phase 3 marks pending oracles; implementations land in Phase 4+.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

const ORACLE_FILES: Record<string, string> = {
  "free-traffic.rent-vs-buy-calculator": "rent-vs-buy-oracle.ts",
};

/** Critical tools awaiting oracle implementation (no file required yet). */
const ORACLE_PENDING_TOOL_IDS: readonly string[] = [
  "free-traffic.rent-vs-buy-calculator",
  "free-traffic.loan-payment-calculator",
  "free-traffic.mortgage-calculator",
  "free-traffic.interest-calculator",
  "free-traffic.compound-interest-calculator",
  "free-traffic.profit-margin-calculator",
  "free-traffic.break-even-calculator",
  "free-traffic.salary-cost-calculator",
  "free-traffic.cash-flow-gap-calculator",
  "free-traffic.machine-time-calculator",
  "revenue-premium.cnc-quote-risk-analyzer",
];

export function getOracleRelativePath(toolId: string): string | undefined {
  const file = ORACLE_FILES[toolId];
  if (!file) {
    return undefined;
  }
  return join("src/lib/formula-governance/oracle", file);
}

export function hasOracleForTool(toolId: string, rootDir: string = process.cwd()): boolean {
  const relative = getOracleRelativePath(toolId);
  if (!relative) {
    return false;
  }
  return existsSync(join(rootDir, relative));
}

export function isOraclePending(toolId: string): boolean {
  return ORACLE_PENDING_TOOL_IDS.includes(toolId);
}

export function listRegisteredOracleToolIds(): readonly string[] {
  return Object.keys(ORACLE_FILES);
}

export function listPendingOracleToolIds(): readonly string[] {
  return ORACLE_PENDING_TOOL_IDS.filter((toolId) => !hasOracleForTool(toolId));
}

export function listImplementedOracleToolIds(rootDir: string = process.cwd()): readonly string[] {
  return listRegisteredOracleToolIds().filter((toolId) => hasOracleForTool(toolId, rootDir));
}
