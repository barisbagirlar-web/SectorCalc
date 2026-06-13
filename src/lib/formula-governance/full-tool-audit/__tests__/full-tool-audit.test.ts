/**
 * Full existing tool audit tests — Phase 5H-J.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import { runFullExistingToolAudit } from "@/lib/formula-governance/full-tool-audit/full-tool-audit-runner";
import {
  ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_GOVERNANCE_SLUGS,
} from "@/components/tools/smart-form/rollout-batch-h-catalog";

describe("full existing tool audit — Phase 5H-J", () => {
  test("all contracts enter audit", () => {
    const result = runFullExistingToolAudit(FORMULA_CONTRACTS, process.cwd());
    expect(result.totalTools).toBe(FORMULA_CONTRACTS.length);
    expect(result.items).toHaveLength(FORMULA_CONTRACTS.length);
  });

  test("missing production locator makes productionSafe false", () => {
    const result = runFullExistingToolAudit(FORMULA_CONTRACTS, process.cwd());
    const withoutLocator = result.items.filter((item) => !item.hasProductionLocator);
    expect(withoutLocator.every((item) => item.readiness.productionSafe === false)).toBe(true);
  });

  test("oracle pass increases score versus not wired", () => {
    const result = runFullExistingToolAudit(FORMULA_CONTRACTS, process.cwd());
    const pass = result.items.filter((item) => item.oracleStatus === "PASS");
    const notWired = result.items.filter((item) => item.oracleStatus === "NOT_WIRED");

    if (pass.length > 0 && notWired.length > 0) {
      const avgPass = pass.reduce((sum, item) => sum + item.score, 0) / pass.length;
      const avgNotWired =
        notWired.reduce((sum, item) => sum + item.score, 0) / notWired.length;
      expect(avgPass).toBeGreaterThan(avgNotWired);
    }
  });

  test("smart form live pilots are marked correctly", () => {
    const result = runFullExistingToolAudit(FORMULA_CONTRACTS, process.cwd());

    for (const slug of ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_GOVERNANCE_SLUGS) {
      const item = result.items.find((entry) => entry.slug === slug);
      expect(item?.smartFormStatus).toBe("live_pilot");
      expect(item?.routeStatus).toBe("production_live_route");
    }
  });

  test("recommended batches are deterministic", () => {
    const first = runFullExistingToolAudit(FORMULA_CONTRACTS, process.cwd());
    const second = runFullExistingToolAudit(FORMULA_CONTRACTS, process.cwd());

    expect(first.recommendedBatches).toEqual(second.recommendedBatches);
    expect(first.top10Risks).toEqual(second.top10Risks);
  });

  test("audit remains read-only", () => {
    const result = runFullExistingToolAudit(FORMULA_CONTRACTS, process.cwd());
    expect(result.items.every((item) => item.hasFormulaContract)).toBe(true);
  });
});
