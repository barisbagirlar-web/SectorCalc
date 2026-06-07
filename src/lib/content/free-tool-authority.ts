import type { FreeTrafficCategory, FreeTrafficTool } from "@/lib/tools/free-traffic-catalog";

export interface FreeToolAuthorityCopy {
  readonly description: string;
  readonly formulaSummary: string;
  readonly inputsMeaning: string;
  readonly includes: readonly string[];
  readonly excludes: readonly string[];
}

const CATEGORY_FORMULA: Record<FreeTrafficCategory, string> = {
  "construction-measurement":
    "Area, volume and material quantities are derived from your dimensions and standard conversion factors for the selected units.",
  "finance-business":
    "Financial results combine principal, rate, time or margin inputs using standard business formulas such as payment, interest or break-even equations.",
  "manufacturing-workshop":
    "Shop-floor metrics combine time, rate, yield or efficiency inputs using standard manufacturing ratios for cycle time, OEE or scrap exposure.",
  "energy-carbon":
    "Energy and emissions estimates multiply consumption, tariff or emission factors from your inputs to show cost and carbon exposure.",
  "logistics-travel":
    "Route and travel costs sum distance, fuel rate, stop count or time inputs to estimate per-trip or per-km operating exposure.",
  "agriculture-food":
    "Yield and food-cost metrics relate area, input rate or recipe cost to output quantity using standard ratio formulas.",
  "everyday-life":
    "Everyday estimates apply simple ratio or sum formulas to the values you enter for quick household or personal planning.",
  "math-statistics":
    "Statistical and math results apply standard formulas to the numeric inputs you provide.",
  conversion:
    "Conversion results multiply or divide by fixed unit factors so you can compare metric and imperial measurements consistently.",
  "health-body":
    "Body metric estimates apply published ratio formulas to height, weight or activity inputs. They are not medical advice.",
};

const DEFAULT_FORMULA =
  "This calculator uses the values entered above to estimate the primary result and related secondary values using standard ratio formulas for this tool type.";

export function getFreeToolAuthorityCopy(tool: FreeTrafficTool): FreeToolAuthorityCopy {
  const formulaSummary = CATEGORY_FORMULA[tool.category] ?? DEFAULT_FORMULA;
  const inputsMeaning = tool.inputs
    .map((input) => `${input.label}${input.unit ? ` (${input.unit})` : ""}: ${input.helper}`)
    .join(" ");

  return {
    description: tool.description,
    formulaSummary,
    inputsMeaning,
    includes: [
      "Formula-based estimate from the inputs you enter",
      "Primary result plus supporting secondary values where applicable",
      "Plain-language explanation of what the numbers represent",
    ],
    excludes: [
      "Premium hidden-loss diagnostics or threshold verdicts",
      "PDF or CSV export and saved report history",
      "Professional financial, legal, medical or engineering advice",
    ],
  };
}
