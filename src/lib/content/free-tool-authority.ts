import type { FreeTrafficCategory, FreeTrafficTool } from "@/lib/features/tools/free-traffic-catalog";

export interface FreeToolAuthorityCopy {
  readonly description: string;
  readonly formulaSummary: string;
  readonly inputsMeaning: string;
  readonly includes: readonly string[];
  readonly excludes: readonly string[];
  readonly estimateMisses: string;
}

const CATEGORY_FORMULA: Partial<Record<FreeTrafficCategory, string>> = {
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
  "physics-science":
    "Physics estimates apply standard mechanics, thermodynamics or wave equations to the values you enter.",
  "chemistry-science":
    "Chemistry results use molarity, stoichiometry or equilibrium formulas from your concentration and mass inputs.",
  "engineering-science":
    "Engineering checks combine load, material or electrical inputs using standard design ratio formulas.",
  "food-cooking":
    "Kitchen math scales recipes, portions or cooking times using ratio formulas from your ingredient inputs.",
  "date-time":
    "Date and time results derive intervals, ages or calendar offsets from the dates and durations you provide.",
  "education-academic":
    "Academic scores and grade metrics apply standard weighting or percentile formulas to your entered values.",
  "ecology-environment":
    "Environmental estimates multiply activity, consumption or area inputs by published emission or savings factors.",
  "gaming-entertainment":
    "Game and media helpers apply probability, rating or exposure formulas to the stats you enter.",
  "hobbies-diy":
    "Hobby calculators use spacing, dosage or sizing ratios for gardening, crafts and outdoor planning inputs.",
};

const DEFAULT_FORMULA =
  "This calculator uses the values entered above to estimate the primary result and related secondary values using standard ratio formulas for this tool type.";

const ESTIMATE_MISSES =
  "This free result gives the first number. It does not include hidden drivers such as thresholds, benchmark comparison, sensitivity, export-ready report output or suggested action plans.";

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
    estimateMisses: ESTIMATE_MISSES,
  };
}
