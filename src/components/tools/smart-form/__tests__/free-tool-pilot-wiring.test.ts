/**
 * Phase 5H-G-D — free tool pilot wiring selection tests.
 */

import { afterEach, describe, expect, test, vi } from "vitest";
import { resolveSmartFormPilotManifestForRoute } from "@/lib/formula-governance/smart-form-ui-bridge/resolve-smart-form-pilot-manifest";
import { shouldUseSmartFormPilot } from "@/lib/feature-flags/smart-form-pilot";

describe("free tool pilot wiring", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("flag false returns null manifest for route resolver", () => {
    vi.stubEnv("NEXT_PUBLIC_SMART_FORM_PILOT", "false");
    expect(shouldUseSmartFormPilot("3d-print-cost-check")).toBe(false);
    expect(resolveSmartFormPilotManifestForRoute("3d-print-cost-check")).toBeNull();
  });

  test("flag true resolves manifest for pilot free routes", () => {
    vi.stubEnv("NEXT_PUBLIC_SMART_FORM_PILOT", "true");
    const threeDPrint = resolveSmartFormPilotManifestForRoute("3d-print-cost-check");
    expect(threeDPrint).not.toBeNull();
    expect(threeDPrint?.slug).toBe("3d-print-cost-check");

    const autoShop = resolveSmartFormPilotManifestForRoute("repair-time-vs-price-check");
    expect(autoShop).not.toBeNull();
    expect(autoShop?.slug).toBe("auto-shop-margin-leak-detector");

    expect(resolveSmartFormPilotManifestForRoute("cabinet-cost-estimator")).toBeNull();
  });
});
