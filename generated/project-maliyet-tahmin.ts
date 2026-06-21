// Auto-generated from project-maliyet-tahmin-schema.json
import * as z from 'zod';

export interface Project_maliyet_tahminInput {
  Hours_i: number;
  Rate_i: number;
  Quantity_j: number;
  Price_j: number;
  RentalDays_k: number;
  DailyRate_k: number;
  LumpSum_m: number;
  OverheadRate: number;
  Direct: number;
  RiskFactor: number;
  Budget: number;
  dataConfidence?: number;
}

export const Project_maliyet_tahminInputSchema = z.object({
  Hours_i: z.number().min(0).default(0),
  Rate_i: z.number().min(0).default(0),
  Quantity_j: z.number().min(0).default(0),
  Price_j: z.number().min(0).default(0),
  RentalDays_k: z.number().min(0).default(0),
  DailyRate_k: z.number().min(0).default(0),
  LumpSum_m: z.number().min(0).default(0),
  OverheadRate: z.number().min(0).default(0),
  Direct: z.number().min(0).default(0),
  RiskFactor: z.number().min(0).default(0),
  Budget: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Project_maliyet_tahminInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["DirectLabor"] = Number.NaN;
  results["DirectMaterial"] = Number.NaN;
  results["Equipment"] = Number.NaN;
  results["Subcontractor"] = Number.NaN;
  try { const v = ((toNumericFormulaValue(results["DirectLabor"])) + (toNumericFormulaValue(results["DirectMaterial"]))) * input.OverheadRate; results["Overhead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Overhead"] = Number.NaN; }
  try { const v = (input.Direct + (toNumericFormulaValue(results["Overhead"]))) * input.RiskFactor; results["Contingency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Contingency"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["DirectLabor"])) + (toNumericFormulaValue(results["DirectMaterial"])) + (toNumericFormulaValue(results["Equipment"])) + (toNumericFormulaValue(results["Subcontractor"])) + (toNumericFormulaValue(results["Overhead"])) + (toNumericFormulaValue(results["Contingency"])); results["TotalEstimate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalEstimate"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TotalEstimate"])) - input.Budget; results["CostVariance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostVariance"] = Number.NaN; }
  return results;
}


export function calculateProject_maliyet_tahmin(input: Project_maliyet_tahminInput): Project_maliyet_tahminOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["CostVariance"]);
  const breakdown = {
    DirectLabor: toNumericFormulaValue(values["DirectLabor"]),
    DirectMaterial: toNumericFormulaValue(values["DirectMaterial"]),
    Equipment: toNumericFormulaValue(values["Equipment"]),
    Subcontractor: toNumericFormulaValue(values["Subcontractor"]),
    Overhead: toNumericFormulaValue(values["Overhead"]),
    Contingency: toNumericFormulaValue(values["Contingency"]),
    TotalEstimate: toNumericFormulaValue(values["TotalEstimate"]),
    CostVariance: toNumericFormulaValue(values["CostVariance"])
  };
  const hiddenLossDrivers: string[] = ["Verify assumptions with real data","Cross-check with industry benchmarks"];
  const suggestedActions: string[] = ["Run sensitivity analysis","Review assumptions with domain expert"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report","Action plan"],
  };
}


export interface Project_maliyet_tahminOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { DirectLabor: number; DirectMaterial: number; Equipment: number; Subcontractor: number; Overhead: number; Contingency: number; TotalEstimate: number; CostVariance: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Project_maliyet_tahminOutputMeta = {
  primaryKey: "CostVariance",
  unit: "USD",
  breakdownKeys: ["DirectLabor","DirectMaterial","Equipment","Subcontractor","Overhead","Contingency","TotalEstimate","CostVariance"],
} as const;

