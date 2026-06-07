/**
 * Oracle registry — independent reference models for critical formulas.
 * Phase 3 adds concrete oracle implementations.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

const ORACLE_FILES: Record<string, string> = {
  "free-traffic.rent-vs-buy-calculator": "rent-vs-buy-oracle.ts",
};

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

export function listRegisteredOracleToolIds(): readonly string[] {
  return Object.keys(ORACLE_FILES);
}
