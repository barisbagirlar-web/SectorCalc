import { describe, expect, test } from "vitest";
import {
  buildPdfExportLeadInput,
  isValidPdfExportEmail,
} from "@/lib/leads/save-pdf-export-lead-server";
import { buildPdfExportInputRows } from "@/lib/pdf/build-pdf-export-rows";
import type { GeneratedToolSchema } from "@/lib/generated-tools/types";

const SCHEMA: GeneratedToolSchema = {
  toolName: "Cutting Speed Calculator",
  inputs: [
    {
      id: "cutting_speed",
      label: "Cutting speed",
      type: "number",
      unit: "m/min",
      businessContext: "Speed",
    },
  ],
  validation: { rules: [], thresholds: {} },
  formulas: {},
  outputs: {
    primary: "Result",
    breakdown: {},
    hiddenLossDrivers: [],
    suggestedActions: [],
    dataConfidenceAdjusted: "medium",
  },
  premiumFeatures: [],
  premiumRequired: false,
};

describe("pdf export lead magnet", () => {
  test("validates export email addresses", () => {
    expect(isValidPdfExportEmail("user@example.com")).toBe(true);
    expect(isValidPdfExportEmail("not-an-email")).toBe(false);
  });

  test("builds lead intent payload for pdf export", () => {
    const lead = buildPdfExportLeadInput({
      email: "Operator@Example.com",
      toolName: "Cutting Speed Calculator",
      toolSlug: "cutting-speed-calculator",
      locale: "de",
      pagePath: "/de/tools/generated/cutting-speed-calculator",
    });

    expect(lead.source).toBe("export");
    expect(lead.email).toBe("operator@example.com");
    expect(lead.toolRequested).toBe("Cutting Speed Calculator");
    expect(lead.plan).toBe("free");
  });

  test("builds localized pdf input rows", () => {
    const rows = buildPdfExportInputRows({
      schema: SCHEMA,
      values: { cutting_speed: 120 },
      locale: "en",
    });

    expect(rows).toHaveLength(1);
    expect(rows[0]?.label).toBe("Cutting speed");
    expect(rows[0]?.value).toContain("120");
  });
});
