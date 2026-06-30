/**
 * Phase 5H-G-D — smart form pilot feature flag tests.
 */

import { afterEach, describe, expect, test, vi } from "vitest";
import {
  isSmartFormPilotEnabled,
  isSmartFormPilotSlug,
  shouldUseSmartFormPilot,
  SMART_FORM_PILOT_SLUG,
} from "@/lib/feature-flags/smart-form-pilot";

describe("smart form pilot feature flag", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("defaults to disabled", () => {
    vi.stubEnv("NEXT_PUBLIC_SMART_FORM_PILOT", undefined);
    expect(isSmartFormPilotEnabled()).toBe(false);
    expect(shouldUseSmartFormPilot(SMART_FORM_PILOT_SLUG)).toBe(false);
  });

  test("enables only for pilot slug when flag is true", () => {
    vi.stubEnv("NEXT_PUBLIC_SMART_FORM_PILOT", "true");
    expect(isSmartFormPilotEnabled()).toBe(false);
    expect(shouldUseSmartFormPilot(SMART_FORM_PILOT_SLUG)).toBe(false);
    expect(shouldUseSmartFormPilot("repair-time-vs-price-check")).toBe(false);
    expect(shouldUseSmartFormPilot("cabinet-cost-estimator")).toBe(false);
    expect(shouldUseSmartFormPilot("electrical-labor-estimator")).toBe(false);
    expect(shouldUseSmartFormPilot("plumbing-job-margin-verdict")).toBe(false);
  });

  test("recognizes pilot slug constants", () => {
    expect(isSmartFormPilotSlug("3d-print-cost-check")).toBe(false);
    expect(isSmartFormPilotSlug("cabinet-cost-estimator")).toBe(false);
    expect(isSmartFormPilotSlug("repair-time-vs-price-check")).toBe(false);
    expect(isSmartFormPilotSlug("electrical-labor-estimator")).toBe(false);
    expect(isSmartFormPilotSlug("plumbing-job-margin-verdict")).toBe(false);
  });
});
