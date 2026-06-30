/**
 * Phase 5H-G-F — smart form pilot analytics, optional field gate, payload equivalence.
 */

import { afterEach, describe, expect, test, vi } from "vitest";
import {
  buildSmartFormPilotAnalyticsPayload,
  trackSmartFormPilotCompleted,
  trackSmartFormPilotStarted,
} from "@/components/tools/smart-form/smart-form-pilot-analytics";
import {
  buildThreeDPrintPilotCalculationPayload,
  THREE_D_PRINT_PILOT_SLUG,
} from "@/components/tools/smart-form/pilot-calculation-payload";
import {
  canIncludeOptionalPilotField,
  THREE_D_PRINT_OPTIONAL_PILOT_CANDIDATES,
} from "@/components/tools/smart-form/optional-field-expansion-gate";
import {
  comparePilotPayloadWithBaseline,
  assertThreeDPrintPilotPayloadMatchesBaseline,
} from "@/components/tools/smart-form/pilot-payload-equivalence";
import {
  getNextSmartFormPilotCandidate,
  NEXT_SMART_FORM_PILOT_CANDIDATE_SLUG,
} from "@/lib/formula-governance/smart-form-ui-bridge/next-smart-form-pilot-candidate";
import { REVENUE_EVENTS, trackRevenueEvent } from "@/lib/analytics/revenue-events";
import { shouldUseSmartFormPilot } from "@/lib/feature-flags/smart-form-pilot";

vi.mock("@/lib/analytics/revenue-events", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/analytics/revenue-events")>();
  return {
    ...original,
    trackRevenueEvent: vi.fn(original.trackRevenueEvent),
  };
});

describe("smart form pilot analytics and gate — Phase 5H-G-F", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.mocked(trackRevenueEvent).mockClear();
  });

  test("analytics payload shape matches free_tool_started/completed contract", () => {
    const payload = buildSmartFormPilotAnalyticsPayload();

    expect(payload).toEqual({
      slug: "3d-print-cost-check",
      mode: "smart_form_pilot",
      featureFlag: true,
      mappedInputCount: 3,
      advancedInputSubmitted: false,
      toolSlug: "3d-print-cost-check",
    });
  });

  test("trackSmartFormPilotStarted emits free_tool_started with pilot payload", () => {
    trackSmartFormPilotStarted(THREE_D_PRINT_PILOT_SLUG);

    expect(trackRevenueEvent).toHaveBeenCalledWith(
      REVENUE_EVENTS.free_tool_started,
      buildSmartFormPilotAnalyticsPayload(THREE_D_PRINT_PILOT_SLUG),
    );
  });

  test("trackSmartFormPilotCompleted emits free_tool_completed with pilot payload", () => {
    trackSmartFormPilotCompleted(THREE_D_PRINT_PILOT_SLUG);

    expect(trackRevenueEvent).toHaveBeenCalledWith(
      REVENUE_EVENTS.free_tool_completed,
      buildSmartFormPilotAnalyticsPayload(THREE_D_PRINT_PILOT_SLUG),
    );
  });

  test("analytics helper swallows trackRevenueEvent errors without throwing", () => {
    vi.mocked(trackRevenueEvent).mockImplementation(() => {
      throw new Error("analytics unavailable");
    });

    expect(() => trackSmartFormPilotStarted()).not.toThrow();
    expect(() => trackSmartFormPilotCompleted()).not.toThrow();
  });

  test("optional field gate defaults to false", () => {
    for (const fieldKey of THREE_D_PRINT_OPTIONAL_PILOT_CANDIDATES) {
      expect(
        canIncludeOptionalPilotField({
          slug: THREE_D_PRINT_PILOT_SLUG,
          fieldKey,
          hasOutputDiffTest: false,
          isProductionMapped: false,
        }),
      ).toBe(false);
    }

    expect(
      canIncludeOptionalPilotField({
        slug: THREE_D_PRINT_PILOT_SLUG,
        fieldKey: "failedPrintRate",
        hasOutputDiffTest: true,
        isProductionMapped: true,
      }),
    ).toBe(false);
  });

  test("failedPrintRate is not included in pilot payload this phase", () => {
    const result = buildThreeDPrintPilotCalculationPayload({
      materialCost: "120",
      printHours: "4",
      machineRate: "35",
      failedPrintRate: "0.15",
    });

    expect(result.payload).toEqual({
      materialCost: 120,
      printHours: 4,
      machineRate: 35,
    });
    expect(result.payload).not.toHaveProperty("failedPrintRate");
  });

  test("materialCost, printHours, and machineRate payload behavior is preserved", () => {
    const baseline = {
      materialCost: 50,
      printHours: 3,
      machineRate: 25,
    };

    const pilotResult = buildThreeDPrintPilotCalculationPayload({
      materialCost: "50",
      printHours: "3",
      machineRate: "25",
    });

    expect(pilotResult.payload).toEqual(baseline);

    const equivalence = comparePilotPayloadWithBaseline({
      slug: THREE_D_PRINT_PILOT_SLUG,
      baselinePayload: baseline,
      pilotPayload: pilotResult.payload ?? {},
    });

    expect(equivalence.equivalent).toBe(true);
    expect(equivalence.differences).toEqual([]);
    expect(() =>
      assertThreeDPrintPilotPayloadMatchesBaseline(baseline, pilotResult.payload ?? {}),
    ).not.toThrow();
  });

  test("derived and assumption field values stay outside submit payload", () => {
    const result = buildThreeDPrintPilotCalculationPayload({
      materialCost: "10",
      printHours: "2",
      machineRate: "5",
      totalMaterialUsed: "999",
      defaultFailureAssumption: "ignored",
    });

    expect(Object.keys(result.payload ?? {})).toEqual([
      "materialCost",
      "printHours",
      "machineRate",
    ]);
  });

  test("auto-shop pilot candidate has calculation bridge enabled", () => {
    const candidate = getNextSmartFormPilotCandidate();

    expect(candidate.slug).toBe(NEXT_SMART_FORM_PILOT_CANDIDATE_SLUG);
    expect(candidate.slug).toBe("electrical-labor-estimator");
    expect(candidate.calculationBridgeEnabled).toBe(true);
    expect(candidate.uiBridgeReady).toBe(true);
    expect(candidate.inputDesignPatchCompleted).toBe(true);
    expect(candidate.smartFormReadyForSpec).toBe(true);
    expect(candidate.reason).toContain("calculation bridge are ready");
  });

  test("feature flag false keeps classic path fallback", () => {
    vi.stubEnv("NEXT_PUBLIC_SMART_FORM_PILOT", "false");
    expect(shouldUseSmartFormPilot("3d-print-cost-check")).toBe(false);
    expect(shouldUseSmartFormPilot("repair-time-vs-price-check")).toBe(false);
    expect(shouldUseSmartFormPilot("cabinet-cost-estimator")).toBe(false);
  });
});
