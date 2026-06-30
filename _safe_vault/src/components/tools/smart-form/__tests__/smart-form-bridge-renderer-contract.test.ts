/**
 * Phase 5H-G-D — smart form bridge renderer contract tests (no DOM).
 */

import { describe, expect, test } from "vitest";
import { getPilotSmartFormManifest } from "@/components/tools/smart-form/getPilotSmartFormManifest";

describe("smart form bridge renderer contract", () => {
  test("manifest includes sections, fields, and calculation summary props", () => {
    const manifest = getPilotSmartFormManifest("3d-print-cost-check");
    expect(manifest).not.toBeNull();
    expect(manifest?.sections.length).toBeGreaterThan(0);
    expect(manifest?.fields.length).toBeGreaterThan(0);
    expect(manifest?.trustTrace.enabled).toBe(true);
    expect(manifest?.trustTrace.usedInputs.length).toBeGreaterThan(0);
  });

  test("derived fields are not editable in manifest props", () => {
    const manifest = getPilotSmartFormManifest("3d-print-cost-check");
    const derivedFields = manifest?.fields.filter((field) => field.badges.includes("Derived")) ?? [];

    expect(derivedFields.length).toBeGreaterThan(0);
    for (const field of derivedFields) {
      expect(field.editable).toBe(false);
      expect(field.componentKind).toBe("field_readonly");
    }
  });

  test("assumption callout fields are present", () => {
    const manifest = getPilotSmartFormManifest("3d-print-cost-check");
    const assumptions =
      manifest?.fields.filter((field) => field.componentKind === "assumption_callout") ?? [];

    expect(assumptions.length).toBeGreaterThan(0);
    expect(assumptions.some((field) => field.badges.includes("Assumption"))).toBe(true);
  });

  test("manifest is JSON-serializable governance object", () => {
    const manifest = getPilotSmartFormManifest("3d-print-cost-check");
    expect(() => JSON.stringify(manifest)).not.toThrow();
  });

  test("renderer module does not import production calculator", async () => {
    const rendererSource = await import("node:fs/promises").then((fs) =>
      fs.readFile(
        new URL("../SmartFormBridgeRenderer.tsx", import.meta.url),
        "utf8",
      ),
    );

    expect(rendererSource).not.toContain("calculateFreeToolResult");
    expect(rendererSource).not.toContain("calculateFreeTrafficTool");
    expect(rendererSource).not.toContain("free-traffic-calculators");
  });
});
