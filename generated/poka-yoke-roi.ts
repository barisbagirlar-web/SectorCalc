// Auto-generated from poka-yoke-roi-schema.json
import * as z from 'zod';

export interface Poka_yoke_roiInput {
  Defects: number;
  TotalUnits: number;
  CostPerDefect: number;
  Design: number;
  Implementation: number;
  Training: number;
  Maintenance: number;
  Effectiveness: number;
  dataConfidence?: number;
}

export const Poka_yoke_roiInputSchema = z.object({
  Defects: z.number().min(0).default(0),
  TotalUnits: z.number().min(0).default(0),
  CostPerDefect: z.number().min(0).default(0),
  Design: z.number().min(0).default(0),
  Implementation: z.number().min(0).default(0),
  Training: z.number().min(0).default(0),
  Maintenance: z.number().min(0).default(0),
  Effectiveness: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Poka_yoke_roiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Defects / input.TotalUnits; results["CurrentDefectRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CurrentDefectRate"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["CurrentDefectRate"])) * input.TotalUnits * input.CostPerDefect; results["DefectCost_Annual"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DefectCost_Annual"] = Number.NaN; }
  try { const v = input.Design + input.Implementation + input.Training + input.Maintenance; results["PokaYoke_Cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PokaYoke_Cost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["CurrentDefectRate"])) * (1 - input.Effectiveness); results["NewDefectRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NewDefectRate"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["CurrentDefectRate"])) - (toNumericFormulaValue(results["NewDefectRate"]))) * input.TotalUnits * input.CostPerDefect; results["Savings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Savings"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["Savings"])) - (toNumericFormulaValue(results["PokaYoke_Cost"]))) / (toNumericFormulaValue(results["PokaYoke_Cost"])); results["ROI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ROI"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["PokaYoke_Cost"])) / ((toNumericFormulaValue(results["Savings"])) / 12); results["PaybackMonths"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PaybackMonths"] = Number.NaN; }
  return results;
}


export function calculatePoka_yoke_roi(input: Poka_yoke_roiInput): Poka_yoke_roiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["PaybackMonths"]);
  const breakdown = {
    CurrentDefectRate: toNumericFormulaValue(values["CurrentDefectRate"]),
    DefectCost_Annual: toNumericFormulaValue(values["DefectCost_Annual"]),
    PokaYoke_Cost: toNumericFormulaValue(values["PokaYoke_Cost"]),
    NewDefectRate: toNumericFormulaValue(values["NewDefectRate"]),
    Savings: toNumericFormulaValue(values["Savings"]),
    ROI: toNumericFormulaValue(values["ROI"]),
    PaybackMonths: toNumericFormulaValue(values["PaybackMonths"])
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


export interface Poka_yoke_roiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { CurrentDefectRate: number; DefectCost_Annual: number; PokaYoke_Cost: number; NewDefectRate: number; Savings: number; ROI: number; PaybackMonths: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Poka_yoke_roiOutputMeta = {
  primaryKey: "PaybackMonths",
  unit: "USD",
  breakdownKeys: ["CurrentDefectRate","DefectCost_Annual","PokaYoke_Cost","NewDefectRate","Savings","ROI","PaybackMonths"],
} as const;

