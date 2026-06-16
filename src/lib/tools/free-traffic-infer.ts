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

const FREE_TRAFFIC_CATEGORY_SET = new Set<string>([
  "construction-measurement",
  "finance-business",
  "manufacturing-workshop",
  "energy-carbon",
  "logistics-travel",
  "agriculture-food",
  "everyday-life",
  "math-statistics",
  "conversion",
  "health-body",
  "physics-science",
  "chemistry-science",
  "engineering-science",
  "food-cooking",
  "date-time",
  "education-academic",
  "ecology-environment",
  "gaming-entertainment",
  "hobbies-diy",
]);

function isFreeTrafficCategory(value: string): value is FreeTrafficCategory {
  return FREE_TRAFFIC_CATEGORY_SET.has(value);
}

export function inferFreeTrafficCategory(slug: string): FreeTrafficCategory {
  if (
    /mortgage|loan|tax|margin|roi|npv|apy|salary|discount|interest|break-even|compound|dividend|ira|401k|bond|stock|crypto|forex|valuation|payroll|depreciation|amortization/.test(
      slug,
    )
  ) {
    return "finance-business";
  }
  if (
    /concrete|beam|pipe|reynolds|wind-load|voltage|thermal|deflection|flow|roof|drywall|tile|flooring|excavation|rebar|stair|brick|paint|hvac|plumb/.test(
      slug,
    )
  ) {
    return "construction-measurement";
  }
  if (
    /carbon|kwh|energy|ohms|hp-to|psi-to|solar|emission|ecology|sustainability|water-footprint/.test(
      slug,
    )
  ) {
    return "energy-carbon";
  }
  if (
    /physics|velocity|acceleration|momentum|thermodynamic|quantum|relativistic|orbital|newton|bernoulli/.test(
      slug,
    )
  ) {
    return "physics-science";
  }
  if (
    /chemistry|molar|molecule|ph-|stoichiometry|periodic|titration|electrochem/.test(
      slug,
    )
  ) {
    return "chemistry-science";
  }
  if (
    /engineering|stress|strain|gear|bearing|shaft|welding|machining|civil|aerospace|mechanical/.test(
      slug,
    )
  ) {
    return "engineering-science";
  }
  if (
    /recipe|baking|cooking|turkey|coffee|beer|wine|cocktail|nutrition-label|food-cost/.test(
      slug,
    )
  ) {
    return "food-cooking";
  }
  if (
    /age-|date-|countdown|calendar|timezone|pregnancy-due|week-number|leap-year/.test(
      slug,
    )
  ) {
    return "date-time";
  }
  if (
    /gpa|sat-|act-|gre-|education|grade-|scholarship|tuition|citation|reading-level/.test(
      slug,
    )
  ) {
    return "education-academic";
  }
  if (/game|poker|dice|gacha|elo-|dps-|chess-rating/.test(slug)) {
    return "gaming-entertainment";
  }
  if (
    /garden|knitting|crochet|aquarium|pet-|dog-|cat-|horse-|odds-|parlay/.test(
      slug,
    )
  ) {
    return "hobbies-diy";
  }
  if (
    /mpg|liter|gallon|kg-to|lbs-to|cm-to|mm-to|sqft|celsius|converter|inch|meter|fahrenheit|kelvin/.test(
      slug,
    )
  ) {
    return "conversion";
  }
  if (
    /bmi|bmr|tdee|calorie|body-fat|ovulation|pregnancy|sleep|water-intake|heart-rate|vo2|medical|diabetes|cholesterol|clinical/.test(
      slug,
    )
  ) {
    return "health-body";
  }
  if (
    /percent|fraction|lcm|quadratic|probability|z-score|logarithm|vector|scientific|standard-deviation|regression|anova|matrix|derivative|integral/.test(
      slug,
    )
  ) {
    return "math-statistics";
  }
  if (/machine-time|cnc|oee|scrap|welding|laser|sheet-metal|shop-rate/.test(slug)) {
    return "manufacturing-workshop";
  }
  if (/fuel|freight|desi|route|logistics|trip-budget|mileage/.test(slug)) {
    return "logistics-travel";
  }
  if (/fertilizer|crop|irrigation|feed|milk|agriculture|harvest|seed-rate/.test(slug)) {
    return "agriculture-food";
  }

  if (isFreeTrafficCategory("everyday-life")) {
    return "everyday-life";
  }
  return "everyday-life";
}
