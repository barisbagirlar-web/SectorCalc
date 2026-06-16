import { describe, expect, it } from "vitest";
import type { GeneratedToolSchema } from "@/lib/generated-tools/types";
import { resolveToolDisplayChrome, resolveToolKeywordTags } from "@/lib/tools/resolve-tool-display-chrome";

const schema = {
  toolName: "Thermal Conductivity Calculator",
  inputs: [
    {
      id: "material",
      label: "Material",
      type: "select",
      options: ["steel"],
      unit: "",
      businessContext: "",
    },
    {
      id: "temperature",
      label: "Temperature",
      type: "number",
      unit: "C",
      businessContext: "",
    },
    {
      id: "thickness",
      label: "Thickness",
      type: "number",
      unit: "mm",
      businessContext: "",
    },
    {
      id: "insulation",
      label: "Insulation",
      type: "number",
      unit: "mm",
      businessContext: "",
    },
  ],
  outputs: {
    primary: "Thermal conductivity based on material and temperature.",
    breakdown: {},
    hiddenLossDrivers: [],
    suggestedActions: [],
    dataConfidenceAdjusted: "Adjusted output",
  },
  premiumRequired: false,
  premiumFeatures: [],
} as unknown as GeneratedToolSchema;

describe("resolve-tool-display-chrome", () => {
  it("returns one-line summary and three keyword tags", () => {
    const chrome = resolveToolDisplayChrome("thermal-conductivity-calculator", schema, "en");

    expect(chrome.summary).toContain("Thermal conductivity");
    expect(chrome.keywordTags).toEqual(["Material", "Temperature", "Thickness"]);
  });

  it("limits keyword tags", () => {
    expect(resolveToolKeywordTags(schema, "en", 2)).toEqual(["Material", "Temperature"]);
  });
});
