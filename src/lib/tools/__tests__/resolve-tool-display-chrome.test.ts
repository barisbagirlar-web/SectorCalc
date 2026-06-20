import { describe, expect, it } from "vitest";
import { resolveGeneratedToolTitle } from "@/lib/generated-tools/resolve-tool-display";
import type { GeneratedToolSchema } from "@/lib/generated-tools/types";
import { resolveFreeToolFieldDisplay } from "@/lib/i18n/free-tool-form-i18n";
import {
  hasCalculatorFieldCopyResidue,
  isSnakeCaseTechnicalKey,
} from "@/lib/i18n/locale-field-copy-quality";
import {
  resolveToolDisplayChrome,
  resolveToolKeywordTags,
} from "@/lib/tools/resolve-tool-display-chrome";

const schema = {
  toolName: "Tool Wear Cost Calculator",
  inputs: [
    {
      id: "tool_cost",
      label: "Tool Cost per Unit",
      type: "number",
      unit: "USD",
      businessContext: "Purchase price of a single cutting tool or insert.",
    },
    {
      id: "tool_life_parts",
      label: "Tool Life (Parts per Tool)",
      type: "number",
      unit: "parts",
      businessContext: "Average number of parts produced before tool replacement is required.",
    },
    {
      id: "replacement_time_min",
      label: "Replacement Time",
      type: "number",
      unit: "minutes",
      businessContext: "Time required to replace or index the tool.",
    },
  ],
  outputs: {
    primary: "total_tool_wear_cost_per_part",
    breakdown: {},
    hiddenLossDrivers: [],
    suggestedActions: [],
    dataConfidenceAdjusted: "data_confidence_adjusted_cost",
  },
  premiumRequired: true,
  premiumFeatures: [],
} as unknown as GeneratedToolSchema;

describe("locale-field-copy-quality", () => {
  it("flags mixed EN/TR residue", () => {
    expect(
      hasCalculatorFieldCopyResidue("tr", {
        label: "Replacement Süre",
        helper: "Süre Gerekli to replace veya index takım.",
      }),
    ).toBe(true);
    expect(
      hasCalculatorFieldCopyResidue("tr", {
        label: "Birim Başına Takım Maliyeti",
        helper: "Tek bir kesici takımın veya uç satın alma fiyatı.",
      }),
    ).toBe(false);
  });

  it("detects snake_case technical keys", () => {
    expect(isSnakeCaseTechnicalKey("total_tool_wear_cost_per_part")).toBe(true);
    expect(isSnakeCaseTechnicalKey("Total Tool Wear Cost per Part")).toBe(false);
  });
});

describe("resolve-tool-display-chrome", () => {
  it("uses localized title and skips technical primary key in summary", () => {
    expect(resolveGeneratedToolTitle("tool-wear-cost-calculator", schema, "tr")).toBe(
      "Takım Aşınma Maliyeti Hesaplayıcı",
    );

    const chrome = resolveToolDisplayChrome("tool-wear-cost-calculator", schema, "tr");
    expect(chrome.summary).not.toBe("total_tool_wear_cost_per_part");
    expect(chrome.summary.length).toBeGreaterThan(10);
  });

  it("returns Turkish keyword tags from generated bundle", () => {
    const tags = resolveToolKeywordTags("tool-wear-cost-calculator", schema, "tr");
    expect(tags[0]).toBe("Takım Birim Maliyeti");
    expect(tags[1]).toBe("Takım Ömrü (Takım Başına Parça)");
    expect(tags[2]).toBe("Değiştirme Süresi");
  });

  it("skips camelCase formula keys like totalBoot in summary", () => {
    const exchangeSchema = {
      toolName: "1031 Exchange Calculator",
      inputs: [
        {
          id: "salePrice",
          label: "Sale Price of Relinquished Property",
          type: "number",
          unit: "$",
          businessContext: "The selling price of the property you are giving up",
        },
      ],
      formulas: {
        totalBoot: "cashBoot + mortgageBoot",
      },
      outputs: {
        primary: "totalBoot",
        breakdown: { netProceeds: "netProceeds" },
      },
      catalogCategory: "finance-business",
    } as unknown as GeneratedToolSchema;

    const chrome = resolveToolDisplayChrome("1031-exchange-calculator", exchangeSchema, "tr");
    expect(chrome.summary).not.toBe("totalBoot");
    expect(chrome.summary.length).toBeGreaterThan(10);
  });
});

describe("resolveFreeToolFieldDisplay", () => {
  it("prefers clean generated bundle over corrupt messages copy", () => {
    const resolved = resolveFreeToolFieldDisplay("tool-wear-cost-calculator", "tool_cost", "tr", {
      label: "Tool Cost per Unit",
      placeholder: "Enter tool cost per unit",
      helper: "Purchase price of a single cutting tool or insert.",
    });

    expect(resolved.label).toBe("Takım Birim Maliyeti");
    expect(resolved.helper).toContain("kesici takım");
    expect(hasCalculatorFieldCopyResidue("tr", resolved)).toBe(false);
  });
});
