/**
 * Phase 5H-G-E — pilot calculation payload tests.
 */

import { afterEach, describe, expect, test, vi } from "vitest";
import { getPilotSmartFormManifest } from "@/components/tools/smart-form/getPilotSmartFormManifest";
import {
  buildThreeDPrintPilotCalculationPayload,
  isThreeDPrintPilotSubmitDisabled,
  shouldIncludeFieldInPilotPayload,
  THREE_D_PRINT_PILOT_SUBMIT_KEYS,
} from "@/components/tools/smart-form/pilot-calculation-payload";
import { shouldUseSmartFormPilot } from "@/lib/infrastructure/feature-flags/smart-form-pilot";

describe("pilot calculation payload", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("includes materialCost, printHours, and machineRate in payload", () => {
    const result = buildThreeDPrintPilotCalculationPayload({
      materialCost: "120",
      printHours: "4",
      machineRate: "35",
    });

    expect(result.errors).toEqual({});
    expect(result.payload).toEqual({
      materialCost: 120,
      printHours: 4,
      machineRate: 35,
    });
  });

  test("excludes derived and assumption fields from payload mapping keys", () => {
    const manifest = getPilotSmartFormManifest("3d-print-cost-check");
    expect(manifest).not.toBeNull();

    const derivedKeys =
      manifest?.fields
        .filter((field) => field.componentKind === "field_readonly")
        .map((field) => field.key) ?? [];
    const assumptionKeys =
      manifest?.fields
        .filter((field) => field.componentKind === "assumption_callout")
        .map((field) => field.key) ?? [];

    for (const key of derivedKeys) {
      expect(shouldIncludeFieldInPilotPayload(key)).toBe(false);
    }
    for (const key of assumptionKeys) {
      expect(shouldIncludeFieldInPilotPayload(key)).toBe(false);
    }
  });

  test("returns validation errors for invalid numeric input", () => {
    const result = buildThreeDPrintPilotCalculationPayload({
      materialCost: "abc",
      printHours: "2",
      machineRate: "10",
    });

    expect(result.payload).toBeNull();
    expect(result.errors.materialCost).toContain("valid number");
  });

  test("submit disabled when required mapped fields are empty", () => {
    expect(
      isThreeDPrintPilotSubmitDisabled({
        materialCost: "",
        printHours: "2",
        machineRate: "10",
      }),
    ).toBe(true);
    expect(
      isThreeDPrintPilotSubmitDisabled({
        materialCost: "10",
        printHours: "2",
        machineRate: "10",
      }),
    ).toBe(false);
  });

  test("flag false keeps smart form calculation bridge off", () => {
    vi.stubEnv("NEXT_PUBLIC_SMART_FORM_PILOT", "false");
    expect(shouldUseSmartFormPilot("3d-print-cost-check")).toBe(false);
  });

  test("flag true enables bridge for pilot free routes only", () => {
    vi.stubEnv("NEXT_PUBLIC_SMART_FORM_PILOT", "true");
    expect(shouldUseSmartFormPilot("3d-print-cost-check")).toBe(true);
    expect(shouldUseSmartFormPilot("repair-time-vs-price-check")).toBe(true);
    expect(shouldUseSmartFormPilot("cabinet-cost-estimator")).toBe(true);
    expect(shouldUseSmartFormPilot("plumbing-job-margin-verdict")).toBe(false);
  });

  test("submit keys match production free input shape", () => {
    expect(THREE_D_PRINT_PILOT_SUBMIT_KEYS).toEqual([
      "materialCost",
      "printHours",
      "machineRate",
    ]);
  });

  test("payload module does not import production calculator", async () => {
    const source = await import("node:fs/promises").then((fs) =>
      fs.readFile(new URL("../pilot-calculation-payload.ts", import.meta.url), "utf8"),
    );

    expect(source).not.toContain("calculateFreeToolResult");
    expect(source).not.toContain("calculateFreeTrafficTool");
    expect(source).not.toContain("free-sector-calculations");
  });
});
