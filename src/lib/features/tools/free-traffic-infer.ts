/** Client-safe category inference - no Node/fs imports. */

export type FreeTrafficCategory =
  | "construction-measurement"
  | "finance-business"
  | "manufacturing-workshop"
  | "energy-carbon"
  | "logistics-travel"
  | "agriculture-food"
  | "everyday-life"
  | "math-statistics"
  | "conversion"
  | "health-body"
  | "physics-science"
  | "chemistry-science"
  | "engineering-science"
  | "food-cooking"
  | "date-time"
  | "education-academic"
  | "ecology-environment"
  | "gaming-entertainment"
  | "hobbies-diy";

export function inferFreeTrafficCategory(slug: string): FreeTrafficCategory {
  if (
    /machining|cnc|cutting|feed-rate|tool-|oee|cycle-time|manufacturing|gage|msa|muda|setup|mtbf|mttr|spindle/.test(
      slug,
    )
  ) {
    return "manufacturing-workshop";
  }
  if (
    /mortgage|loan|tax|margin|roi|npv|apy|salary|discount|interest|break-even|compound|1031|exchange|capital-gains|depreciation|amortization/.test(
      slug,
    )
  ) {
    return "finance-business";
  }
  if (/concrete|beam|pipe|reynolds|wind|voltage|thermal|deflection|flow/.test(slug)) {
    return "construction-measurement";
  }
  if (/carbon|kwh|energy|ohms|hp-to|psi-to/.test(slug)) {
    return "energy-carbon";
  }
  if (/mpg|liter|gallon|kg-to|lbs-to|cm-to|mm-to|sqft|celsius|converter/.test(slug)) {
    return "conversion";
  }
  if (/bmi|bmr|tdee|calorie|body-fat|ovulation|pregnancy|sleep|water-intake/.test(slug)) {
    return "health-body";
  }
  if (
    /percent|fraction|lcm|quadratic|probability|z-score|logarithm|vector|scientific|standard-deviation/.test(
      slug,
    )
  ) {
    return "math-statistics";
  }
  return "everyday-life";
}
