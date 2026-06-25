/**
 * P77-MAX — Formula Gate contracts for active free traffic tools.
 */

import type { FormulaContract } from "@/lib/formula-governance/types";
import {
  FINANCIAL_SIMULATION_DISCLAIMER,
  STANDARD_DECISION_LANGUAGE_RULE,
  STANDARD_MUST_NOT_CLAIM,
  buildAssuredCriticalContract,
  freeTrafficProductionAssumption,
} from "@/lib/formula-governance/contracts/shared";
import { createWarningPolicy } from "@/lib/formula-governance/warning-policy";

function freeTrafficContract(config: {
  slug: string;
  toolName: string;
  purpose: string;
  userDecision: string;
  requiredInputs: string[];
  outputs: string[];
  formulaSummary: string;
  limitations?: string[];
}): FormulaContract {
  return buildAssuredCriticalContract({
    toolId: `free-traffic.${config.slug}`,
    toolName: config.toolName,
    slug: config.slug,
    purpose: config.purpose,
    userDecision: config.userDecision,
    decisionImpact: "operational",
    requiredInputs: config.requiredInputs,
    criticalInputs: config.requiredInputs,
    outputs: config.outputs,
    assumptions: [
      FINANCIAL_SIMULATION_DISCLAIMER,
      freeTrafficProductionAssumption(config.slug, "CALCULATORS entry"),
      ...(config.limitations ?? []),
    ],
    formulaSummary: config.formulaSummary,
    missingParameterWarnings: [],
    warningPolicy: createWarningPolicy({
      acceptedAssumptions: [
        "Inputs processed in browser; values are not stored unless saved.",
        "Deterministic unit conversion or cost formula from documented inputs.",
      ],
      modelLimitations: config.limitations ?? ["Free-tier quick check — not a certified engineering or legal decision."],
      futureExtensions: ["Sector-specific paid verdict when premium pack exists."],
    }),
    validationRules: [
      { id: "inputs-finite", description: "Required numeric inputs must be finite.", kind: "edge" },
      { id: "denominator-guard", description: "Zero divisors rejected where applicable.", kind: "edge" },
      { id: "units-consistent", description: "Inputs use consistent units per field labels.", kind: "dimensional" },
    ],
    scenarioSpecs: [
      { id: "golden-valid", description: "Valid baseline inputs produce finite primary output." },
      { id: "missing-input", description: "Missing required inputs block calculation." },
      { id: "invalid-negative", description: "Invalid negative inputs rejected where min bound applies." },
      { id: "boundary-min", description: "Minimum boundary inputs remain finite." },
      { id: "zero-divisor", description: "Zero divisor inputs rejected." },
    ],
    monotonicityRules: [],
    decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
    mustNotClaim: ["dummy"],
  });
}

export const areaConverterContract = freeTrafficContract({
  slug: "area-converter",
  toolName: "Area Converter",
  purpose: "Convert area values across m², ft², acre, hectare and related units.",
  userDecision: "What is this area in my target unit?",
  requiredInputs: ["value", "fromUnit", "toUnit"],
  outputs: ["recommendedPrice", "baseM2", "converted"],
  formulaSummary: "baseM2 = value × factor[fromUnit]; converted = baseM2 ÷ factor[toUnit].",
});

export const lengthConverterContract = freeTrafficContract({
  slug: "length-converter",
  toolName: "Length Converter",
  purpose: "Convert length values across metric and imperial units.",
  userDecision: "What is this length in my target unit?",
  requiredInputs: ["value", "fromUnit", "toUnit"],
  outputs: ["recommendedPrice", "baseMeters", "converted"],
  formulaSummary: "baseM = value × factor[fromUnit]; converted = baseM ÷ factor[toUnit].",
});

export const temperatureConverterContract = freeTrafficContract({
  slug: "temperature-converter",
  toolName: "Temperature Converter",
  purpose: "Convert temperature between Celsius, Fahrenheit and Kelvin.",
  userDecision: "What is this temperature in my target scale?",
  requiredInputs: ["value", "fromUnit", "toUnit"],
  outputs: ["recommendedPrice", "celsius", "converted"],
  formulaSummary:
    "Normalize to Celsius (C, (F−32)×5/9, K−273.15) then convert to target scale.",
});

export const volumeConverterContract = freeTrafficContract({
  slug: "volume-converter",
  toolName: "Volume Converter",
  purpose: "Convert volume values across liter, m³, gallon and related units.",
  userDecision: "What is this volume in my target unit?",
  requiredInputs: ["value", "fromUnit", "toUnit"],
  outputs: ["recommendedPrice", "baseLiter", "converted"],
  formulaSummary: "baseLiter = value × factor[fromUnit]; converted = baseLiter ÷ factor[toUnit].",
});

export const weightConverterContract = freeTrafficContract({
  slug: "weight-converter",
  toolName: "Weight Converter",
  purpose: "Convert weight values across kg, lb, ton and related units.",
  userDecision: "What is this weight in my target unit?",
  requiredInputs: ["value", "fromUnit", "toUnit"],
  outputs: ["recommendedPrice", "baseKg", "converted"],
  formulaSummary: "baseKg = value × factor[fromUnit]; converted = baseKg ÷ factor[toUnit].",
});

export const ratioCalculatorContract = freeTrafficContract({
  slug: "ratio-calculator",
  toolName: "Ratio Calculator",
  purpose: "Compute ratio, percentage and per-thousand from numerator and denominator.",
  userDecision: "What ratio and percentage do these values represent?",
  requiredInputs: ["numerator", "denominator"],
  outputs: ["recommendedPrice", "ratio", "percentage", "perThousand"],
  formulaSummary: "ratio = numerator ÷ denominator; percentage = ratio × 100; perThousand = ratio × 1000.",
});

export const kwhConsumptionCheckContract = freeTrafficContract({
  slug: "kwh-consumption-check",
  toolName: "kWh Consumption Check",
  purpose: "Estimate period kWh use and energy cost from power, hours and tariff.",
  userDecision: "What kWh and cost does this load profile produce?",
  requiredInputs: ["powerKw", "hoursPerDay", "days", "tariffPerKwh"],
  outputs: ["recommendedPrice", "dailyKwh", "periodKwh", "energyCost"],
  formulaSummary:
    "dailyKwh = powerKw × hoursPerDay; periodKwh = dailyKwh × days; energyCost = periodKwh × tariffPerKwh.",
});

export const paintCoverageCostCheckContract = freeTrafficContract({
  slug: "paint-coverage-cost-check",
  toolName: "Paint Coverage Cost Check",
  purpose: "Estimate paint units and cost including coats and waste allowance.",
  userDecision: "How many units and what paint cost for this area?",
  requiredInputs: ["paintableArea", "coveragePerUnit", "coats", "unitPrice", "wasteAllowancePct"],
  outputs: ["recommendedPrice", "requiredUnits", "paintCost"],
  formulaSummary:
    "netArea = paintableArea × coats; baseUnits = netArea ÷ coveragePerUnit; requiredUnits = ceil(baseUnits + waste); paintCost = requiredUnits × unitPrice.",
});

export const plumbingFixtureCostCheckContract = freeTrafficContract({
  slug: "plumbing-fixture-cost-check",
  toolName: "Plumbing Fixture Cost Check",
  purpose: "Estimate fixture material, labor and overhead for plumbing work.",
  userDecision: "What total cost for this fixture count and labor profile?",
  requiredInputs: ["fixtureCount", "unitMaterialCost", "laborHoursPerFixture", "laborRate", "overheadPct"],
  outputs: ["recommendedPrice", "materialCost", "laborCost", "totalCost"],
  formulaSummary:
    "materialCost = fixtureCount × unitMaterialCost; laborCost = fixtureCount × laborHoursPerFixture × laborRate; totalCost = (material + labor) × (1 + overheadPct/100).",
});

export const homeRenovationM2Contract = freeTrafficContract({
  slug: "home-renovation-m2",
  toolName: "Home Renovation m² Estimator",
  purpose: "Estimate renovation cost from area, unit cost, demolition and contingency.",
  userDecision: "What total renovation cost for this floor area?",
  requiredInputs: ["areaM2", "unitCostPerM2", "demolitionCost", "contingencyPct"],
  outputs: ["recommendedPrice", "baseCost", "totalEstimatedCost"],
  formulaSummary:
    "baseCost = areaM2 × unitCostPerM2; subtotal = baseCost + demolitionCost; totalEstimatedCost = subtotal × (1 + contingencyPct/100).",
});

export const P77_FREE_TRAFFIC_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  areaConverterContract,
  lengthConverterContract,
  temperatureConverterContract,
  volumeConverterContract,
  weightConverterContract,
  ratioCalculatorContract,
  kwhConsumptionCheckContract,
  paintCoverageCostCheckContract,
  plumbingFixtureCostCheckContract,
  homeRenovationM2Contract,
];
