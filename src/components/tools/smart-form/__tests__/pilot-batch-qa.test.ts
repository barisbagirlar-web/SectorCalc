/**
 * Phase 5H-G-I — smart form pilot batch QA and optional expansion gate tests.
 */

import { afterEach, describe, expect, test, vi } from "vitest";
import { buildSmartFormPilotCalculationPayload } from "@/components/tools/smart-form/build-smart-form-pilot-calculation-payload";
import {
  evaluateOptionalFieldExpansionReadiness,
  isOptionalFieldExpansionBlocked,
  OPTIONAL_EXPANSION_BLOCKED_FIELD_EXAMPLES,
} from "@/components/tools/smart-form/optional-expansion-diff-gate";
import {
  formatSmartFormPilotBatchQaAuditReport,
  runSmartFormPilotBatchQaAudit,
} from "@/components/tools/smart-form/pilot-batch-qa-audit";
import {
  getSmartFormPilotBatchRegistry,
  getSmartFormPilotBatchEntryByGovernanceSlug,
} from "@/components/tools/smart-form/pilot-batch-qa-registry";
import { buildSmartFormPilotManualQaChecklist } from "@/components/tools/smart-form/pilot-manual-qa-checklist";
import {
  buildDefaultPendingManualQaResults,
  buildPassedManualQaResult,
} from "@/components/tools/smart-form/pilot-manual-qa-result";
import { evaluateSmartFormPilotQaDecision } from "@/components/tools/smart-form/pilot-qa-decision-gate";
import { getPilotSmartFormManifest } from "@/components/tools/smart-form/getPilotSmartFormManifest";
import {
  AUTO_SHOP_PILOT_FREE_ROUTE_SLUG,
  AUTO_SHOP_PILOT_GOVERNANCE_SLUG,
  CABINET_PILOT_GOVERNANCE_SLUG,
  THREE_D_PRINT_PILOT_GOVERNANCE_SLUG,
} from "@/lib/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";

describe("smart form pilot batch QA — Phase 5H-G-I", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("pilot registry contains 3 batch entries", () => {
    const registry = getSmartFormPilotBatchRegistry();
    expect(registry).toHaveLength(3);
  });

  test("each pilot has correct route slug and governance slug", () => {
    const threeDPrint = getSmartFormPilotBatchEntryByGovernanceSlug(THREE_D_PRINT_PILOT_GOVERNANCE_SLUG);
    const autoShop = getSmartFormPilotBatchEntryByGovernanceSlug(AUTO_SHOP_PILOT_GOVERNANCE_SLUG);
    const cabinet = getSmartFormPilotBatchEntryByGovernanceSlug(CABINET_PILOT_GOVERNANCE_SLUG);

    expect(threeDPrint?.routeSlug).toBe("3d-print-cost-check");
    expect(threeDPrint?.governanceSlug).toBe("3d-print-cost-check");

    expect(autoShop?.routeSlug).toBe(AUTO_SHOP_PILOT_FREE_ROUTE_SLUG);
    expect(autoShop?.governanceSlug).toBe("auto-shop-margin-leak-detector");

    expect(cabinet?.routeSlug).toBe("cabinet-cost-estimator");
    expect(cabinet?.governanceSlug).toBe("cabinet-cost-estimator");
  });

  test("mapped submit keys are non-empty for every pilot", () => {
    for (const entry of getSmartFormPilotBatchRegistry()) {
      expect(entry.mappedSubmitKeys.length).toBeGreaterThan(0);
    }
  });

  test("derived and optional keys do not leak into pilot payload", () => {
    for (const entry of getSmartFormPilotBatchRegistry()) {
      const manifest = getPilotSmartFormManifest(entry.governanceSlug);
      expect(manifest).not.toBeNull();

      const fieldValues: Record<string, string> = {};
      for (const key of entry.mappedSubmitKeys) {
        fieldValues[key] = "10";
      }
      fieldValues.failedPrintRate = "0.2";
      fieldValues.diagnosticHours = "2";
      fieldValues.hardwareCost = "500";
      fieldValues.trueJobProfit = "999";

      const result = buildSmartFormPilotCalculationPayload({
        slug: entry.governanceSlug,
        fieldValues,
        manifest: manifest!,
      });

      expect(result.supported).toBe(true);
      expect(Object.keys(result.payload ?? {})).toEqual([...entry.mappedSubmitKeys]);
    }
  });

  test("manual QA checklist produces URLs for all 3 pilots", () => {
    const checklist = buildSmartFormPilotManualQaChecklist();

    expect(checklist.totalPilots).toBe(3);
    expect(checklist.manualQaUrls).toEqual([
      "/tools/free/3d-print-cost-check",
      "/tools/free/repair-time-vs-price-check",
      "/tools/free/cabinet-cost-estimator",
    ]);

    for (const pilot of checklist.pilots) {
      expect(pilot.manualQaStatus).toBe("pending_manual_qa");
      expect(pilot.checks.length).toBeGreaterThanOrEqual(12);
      expect(pilot.checks.some((check) => check.label.includes("Flag false fallback"))).toBe(
        true,
      );
      expect(pilot.checks.some((check) => check.label.includes("analytics"))).toBe(true);
    }
  });

  test("optional expansion gate defaults to blocked", () => {
    const result = evaluateOptionalFieldExpansionReadiness({
      slug: THREE_D_PRINT_PILOT_GOVERNANCE_SLUG,
      fieldKey: "supportMaterialCost",
      hasPayloadEquivalenceTest: true,
      hasOutputDiffTest: true,
      productionMapped: true,
      analyticsCovered: true,
    });

    expect(result.status).toBe("blocked");
    expect(result.ready).toBe(false);
    expect(result.blockedReasons.length).toBeGreaterThan(0);
  });

  test.each(["failedPrintRate", "diagnosticHours", "hardwareCost"] as const)(
    "optional field %s remains blocked",
    (fieldKey) => {
      expect(
        isOptionalFieldExpansionBlocked({
          slug: THREE_D_PRINT_PILOT_GOVERNANCE_SLUG,
          fieldKey,
          hasPayloadEquivalenceTest: false,
          hasOutputDiffTest: false,
          productionMapped: false,
          analyticsCovered: true,
        }),
      ).toBe(true);
    },
  );

  test("blocked field examples include required governance placeholders", () => {
    expect(OPTIONAL_EXPANSION_BLOCKED_FIELD_EXAMPLES).toEqual([
      "failedPrintRate",
      "diagnosticHours",
      "laborRate",
      "hardwareCost",
    ]);
  });

  test("QA audit reports 3 pilots with zero blockers", () => {
    const audit = runSmartFormPilotBatchQaAudit();

    expect(audit.totalPilots).toBe(3);
    expect(audit.calculationBridgeReady).toBe(3);
    expect(audit.fallbackReady).toBe(3);
    expect(audit.analyticsReady).toBe(3);
    expect(audit.optionalExpansionBlocked).toBe(true);
    expect(audit.manualQaRequired).toBe(true);
    expect(audit.manualQaStatus).toBe("pending_manual_qa");
    expect(audit.stagingFlagReady).toBe(false);
    expect(audit.deploymentReady).toBe(false);
    expect(audit.blockers).toHaveLength(0);
  });

  test("QA audit report formatter includes manual QA and staging decision lines", () => {
    const report = formatSmartFormPilotBatchQaAuditReport(runSmartFormPilotBatchQaAudit());

    expect(report).toContain("Smart Form Pilot QA Audit");
    expect(report).toContain("Total pilots: 3");
    expect(report).toContain("Blockers: 0");
    expect(report).toContain("Manual QA status: pending_manual_qa");
    expect(report).toContain("Staging flag ready: false");
    expect(report).toContain("Deployment ready: false");
    expect(report).toContain("/tools/free/3d-print-cost-check");
    expect(report).toContain("/tools/free/repair-time-vs-price-check");
    expect(report).toContain("/tools/free/cabinet-cost-estimator");
  });
});

describe("smart form pilot QA decision gate — Phase 5H-G-J", () => {
  test("pending QA keeps stagingFlagReady false", () => {
    const pending = buildDefaultPendingManualQaResults().results;
    const decision = evaluateSmartFormPilotQaDecision(pending);

    expect(decision.manualQaStatus).toBe("pending_manual_qa");
    expect(decision.stagingFlagReady).toBe(false);
    expect(decision.deploymentReady).toBe(false);
  });

  test("all passed QA sets stagingFlagReady true and deploymentReady false", () => {
    const passed = getSmartFormPilotBatchRegistry().map((entry) =>
      buildPassedManualQaResult({
        slug: entry.governanceSlug,
        route: entry.routeSlug,
      }),
    );

    const decision = evaluateSmartFormPilotQaDecision(passed);

    expect(decision.manualQaStatus).toBe("passed");
    expect(decision.stagingFlagReady).toBe(true);
    expect(decision.deploymentReady).toBe(false);
    expect(decision.blockedReasons).toHaveLength(0);
  });

  test("console failure blocks staging readiness", () => {
    const base = buildPassedManualQaResult({
      slug: THREE_D_PRINT_PILOT_GOVERNANCE_SLUG,
      route: THREE_D_PRINT_PILOT_GOVERNANCE_SLUG,
    });
    const decision = evaluateSmartFormPilotQaDecision([
      { ...base, consoleClean: false },
    ]);

    expect(decision.stagingFlagReady).toBe(false);
    expect(decision.blockedReasons.some((reason) => reason.includes("console not clean"))).toBe(
      true,
    );
  });

  test("network failure blocks staging readiness", () => {
    const base = buildPassedManualQaResult({
      slug: THREE_D_PRINT_PILOT_GOVERNANCE_SLUG,
      route: THREE_D_PRINT_PILOT_GOVERNANCE_SLUG,
    });
    const decision = evaluateSmartFormPilotQaDecision([
      { ...base, networkClean: false },
    ]);

    expect(decision.stagingFlagReady).toBe(false);
    expect(decision.blockedReasons.some((reason) => reason.includes("network not clean"))).toBe(
      true,
    );
  });

  test("flag false fallback failure blocks staging readiness", () => {
    const base = buildPassedManualQaResult({
      slug: AUTO_SHOP_PILOT_GOVERNANCE_SLUG,
      route: AUTO_SHOP_PILOT_FREE_ROUTE_SLUG,
    });
    const decision = evaluateSmartFormPilotQaDecision([
      { ...base, flagFalseFallbackPassed: false },
    ]);

    expect(decision.stagingFlagReady).toBe(false);
    expect(
      decision.blockedReasons.some((reason) => reason.includes("flag false fallback failed")),
    ).toBe(true);
  });

  test("submit result failure blocks staging readiness", () => {
    const base = buildPassedManualQaResult({
      slug: CABINET_PILOT_GOVERNANCE_SLUG,
      route: CABINET_PILOT_GOVERNANCE_SLUG,
    });
    const decision = evaluateSmartFormPilotQaDecision([
      { ...base, submitResultPassed: false },
    ]);

    expect(decision.stagingFlagReady).toBe(false);
    expect(decision.blockedReasons.some((reason) => reason.includes("submit result failed"))).toBe(
      true,
    );
  });

  test("default pending manual QA results include 3 pilots with full shape", () => {
    const { results } = buildDefaultPendingManualQaResults();

    expect(results).toHaveLength(3);
    for (const result of results) {
      expect(result.slug.length).toBeGreaterThan(0);
      expect(result.route.length).toBeGreaterThan(0);
      expect(result.status).toBe("pending_manual_qa");
      expect(result.desktopPassed).toBe(false);
      expect(result.resultCardConsistencyPassed).toBe(false);
    }
  });
});
