/**
 * Phase 5H-G-D - smart form pilot selection tests.
 */

import { afterEach, describe, expect, test, vi } from "vitest";
import { getPilotSmartFormManifest } from "@/components/tools/smart-form/getPilotSmartFormManifest";
import { shouldUseSmartFormPilot } from "@/lib/infrastructure/feature-flags/smart-form-pilot";

describe("smart form pilot selection", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("flag false keeps existing path selection off", () => {
    vi.stubEnv("NEXT_PUBLIC_SMART_FORM_PILOT", "false");
    expect(shouldUseSmartFormPilot("3d-print-cost-check")).toBe(false);
    // Loader may still resolve manifest; wiring gate is shouldUseSmartFormPilot in FreeToolPage.
    expect(getPilotSmartFormManifest("3d-print-cost-check")?.status).toBe("ui_bridge_ready");
  });

  test("flag true selects pilot for all wired free routes", () => {
    vi.stubEnv("NEXT_PUBLIC_SMART_FORM_PILOT", "true");
    expect(shouldUseSmartFormPilot("3d-print-cost-check")).toBe(true);
    expect(shouldUseSmartFormPilot("repair-time-vs-price-check")).toBe(true);
    expect(shouldUseSmartFormPilot("cabinet-cost-estimator")).toBe(true);

    const threeDPrint = getPilotSmartFormManifest("3d-print-cost-check");
    expect(threeDPrint).not.toBeNull();
    expect(threeDPrint?.slug).toBe("3d-print-cost-check");

    const autoShop = getPilotSmartFormManifest("repair-time-vs-price-check");
    expect(autoShop).not.toBeNull();
    expect(autoShop?.slug).toBe("auto-shop-margin-leak-detector");

    const cabinet = getPilotSmartFormManifest("cabinet-cost-estimator");
    expect(cabinet).not.toBeNull();
    expect(cabinet?.slug).toBe("cabinet-cost-estimator");
  });

  test("flag true does not select non-pilot slugs", () => {
    vi.stubEnv("NEXT_PUBLIC_SMART_FORM_PILOT", "true");
    expect(shouldUseSmartFormPilot("plumbing-job-margin-verdict")).toBe(false);
  });
});
