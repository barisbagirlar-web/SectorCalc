/**
 * Phase 5H-G-G - auto-shop smart form pilot calculation bridge tests.
 */

import { afterEach, describe, expect, test, vi } from "vitest";
import { getPilotSmartFormManifest } from "@/components/tools/smart-form/getPilotSmartFormManifest";
import {
  buildAutoShopPilotCalculationPayload,
  shouldIncludeAutoShopFieldInPilotPayload,
} from "@/components/tools/smart-form/auto-shop-pilot-calculation-payload";
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
  AUTO_SHOP_PILOT_GOVERNANCE_SLUG,
  AUTO_SHOP_PILOT_FREE_ROUTE_SLUG,
  isPilotCalculationBridgeEnabled,
  THREE_D_PRINT_PILOT_GOVERNANCE_SLUG,
} from "@/lib/features/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";
import { resolveSmartFormPilotManifestForRoute } from "@/lib/features/formula-governance/smart-form-ui-bridge/resolve-smart-form-pilot-manifest";
import { REVENUE_EVENTS, trackRevenueEvent } from "@/lib/infrastructure/analytics/revenue-events";
import { shouldUseSmartFormPilot } from "@/lib/infrastructure/feature-flags/smart-form-pilot";

vi.mock("@/lib/infrastructure/analytics/revenue-events", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/infrastructure/analytics/revenue-events")>();
  return {
    ...original,
    trackRevenueEvent: vi.fn(original.trackRevenueEvent),
  };
});

describe("auto-shop smart form pilot calculation bridge - Phase 5H-G-G", () => {
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

  test("auto-shop mapper includes only free production mapped fields", () => {
    const manifest = getPilotSmartFormManifest(AUTO_SHOP_PILOT_GOVERNANCE_SLUG);
    expect(manifest).not.toBeNull();

    const result = buildAutoShopPilotCalculationPayload({
      fieldValues: {
        quotedPrice: "850",
        repairHours: "3",
        partsCost: "220",
        diagnosticHours: "1.5",
        laborRate: "95",
        comebackRiskPercent: "12",
        partsMarkupPercent: "30",
      },
      manifest: manifest!,
    });

    expect(result.payload).toEqual({
      quotedPrice: 850,
      repairHours: 3,
      partsCost: 220,
    });
    expect(Object.keys(result.payload ?? {})).toHaveLength(3);
  });

  test("auto-shop derived fields stay outside payload", () => {
    const manifest = getPilotSmartFormManifest(AUTO_SHOP_PILOT_GOVERNANCE_SLUG)!;
    const derivedKeys =
      manifest.fields
        .filter((field) => field.componentKind === "field_readonly")
        .map((field) => field.key) ?? [];

    const fieldValues: Record<string, string> = {
      quotedPrice: "500",
      repairHours: "2",
      partsCost: "100",
    };
    for (const key of derivedKeys) {
      fieldValues[key] = "999";
    }

    const result = buildAutoShopPilotCalculationPayload({ fieldValues, manifest });
    expect(result.payload).toEqual({
      quotedPrice: 500,
      repairHours: 2,
      partsCost: 100,
    });
  });

  test("auto-shop assumption fields stay outside payload", () => {
    const manifest = getPilotSmartFormManifest(AUTO_SHOP_PILOT_GOVERNANCE_SLUG)!;
    const assumptionKeys =
      manifest.fields
        .filter((field) => field.componentKind === "assumption_callout")
        .map((field) => field.key) ?? [];

    const fieldValues: Record<string, string> = {
      quotedPrice: "500",
      repairHours: "2",
      partsCost: "100",
    };
    for (const key of assumptionKeys) {
      fieldValues[key] = "ignored";
    }

    const result = buildAutoShopPilotCalculationPayload({ fieldValues, manifest });
    expect(Object.keys(result.payload ?? {})).toEqual([
      "quotedPrice",
      "repairHours",
      "partsCost",
    ]);
  });

  test("generic dispatcher routes slug to correct mapper", () => {
    const threeDPrint = buildSmartFormPilotCalculationPayload({
      slug: THREE_D_PRINT_PILOT_GOVERNANCE_SLUG,
      fieldValues: {
        materialCost: "10",
        printHours: "2",
        machineRate: "5",
      },
      manifest: getPilotSmartFormManifest(THREE_D_PRINT_PILOT_GOVERNANCE_SLUG)!,
    });

    const autoShop = buildSmartFormPilotCalculationPayload({
      slug: AUTO_SHOP_PILOT_GOVERNANCE_SLUG,
      fieldValues: {
        quotedPrice: "400",
        repairHours: "1",
        partsCost: "50",
      },
      manifest: getPilotSmartFormManifest(AUTO_SHOP_PILOT_GOVERNANCE_SLUG)!,
    });

    expect(threeDPrint.supported).toBe(true);
    expect(threeDPrint.payload).toEqual({ materialCost: 10, printHours: 2, machineRate: 5 });
    expect(autoShop.supported).toBe(true);
    expect(autoShop.payload).toEqual({ quotedPrice: 400, repairHours: 1, partsCost: 50 });
  });

  test("unsupported slug returns null unsupported payload", () => {
    const result = buildSmartFormPilotCalculationPayload({
      slug: "machine-time-calculator",
      fieldValues: { laborHours: "1" },
      manifest: getPilotSmartFormManifest("cabinet-cost-estimator")!,
    });

    expect(result.supported).toBe(false);
    expect(result.payload).toBeNull();
  });

  test("auto-shop calculation bridge remains enabled via registry", () => {
    expect(isPilotCalculationBridgeEnabled(AUTO_SHOP_PILOT_GOVERNANCE_SLUG)).toBe(true);
  });

  test("3d-print bridge remains enabled via registry", () => {
    expect(
      buildSmartFormPilotCalculationPayload({
        slug: THREE_D_PRINT_PILOT_SLUG,
        fieldValues: {
          materialCost: "1",
          printHours: "1",
          machineRate: "1",
        },
        manifest: getPilotSmartFormManifest(THREE_D_PRINT_PILOT_SLUG)!,
      }).supported,
    ).toBe(true);
  });

  test("feature flag false keeps classic path fallback for both pilots", () => {
    vi.stubEnv("NEXT_PUBLIC_SMART_FORM_PILOT", "false");
    expect(shouldUseSmartFormPilot(THREE_D_PRINT_PILOT_GOVERNANCE_SLUG)).toBe(false);
    expect(shouldUseSmartFormPilot(AUTO_SHOP_PILOT_FREE_ROUTE_SLUG)).toBe(false);
    expect(resolveSmartFormPilotManifestForRoute(AUTO_SHOP_PILOT_FREE_ROUTE_SLUG)).toBeNull();
  });

  test("auto-shop analytics payload uses governance slug and mapped count", () => {
    const payload = buildSmartFormPilotAnalyticsPayload(AUTO_SHOP_PILOT_GOVERNANCE_SLUG);

    expect(payload).toEqual({
      slug: AUTO_SHOP_PILOT_GOVERNANCE_SLUG,
      mode: "smart_form_pilot",
      featureFlag: true,
      mappedInputCount: 3,
      advancedInputSubmitted: false,
      toolSlug: AUTO_SHOP_PILOT_GOVERNANCE_SLUG,
    });

    trackSmartFormPilotStarted(AUTO_SHOP_PILOT_GOVERNANCE_SLUG);
    expect(trackRevenueEvent).toHaveBeenCalledWith(
      REVENUE_EVENTS.free_tool_started,
      payload,
    );
  });

  test("shouldIncludeAutoShopFieldInPilotPayload excludes governance-only fields", () => {
    expect(shouldIncludeAutoShopFieldInPilotPayload("quotedPrice")).toBe(true);
    expect(shouldIncludeAutoShopFieldInPilotPayload("diagnosticHours")).toBe(false);
    expect(shouldIncludeAutoShopFieldInPilotPayload("trueJobProfit")).toBe(false);
  });

  test("flag true resolves auto-shop manifest on free route slug", () => {
    vi.stubEnv("NEXT_PUBLIC_SMART_FORM_PILOT", "true");
    expect(shouldUseSmartFormPilot(AUTO_SHOP_PILOT_FREE_ROUTE_SLUG)).toBe(true);

    const manifest = resolveSmartFormPilotManifestForRoute(AUTO_SHOP_PILOT_FREE_ROUTE_SLUG);
    expect(manifest?.slug).toBe(AUTO_SHOP_PILOT_GOVERNANCE_SLUG);
  });
});
