// Auto-generated from project-overrun-risk-calculator-schema.json
import * as z from 'zod';

export interface Project_overrun_risk_calculatorInput {
  plannedDuration: number;
  actualDuration: number;
  plannedCost: number;
  actualCost: number;
  percentComplete: number;
  scopeChangeFrequency: string;
  teamExperience: string;
  qualityDefectRate: number;
  dataConfidence?: number;
}

export const Project_overrun_risk_calculatorInputSchema = z.object({
  plannedDuration: z.number().min(1).max(120).default(12),
  actualDuration: z.number().min(0).max(120).default(6),
  plannedCost: z.number().min(1000).max(1000000000).default(1000000),
  actualCost: z.number().min(0).max(1000000000).default(600000),
  percentComplete: z.number().min(0).max(100).default(50),
  scopeChangeFrequency: z.enum(['low', 'moderate', 'high']).default('moderate'),
  teamExperience: z.enum(['junior', 'intermediate', 'senior']).default('intermediate'),
  qualityDefectRate: z.number().min(0).max(1).default(0.05),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Project_overrun_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.qualityDefectRate * input.plannedCost; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.qualityDefectRate * input.plannedCost * (1 + (input.percentComplete / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.qualityDefectRate * input.plannedCost * (1 + (input.percentComplete / 100)) * (input.plannedDuration); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.plannedDuration; results["factor_plannedDuration"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_plannedDuration"] = Number.NaN; }
  return results;
}


export function calculateProject_overrun_risk_calculator(input: Project_overrun_risk_calculatorInput): Project_overrun_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    base_cost: toNumericFormulaValue(values["base_cost"]),
    adjusted_cost: toNumericFormulaValue(values["adjusted_cost"]),
    factor_plannedDuration: toNumericFormulaValue(values["factor_plannedDuration"])
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Multi-project comparison"],
  };
}


export interface Project_overrun_risk_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { base_cost: number; adjusted_cost: number; factor_plannedDuration: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Project_overrun_risk_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["base_cost","adjusted_cost","factor_plannedDuration"],
} as const;

