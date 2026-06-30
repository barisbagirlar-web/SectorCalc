/**
 * Phase 5H-H — smart form rollout batch H eligibility and wiring tests.
 */

import { afterEach, describe, expect, test, vi } from "vitest";
import { buildSmartFormPilotCalculationPayload } from "@/components/tools/smart-form/build-smart-form-pilot-calculation-payload";
import {
  formatRolloutBatchHEligibilityReport,
  runRolloutBatchHEligibilityAudit,
} from "@/components/tools/smart-form/rollout-batch-h-eligibility-audit";
import {
  getRolloutBatchHActiveRouteMappings,
  getRolloutBatchHEligibleToolDefinitions,
  getRolloutBatchHExcludedToolDefinitions,
  ROLLOUT_BATCH_H_ELIGIBLE_TOOL_COUNT,
} from "@/components/tools/smart-form/rollout-batch-h-catalog";
import { getSmartFormPilotBatchRegistry } from "@/components/tools/smart-form/pilot-batch-qa-registry";
import {
  ELECTRICAL_LABOR_PILOT_GOVERNANCE_SLUG,
  HVAC_TONNAGE_PILOT_FREE_ROUTE_SLUG,
  HVAC_TONNAGE_PILOT_GOVERNANCE_SLUG,
  resolvePilotGovernanceSlugFromRoute,
} from "@/lib/features/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";
import { buildPilotUiBridgeManifestForSlug } from "@/lib/features/formula-governance/smart-form-ui-bridge/pilot-ui-bridge-manifest";
import { resolveSmartFormPilotManifestForRoute } from "@/lib/features/formula-governance/smart-form-ui-bridge/resolve-smart-form-pilot-manifest";
import { shouldUseSmartFormPilot } from "@/lib/infrastructure/feature-flags/smart-form-pilot";

describe("smart form rollout batch H — Phase 5H-H", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("eligibility audit reports 10 eligible and 5 excluded tools", () => {
    expect(getRolloutBatchHEligibleToolDefinitions()).toHaveLength(ROLLOUT_BATCH_H_ELIGIBLE_TOOL_COUNT);
    expect(getRolloutBatchHExcludedToolDefinitions()).toHaveLength(5);

    const audit = runRolloutBatchHEligibilityAudit();
    expect(audit.eligibleTools).toHaveLength(10);
    expect(audit.excludedTools).toHaveLength(5);
    expect(audit.manifestReadyCount).toBe(10);
    expect(audit.blockers).toHaveLength(0);
  });

  test("route mappings resolve governance slugs for all eligible free routes", () => {
    const mappings = getRolloutBatchHActiveRouteMappings();

    expect(mappings["electrical-labor-estimator"]).toBe("electrical-labor-estimator");
    expect(mappings[HVAC_TONNAGE_PILOT_FREE_ROUTE_SLUG]).toBe(HVAC_TONNAGE_PILOT_GOVERNANCE_SLUG);
    expect(mappings["plumbing-fixture-cost-check"]).toBe("plumbing-job-margin-verdict");
    expect(mappings["laser-cutting-time-check"]).toBe("sheet-metal-quote-risk-tool");
    expect(mappings["welding-cost-estimator"]).toBe("welding-bid-risk-analyzer");
    expect(Object.keys(mappings)).toHaveLength(10);
  });

  test("excluded tools document route ownership conflicts", () => {
    const excluded = getRolloutBatchHExcludedToolDefinitions();
    const slugs = excluded.map((tool) => tool.governanceSlug);

    expect(slugs).toContain("millwork-bid-risk-analyzer");
    expect(slugs).toContain("panel-shop-margin-verdict");
    expect(slugs).toContain("repair-time-vs-price-check");
    expect(slugs).toContain("signage-bid-safe-price-tool");
    expect(slugs).toContain("landscaping-contract-profit-tool");
  });

  test("batch registry includes 10 pilots with payload bridges", () => {
    const registry = getSmartFormPilotBatchRegistry();

    expect(registry).toHaveLength(10);
    expect(registry.every((entry) => entry.calculationBridgeEnabled)).toBe(true);
    expect(registry.every((entry) => entry.mappedSubmitKeys.length > 0)).toBe(true);
  });

  test("flag true resolves manifest for new batch H routes", () => {
    vi.stubEnv("NEXT_PUBLIC_SMART_FORM_PILOT", "true");

    expect(shouldUseSmartFormPilot("electrical-labor-estimator")).toBe(true);
    const manifest = resolveSmartFormPilotManifestForRoute("electrical-labor-estimator");
    expect(manifest?.slug).toBe(ELECTRICAL_LABOR_PILOT_GOVERNANCE_SLUG);
    expect(buildPilotUiBridgeManifestForSlug(ELECTRICAL_LABOR_PILOT_GOVERNANCE_SLUG)?.status).toBe(
      "ui_bridge_ready",
    );
  });

  test("mapped payload bridge only submits production-aligned keys", () => {
    const manifest = buildPilotUiBridgeManifestForSlug(ELECTRICAL_LABOR_PILOT_GOVERNANCE_SLUG);
    expect(manifest).toBeDefined();

    const result = buildSmartFormPilotCalculationPayload({
      slug: ELECTRICAL_LABOR_PILOT_GOVERNANCE_SLUG,
      fieldValues: {
        materialCost: "500",
        laborHours: "6",
        laborRate: "85",
        permitCost: "120",
      },
      manifest: manifest!,
    });

    expect(result.supported).toBe(true);
    expect(result.payload).toEqual({
      materialCost: 500,
      laborHours: 6,
      laborRate: 85,
    });
    expect(result.payload).not.toHaveProperty("permitCost");
  });

  test("non-pilot route still resolves null", () => {
    vi.stubEnv("NEXT_PUBLIC_SMART_FORM_PILOT", "true");
    expect(resolvePilotGovernanceSlugFromRoute("machine-time-calculator")).toBeNull();
    expect(resolveSmartFormPilotManifestForRoute("machine-time-calculator")).toBeNull();
  });

  test("CLI eligibility report prints eligible and excluded tools", () => {
    const report = formatRolloutBatchHEligibilityReport(runRolloutBatchHEligibilityAudit());

    expect(report).toContain("Smart Form Rollout Batch H Eligibility");
    expect(report).toContain("Eligible tools: 10");
    expect(report).toContain("Excluded tools: 5");
    expect(report).toContain("electrical-labor-estimator");
    expect(report).toContain("millwork-bid-risk-analyzer");
    expect(report).toContain("Blockers: 0");
  });
});
