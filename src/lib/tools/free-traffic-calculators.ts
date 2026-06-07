/**
 * Free traffic calculator engine — browser-side math for all catalog slugs.
 * No premium verdict leakage; every slug computes real formulas.
 */

import {
  formatLocalizedCurrency,
  formatLocalizedNumber,
  getFreeToolLegalNote,
  normalizeLocale,
  NOT_AVAILABLE,
  type SupportedLocale,
} from "@/lib/format/localization";
import {
  getFreeTrafficToolBySlug,
  listFreeTrafficSlugs,
} from "@/lib/tools/free-traffic-catalog";
import {
  calculateRentVsBuyModel,
  parseRentVsBuyValues,
  RENT_VS_BUY_RESULT_WARNING,
  RentVsBuyValidationError,
  strongerScenarioLabel,
} from "@/lib/tools/rent-vs-buy-model";

export type FreeTrafficInputValues = Record<string, number | string>;

export type FreeTrafficResult = {
  readonly headline: string;
  readonly primaryLabel: string;
  readonly primaryValue: string;
  readonly secondaryValues: readonly { readonly label: string; readonly value: string }[];
  readonly explanation: string;
  readonly missingFactors: readonly string[];
  readonly relatedPremiumSlug?: string;
  readonly legalNote: string;
};

let _activeFormatLocale: SupportedLocale = "en";

export function normalizeNumber(value: string | number): number {
  const parsed = typeof value === "number" ? value : Number(String(value).trim());
  return Number.isFinite(parsed) ? parsed : NaN;
}

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

export function safeDivide(a: number, b: number): number {
  if (b === 0 || !Number.isFinite(a) || !Number.isFinite(b)) {
    return 0;
  }
  const resultValue = a / b;
  return Number.isFinite(resultValue) ? resultValue : 0;
}

export function round(value: number, digits = 2): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function formatNumber(n: number, digits = 2): string {
  return formatLocalizedNumber(n, _activeFormatLocale, {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
}

export function formatCurrency(n: number, digits = 2): string {
  return formatLocalizedCurrency(n, _activeFormatLocale, "USD", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits > 0 ? 0 : undefined,
  });
}

export function assertFiniteNumber(n: number, fallback = 0): number {
  return Number.isFinite(n) ? n : fallback;
}

const PREMIUM_LEAK_PATTERNS = [
  /do not accept under/i,
  /minimum safe price/i,
  /\bp90\b/i,
  /final verdict/i,
  /\bpdf\b/i,
  /saved report/i,
] as const;

export function containsPremiumLeakText(text: string): boolean {
  return PREMIUM_LEAK_PATTERNS.some((pattern) => pattern.test(text));
}

function num(values: FreeTrafficInputValues, key: string): number {
  return normalizeNumber(values[key] ?? "");
}

function str(values: FreeTrafficInputValues, key: string): string {
  const raw = values[key];
  return typeof raw === "string" ? raw : String(raw ?? "");
}

function result(partial: Omit<FreeTrafficResult, "legalNote">): FreeTrafficResult {
  return { ...partial, legalNote: getFreeToolLegalNote(_activeFormatLocale) };
}

type CalcPartial = Omit<FreeTrafficResult, "legalNote">;
type CalculatorFn = (values: FreeTrafficInputValues) => CalcPartial;

function meta(slug: string, partial: CalcPartial): FreeTrafficResult {
  const tool = getFreeTrafficToolBySlug(slug);
  return result({
    ...partial,
    missingFactors:
      partial.missingFactors.length > 0
        ? partial.missingFactors
        : tool?.missingFactors ?? [],
    relatedPremiumSlug: partial.relatedPremiumSlug ?? tool?.relatedPremiumSlug,
  });
}

function collectNumericValues(
  values: FreeTrafficInputValues,
  keys: readonly string[],
): number[] {
  const nums: number[] = [];
  for (const key of keys) {
    const raw = values[key];
    if (raw === "" || raw === undefined) {
      continue;
    }
    const parsed = normalizeNumber(raw);
    if (Number.isFinite(parsed)) {
      nums.push(parsed);
    }
  }
  return nums;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x === 0 ? 1 : x;
}

function amortizingPayment(
  principal: number,
  annualRate: number,
  months: number,
): number {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) {
    return safeDivide(principal, months);
  }
  const factor = (1 + monthlyRate) ** -months;
  return safeDivide(principal * monthlyRate, 1 - factor);
}

function fuelTrip(values: FreeTrafficInputValues, headline: string): CalcPartial {
  const distanceKm = num(values, "distanceKm");
  const consumptionPer100Km = num(values, "consumptionPer100Km");
  const fuelPrice = num(values, "fuelPrice");
  const fuelLiters = safeDivide(distanceKm, 100) * consumptionPer100Km;
  const cost = fuelLiters * fuelPrice;
  return {
    headline,
    primaryLabel: "Fuel cost",
    primaryValue: formatCurrency(cost),
    secondaryValues: [{ label: "Fuel used", value: `${formatNumber(fuelLiters)} L` }],
    explanation: "Fuel = distance ÷ 100 × consumption; cost = fuel × price per liter.",
    missingFactors: [],
  };
}

function volumetricWeight(values: FreeTrafficInputValues, headline: string): CalcPartial {
  const lengthCm = num(values, "lengthCm");
  const widthCm = num(values, "widthCm");
  const heightCm = num(values, "heightCm");
  const divisor = num(values, "divisor");
  const weight = safeDivide(lengthCm * widthCm * heightCm, divisor);
  return {
    headline,
    primaryLabel: "Volumetric weight",
    primaryValue: formatNumber(weight),
    secondaryValues: [
      { label: "Volume", value: `${formatNumber(lengthCm * widthCm * heightCm, 0)} cm³` },
    ],
    explanation: "Volumetric weight = length × width × height ÷ divisor.",
    missingFactors: [],
  };
}

const LENGTH_TO_METERS: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  inch: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mile: 1609.344,
};

const LENGTH_LABELS: Record<string, string> = {
  mm: "Millimeters (mm)",
  cm: "Centimeters (cm)",
  m: "Meters (m)",
  km: "Kilometers (km)",
  inch: "Inches (in)",
  ft: "Feet (ft)",
  yd: "Yards (yd)",
  mile: "Miles (mi)",
};

const WEIGHT_TO_KG: Record<string, number> = {
  g: 0.001,
  kg: 1,
  ton: 1000,
  oz: 0.0283495,
  lb: 0.453592,
};

const WEIGHT_LABELS: Record<string, string> = {
  g: "Grams (g)",
  kg: "Kilograms (kg)",
  ton: "Metric tons (t)",
  oz: "Ounces (oz)",
  lb: "Pounds (lb)",
};

const AREA_TO_M2: Record<string, number> = {
  mm2: 1e-6,
  cm2: 1e-4,
  m2: 1,
  km2: 1e6,
  in2: 0.00064516,
  ft2: 0.092903,
  yd2: 0.836127,
  mi2: 2589988.110336,
  are: 100,
  hectare: 10000,
  acre: 4046.8564224,
};

const AREA_LABELS: Record<string, string> = {
  mm2: "mm²",
  cm2: "cm²",
  m2: "m²",
  km2: "km²",
  in2: "in²",
  ft2: "ft²",
  yd2: "yd²",
  mi2: "mi²",
  are: "Are",
  hectare: "Hectare",
  acre: "Acre",
};

const VOLUME_TO_LITER: Record<string, number> = {
  ml: 0.001,
  l: 1,
  m3: 1000,
  cm3: 0.001,
  in3: 0.016387064,
  ft3: 28.316846592,
  gal_us: 3.785411784,
};

const VOLUME_LABELS: Record<string, string> = {
  ml: "Milliliters (ml)",
  l: "Liters (L)",
  m3: "Cubic meters (m³)",
  cm3: "Cubic cm (cm³)",
  in3: "Cubic inches (in³)",
  ft3: "Cubic feet (ft³)",
  gal_us: "US gallons (gal)",
};

function convertAllUnits(
  value: number,
  fromUnit: string,
  factors: Record<string, number>,
  labels: Record<string, string>,
  digits = 4,
): { readonly label: string; readonly value: string }[] {
  const fromFactor = factors[fromUnit];
  if (!Number.isFinite(value) || fromFactor === undefined) {
    return [];
  }
  const base = value * fromFactor;
  return Object.entries(factors).map(([unit, factor]) => ({
    label: labels[unit] ?? unit,
    value: formatNumber(safeDivide(base, factor), digits),
  }));
}

function tempToCelsius(value: number, fromUnit: string): number {
  if (fromUnit === "fahrenheit") {
    return (value - 32) * (5 / 9);
  }
  if (fromUnit === "kelvin") {
    return value - 273.15;
  }
  return value;
}

function celsiusToUnit(celsius: number, unit: string): number {
  if (unit === "fahrenheit") {
    return celsius * (9 / 5) + 32;
  }
  if (unit === "kelvin") {
    return celsius + 273.15;
  }
  return celsius;
}

const TEMP_LABELS: Record<string, string> = {
  celsius: "Celsius (°C)",
  fahrenheit: "Fahrenheit (°F)",
  kelvin: "Kelvin (K)",
};
const VALUE_KEYS = ["value1", "value2", "value3", "value4", "value5"] as const;

const CALCULATORS: Record<string, CalculatorFn> = {
  "square-meter-calculator": (values) => {
    const area = num(values, "length") * num(values, "width");
    return {
      headline: "Floor area",
      primaryLabel: "Area",
      primaryValue: `${formatNumber(area)} m²`,
      secondaryValues: [
        { label: "Square centimeters", value: `${formatNumber(area * 10000, 0)} cm²` },
        { label: "Square feet", value: `${formatNumber(area * 10.7639)} ft²` },
        { label: "Square yards", value: `${formatNumber(area * 1.19599)} yd²` },
      ],
      explanation: "Rectangular area = length × width.",
      missingFactors: [],
    };
  },
  "square-footage-calculator": (values) => {
    const area = num(values, "length") * num(values, "width");
    return {
      headline: "Floor area",
      primaryLabel: "Area",
      primaryValue: `${formatNumber(area)} ft²`,
      secondaryValues: [
        { label: "Square meters", value: `${formatNumber(area * 0.092903)} m²` },
        { label: "Square yards", value: `${formatNumber(safeDivide(area, 9))} yd²` },
        { label: "Acres", value: `${formatNumber(safeDivide(area, 43560), 4)} ac` },
      ],
      explanation: "Rectangular area = length × width in feet.",
      missingFactors: [],
    };
  },
  "concrete-volume-calculator": (values) => {
    const volume = num(values, "length") * num(values, "width") * num(values, "depth");
    return {
      headline: "Pour volume",
      primaryLabel: "Volume",
      primaryValue: `${formatNumber(volume)} m³`,
      secondaryValues: [
        { label: "Liters", value: `${formatNumber(volume * 1000, 0)} L` },
        { label: "Cubic yards", value: `${formatNumber(volume * 1.30795)} yd³` },
      ],
      explanation: "Slab volume = length × width × depth.",
      missingFactors: [],
    };
  },
  "concrete-bag-calculator": (values) => {
    const volumeM3 = num(values, "volumeM3");
    const bagYieldM3 = num(values, "bagYieldM3");
    const wastePercent = num(values, "wastePercent");
    const adjusted = volumeM3 * (1 + wastePercent / 100);
    const bags = Math.ceil(safeDivide(adjusted, bagYieldM3));
    return {
      headline: "Concrete bags",
      primaryLabel: "Bags needed",
      primaryValue: formatNumber(bags, 0),
      secondaryValues: [
        { label: "Volume with waste", value: `${formatNumber(adjusted)} m³` },
      ],
      explanation: "Bags = ceil(volume × (1 + waste%) ÷ yield per bag).",
      missingFactors: [],
    };
  },
  "paint-coverage-calculator": (values) => {
    const areaM2 = num(values, "areaM2");
    const coveragePerLiter = num(values, "coveragePerLiter");
    const coats = num(values, "coats");
    const liters = safeDivide(areaM2 * coats, coveragePerLiter);
    return {
      headline: "Paint quantity",
      primaryLabel: "Paint needed",
      primaryValue: `${formatNumber(liters)} L`,
      secondaryValues: [
        { label: "Wall area", value: `${formatNumber(areaM2)} m²` },
        { label: "Coats", value: formatNumber(coats, 0) },
      ],
      explanation: "Liters = area × coats ÷ coverage per liter.",
      missingFactors: [],
    };
  },
  "tile-calculator": (values) => {
    const areaM2 = num(values, "areaM2");
    const tileAreaM2 = safeDivide(num(values, "tileLengthCm") * num(values, "tileWidthCm"), 10000);
    const wastePercent = num(values, "wastePercent");
    const tiles = Math.ceil(safeDivide(areaM2, tileAreaM2) * (1 + wastePercent / 100));
    return {
      headline: "Tile count",
      primaryLabel: "Tiles needed",
      primaryValue: formatNumber(tiles, 0),
      secondaryValues: [
        { label: "Tile area", value: `${formatNumber(tileAreaM2, 4)} m²` },
        { label: "Floor area", value: `${formatNumber(areaM2)} m²` },
      ],
      explanation: "Tiles = ceil(floor area ÷ tile area × (1 + waste%)).",
      missingFactors: [],
    };
  },
  "flooring-calculator": (values) => {
    const area = num(values, "roomLengthM") * num(values, "roomWidthM");
    const wastePercent = num(values, "wastePercent");
    const withWaste = area * (1 + wastePercent / 100);
    return {
      headline: "Flooring area",
      primaryLabel: "Material needed",
      primaryValue: `${formatNumber(withWaste)} m²`,
      secondaryValues: [{ label: "Net floor area", value: `${formatNumber(area)} m²` }],
      explanation: "Material = room area × (1 + waste%).",
      missingFactors: [],
    };
  },
  "roofing-area-calculator": (values) => {
    const area = num(values, "lengthM") * num(values, "widthM") * num(values, "pitchFactor");
    return {
      headline: "Roof surface",
      primaryLabel: "Roof area",
      primaryValue: `${formatNumber(area)} m²`,
      secondaryValues: [
        { label: "Footprint", value: `${formatNumber(num(values, "lengthM") * num(values, "widthM"))} m²` },
      ],
      explanation: "Roof area = length × width × pitch factor.",
      missingFactors: [],
    };
  },
  "stair-calculator": (values) => {
    const totalRiseCm = num(values, "totalRiseCm");
    const riserHeightCm = num(values, "riserHeightCm");
    const treadDepthCm = num(values, "treadDepthCm");
    const steps = Math.ceil(safeDivide(totalRiseCm, riserHeightCm));
    const runM = safeDivide(steps * treadDepthCm, 100);
    return {
      headline: "Stair layout",
      primaryLabel: "Steps",
      primaryValue: formatNumber(steps, 0),
      secondaryValues: [{ label: "Total run", value: `${formatNumber(runM)} m` }],
      explanation: "Steps = ceil(total rise ÷ riser height); run = steps × tread depth.",
      missingFactors: [],
    };
  },
  "drywall-calculator": (values) => {
    const wallAreaM2 = num(values, "wallAreaM2");
    const sheetAreaM2 = num(values, "sheetAreaM2");
    const wastePercent = num(values, "wastePercent");
    const sheets = Math.ceil(safeDivide(wallAreaM2, sheetAreaM2) * (1 + wastePercent / 100));
    return {
      headline: "Drywall sheets",
      primaryLabel: "Sheets needed",
      primaryValue: formatNumber(sheets, 0),
      secondaryValues: [{ label: "Wall area", value: `${formatNumber(wallAreaM2)} m²` }],
      explanation: "Sheets = ceil(wall area ÷ sheet area × (1 + waste%)).",
      missingFactors: [],
    };
  },
  "brick-calculator": (values) => {
    const wallAreaM2 = num(values, "wallAreaM2");
    const bricksPerM2 = num(values, "bricksPerM2");
    const wastePercent = num(values, "wastePercent");
    const bricks = Math.ceil(wallAreaM2 * bricksPerM2 * (1 + wastePercent / 100));
    return {
      headline: "Brick count",
      primaryLabel: "Bricks needed",
      primaryValue: formatNumber(bricks, 0),
      secondaryValues: [{ label: "Wall area", value: `${formatNumber(wallAreaM2)} m²` }],
      explanation: "Bricks = ceil(wall area × bricks per m² × (1 + waste%)).",
      missingFactors: [],
    };
  },
  "rebar-weight-calculator": (values) => {
    const diameterMm = num(values, "diameterMm");
    const lengthM = num(values, "lengthM");
    const quantity = num(values, "quantity");
    const kgPerM = safeDivide(diameterMm * diameterMm, 162);
    const totalKg = kgPerM * lengthM * quantity;
    return {
      headline: "Rebar weight",
      primaryLabel: "Total weight",
      primaryValue: `${formatNumber(totalKg)} kg`,
      secondaryValues: [{ label: "Weight per meter", value: `${formatNumber(kgPerM, 3)} kg/m` }],
      explanation: "Weight per meter = (diameter mm)² ÷ 162; total = kg/m × length × quantity.",
      missingFactors: [],
    };
  },
  "excavation-volume-calculator": (values) => {
    const volume = num(values, "lengthM") * num(values, "widthM") * num(values, "depthM");
    return {
      headline: "Excavation volume",
      primaryLabel: "Volume",
      primaryValue: `${formatNumber(volume)} m³`,
      secondaryValues: [{ label: "Liters", value: `${formatNumber(volume * 1000, 0)} L` }],
      explanation: "Volume = length × width × depth.",
      missingFactors: [],
    };
  },
  "plaster-calculator": (values) => {
    const areaM2 = num(values, "areaM2");
    const thicknessMm = num(values, "thicknessMm");
    const densityKgM3 = num(values, "densityKgM3");
    const volumeM3 = areaM2 * safeDivide(thicknessMm, 1000);
    const weightKg = volumeM3 * densityKgM3;
    return {
      headline: "Plaster estimate",
      primaryLabel: "Plaster weight",
      primaryValue: `${formatNumber(weightKg)} kg`,
      secondaryValues: [{ label: "Volume", value: `${formatNumber(volumeM3, 4)} m³` }],
      explanation: "Volume = area × thickness; weight = volume × density.",
      missingFactors: [],
    };
  },
  "home-renovation-m2-calculator": (values) => {
    const areaM2 = num(values, "areaM2");
    const costPerM2 = num(values, "costPerM2");
    const contingencyPercent = num(values, "contingencyPercent");
    const base = areaM2 * costPerM2;
    const total = base * (1 + contingencyPercent / 100);
    return {
      headline: "Renovation budget",
      primaryLabel: "Estimated cost",
      primaryValue: formatCurrency(total),
      secondaryValues: [
        { label: "Base cost", value: formatCurrency(base) },
        { label: "Area", value: `${formatNumber(areaM2)} m²` },
      ],
      explanation: "Cost = area × rate × (1 + contingency%).",
      missingFactors: [],
    };
  },
  "loan-payment-calculator": (values) => {
    const principal = num(values, "principal");
    const annualRate = num(values, "annualRate");
    const months = num(values, "months");
    const payment = amortizingPayment(principal, annualRate, months);
    return {
      headline: "Monthly payment estimate",
      primaryLabel: "Payment",
      primaryValue: formatCurrency(payment),
      secondaryValues: [
        { label: "Principal", value: formatCurrency(principal) },
        { label: "Term", value: `${formatNumber(months, 0)} months` },
      ],
      explanation: "Amortizing payment at fixed nominal rate. Taxes, insurance and fees not included.",
      missingFactors: [],
    };
  },
  "mortgage-calculator": (values) => {
    const principal = num(values, "principal");
    const annualRate = num(values, "annualRate");
    const months = num(values, "months");
    const payment = amortizingPayment(principal, annualRate, months);
    const totalPaid = payment * months;
    const totalInterest = totalPaid - principal;
    return {
      headline: "Mortgage payment estimate",
      primaryLabel: "Payment",
      primaryValue: formatCurrency(payment),
      secondaryValues: [
        { label: "Total paid", value: formatCurrency(totalPaid) },
        { label: "Total interest", value: formatCurrency(totalInterest) },
      ],
      explanation: "Amortizing mortgage payment at fixed nominal rate.",
      missingFactors: [],
    };
  },
  "interest-calculator": (values) => {
    const principal = num(values, "principal");
    const ratePercent = num(values, "ratePercent");
    const years = num(values, "years");
    const interest = principal * (ratePercent / 100) * years;
    const total = principal + interest;
    return {
      headline: "Simple interest",
      primaryLabel: "Total repayment",
      primaryValue: formatCurrency(total),
      secondaryValues: [{ label: "Interest portion", value: formatCurrency(interest) }],
      explanation: "Simple interest = principal × rate × years.",
      missingFactors: [],
    };
  },
  "compound-interest-calculator": (values) => {
    const principal = num(values, "principal");
    const annualRate = num(values, "annualRate");
    const years = num(values, "years");
    const compoundsPerYear = num(values, "compoundsPerYear");
    const ratePerPeriod = safeDivide(annualRate / 100, compoundsPerYear);
    const periods = compoundsPerYear * years;
    const amount = principal * (1 + ratePerPeriod) ** periods;
    const interest = amount - principal;
    return {
      headline: "Compound growth",
      primaryLabel: "Future value",
      primaryValue: formatCurrency(amount),
      secondaryValues: [{ label: "Interest earned", value: formatCurrency(interest) }],
      explanation: "Future value = principal × (1 + rate/n)^(n×years).",
      missingFactors: [],
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
      primaryValue: formatNumber(gross),
      secondaryValues: [
        { label: "VAT amount", value: formatNumber(vat) },
        { label: "Net", value: formatNumber(net) },
      ],
      explanation: "Gross = net + (net × VAT rate).",
      missingFactors: [],
    };
  },
  "discount-calculator": (values) => {
    const originalPrice = num(values, "originalPrice");
    const discountPercent = num(values, "discountPercent");
    const salePrice = originalPrice * (1 - discountPercent / 100);
    const saved = originalPrice - salePrice;
    return {
      headline: "Discount price",
      primaryLabel: "Sale price",
      primaryValue: formatCurrency(salePrice),
      secondaryValues: [{ label: "You save", value: formatCurrency(saved) }],
      explanation: "Sale price = original × (1 − discount%).",
      missingFactors: [],
    };
  },
  "percentage-calculator": (values) => {
    const value = num(values, "value");
    const percent = num(values, "percent");
    const out = value * (percent / 100);
    return {
      headline: "Percentage result",
      primaryLabel: "Result",
      primaryValue: formatNumber(out),
      secondaryValues: [{ label: "Percent applied", value: `${formatNumber(percent)}%` }],
      explanation: `${formatNumber(percent)}% of ${formatNumber(value)}.`,
      missingFactors: [],
    };
  },
  "profit-margin-calculator": (values) => {
    const cost = num(values, "cost");
    const price = num(values, "sellingPrice");
    const margin = safeDivide(price - cost, price) * 100;
    const markup = safeDivide(price - cost, cost) * 100;
    return {
      headline: "Selling margin",
      primaryLabel: "Margin",
      primaryValue: `${formatNumber(margin)}%`,
      secondaryValues: [{ label: "Markup on cost", value: `${formatNumber(markup)}%` }],
      explanation: "Margin % = (price − cost) ÷ price × 100.",
      missingFactors: [],
    };
  },
  "break-even-calculator": (values) => {
    const fixed = num(values, "fixedCost");
    const price = num(values, "unitPrice");
    const variable = num(values, "variableCost");
    const contribution = price - variable;
    if (contribution <= 0) {
      return {
        headline: "Break-even volume",
        primaryLabel: "Units to break even",
        primaryValue: "—",
        secondaryValues: [{ label: "Contribution margin", value: formatNumber(contribution) }],
        explanation: "Contribution margin is zero or negative — break-even volume is not defined.",
        missingFactors: [],
      };
    }
    const units = safeDivide(fixed, contribution);
    return {
      headline: "Break-even volume",
      primaryLabel: "Units to break even",
      primaryValue: formatNumber(units, 0),
      secondaryValues: [{ label: "Contribution margin", value: formatNumber(contribution) }],
      explanation: "Units = fixed costs ÷ (unit price − variable cost).",
      missingFactors: [],
    };
  },
  "roi-calculator": (values) => {
    const gain = num(values, "gain");
    const cost = num(values, "cost");
    const roi = safeDivide(gain - cost, cost) * 100;
    return {
      headline: "Return on investment",
      primaryLabel: "ROI",
      primaryValue: `${formatNumber(roi)}%`,
      secondaryValues: [{ label: "Net gain", value: formatCurrency(gain - cost) }],
      explanation: "ROI = (gain − cost) ÷ cost × 100.",
      missingFactors: [],
    };
  },
  "salary-cost-calculator": (values) => {
    const grossSalary = num(values, "grossSalary");
    const employerRatePercent = num(values, "employerRatePercent");
    const total = grossSalary * (1 + employerRatePercent / 100);
    return {
      headline: "Employer salary cost",
      primaryLabel: "Total cost",
      primaryValue: formatCurrency(total),
      secondaryValues: [{ label: "Gross salary", value: formatCurrency(grossSalary) }],
      explanation: "Total = gross salary × (1 + employer burden %).",
      missingFactors: [],
    };
  },
  "hourly-rate-calculator": (values) => {
    const monthlyIncome = num(values, "monthlyIncome");
    const billableHours = num(values, "billableHours");
    const rate = safeDivide(monthlyIncome, billableHours);
    return {
      headline: "Hourly rate",
      primaryLabel: "Rate",
      primaryValue: formatCurrency(rate),
      secondaryValues: [{ label: "Monthly income", value: formatCurrency(monthlyIncome) }],
      explanation: "Hourly rate = monthly income ÷ billable hours.",
      missingFactors: [],
    };
  },
  "depreciation-calculator": (values) => {
    const assetCost = num(values, "assetCost");
    const salvageValue = num(values, "salvageValue");
    const usefulLifeYears = num(values, "usefulLifeYears");
    const annual = safeDivide(assetCost - salvageValue, usefulLifeYears);
    return {
      headline: "Straight-line depreciation",
      primaryLabel: "Annual depreciation",
      primaryValue: formatCurrency(annual),
      secondaryValues: [{ label: "Depreciable base", value: formatCurrency(assetCost - salvageValue) }],
      explanation: "Annual = (cost − salvage) ÷ useful life.",
      missingFactors: [],
    };
  },
  "cash-flow-gap-calculator": (values) => {
    const receivablesDays = num(values, "receivablesDays");
    const payableDays = num(values, "payableDays");
    const dailyCost = num(values, "dailyCost");
    const gapDays = receivablesDays - payableDays;
    const gapAmount = gapDays * dailyCost;
    return {
      headline: "Cash flow gap",
      primaryLabel: "Working capital gap",
      primaryValue: formatCurrency(gapAmount),
      secondaryValues: [{ label: "Day difference", value: `${formatNumber(gapDays, 0)} days` }],
      explanation: "Gap = (receivable days − payable days) × daily operating cost.",
      missingFactors: [],
    };
  },
  "unit-cost-calculator": (values) => {
    const totalCost = num(values, "totalCost");
    const quantity = num(values, "quantity");
    const unitCost = safeDivide(totalCost, quantity);
    return {
      headline: "Unit cost",
      primaryLabel: "Cost per unit",
      primaryValue: formatCurrency(unitCost),
      secondaryValues: [{ label: "Total cost", value: formatCurrency(totalCost) }],
      explanation: "Unit cost = total cost ÷ quantity.",
      missingFactors: [],
    };
  },
  "machine-time-calculator": (values) => {
    const totalMinutes =
      num(values, "setupMinutes") + (num(values, "cycleSeconds") * num(values, "quantity")) / 60;
    const machineCost = safeDivide(totalMinutes, 60) * num(values, "machineRate");
    return {
      headline: "Machine time and cost",
      primaryLabel: "Machine cost",
      primaryValue: formatCurrency(machineCost),
      secondaryValues: [{ label: "Total time", value: `${formatNumber(totalMinutes)} min` }],
      explanation: "Setup + cycle × qty, converted to hours × machine rate.",
      missingFactors: [],
    };
  },
  "cnc-cycle-time-calculator": (values) => {
    const perPart =
      num(values, "machiningSeconds") +
      num(values, "loadUnloadSeconds") +
      num(values, "inspectionSeconds");
    const totalSeconds = perPart * num(values, "quantity");
    return {
      headline: "CNC cycle time",
      primaryLabel: "Total cycle time",
      primaryValue: `${formatNumber(totalSeconds, 0)} s`,
      secondaryValues: [
        { label: "Per part", value: `${formatNumber(perPart, 0)} s` },
        { label: "Total minutes", value: `${formatNumber(safeDivide(totalSeconds, 60))} min` },
      ],
      explanation: "Total = (machining + load/unload + inspection) × quantity.",
      missingFactors: [],
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
      primaryValue: formatCurrency(cost),
      secondaryValues: [{ label: "Labor", value: formatCurrency(num(values, "laborHours") * num(values, "laborRate")) }],
      explanation: "Material + labor hours × rate + consumables.",
      missingFactors: [],
    };
  },
  "laser-cutting-time-check": (values) => {
    const cutMinutes = safeDivide(num(values, "cutLengthM"), num(values, "cutSpeedMMin"));
    const pierceMinutes = (num(values, "pierceCount") * num(values, "pierceSeconds")) / 60;
    const totalMinutes = num(values, "setupMinutes") + cutMinutes + pierceMinutes;
    return {
      headline: "Laser cut time",
      primaryLabel: "Total minutes",
      primaryValue: `${formatNumber(totalMinutes)} min`,
      secondaryValues: [{ label: "Cut path time", value: `${formatNumber(cutMinutes)} min` }],
      explanation: "Setup + cut length ÷ speed + pierce time.",
      missingFactors: [],
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
      primaryValue: formatCurrency(cost),
      secondaryValues: [{ label: "Machine time cost", value: formatCurrency(num(values, "printHours") * num(values, "machineRate")) }],
      explanation: "Material + print machine time + post-process labor.",
      missingFactors: [],
    };
  },
  "sheet-metal-weight-calculator": (values) => {
    const thicknessM = safeDivide(num(values, "thicknessMm"), 1000);
    const volumeM3 = num(values, "lengthM") * num(values, "widthM") * thicknessM;
    const weightKg = volumeM3 * num(values, "densityKgM3");
    return {
      headline: "Sheet metal weight",
      primaryLabel: "Weight",
      primaryValue: `${formatNumber(weightKg)} kg`,
      secondaryValues: [{ label: "Volume", value: `${formatNumber(volumeM3, 4)} m³` }],
      explanation: "Weight = length × width × thickness × density.",
      missingFactors: [],
    };
  },
  "material-waste-calculator": (values) => {
    const inputMaterialKg = num(values, "inputMaterialKg");
    const goodOutputKg = num(values, "goodOutputKg");
    const wasteKg = inputMaterialKg - goodOutputKg;
    const wastePercent = safeDivide(wasteKg, inputMaterialKg) * 100;
    return {
      headline: "Material waste",
      primaryLabel: "Waste rate",
      primaryValue: `${formatNumber(wastePercent)}%`,
      secondaryValues: [{ label: "Waste mass", value: `${formatNumber(wasteKg)} kg` }],
      explanation: "Waste % = (input − good output) ÷ input × 100.",
      missingFactors: [],
    };
  },
  "scrap-rate-calculator": (values) => {
    const scrapUnits = num(values, "scrapUnits");
    const totalUnits = num(values, "totalUnits");
    const rate = safeDivide(scrapUnits, totalUnits) * 100;
    return {
      headline: "Scrap rate",
      primaryLabel: "Scrap rate",
      primaryValue: `${formatNumber(rate)}%`,
      secondaryValues: [{ label: "Good units", value: formatNumber(totalUnits - scrapUnits, 0) }],
      explanation: "Scrap rate = scrap units ÷ total units × 100.",
      missingFactors: [],
    };
  },
  "oee-calculator": (values) => {
    const availability = num(values, "availabilityPercent") / 100;
    const performance = num(values, "performancePercent") / 100;
    const quality = num(values, "qualityPercent") / 100;
    const oee = availability * performance * quality * 100;
    return {
      headline: "Overall equipment effectiveness",
      primaryLabel: "OEE",
      primaryValue: `${formatNumber(oee)}%`,
      secondaryValues: [
        { label: "Availability", value: `${formatNumber(num(values, "availabilityPercent"))}%` },
        { label: "Performance", value: `${formatNumber(num(values, "performancePercent"))}%` },
        { label: "Quality", value: `${formatNumber(num(values, "qualityPercent"))}%` },
      ],
      explanation: "OEE = availability × performance × quality.",
      missingFactors: [],
    };
  },
  "machine-hour-rate-calculator": (values) => {
    const fixedHourly = safeDivide(num(values, "fixedMonthlyCost"), num(values, "monthlyMachineHours"));
    const rate = fixedHourly + num(values, "variableCostPerHour");
    return {
      headline: "Machine hour rate",
      primaryLabel: "Hourly rate",
      primaryValue: formatCurrency(rate),
      secondaryValues: [{ label: "Fixed portion", value: formatCurrency(fixedHourly) }],
      explanation: "Rate = fixed monthly cost ÷ machine hours + variable cost per hour.",
      missingFactors: [],
    };
  },
  "tool-life-calculator": (values) => {
    const costPerPart = safeDivide(num(values, "totalToolCost"), num(values, "partsProduced"));
    return {
      headline: "Tool cost per part",
      primaryLabel: "Cost per part",
      primaryValue: formatCurrency(costPerPart),
      secondaryValues: [{ label: "Tool cost", value: formatCurrency(num(values, "totalToolCost")) }],
      explanation: "Cost per part = total tool cost ÷ parts produced.",
      missingFactors: [],
    };
  },
  "cutting-speed-calculator": (values) => {
    const diameterMm = num(values, "diameterMm");
    const rpm = num(values, "rpm");
    const vc = safeDivide(Math.PI * diameterMm * rpm, 1000);
    return {
      headline: "Cutting speed",
      primaryLabel: "Vc",
      primaryValue: `${formatNumber(vc)} m/min`,
      secondaryValues: [{ label: "Diameter", value: `${formatNumber(diameterMm)} mm` }],
      explanation: "Vc = π × diameter (mm) × rpm ÷ 1000.",
      missingFactors: [],
    };
  },
  "feed-rate-calculator": (values) => {
    const feed = num(values, "rpm") * num(values, "teeth") * num(values, "feedPerToothMm");
    return {
      headline: "Feed rate",
      primaryLabel: "Feed",
      primaryValue: `${formatNumber(feed)} mm/min`,
      secondaryValues: [{ label: "RPM", value: formatNumber(num(values, "rpm"), 0) }],
      explanation: "Feed = rpm × teeth × feed per tooth.",
      missingFactors: [],
    };
  },
  "tolerance-drift-calculator": (values) => {
    const target = num(values, "target");
    const actual = num(values, "actual");
    const drift = actual - target;
    const driftPercent = safeDivide(drift, target) * 100;
    return {
      headline: "Tolerance drift",
      primaryLabel: "Drift",
      primaryValue: formatNumber(drift, 4),
      secondaryValues: [{ label: "Drift %", value: `${formatNumber(driftPercent)}%` }],
      explanation: "Drift = actual − target.",
      missingFactors: [],
    };
  },
  "batch-yield-calculator": (values) => {
    const inputQty = num(values, "inputQty");
    const goodOutputQty = num(values, "goodOutputQty");
    const yieldPercent = safeDivide(goodOutputQty, inputQty) * 100;
    return {
      headline: "Batch yield",
      primaryLabel: "Yield",
      primaryValue: `${formatNumber(yieldPercent)}%`,
      secondaryValues: [{ label: "Good output", value: formatNumber(goodOutputQty, 0) }],
      explanation: "Yield = good output ÷ input × 100.",
      missingFactors: [],
    };
  },
  "kwh-cost-calculator": (values) => {
    const cost = num(values, "kwh") * num(values, "rate");
    return {
      headline: "Electricity cost",
      primaryLabel: "Cost",
      primaryValue: formatCurrency(cost),
      secondaryValues: [{ label: "Energy", value: `${formatNumber(num(values, "kwh"))} kWh` }],
      explanation: "Cost = kWh consumed × unit tariff.",
      missingFactors: [],
    };
  },
  "electricity-bill-calculator": (values) => {
    const variable = num(values, "kwh") * num(values, "rate");
    const total = variable + num(values, "fixedCharge");
    return {
      headline: "Electricity bill",
      primaryLabel: "Total bill",
      primaryValue: formatCurrency(total),
      secondaryValues: [
        { label: "Energy charge", value: formatCurrency(variable) },
        { label: "Fixed charge", value: formatCurrency(num(values, "fixedCharge")) },
      ],
      explanation: "Bill = kWh × rate + fixed charge.",
      missingFactors: [],
    };
  },
  "energy-consumption-check": (values) => {
    const kwh = num(values, "powerKw") * num(values, "hoursPerDay") * num(values, "days");
    const cost = kwh * num(values, "rate");
    return {
      headline: "Energy consumption",
      primaryLabel: "Energy cost",
      primaryValue: formatCurrency(cost),
      secondaryValues: [{ label: "Energy used", value: `${formatNumber(kwh)} kWh` }],
      explanation: "kWh = power × hours per day × days; cost = kWh × rate.",
      missingFactors: [],
    };
  },
  "carbon-footprint-quick": (values) => {
    const kgCo2 = num(values, "energyKwh") * num(values, "emissionFactorKgPerKwh");
    return {
      headline: "Carbon footprint",
      primaryLabel: "CO₂ estimate",
      primaryValue: `${formatNumber(kgCo2)} kg CO₂`,
      secondaryValues: [{ label: "Energy", value: `${formatNumber(num(values, "energyKwh"))} kWh` }],
      explanation: "CO₂ = energy × emission factor.",
      missingFactors: [],
    };
  },
  "fuel-emission-calculator": (values) => {
    const kgCo2 = num(values, "litersFuel") * num(values, "kgCo2PerLiter");
    return {
      headline: "Fuel emissions",
      primaryLabel: "CO₂ estimate",
      primaryValue: `${formatNumber(kgCo2)} kg CO₂`,
      secondaryValues: [{ label: "Fuel", value: `${formatNumber(num(values, "litersFuel"))} L` }],
      explanation: "CO₂ = liters × kg CO₂ per liter.",
      missingFactors: [],
    };
  },
  "solar-panel-output-calculator": (values) => {
    const kwh =
      num(values, "systemKw") *
      num(values, "sunHoursPerDay") *
      num(values, "days") *
      (num(values, "efficiencyPercent") / 100);
    return {
      headline: "Solar output",
      primaryLabel: "Energy generated",
      primaryValue: `${formatNumber(kwh)} kWh`,
      secondaryValues: [{ label: "System size", value: `${formatNumber(num(values, "systemKw"))} kW` }],
      explanation: "Output = system kW × sun hours × days × efficiency.",
      missingFactors: [],
    };
  },
  "heat-loss-calculator": (values) => {
    const watts = num(values, "uValue") * num(values, "areaM2") * num(values, "tempDifferenceC");
    return {
      headline: "Heat loss",
      primaryLabel: "Heat loss",
      primaryValue: `${formatNumber(watts)} W`,
      secondaryValues: [{ label: "Area", value: `${formatNumber(num(values, "areaM2"))} m²` }],
      explanation: "Heat loss (W) = U-value × area × temperature difference.",
      missingFactors: [],
    };
  },
  "boiler-efficiency-calculator": (values) => {
    const efficiency = safeDivide(num(values, "usefulOutputKwh"), num(values, "fuelInputKwh")) * 100;
    return {
      headline: "Boiler efficiency",
      primaryLabel: "Efficiency",
      primaryValue: `${formatNumber(efficiency)}%`,
      secondaryValues: [{ label: "Useful output", value: `${formatNumber(num(values, "usefulOutputKwh"))} kWh` }],
      explanation: "Efficiency = useful output ÷ fuel input × 100.",
      missingFactors: [],
    };
  },
  "compressor-energy-cost-calculator": (values) => {
    const kwh = num(values, "powerKw") * num(values, "operatingHours");
    const cost = kwh * num(values, "rate");
    return {
      headline: "Compressor energy cost",
      primaryLabel: "Energy cost",
      primaryValue: formatCurrency(cost),
      secondaryValues: [{ label: "Energy", value: `${formatNumber(kwh)} kWh` }],
      explanation: "Cost = power × operating hours × rate.",
      missingFactors: [],
    };
  },
  "cbam-exposure-quick-check": (values) => {
    const exposure = num(values, "emissionsTon") * num(values, "carbonPrice");
    return {
      headline: "CBAM exposure",
      primaryLabel: "Estimated exposure",
      primaryValue: formatCurrency(exposure),
      secondaryValues: [{ label: "Emissions", value: `${formatNumber(num(values, "emissionsTon"))} t CO₂` }],
      explanation: "Exposure = emissions (tonnes) × carbon price.",
      missingFactors: [],
    };
  },
  "fuel-consumption-calculator": (values) => fuelTrip(values, "Trip fuel"),
  "fuel-cost-calculator": (values) => fuelTrip(values, "Fuel cost"),
  "desi-calculator": (values) => volumetricWeight(values, "Desi weight"),
  "volumetric-weight-calculator": (values) => volumetricWeight(values, "Volumetric weight"),
  "route-cost-calculator": (values) => {
    const cost =
      num(values, "distanceKm") * num(values, "fuelCostPerKm") +
      num(values, "driverHours") * num(values, "hourlyRate") +
      num(values, "tolls");
    return {
      headline: "Route cost",
      primaryLabel: "Total cost",
      primaryValue: formatCurrency(cost),
      secondaryValues: [{ label: "Distance", value: `${formatNumber(num(values, "distanceKm"))} km` }],
      explanation: "Cost = distance × fuel cost/km + driver hours × rate + tolls.",
      missingFactors: [],
    };
  },
  "delivery-cost-calculator": (values) => {
    const cost =
      num(values, "distanceKm") * num(values, "costPerKm") +
      num(values, "stops") * num(values, "costPerStop");
    return {
      headline: "Delivery cost",
      primaryLabel: "Total cost",
      primaryValue: formatCurrency(cost),
      secondaryValues: [{ label: "Stops", value: formatNumber(num(values, "stops"), 0) }],
      explanation: "Cost = distance × cost/km + stops × cost/stop.",
      missingFactors: [],
    };
  },
  "freight-cost-calculator": (values) => {
    const cost = num(values, "weightKg") * num(values, "ratePerKg") + num(values, "fixedFee");
    return {
      headline: "Freight cost",
      primaryLabel: "Total cost",
      primaryValue: formatCurrency(cost),
      secondaryValues: [{ label: "Weight", value: `${formatNumber(num(values, "weightKg"))} kg` }],
      explanation: "Cost = weight × rate/kg + fixed fee.",
      missingFactors: [],
    };
  },
  "warehouse-storage-cost-calculator": (values) => {
    const cost = num(values, "palletCount") * num(values, "costPerPalletPerDay") * num(values, "days");
    return {
      headline: "Storage cost",
      primaryLabel: "Total cost",
      primaryValue: formatCurrency(cost),
      secondaryValues: [{ label: "Pallets", value: formatNumber(num(values, "palletCount"), 0) }],
      explanation: "Cost = pallets × daily rate × days.",
      missingFactors: [],
    };
  },
  "vehicle-depreciation-calculator": (values) => {
    const annual = safeDivide(num(values, "purchasePrice") - num(values, "resaleValue"), num(values, "years"));
    return {
      headline: "Vehicle depreciation",
      primaryLabel: "Annual depreciation",
      primaryValue: formatCurrency(annual),
      secondaryValues: [{ label: "Total loss", value: formatCurrency(num(values, "purchasePrice") - num(values, "resaleValue")) }],
      explanation: "Annual = (purchase − resale) ÷ years.",
      missingFactors: [],
    };
  },
  "trip-budget-calculator": (values) => {
    const total =
      num(values, "fuelCost") +
      num(values, "accommodationCost") +
      num(values, "foodCost") +
      num(values, "tolls") +
      num(values, "otherCost");
    return {
      headline: "Trip budget",
      primaryLabel: "Total budget",
      primaryValue: formatCurrency(total),
      secondaryValues: [{ label: "Fuel", value: formatCurrency(num(values, "fuelCost")) }],
      explanation: "Sum of fuel, accommodation, food, tolls and other costs.",
      missingFactors: [],
    };
  },
  "fertilizer-dosage-calculator": (values) => {
    const fertilizer = num(values, "areaHa") * num(values, "dosageKgPerHa");
    return {
      headline: "Fertilizer required",
      primaryLabel: "Total fertilizer",
      primaryValue: `${formatNumber(fertilizer)} kg`,
      secondaryValues: [{ label: "Field area", value: `${formatNumber(num(values, "areaHa"))} ha` }],
      explanation: "Total = area × dosage per hectare.",
      missingFactors: [],
    };
  },
  "seed-rate-calculator": (values) => {
    const seed = num(values, "areaHa") * num(values, "seedKgPerHa");
    return {
      headline: "Seed required",
      primaryLabel: "Total seed",
      primaryValue: `${formatNumber(seed)} kg`,
      secondaryValues: [{ label: "Field area", value: `${formatNumber(num(values, "areaHa"))} ha` }],
      explanation: "Total = area × seed rate per hectare.",
      missingFactors: [],
    };
  },
  "irrigation-cost-check": (values) => {
    const energyCost = num(values, "pumpKw") * num(values, "hours") * num(values, "energyRate");
    const total = energyCost + num(values, "waterCost");
    return {
      headline: "Irrigation cost",
      primaryLabel: "Total cost",
      primaryValue: formatCurrency(total),
      secondaryValues: [{ label: "Energy cost", value: formatCurrency(energyCost) }],
      explanation: "Cost = pump kW × hours × energy rate + water cost.",
      missingFactors: [],
    };
  },
  "water-usage-calculator": (values) => {
    const liters = num(values, "flowRateLiterMin") * num(values, "minutes");
    return {
      headline: "Water usage",
      primaryLabel: "Volume used",
      primaryValue: `${formatNumber(liters)} L`,
      secondaryValues: [{ label: "Duration", value: `${formatNumber(num(values, "minutes"))} min` }],
      explanation: "Volume = flow rate × minutes.",
      missingFactors: [],
    };
  },
  "feed-cost-estimator": (values) => {
    const total = num(values, "feedKg") * num(values, "pricePerKg") + num(values, "transportCost");
    return {
      headline: "Feed cost",
      primaryLabel: "Total cost",
      primaryValue: formatCurrency(total),
      secondaryValues: [{ label: "Feed mass", value: `${formatNumber(num(values, "feedKg"))} kg` }],
      explanation: "Cost = feed kg × price/kg + transport.",
      missingFactors: [],
    };
  },
  "milk-yield-check": (values) => {
    const liters = num(values, "cows") * num(values, "litersPerCow");
    const revenue = liters * num(values, "milkPrice");
    return {
      headline: "Milk revenue",
      primaryLabel: "Revenue",
      primaryValue: formatCurrency(revenue),
      secondaryValues: [{ label: "Total liters", value: `${formatNumber(liters)} L` }],
      explanation: "Revenue = cows × liters/cow × milk price.",
      missingFactors: [],
    };
  },
  "crop-yield-calculator": (values) => {
    const tons = num(values, "areaHa") * num(values, "yieldTonPerHa");
    const revenue = tons * num(values, "pricePerTon");
    return {
      headline: "Crop revenue",
      primaryLabel: "Revenue",
      primaryValue: formatCurrency(revenue),
      secondaryValues: [{ label: "Yield", value: `${formatNumber(tons)} t` }],
      explanation: "Revenue = area × yield/ha × price/ton.",
      missingFactors: [],
    };
  },
  "recipe-cost-check": (values) => {
    const portionCost = safeDivide(num(values, "ingredientCost"), num(values, "portions"));
    return {
      headline: "Recipe cost",
      primaryLabel: "Cost per portion",
      primaryValue: formatCurrency(portionCost),
      secondaryValues: [{ label: "Batch total", value: formatCurrency(num(values, "ingredientCost")) }],
      explanation: "Cost per portion = ingredient cost ÷ portions.",
      missingFactors: [],
    };
  },
  "food-cost-calculator": (values) => {
    const foodCostPercent = safeDivide(num(values, "ingredientCost"), num(values, "menuPrice")) * 100;
    return {
      headline: "Food cost ratio",
      primaryLabel: "Food cost %",
      primaryValue: `${formatNumber(foodCostPercent)}%`,
      secondaryValues: [{ label: "Ingredient cost", value: formatCurrency(num(values, "ingredientCost")) }],
      explanation: "Food cost % = ingredient cost ÷ menu price × 100.",
      missingFactors: [],
    };
  },
  "portion-cost-calculator": (values) => {
    const portionCost = safeDivide(num(values, "totalBatchCost"), num(values, "portions"));
    return {
      headline: "Portion cost",
      primaryLabel: "Cost per portion",
      primaryValue: formatCurrency(portionCost),
      secondaryValues: [{ label: "Batch total", value: formatCurrency(num(values, "totalBatchCost")) }],
      explanation: "Portion cost = batch cost ÷ portions.",
      missingFactors: [],
    };
  },
  "rent-vs-buy-calculator": (values) => {
    try {
      const model = calculateRentVsBuyModel(parseRentVsBuyValues(values));
      const verdict = strongerScenarioLabel(model.strongerScenario);
      return {
        headline: "Rent vs buy comparison",
        primaryLabel: "Stronger scenario",
        primaryValue: verdict,
        secondaryValues: [
          { label: "Rent net position", value: formatCurrency(model.rentNetPosition) },
          { label: "Buy net position", value: formatCurrency(model.buyNetPosition) },
          { label: "Net difference (buy − rent)", value: formatCurrency(model.netDifference) },
          { label: "Total rent paid", value: formatCurrency(model.totalRentPaid) },
          {
            label: "Investment value if renting",
            value: formatCurrency(model.investmentValueIfRenting),
          },
          { label: "Monthly mortgage payment", value: formatCurrency(model.monthlyMortgagePayment) },
          { label: "Total mortgage paid", value: formatCurrency(model.totalMortgagePaid) },
          {
            label: "Remaining mortgage balance",
            value: formatCurrency(model.remainingMortgageBalance),
          },
          { label: "Future home value", value: formatCurrency(model.futureHomeValue) },
          {
            label: "Estimated ownership costs",
            value: formatCurrency(model.estimatedOwnershipCosts),
          },
          { label: "Estimated selling costs", value: formatCurrency(model.estimatedSellingCosts) },
        ],
        explanation: `${verdict} Small changes in rates, rent growth or home appreciation can change the result. ${RENT_VS_BUY_RESULT_WARNING}`,
        missingFactors: [],
      };
    } catch (error) {
      const message =
        error instanceof RentVsBuyValidationError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Invalid inputs for rent vs buy comparison.";
      return {
        headline: "Rent vs buy comparison",
        primaryLabel: "Result",
        primaryValue: "—",
        secondaryValues: [],
        explanation: message,
        missingFactors: [],
      };
    }
  },
  "home-budget-calculator": (values) => {
    const income = num(values, "income");
    const expenses =
      num(values, "rent") +
      num(values, "food") +
      num(values, "transport") +
      num(values, "utilities");
    const remaining = income - expenses;
    return {
      headline: "Home budget",
      primaryLabel: "Remaining",
      primaryValue: formatCurrency(remaining),
      secondaryValues: [
        { label: "Total expenses", value: formatCurrency(expenses) },
        { label: "Income", value: formatCurrency(income) },
      ],
      explanation: "Remaining = income − (rent + food + transport + utilities).",
      missingFactors: [],
    };
  },
  "time-duration-calculator": (values) => {
    const startMin = num(values, "startHour") * 60 + num(values, "startMinute");
    let endMin = num(values, "endHour") * 60 + num(values, "endMinute");
    if (endMin < startMin) {
      endMin += 24 * 60;
    }
    const durationMin = endMin - startMin;
    const hours = Math.floor(safeDivide(durationMin, 60));
    const minutes = durationMin % 60;
    return {
      headline: "Time duration",
      primaryLabel: "Duration",
      primaryValue: `${formatNumber(hours, 0)} h ${formatNumber(minutes, 0)} min`,
      secondaryValues: [{ label: "Total minutes", value: formatNumber(durationMin, 0) }],
      explanation: "Duration from start to end, wrapping past midnight when needed.",
      missingFactors: [],
    };
  },
  "age-calculator": (values) => {
    const age = num(values, "currentYear") - num(values, "birthYear");
    return {
      headline: "Age",
      primaryLabel: "Age",
      primaryValue: `${formatNumber(age, 0)} years`,
      secondaryValues: [{ label: "Birth year", value: formatNumber(num(values, "birthYear"), 0) }],
      explanation: "Age = current year − birth year.",
      missingFactors: [],
    };
  },
  "date-difference-calculator": (values) => {
    const diff = num(values, "endDayNumber") - num(values, "startDayNumber");
    return {
      headline: "Date difference",
      primaryLabel: "Days between",
      primaryValue: `${formatNumber(diff, 0)} days`,
      secondaryValues: [{ label: "Weeks", value: formatNumber(safeDivide(diff, 7), 1) }],
      explanation: "Difference = end day number − start day number.",
      missingFactors: [],
    };
  },
  "shopping-budget-calculator": (values) => {
    const total =
      num(values, "item1") +
      num(values, "item2") +
      num(values, "item3") +
      num(values, "item4") +
      num(values, "item5");
    return {
      headline: "Shopping total",
      primaryLabel: "Total",
      primaryValue: formatCurrency(total),
      secondaryValues: [{ label: "Items summed", value: "5" }],
      explanation: "Sum of item1 through item5.",
      missingFactors: [],
    };
  },
  "fuel-travel-calculator": (values) => fuelTrip(values, "Travel fuel cost"),
  "unit-price-calculator": (values) => {
    const unitPrice = safeDivide(num(values, "totalPrice"), num(values, "quantity"));
    return {
      headline: "Unit price",
      primaryLabel: "Price per unit",
      primaryValue: formatCurrency(unitPrice),
      secondaryValues: [{ label: "Total price", value: formatCurrency(num(values, "totalPrice")) }],
      explanation: "Unit price = total price ÷ quantity.",
      missingFactors: [],
    };
  },
  "tip-calculator": (values) => {
    const billAmount = num(values, "billAmount");
    const tipPercent = num(values, "tipPercent");
    const tip = billAmount * (tipPercent / 100);
    const total = billAmount + tip;
    return {
      headline: "Tip calculator",
      primaryLabel: "Total with tip",
      primaryValue: formatCurrency(total),
      secondaryValues: [{ label: "Tip amount", value: formatCurrency(tip) }],
      explanation: "Total = bill + bill × tip%.",
      missingFactors: [],
    };
  },
  "savings-goal-calculator": (values) => {
    const months = safeDivide(num(values, "targetAmount"), num(values, "monthlySaving"));
    return {
      headline: "Savings timeline",
      primaryLabel: "Months to goal",
      primaryValue: `${formatNumber(months, 1)} months`,
      secondaryValues: [{ label: "Target", value: formatCurrency(num(values, "targetAmount")) }],
      explanation: "Months = target amount ÷ monthly saving.",
      missingFactors: [],
    };
  },
  "percentage-increase-calculator": (values) => {
    const oldValue = num(values, "oldValue");
    const newValue = num(values, "newValue");
    const change = safeDivide(newValue - oldValue, oldValue) * 100;
    return {
      headline: "Percentage change",
      primaryLabel: "Change",
      primaryValue: `${formatNumber(change)}%`,
      secondaryValues: [{ label: "Absolute change", value: formatNumber(newValue - oldValue) }],
      explanation: "Change % = (new − old) ÷ old × 100.",
      missingFactors: [],
    };
  },
  "average-calculator": (values) => {
    const nums = collectNumericValues(values, VALUE_KEYS);
    const count = nums.length;
    const sum = nums.reduce((a, b) => a + b, 0);
    const avg = count > 0 ? safeDivide(sum, count) : 0;
    return {
      headline: "Arithmetic mean",
      primaryLabel: "Average",
      primaryValue: formatNumber(avg),
      secondaryValues: [{ label: "Values used", value: String(count) }],
      explanation: "Mean = sum of entered values ÷ count.",
      missingFactors: [],
    };
  },
  "median-calculator": (values) => {
    const nums = collectNumericValues(values, VALUE_KEYS).sort((a, b) => a - b);
    const n = nums.length;
    let median = 0;
    if (n > 0) {
      const mid = Math.floor(n / 2);
      median = n % 2 === 0 ? (nums[mid - 1] + nums[mid]) / 2 : nums[mid];
    }
    return {
      headline: "Median",
      primaryLabel: "Median",
      primaryValue: formatNumber(median),
      secondaryValues: [{ label: "Values used", value: String(n) }],
      explanation: "Middle value of sorted entered numbers.",
      missingFactors: [],
    };
  },
  "standard-deviation-calculator": (values) => {
    const nums = collectNumericValues(values, VALUE_KEYS);
    const n = nums.length;
    const mean = n > 0 ? safeDivide(nums.reduce((a, b) => a + b, 0), n) : 0;
    const variance =
      n > 0 ? safeDivide(nums.reduce((acc, x) => acc + (x - mean) ** 2, 0), n) : 0;
    const std = Math.sqrt(variance);
    return {
      headline: "Population standard deviation",
      primaryLabel: "σ",
      primaryValue: formatNumber(std),
      secondaryValues: [{ label: "Mean μ", value: formatNumber(mean) }],
      explanation: "Population σ = √(Σ(x−μ)² / n).",
      missingFactors: [],
    };
  },
  "ratio-calculator": (values) => {
    const a = num(values, "a");
    const b = num(values, "b");
    const divisor = gcd(a, b);
    const simplifiedA = Math.round(a / divisor);
    const simplifiedB = Math.round(b / divisor);
    return {
      headline: "Ratio",
      primaryLabel: "Simplified ratio",
      primaryValue: `${formatNumber(simplifiedA, 0)} : ${formatNumber(simplifiedB, 0)}`,
      secondaryValues: [{ label: "Decimal ratio", value: formatNumber(safeDivide(a, b), 4) }],
      explanation: "Ratio simplified by greatest common divisor.",
      missingFactors: [],
    };
  },
  "proportion-calculator": (values) => {
    const a = num(values, "a");
    const b = num(values, "b");
    const c = num(values, "c");
    const x = safeDivide(b * c, a);
    return {
      headline: "Proportion",
      primaryLabel: "Missing value x",
      primaryValue: formatNumber(x),
      secondaryValues: [{ label: "Proportion", value: `${formatNumber(a)} : ${formatNumber(b)} = ${formatNumber(c)} : x` }],
      explanation: "If a : b = c : x, then x = b × c ÷ a.",
      missingFactors: [],
    };
  },
  "probability-calculator": (values) => {
    const favorable = num(values, "favorableOutcomes");
    const total = num(values, "totalOutcomes");
    const probability = safeDivide(favorable, total);
    return {
      headline: "Probability",
      primaryLabel: "Probability",
      primaryValue: formatNumber(probability, 4),
      secondaryValues: [{ label: "Percent", value: `${formatNumber(probability * 100)}%` }],
      explanation: "Probability = favorable outcomes ÷ total outcomes.",
      missingFactors: [],
    };
  },
  "sample-size-calculator": (values) => {
    const population = num(values, "population");
    const z = num(values, "confidenceZ");
    const margin = num(values, "marginErrorPercent") / 100;
    const p = num(values, "proportionPercent") / 100;
    const n0 = safeDivide(z * z * p * (1 - p), margin * margin);
    const sample =
      population > 0
        ? safeDivide(n0, 1 + safeDivide(n0 - 1, population))
        : n0;
    return {
      headline: "Sample size",
      primaryLabel: "Required sample",
      primaryValue: formatNumber(Math.ceil(sample), 0),
      secondaryValues: [{ label: "Infinite population estimate", value: formatNumber(Math.ceil(n0), 0) }],
      explanation: "Sample size with finite population correction.",
      missingFactors: [],
    };
  },
  "z-score-calculator": (values) => {
    const value = num(values, "value");
    const mean = num(values, "mean");
    const sd = num(values, "standardDeviation");
    const z = safeDivide(value - mean, sd);
    return {
      headline: "Z-score",
      primaryLabel: "Z",
      primaryValue: formatNumber(z, 4),
      secondaryValues: [{ label: "Value", value: formatNumber(value) }],
      explanation: "Z = (value − mean) ÷ standard deviation.",
      missingFactors: [],
    };
  },
  "linear-regression-calculator": (values) => {
    const xs = [num(values, "x1"), num(values, "x2"), num(values, "x3")];
    const ys = [num(values, "y1"), num(values, "y2"), num(values, "y3")];
    const n = 3;
    const sumX = xs.reduce((a, b) => a + b, 0);
    const sumY = ys.reduce((a, b) => a + b, 0);
    const sumXY = xs.reduce((acc, x, i) => acc + x * ys[i], 0);
    const sumX2 = xs.reduce((acc, x) => acc + x * x, 0);
    const denom = n * sumX2 - sumX * sumX;
    const slope = safeDivide(n * sumXY - sumX * sumY, denom);
    const intercept = safeDivide(sumY - slope * sumX, n);
    return {
      headline: "Linear regression",
      primaryLabel: "Slope",
      primaryValue: formatNumber(slope, 4),
      secondaryValues: [{ label: "Intercept", value: formatNumber(intercept, 4) }],
      explanation: "Least-squares line through three points.",
      missingFactors: [],
    };
  },
  "length-converter": (values) => {
    const value = num(values, "value");
    const fromUnit = str(values, "fromUnit");
    const baseMeters = value * (LENGTH_TO_METERS[fromUnit] ?? 0);
    const secondary = convertAllUnits(value, fromUnit, LENGTH_TO_METERS, LENGTH_LABELS);
    return {
      headline: "Length conversion",
      primaryLabel: "Meters",
      primaryValue: `${formatNumber(baseMeters, 6)} m`,
      secondaryValues: secondary,
      explanation: "Convert length to meters and all common units.",
      missingFactors: [],
    };
  },
  "weight-converter": (values) => {
    const value = num(values, "value");
    const fromUnit = str(values, "fromUnit");
    const baseKg = value * (WEIGHT_TO_KG[fromUnit] ?? 0);
    const secondary = convertAllUnits(value, fromUnit, WEIGHT_TO_KG, WEIGHT_LABELS);
    return {
      headline: "Weight conversion",
      primaryLabel: "Kilograms",
      primaryValue: `${formatNumber(baseKg, 6)} kg`,
      secondaryValues: secondary,
      explanation: "Convert weight to kilograms and all common units.",
      missingFactors: [],
    };
  },
  "area-converter": (values) => {
    const value = num(values, "value");
    const fromUnit = str(values, "fromUnit");
    const baseM2 = value * (AREA_TO_M2[fromUnit] ?? 0);
    const secondary = convertAllUnits(value, fromUnit, AREA_TO_M2, AREA_LABELS);
    return {
      headline: "Area conversion",
      primaryLabel: "Square meters",
      primaryValue: `${formatNumber(baseM2, 6)} m²`,
      secondaryValues: secondary,
      explanation: "Convert area to m² and all common units.",
      missingFactors: [],
    };
  },
  "volume-converter": (values) => {
    const value = num(values, "value");
    const fromUnit = str(values, "fromUnit");
    const baseLiter = value * (VOLUME_TO_LITER[fromUnit] ?? 0);
    const secondary = convertAllUnits(value, fromUnit, VOLUME_TO_LITER, VOLUME_LABELS);
    return {
      headline: "Volume conversion",
      primaryLabel: "Liters",
      primaryValue: `${formatNumber(baseLiter, 6)} L`,
      secondaryValues: secondary,
      explanation: "Convert volume to liters and all common units.",
      missingFactors: [],
    };
  },
  "temperature-converter": (values) => {
    const value = num(values, "value");
    const fromUnit = str(values, "fromUnit");
    const celsius = tempToCelsius(value, fromUnit);
    const secondary = (["celsius", "fahrenheit", "kelvin"] as const).map((unit) => ({
      label: TEMP_LABELS[unit],
      value: formatNumber(celsiusToUnit(celsius, unit), 4),
    }));
    return {
      headline: "Temperature conversion",
      primaryLabel: "Celsius",
      primaryValue: `${formatNumber(celsius, 4)} °C`,
      secondaryValues: secondary,
      explanation: "Convert temperature across Celsius, Fahrenheit and Kelvin.",
      missingFactors: [],
    };
  },
};

export function calculateFreeTrafficTool(
  slug: string,
  values: FreeTrafficInputValues,
  locale: SupportedLocale | string = "en",
): FreeTrafficResult {
  const calculator = CALCULATORS[slug];
  if (!calculator) {
    throw new Error(`Unknown free traffic calculator slug: ${slug}`);
  }
  const previousLocale = _activeFormatLocale;
  _activeFormatLocale = normalizeLocale(locale);
  try {
    return meta(slug, calculator(values));
  } finally {
    _activeFormatLocale = previousLocale;
  }
}

export { NOT_AVAILABLE as FREE_RESULT_NOT_AVAILABLE };

export function hasDedicatedTrafficCalculator(slug: string): boolean {
  return slug in CALCULATORS;
}

const _registeredSlugs = Object.keys(CALCULATORS);
const _catalogSlugs = listFreeTrafficSlugs();
if (_registeredSlugs.length !== _catalogSlugs.length) {
  throw new Error(
    `Calculator count mismatch: registered ${_registeredSlugs.length}, catalog ${_catalogSlugs.length}`,
  );
}
for (const catalogSlug of _catalogSlugs) {
  if (!(catalogSlug in CALCULATORS)) {
    throw new Error(`Missing calculator for slug: ${catalogSlug}`);
  }
}
