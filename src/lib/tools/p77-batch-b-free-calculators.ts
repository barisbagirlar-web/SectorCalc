/**
 * P77-MAX Batch B — production calculators for revenue free routes.
 * Formulas match FormulaContract entries in p77-free-traffic-batch.ts.
 */

import type { RevenueTool } from "@/lib/tools/revenue-tools";
import type { FreeRiskLevel, FreeToolInputValues, FreeToolResult } from "@/lib/tools/free-tool-results";
import { OracleValidationError } from "@/lib/formula-governance/oracle/oracle-types";

export const P77_BATCH_B_FREE_SLUGS = [
  "kwh-consumption-check",
  "paint-coverage-cost-check",
  "plumbing-fixture-cost-check",
  "home-renovation-m2",
] as const;

export type P77BatchBFreeSlug = (typeof P77_BATCH_B_FREE_SLUGS)[number];

export function isP77BatchBFreeSlug(slug: string): slug is P77BatchBFreeSlug {
  return (P77_BATCH_B_FREE_SLUGS as readonly string[]).includes(slug);
}

function num(values: FreeToolInputValues, key: string): number {
  const raw = values[key];
  if (typeof raw === "number") {
    return Number.isFinite(raw) ? raw : NaN;
  }
  if (typeof raw === "string") {
    const parsed = Number(raw.trim());
    return Number.isFinite(parsed) ? parsed : NaN;
  }
  return NaN;
}

function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function money(value: number): string {
  return `$${round(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function requireFinite(value: number, label: string): number {
  if (!Number.isFinite(value)) {
    throw new OracleValidationError("INVALID_TIME_INPUT", `${label} must be a finite number.`);
  }
  return value;
}

function requireNonNegative(value: number, label: string): number {
  requireFinite(value, label);
  if (value < 0) {
    throw new OracleValidationError("INVALID_COST", `${label} cannot be negative.`);
  }
  return value;
}

function requirePositive(value: number, label: string): number {
  requireFinite(value, label);
  if (value <= 0) {
    throw new OracleValidationError("INVALID_QUANTITY", `${label} must be greater than 0.`);
  }
  return value;
}

export type KwhConsumptionOutputs = {
  readonly dailyKwh: number;
  readonly periodKwh: number;
  readonly energyCost: number;
  readonly recommendedPrice: number;
};

export type PaintCoverageOutputs = {
  readonly netArea: number;
  readonly baseUnits: number;
  readonly wasteUnits: number;
  readonly requiredUnits: number;
  readonly paintCost: number;
  readonly recommendedPrice: number;
};

export type PlumbingFixtureOutputs = {
  readonly materialCost: number;
  readonly laborCost: number;
  readonly subtotal: number;
  readonly overhead: number;
  readonly totalCost: number;
  readonly recommendedPrice: number;
};

export type HomeRenovationM2Outputs = {
  readonly baseCost: number;
  readonly subtotal: number;
  readonly contingency: number;
  readonly totalEstimatedCost: number;
  readonly recommendedPrice: number;
};

export function calculateKwhConsumptionCheck(values: FreeToolInputValues): KwhConsumptionOutputs {
  const powerKw = requireNonNegative(num(values, "powerKw"), "Power (kW)");
  const hoursPerDay = requireNonNegative(num(values, "hoursPerDay"), "Hours per day");
  const days = requirePositive(num(values, "days"), "Days");
  const tariffPerKwh = requireNonNegative(num(values, "tariffPerKwh"), "Tariff per kWh");

  const dailyKwh = round(powerKw * hoursPerDay, 4);
  const periodKwh = round(dailyKwh * days, 4);
  const energyCost = round(periodKwh * tariffPerKwh, 2);

  return {
    dailyKwh,
    periodKwh,
    energyCost,
    recommendedPrice: energyCost,
  };
}

export function calculatePaintCoverageCostCheck(values: FreeToolInputValues): PaintCoverageOutputs {
  const paintableArea = requirePositive(num(values, "paintableArea"), "Paintable area");
  const coveragePerUnit = requirePositive(num(values, "coveragePerUnit"), "Coverage per unit");
  const coats = requirePositive(num(values, "coats"), "Coats");
  const unitPrice = requireNonNegative(num(values, "unitPrice"), "Unit price");
  const wasteAllowancePct = requireNonNegative(num(values, "wasteAllowancePct"), "Waste allowance");

  const netArea = round(paintableArea * coats, 4);
  const baseUnits = netArea / coveragePerUnit;
  const wasteUnits = baseUnits * (wasteAllowancePct / 100);
  const requiredUnits = Math.ceil(baseUnits + wasteUnits);
  const paintCost = round(requiredUnits * unitPrice, 2);

  return {
    netArea,
    baseUnits: round(baseUnits, 4),
    wasteUnits: round(wasteUnits, 4),
    requiredUnits,
    paintCost,
    recommendedPrice: paintCost,
  };
}

export function calculatePlumbingFixtureCostCheck(values: FreeToolInputValues): PlumbingFixtureOutputs {
  const fixtureCount = requirePositive(num(values, "fixtureCount"), "Fixture count");
  const unitMaterialCost = requireNonNegative(num(values, "unitMaterialCost"), "Unit material cost");
  const laborHoursPerFixture = requireNonNegative(
    num(values, "laborHoursPerFixture"),
    "Labor hours per fixture",
  );
  const laborRate = requireNonNegative(num(values, "laborRate"), "Labor rate");
  const overheadPct = requireNonNegative(num(values, "overheadPct"), "Overhead");

  const materialCost = round(fixtureCount * unitMaterialCost, 2);
  const laborCost = round(fixtureCount * laborHoursPerFixture * laborRate, 2);
  const subtotal = round(materialCost + laborCost, 2);
  const overhead = round(subtotal * (overheadPct / 100), 2);
  const totalCost = round(subtotal + overhead, 2);

  return {
    materialCost,
    laborCost,
    subtotal,
    overhead,
    totalCost,
    recommendedPrice: totalCost,
  };
}

export function calculateHomeRenovationM2Check(values: FreeToolInputValues): HomeRenovationM2Outputs {
  const areaM2 = requirePositive(num(values, "areaM2"), "Area (m²)");
  const unitCostPerM2 = requireNonNegative(num(values, "unitCostPerM2"), "Unit cost per m²");
  const demolitionCost = requireNonNegative(num(values, "demolitionCost"), "Demolition cost");
  const contingencyPct = requireNonNegative(num(values, "contingencyPct"), "Contingency");

  const baseCost = round(areaM2 * unitCostPerM2, 2);
  const subtotal = round(baseCost + demolitionCost, 2);
  const contingency = round(subtotal * (contingencyPct / 100), 2);
  const totalEstimatedCost = round(subtotal + contingency, 2);

  return {
    baseCost,
    subtotal,
    contingency,
    totalEstimatedCost,
    recommendedPrice: totalEstimatedCost,
  };
}

export function calculateP77BatchBNumericOutputs(
  slug: P77BatchBFreeSlug,
  values: FreeToolInputValues,
): Record<string, number> {
  switch (slug) {
    case "kwh-consumption-check":
      return calculateKwhConsumptionCheck(values);
    case "paint-coverage-cost-check":
      return calculatePaintCoverageCostCheck(values);
    case "plumbing-fixture-cost-check":
      return calculatePlumbingFixtureCostCheck(values);
    case "home-renovation-m2":
      return calculateHomeRenovationM2Check(values);
    default: {
      const unsupported: never = slug;
      throw new Error(`Unsupported P77 Batch B slug: ${unsupported}`);
    }
  }
}

function riskFromCost(cost: number): FreeRiskLevel {
  if (cost >= 25_000) {
    return "HIGH";
  }
  if (cost >= 8_000) {
    return "MEDIUM";
  }
  return "LOW";
}

function buildResult(
  riskLevel: FreeRiskLevel,
  headline: string,
  summary: string,
  tool: RevenueTool,
): FreeToolResult {
  return {
    riskLevel,
    headline,
    summary,
    missingFactors: tool.freeMissingFactors.slice(0, 4),
    ctaLabel: tool.premiumCtaLabel ?? "Unlock the Full Analyzer",
  };
}

export function calculateP77BatchBFreeResult(
  slug: P77BatchBFreeSlug,
  values: FreeToolInputValues,
  tool: RevenueTool,
): FreeToolResult {
  try {
    switch (slug) {
      case "kwh-consumption-check": {
        const out = calculateKwhConsumptionCheck(values);
        return buildResult(
          riskFromCost(out.energyCost),
          `Period energy cost ~${money(out.energyCost)}`,
          `${round(out.periodKwh, 2)} kWh over ${num(values, "days")} days (${round(out.dailyKwh, 2)} kWh/day).`,
          tool,
        );
      }
      case "paint-coverage-cost-check": {
        const out = calculatePaintCoverageCostCheck(values);
        return buildResult(
          riskFromCost(out.paintCost),
          `Paint cost ~${money(out.paintCost)}`,
          `${out.requiredUnits} units required for ${round(out.netArea, 1)} m² net area (incl. waste).`,
          tool,
        );
      }
      case "plumbing-fixture-cost-check": {
        const out = calculatePlumbingFixtureCostCheck(values);
        return buildResult(
          riskFromCost(out.totalCost),
          `Fixture job total ~${money(out.totalCost)}`,
          `Material ${money(out.materialCost)} + labor ${money(out.laborCost)} + overhead ${money(out.overhead)}.`,
          tool,
        );
      }
      case "home-renovation-m2": {
        const out = calculateHomeRenovationM2Check(values);
        return buildResult(
          riskFromCost(out.totalEstimatedCost),
          `Renovation estimate ~${money(out.totalEstimatedCost)}`,
          `Base ${money(out.baseCost)} + demolition + ${round(num(values, "contingencyPct"), 1)}% contingency.`,
          tool,
        );
      }
      default: {
        const unsupported: never = slug;
        throw new Error(`Unsupported P77 Batch B slug: ${unsupported}`);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid inputs.";
    return buildResult("MEDIUM", "Check your inputs.", message, tool);
  }
}
