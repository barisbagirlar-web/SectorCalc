/**
 * Phase 5H-G-H — cabinet smart form pilot calculation bridge tests.
 */

import { afterEach, describe, expect, test, vi } from "vitest";
import { getPilotSmartFormManifest } from "@/components/tools/smart-form/getPilotSmartFormManifest";
import {
  buildAutoShopPilotCalculationPayload,
} from "@/components/tools/smart-form/auto-shop-pilot-calculation-payload";
import {
  buildCabinetPilotCalculationPayload,
  shouldIncludeCabinetFieldInPilotPayload,
} from "@/components/tools/smart-form/cabinet-pilot-calculation-payload";
import { buildSmartFormPilotCalculationPayload } from "@/components/tools/smart-form/build-smart-form-pilot-calculation-payload";
import {
  buildThreeDPrintPilotCalculationPayload,
  THREE_D_PRINT_PILOT_SLUG,
} from "@/components/tools/smart-form/pilot-calculation-payload";
import {
  buildSmartFormPilotAnalyticsPayload,
  trackSmartFormPilotStarted,
} from "@/components/tools/smart-form/smart-form-pilot-analytics";
import {
  AUTO_SHOP_PILOT_FREE_ROUTE_SLUG,
  AUTO_SHOP_PILOT_GOVERNANCE_SLUG,
  CABINET_PILOT_GOVERNANCE_SLUG,
  THREE_D_PRINT_PILOT_GOVERNANCE_SLUG,
} from "@/lib/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";
import { getNextSmartFormPilotCandidate } from "@/lib/formula-governance/smart-form-ui-bridge/next-smart-form-pilot-candidate";
import { resolveSmartFormPilotManifestForRoute } from "@/lib/formula-governance/smart-form-ui-bridge/resolve-smart-form-pilot-manifest";
import { REVENUE_EVENTS, trackRevenueEvent } from "@/lib/analytics/revenue-events";
import { shouldUseSmartFormPilot } from "@/lib/feature-flags/smart-form-pilot";

vi.mock("@/lib/analytics/revenue-events", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/analytics/revenue-events")>();
  return {
    ...original,
    trackRevenueEvent: vi.fn(original.trackRevenueEvent),
  };
});

describe("cabinet smart form pilot calculation bridge — Phase 5H-G-H", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.mocked(trackRevenueEvent).mockClear();
  });

  test("3d-print mapper preserves existing behavior", () => {
    const result = buildThreeDPrintPilotCalculationPayload({
      materialCost: "120",
      printHours: "4",
      machineRate: "35",
    });

    expect(result.payload).toEqual({
      materialCost: 120,
      printHours: 4,
      machineRate: 35,
    });
  });

  test("auto-shop mapper preserves existing behavior", () => {
    const manifest = getPilotSmartFormManifest(AUTO_SHOP_PILOT_GOVERNANCE_SLUG)!;
    const result = buildAutoShopPilotCalculationPayload({
      fieldValues: {
        quotedPrice: "850",
        repairHours: "3",
        partsCost: "220",
      },
      manifest,
    });

    expect(result.payload).toEqual({
      quotedPrice: 850,
      repairHours: 3,
      partsCost: 220,
    });
  });

  test("cabinet mapper includes only free production mapped fields", () => {
    const manifest = getPilotSmartFormManifest(CABINET_PILOT_GOVERNANCE_SLUG);
    expect(manifest).not.toBeNull();

    const result = buildCabinetPilotCalculationPayload({
      fieldValues: {
        sheetMaterialCost: "2400",
        laborHours: "18",
        installHours: "6",
        laborRate: "65",
        hardwareCost: "400",
        wastePercent: "12",
      },
      manifest: manifest!,
    });

    expect(result.payload).toEqual({
      sheetMaterialCost: 2400,
      laborHours: 18,
      installHours: 6,
    });
    expect(Object.keys(result.payload ?? {})).toHaveLength(3);
  });

  test("cabinet derived fields stay outside payload", () => {
    const manifest = getPilotSmartFormManifest(CABINET_PILOT_GOVERNANCE_SLUG)!;
    const derivedKeys =
      manifest.fields
        .filter((field) => field.componentKind === "field_readonly")
        .map((field) => field.key) ?? [];

    const fieldValues: Record<string, string> = {
      sheetMaterialCost: "1000",
      laborHours: "10",
      installHours: "4",
    };
    for (const key of derivedKeys) {
      fieldValues[key] = "999";
    }

    const result = buildCabinetPilotCalculationPayload({ fieldValues, manifest });
    expect(result.payload).toEqual({
      sheetMaterialCost: 1000,
      laborHours: 10,
      installHours: 4,
    });
  });

  test("cabinet assumption fields stay outside payload", () => {
    const manifest = getPilotSmartFormManifest(CABINET_PILOT_GOVERNANCE_SLUG)!;
    const assumptionKeys =
      manifest.fields
        .filter((field) => field.componentKind === "assumption_callout")
        .map((field) => field.key) ?? [];

    const fieldValues: Record<string, string> = {
      sheetMaterialCost: "1000",
      laborHours: "10",
      installHours: "4",
    };
    for (const key of assumptionKeys) {
      fieldValues[key] = "ignored";
    }

    const result = buildCabinetPilotCalculationPayload({ fieldValues, manifest });
    expect(Object.keys(result.payload ?? {})).toEqual([
      "sheetMaterialCost",
      "laborHours",
      "installHours",
    ]);
  });

  test("generic dispatcher routes cabinet slug to cabinet mapper", () => {
    const manifest = getPilotSmartFormManifest(CABINET_PILOT_GOVERNANCE_SLUG)!;
    const result = buildSmartFormPilotCalculationPayload({
      slug: CABINET_PILOT_GOVERNANCE_SLUG,
      fieldValues: {
        sheetMaterialCost: "500",
        laborHours: "8",
        installHours: "2",
      },
      manifest,
    });

    expect(result.supported).toBe(true);
    expect(result.payload).toEqual({
      sheetMaterialCost: 500,
      laborHours: 8,
      installHours: 2,
    });
  });

  test("unsupported slug returns null unsupported payload", () => {
    const result = buildSmartFormPilotCalculationPayload({
      slug: "plumbing-job-margin-verdict",
      fieldValues: { laborHours: "1" },
      manifest: getPilotSmartFormManifest(CABINET_PILOT_GOVERNANCE_SLUG)!,
    });

    expect(result.supported).toBe(false);
    expect(result.payload).toBeNull();
  });

  test("cabinet pilot candidate has calculation bridge enabled", () => {
    const candidate = getNextSmartFormPilotCandidate();
    expect(candidate.slug).toBe(CABINET_PILOT_GOVERNANCE_SLUG);
    expect(candidate.calculationBridgeEnabled).toBe(true);
  });

  test("3d-print and auto-shop bridges remain enabled", () => {
    expect(
      buildSmartFormPilotCalculationPayload({
        slug: THREE_D_PRINT_PILOT_GOVERNANCE_SLUG,
        fieldValues: {
          materialCost: "1",
          printHours: "1",
          machineRate: "1",
        },
        manifest: getPilotSmartFormManifest(THREE_D_PRINT_PILOT_SLUG)!,
      }).supported,
    ).toBe(true);

    expect(
      buildSmartFormPilotCalculationPayload({
        slug: AUTO_SHOP_PILOT_GOVERNANCE_SLUG,
        fieldValues: {
          quotedPrice: "1",
          repairHours: "1",
          partsCost: "1",
        },
        manifest: getPilotSmartFormManifest(AUTO_SHOP_PILOT_GOVERNANCE_SLUG)!,
      }).supported,
    ).toBe(true);
  });

  test("feature flag false keeps classic path fallback for all pilots", () => {
    vi.stubEnv("NEXT_PUBLIC_SMART_FORM_PILOT", "false");
    expect(shouldUseSmartFormPilot(THREE_D_PRINT_PILOT_SLUG)).toBe(false);
    expect(shouldUseSmartFormPilot(AUTO_SHOP_PILOT_FREE_ROUTE_SLUG)).toBe(false);
    expect(shouldUseSmartFormPilot(CABINET_PILOT_GOVERNANCE_SLUG)).toBe(false);
    expect(resolveSmartFormPilotManifestForRoute(CABINET_PILOT_GOVERNANCE_SLUG)).toBeNull();
  });

  test("cabinet analytics payload uses governance slug and mapped count", () => {
    const payload = buildSmartFormPilotAnalyticsPayload(CABINET_PILOT_GOVERNANCE_SLUG);

    expect(payload).toEqual({
      slug: CABINET_PILOT_GOVERNANCE_SLUG,
      mode: "smart_form_pilot",
      featureFlag: true,
      mappedInputCount: 3,
      advancedInputSubmitted: false,
      toolSlug: CABINET_PILOT_GOVERNANCE_SLUG,
    });

    trackSmartFormPilotStarted(CABINET_PILOT_GOVERNANCE_SLUG);
    expect(trackRevenueEvent).toHaveBeenCalledWith(
      REVENUE_EVENTS.free_tool_started,
      payload,
    );
  });

  test("shouldIncludeCabinetFieldInPilotPayload excludes governance-only fields", () => {
    expect(shouldIncludeCabinetFieldInPilotPayload("sheetMaterialCost")).toBe(true);
    expect(shouldIncludeCabinetFieldInPilotPayload("laborRate")).toBe(false);
    expect(shouldIncludeCabinetFieldInPilotPayload("wasteAdjustedHours")).toBe(false);
  });

  test("flag true resolves cabinet manifest on free route slug", () => {
    vi.stubEnv("NEXT_PUBLIC_SMART_FORM_PILOT", "true");
    expect(shouldUseSmartFormPilot(CABINET_PILOT_GOVERNANCE_SLUG)).toBe(true);

    const manifest = resolveSmartFormPilotManifestForRoute(CABINET_PILOT_GOVERNANCE_SLUG);
    expect(manifest?.slug).toBe(CABINET_PILOT_GOVERNANCE_SLUG);
  });
});
