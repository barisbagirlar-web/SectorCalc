import { describe, expect, it } from "vitest";
import {
  formatToolLastUpdatedDate,
  parseToolIsoDateOnly,
} from "@/lib/features/generated-tools/format-tool-last-updated-date";
import { getGeneratedToolLastUpdatedIso } from "@/lib/features/generated-tools/resolve-tool-updated-at";
import type { GeneratedToolSchema } from "@/lib/features/generated-tools/types";

const baseSchema: GeneratedToolSchema = {
  toolName: "Test Tool",
  inputs: [
    {
      id: "value",
      label: "Value",
      type: "number",
      unit: "none",
      businessContext: "Test",
    },
  ],
  validation: { rules: [], thresholds: {} },
  formulas: {},
  outputs: {
    primary: "total",
    breakdown: {},
    hiddenLossDrivers: [],
    suggestedActions: [],
    dataConfidenceAdjusted: "0.9",
  },
  premiumFeatures: [],
  premiumRequired: false,
};

describe("resolve-tool-updated-at", () => {
  it("prefers explicit schema lastUpdated when valid", () => {
    const iso = getGeneratedToolLastUpdatedIso("pressure-vessel-thickness", {
      ...baseSchema,
      lastUpdated: "2026-01-22",
    });
    expect(iso).toBe("2026-01-22");
  });

  it("ignores invalid schema lastUpdated and falls back to tracked files", () => {
    const iso = getGeneratedToolLastUpdatedIso("pressure-vessel-thickness", {
      ...baseSchema,
      lastUpdated: "not-a-date",
    });
    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("formats locale-aware dates", () => {
    expect(formatToolLastUpdatedDate("2026-01-22", "tr")).toContain("2026");
    expect(formatToolLastUpdatedDate("2026-01-22", "en")).toContain("2026");
    expect(parseToolIsoDateOnly("2026-01-22")).toBe("2026-01-22");
  });
});
