/**
 * Phase 5H-G-D — smart form pilot selection tests.
 */

import { afterEach, describe, expect, test, vi } from "vitest";
import { getPilotSmartFormManifest } from "@/components/tools/smart-form/getPilotSmartFormManifest";
import { shouldUseSmartFormPilot } from "@/lib/feature-flags/smart-form-pilot";

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

  test("flag true selects pilot for 3d-print-cost-check", () => {
    vi.stubEnv("NEXT_PUBLIC_SMART_FORM_PILOT", "true");
    expect(shouldUseSmartFormPilot("3d-print-cost-check")).toBe(true);
    const manifest = getPilotSmartFormManifest("3d-print-cost-check");
    expect(manifest).not.toBeNull();
    expect(manifest?.slug).toBe("3d-print-cost-check");
    expect(manifest?.status).toBe("ui_bridge_ready");
  });

  test("flag true does not select other slugs", () => {
    vi.stubEnv("NEXT_PUBLIC_SMART_FORM_PILOT", "true");
    expect(shouldUseSmartFormPilot("auto-shop-margin-leak-detector")).toBe(false);
    expect(getPilotSmartFormManifest("auto-shop-margin-leak-detector")).toBeNull();
  });
});
