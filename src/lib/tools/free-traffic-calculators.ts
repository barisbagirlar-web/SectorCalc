/**
 * Free traffic calculator engine — browser-side math for catalog slugs.
 * No premium verdict leakage; generic shell for catalog-only tools.
 */

import {
  ACTIVE_TRAFFIC_CALCULATOR_SLUGS,
  getFreeTrafficToolBySlug,
} from "@/lib/tools/free-traffic-catalog";

export type FreeTrafficInputValues = Record<string, number | string>;

export type FreeTrafficCalcResult = {
  readonly headline: string;
  readonly primaryLabel: string;
  readonly primaryValue: string;
  readonly secondaryValues: readonly { readonly label: string; readonly value: string }[];
  readonly explanation: string;
  readonly missingFactors: readonly string[];
  readonly relatedPremiumSlug?: string;
  readonly legalNote: string;
  readonly isExpandedFormula: boolean;
};

const LEGAL_NOTE =
  "Free tool inputs are processed in your browser. They are not stored unless you create an account or save a premium report. This is a technical estimate, not financial, legal, medical or engineering advice.";

function num(values: FreeTrafficInputValues, key: string): number {
  const raw = values[key];
  const parsed = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) {
    return "—";
  }
  return n.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
}

function result(
  partial: Omit<FreeTrafficCalcResult, "legalNote">,
): FreeTrafficCalcResult {
  return { ...partial, legalNote: LEGAL_NOTE };
}

type CalculatorFn = (values: FreeTrafficInputValues) => Omit<
  FreeTrafficCalcResult,
  "legalNote"
>;

function loanPayment(values: FreeTrafficInputValues): Omit<FreeTrafficCalcResult, "legalNote"> {
  const principal = num(values, "principal");
  const annualRate = num(values, "annualRate");
  const months = num(values, "months");
  const monthlyRate = annualRate / 100 / 12;
  const payment =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months);
  return {
    headline: "Monthly payment estimate",
    primaryLabel: "Payment",
    primaryValue: `$${fmt(payment)}`,
    secondaryValues: [
      { label: "Principal", value: `$${fmt(principal)}` },
      { label: "Term", value: `${fmt(months, 0)} months` },
    ],
    explanation: "Amortizing payment at fixed nominal rate. Taxes, insurance and fees not included.",
    missingFactors: [],
    isExpandedFormula: true,
  };
}

const CALCULATORS: Record<string, CalculatorFn> = {
  "square-meter-calculator": (values) => {
    const area = num(values, "length") * num(values, "width");
    return {
      headline: "Floor area",
      primaryLabel: "Area",
      primaryValue: `${fmt(area)} m²`,
      secondaryValues: [],
      explanation: "Rectangular area = length × width.",
      missingFactors: [],
      isExpandedFormula: true,
    };
  },
  "square-footage-calculator": (values) => {
    const area = num(values, "length") * num(values, "width");
    return {
      headline: "Floor area",
      primaryLabel: "Area",
      primaryValue: `${fmt(area)} ft²`,
      secondaryValues: [],
      explanation: "Rectangular area = length × width in feet.",
      missingFactors: [],
      isExpandedFormula: true,
    };
  },
  "concrete-volume-calculator": (values) => {
    const volume = num(values, "length") * num(values, "width") * num(values, "depth");
    return {
      headline: "Pour volume",
      primaryLabel: "Volume",
      primaryValue: `${fmt(volume)} m³`,
      secondaryValues: [{ label: "Approx. liters", value: `${fmt(volume * 1000, 0)} L` }],
      explanation: "Slab volume = length × width × depth. Add waste factor on site.",
      missingFactors: [],
      relatedPremiumSlug: "change-order-impact-analyzer",
      isExpandedFormula: true,
    };
  },
  "paint-coverage-calculator": (values) => {
    const liters = num(values, "area") / num(values, "coveragePerLiter");
    return {
      headline: "Paint quantity",
      primaryLabel: "Paint needed",
      primaryValue: `${fmt(liters)} L`,
      secondaryValues: [{ label: "Wall area", value: `${fmt(num(values, "area"))} m²` }],
      explanation: "Liters = area ÷ coverage per liter. Coats and primer not included.",
      missingFactors: [],
      relatedPremiumSlug: "painting-job-profit-verdict",
      isExpandedFormula: true,
    };
  },
  "loan-payment-calculator": loanPayment,
  "mortgage-calculator": (values) => {
    const base = loanPayment(values);
    return { ...base, headline: "Mortgage payment estimate" };
  },
  "interest-calculator": (values) => {
    const principal = num(values, "principal");
    const rate = num(values, "rate");
    const years = num(values, "years");
    const interest = principal * (rate / 100) * years;
    const total = principal + interest;
    return {
      headline: "Simple interest",
      primaryLabel: "Total repayment",
      primaryValue: `$${fmt(total)}`,
      secondaryValues: [{ label: "Interest portion", value: `$${fmt(interest)}` }],
      explanation: "Simple interest = principal × rate × years.",
      missingFactors: [],
      isExpandedFormula: true,
    };
  },
  "vat-calculator": (values) => {
    const net = num(values, "net");
    const vatRate = num(values, "vatRate");
    const vat = net * (vatRate / 100);
    const gross = net + vat;
    return {
      headline: "VAT breakdown",
      primaryLabel: "Gross total",
      primaryValue: fmt(gross),
      secondaryValues: [
        { label: "VAT amount", value: fmt(vat) },
        { label: "Net", value: fmt(net) },
      ],
      explanation: "Gross = net + (net × VAT rate).",
      missingFactors: [],
      isExpandedFormula: true,
    };
  },
  "percentage-calculator": (values) => {
    const value = num(values, "value");
    const percent = num(values, "percent");
    const out = value * (percent / 100);
    return {
      headline: "Percentage result",
      primaryLabel: "Result",
      primaryValue: fmt(out),
      secondaryValues: [{ label: "Percent applied", value: `${fmt(percent)}%` }],
      explanation: `${fmt(percent)}% of ${fmt(value)}.`,
      missingFactors: [],
      isExpandedFormula: true,
    };
  },
  "profit-margin-calculator": (values) => {
    const cost = num(values, "cost");
    const price = num(values, "sellingPrice");
    const margin = ((price - cost) / price) * 100;
    return {
      headline: "Selling margin",
      primaryLabel: "Margin",
      primaryValue: `${fmt(margin)}%`,
      secondaryValues: [{ label: "Markup on cost", value: `${fmt(((price - cost) / cost) * 100)}%` }],
      explanation: "Margin % = (price − cost) ÷ price × 100.",
      missingFactors: [],
      relatedPremiumSlug: "product-margin-calculator",
      isExpandedFormula: true,
    };
  },
  "break-even-calculator": (values) => {
    const fixed = num(values, "fixedCost");
    const price = num(values, "unitPrice");
    const variable = num(values, "variableCost");
    const units = fixed / (price - variable);
    return {
      headline: "Break-even volume",
      primaryLabel: "Units to break even",
      primaryValue: fmt(units, 0),
      secondaryValues: [{ label: "Contribution margin", value: fmt(price - variable) }],
      explanation: "Units = fixed costs ÷ (unit price − variable cost).",
      missingFactors: [],
      isExpandedFormula: true,
    };
  },
  "machine-time-calculator": (values) => {
    const totalMinutes =
      num(values, "setupMinutes") + (num(values, "cycleSeconds") * num(values, "quantity")) / 60;
    const machineCost = (totalMinutes / 60) * num(values, "machineRate");
    return {
      headline: "Machine time & cost",
      primaryLabel: "Machine cost",
      primaryValue: `$${fmt(machineCost)}`,
      secondaryValues: [{ label: "Total time", value: `${fmt(totalMinutes)} min` }],
      explanation: "Setup + cycle × qty, converted to hours × machine rate.",
      missingFactors: [],
      relatedPremiumSlug: "cnc-quote-risk-analyzer",
      isExpandedFormula: true,
    };
  },
  "welding-cost-estimator": (values) => {
    const cost =
      num(values, "materialCost") +
      num(values, "laborHours") * num(values, "laborRate") +
      num(values, "consumablesCost");
    return {
      headline: "Welding job cost",
      primaryLabel: "Estimated cost",
      primaryValue: `$${fmt(cost)}`,
      secondaryValues: [],
      explanation: "Material + labor hours × rate + consumables.",
      missingFactors: [],
      relatedPremiumSlug: "welding-bid-risk-analyzer",
      isExpandedFormula: true,
    };
  },
  "laser-cutting-time-check": (values) => {
    const cutMinutes = num(values, "cutLength") / num(values, "cutSpeed");
    const pierceMinutes = (num(values, "pierceCount") * num(values, "pierceSeconds")) / 60;
    const totalMinutes = num(values, "setupMinutes") + cutMinutes + pierceMinutes;
    return {
      headline: "Laser cut time",
      primaryLabel: "Total minutes",
      primaryValue: `${fmt(totalMinutes)} min`,
      secondaryValues: [{ label: "Cut path time", value: `${fmt(cutMinutes)} min` }],
      explanation: "Setup + cut length ÷ speed + pierce time.",
      missingFactors: [],
      relatedPremiumSlug: "sheet-metal-quote-risk-tool",
      isExpandedFormula: true,
    };
  },
  "3d-print-cost-check": (values) => {
    const cost =
      num(values, "materialCost") +
      num(values, "printHours") * num(values, "machineRate") +
      num(values, "postProcessHours") * num(values, "laborRate");
    return {
      headline: "3D print job cost",
      primaryLabel: "Estimated cost",
      primaryValue: `$${fmt(cost)}`,
      secondaryValues: [],
      explanation: "Material + print machine time + post-process labor.",
      missingFactors: [],
      relatedPremiumSlug: "3d-print-job-margin-tool",
      isExpandedFormula: true,
    };
  },
  "kwh-cost-calculator": (values) => {
    const cost = num(values, "kwh") * num(values, "rate");
    return {
      headline: "Electricity cost",
      primaryLabel: "Cost",
      primaryValue: fmt(cost),
      secondaryValues: [{ label: "Energy", value: `${fmt(num(values, "kwh"))} kWh` }],
      explanation: "Cost = kWh consumed × unit tariff.",
      missingFactors: [],
      relatedPremiumSlug: "energy-efficiency-report",
      isExpandedFormula: true,
    };
  },
  "fuel-consumption-calculator": (values) => {
    const fuel = (num(values, "distance") / 100) * num(values, "consumptionPer100");
    const cost = fuel * num(values, "fuelPrice");
    return {
      headline: "Trip fuel",
      primaryLabel: "Fuel cost",
      primaryValue: fmt(cost),
      secondaryValues: [{ label: "Liters", value: `${fmt(fuel)} L` }],
      explanation: "Fuel = distance ÷ 100 × L/100km; cost = fuel × price per liter.",
      missingFactors: [],
      relatedPremiumSlug: "trip-budget-optimizer",
      isExpandedFormula: true,
    };
  },
  "desi-calculator": (values) => {
    const desi =
      (num(values, "length") * num(values, "width") * num(values, "height")) /
      num(values, "divisor");
    return {
      headline: "Volumetric weight",
      primaryLabel: "Desi",
      primaryValue: fmt(desi),
      secondaryValues: [],
      explanation: "Desi = L × W × H ÷ divisor (cm).",
      missingFactors: [],
      relatedPremiumSlug: "route-optimization-analyzer",
      isExpandedFormula: true,
    };
  },
  "fertilizer-dosage-calculator": (values) => {
    const fertilizer = num(values, "area") * num(values, "dosagePerArea");
    return {
      headline: "Fertilizer required",
      primaryLabel: "Total fertilizer",
      primaryValue: `${fmt(fertilizer)} kg`,
      secondaryValues: [{ label: "Field area", value: `${fmt(num(values, "area"))} ha` }],
      explanation: "Total = area × dosage per hectare.",
      missingFactors: [],
      relatedPremiumSlug: "crop-yield-loss-analyzer",
      isExpandedFormula: true,
    };
  },
  "recipe-cost-check": (values) => {
    const total =
      num(values, "ingredient1") + num(values, "ingredient2") + num(values, "ingredient3");
    const portions = num(values, "portions");
    const portionCost = total / portions;
    return {
      headline: "Recipe cost",
      primaryLabel: "Cost per portion",
      primaryValue: `$${fmt(portionCost)}`,
      secondaryValues: [{ label: "Batch total", value: `$${fmt(total)}` }],
      explanation: "Sum ingredients ÷ portions served.",
      missingFactors: [],
      relatedPremiumSlug: "meal-planning-verdict",
      isExpandedFormula: true,
    };
  },
  "bmi-calculator": (values) => {
    const weight = num(values, "weightKg");
    const height = num(values, "heightM");
    const bmi = weight / (height * height);
    let band = "Normal range";
    if (bmi < 18.5) band = "Underweight band";
    else if (bmi >= 25 && bmi < 30) band = "Overweight band";
    else if (bmi >= 30) band = "Obesity band";
    return {
      headline: "Body mass index",
      primaryLabel: "BMI",
      primaryValue: fmt(bmi, 1),
      secondaryValues: [{ label: "Reference band", value: band }],
      explanation: "BMI = weight ÷ height². Screening tool only — not a diagnosis.",
      missingFactors: [],
      isExpandedFormula: true,
    };
  },
  "calorie-calculator": (values) => {
    const w = num(values, "weightKg");
    const h = num(values, "heightCm");
    const age = num(values, "age");
    const sex = String(values.sex ?? "male");
    const bmr =
      sex === "female"
        ? 10 * w + 6.25 * h - 5 * age - 161
        : 10 * w + 6.25 * h - 5 * age + 5;
    return {
      headline: "Basal metabolic rate",
      primaryLabel: "BMR",
      primaryValue: `${fmt(bmr, 0)} kcal/day`,
      secondaryValues: [],
      explanation: "Mifflin-St Jeor BMR estimate. Activity multiplier not applied.",
      missingFactors: [],
      isExpandedFormula: true,
    };
  },
  "average-calculator": (values) => {
    const nums = ["v1", "v2", "v3", "v4", "v5"]
      .map((k) => num(values, k))
      .filter((n, idx) => {
        const key = ["v1", "v2", "v3", "v4", "v5"][idx];
        const raw = values[key ?? ""];
        if (raw === "" || raw === undefined) {
          return false;
        }
        return Number.isFinite(n);
      });
    const count = Math.max(nums.length, 1);
    const sum = nums.reduce((a, b) => a + b, 0);
    const avg = sum / count;
    return {
      headline: "Arithmetic mean",
      primaryLabel: "Average",
      primaryValue: fmt(avg),
      secondaryValues: [{ label: "Values used", value: String(count) }],
      explanation: "Mean = sum of non-zero entries ÷ count.",
      missingFactors: [],
      isExpandedFormula: true,
    };
  },
  "standard-deviation-calculator": (values) => {
    const keys = ["v1", "v2", "v3", "v4", "v5"] as const;
    const nums = keys
      .map((k) => num(values, k))
      .filter((n, idx) => {
        const raw = values[keys[idx] ?? ""];
        if (raw === "" || raw === undefined) {
          return false;
        }
        return Number.isFinite(n);
      });
    const n = Math.max(nums.length, 1);
    const mean = nums.reduce((a, b) => a + b, 0) / n;
    const variance = nums.reduce((acc, x) => acc + (x - mean) ** 2, 0) / n;
    const std = Math.sqrt(variance);
    return {
      headline: "Population standard deviation",
      primaryLabel: "σ",
      primaryValue: fmt(std),
      secondaryValues: [{ label: "Mean μ", value: fmt(mean) }],
      explanation: "Population σ = √(Σ(x−μ)² / n).",
      missingFactors: [],
      isExpandedFormula: true,
    };
  },
  "unit-price-calculator": (values) => {
    const unitPrice = num(values, "totalPrice") / num(values, "quantity");
    return {
      headline: "Unit price",
      primaryLabel: "Price per unit",
      primaryValue: fmt(unitPrice),
      secondaryValues: [],
      explanation: "Unit price = total price ÷ quantity.",
      missingFactors: [],
      isExpandedFormula: true,
    };
  },
};

function genericShell(
  slug: string,
  values: FreeTrafficInputValues,
): Omit<FreeTrafficCalcResult, "legalNote"> {
  const tool = getFreeTrafficToolBySlug(slug);
  const missingFactors = tool?.missingFactors ?? [
    "P90 safe price floor",
    "Margin leak diagnosis",
    "Accept / caution / reject verdict",
  ];

  const filledInputs = tool?.inputs.filter((input) => {
    const v = values[input.key];
    if (input.type === "select") {
      return typeof v === "string" && v.length > 0;
    }
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n);
  }).length ?? 0;

  return {
    headline: "Quick check ready",
    primaryLabel: "Status",
    primaryValue: filledInputs > 0 ? "Inputs captured" : "Awaiting inputs",
    secondaryValues: [
      { label: "Fields filled", value: String(filledInputs) },
      { label: "Catalog", value: tool?.title ?? slug },
    ],
    explanation:
      "This free calculator is being expanded with a deeper sector formula. Use the related sector analyzer for full decision output — P90 safe price, margin leaks and verdict reports stay in premium tools.",
    missingFactors,
    relatedPremiumSlug: tool?.relatedPremiumSlug,
    isExpandedFormula: false,
  };
}

export function calculateFreeTrafficTool(
  slug: string,
  values: FreeTrafficInputValues,
): FreeTrafficCalcResult {
  const tool = getFreeTrafficToolBySlug(slug);
  const calculator = CALCULATORS[slug];

  if (calculator && ACTIVE_TRAFFIC_CALCULATOR_SLUGS.has(slug)) {
    const out = calculator(values);
    return result({
      ...out,
      missingFactors: out.missingFactors.length > 0 ? out.missingFactors : tool?.missingFactors ?? [],
      relatedPremiumSlug: out.relatedPremiumSlug ?? tool?.relatedPremiumSlug,
    });
  }

  const shell = genericShell(slug, values);
  return result({
    ...shell,
    relatedPremiumSlug: shell.relatedPremiumSlug ?? tool?.relatedPremiumSlug,
  });
}

export function hasDedicatedTrafficCalculator(slug: string): boolean {
  return ACTIVE_TRAFFIC_CALCULATOR_SLUGS.has(slug) && slug in CALCULATORS;
}
