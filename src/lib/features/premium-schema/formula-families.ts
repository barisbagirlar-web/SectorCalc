/**
 * SectorCalc - 10 locked industrial formula families.
 * All schemas and registry entries must map to one of these families.
 * Schemas reference formulaId only - never expressions.
 */

export const FORMULA_FAMILIES = [
  "measurement",
  "calibration",
  "scrap",
  "oee",
  "time",
  "route",
  "cost",
  "energy",
  "carbon",
  "benchmark",
  "finance",
  "fluid",
  "lean",
  "industrial",
] as const;

export type FormulaFamilyId = (typeof FORMULA_FAMILIES)[number];

export const FORMULA_FAMILY_LABELS: Record<FormulaFamilyId, string> = {
  measurement: "Measurement - weighing, units, deviation",
  calibration: "Calibration - tolerance, drift, adjustment",
  scrap: "Scrap / Waste - fire, defect, material loss",
  oee: "OEE / Productivity - availability, performance, quality",
  time: "Time / Setup - setup, delay, cycle, labor hours",
  route: "Route / Resource - deadhead, equipment, allocation",
  cost: "Cost / Margin - price, margin leak, safe floor",
  energy: "Energy - kWh, peak demand, equipment loss",
  carbon: "Carbon / Compliance - CBAM, emissions exposure",
  benchmark: "Benchmark / Health - variance, sector comparison",
  finance: "Finance - IRR, NPV, DCF, ROI, valuation",
  fluid: "Fluid - pipe flow, heat exchange, hydraulic systems",
  lean: "Lean - balance, muda, efficiency, standard work",
  industrial: "Industrial - machinery, power, metal, HVAC",
};

/** Schema category aligns 1:1 with formula family id. */
export type PremiumCalculatorCategory = FormulaFamilyId;

export const PREMIUM_ARCHITECTURE_LAYERS = [
  "Dynamic UI - renders, never calculates",
  "Sector Schema - inputs, thresholds, report template (no math)",
  "Safe Formula Registry - typed tested TypeScript functions",
  "Schema Linter - build-time registry compliance",
  "Decision Report Engine - big number, thresholds, action, PDF",
] as const;

export const PREMIUM_FORBIDDEN_PATTERNS = [
  "eval",
  "new Function",
  "expression",
  "formulaString",
  "executable",
] as const;
