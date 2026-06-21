// Auto-generated from recete-maliyet-check-schema.json
import * as z from 'zod';

export interface Recete_maliyet_checkInput {
  FormulationPct_i: number;
  IngredientPrice_i: number;
  TotalMaterialConsumed: number;
  AvgPrice: number;
  TotalOutput: number;
  ActualYield: number;
  InputWeight: number;
  OutputWeight: number;
  KnownScrap: number;
  ActualOutput: number;
  TheoreticalOutput: number;
  dataConfidence?: number;
}

export const Recete_maliyet_checkInputSchema = z.object({
  FormulationPct_i: z.number().min(0).default(0),
  IngredientPrice_i: z.number().min(0).default(0),
  TotalMaterialConsumed: z.number().min(0).default(0),
  AvgPrice: z.number().min(0).default(0),
  TotalOutput: z.number().min(0).default(0),
  ActualYield: z.number().min(0).default(0),
  InputWeight: z.number().min(0).default(0),
  OutputWeight: z.number().min(0).default(0),
  KnownScrap: z.number().min(0).default(0),
  ActualOutput: z.number().min(0).default(0),
  TheoreticalOutput: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Recete_maliyet_checkInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["TheoreticalCost"] = Number.NaN;
  try { const v = input.TotalMaterialConsumed * input.AvgPrice / input.TotalOutput; results["ActualCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ActualCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ActualCost"])) - (toNumericFormulaValue(results["TheoreticalCost"])); results["Variance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Variance"] = Number.NaN; }
  try { const v = (1 - input.ActualYield) * (toNumericFormulaValue(results["TheoreticalCost"])); results["YieldLossCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["YieldLossCost"] = Number.NaN; }
  try { const v = input.InputWeight - input.OutputWeight - input.KnownScrap; results["EvaporationLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EvaporationLoss"] = Number.NaN; }
  try { const v = input.ActualOutput / input.TheoreticalOutput; results["Efficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Efficiency"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ActualCost"])) / input.OutputWeight; results["CostPerKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostPerKg"] = Number.NaN; }
  return results;
}


export function calculateRecete_maliyet_check(input: Recete_maliyet_checkInput): Recete_maliyet_checkOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["CostPerKg"]);
  const breakdown = {
    TheoreticalCost: toNumericFormulaValue(values["TheoreticalCost"]),
    ActualCost: toNumericFormulaValue(values["ActualCost"]),
    Variance: toNumericFormulaValue(values["Variance"]),
    YieldLossCost: toNumericFormulaValue(values["YieldLossCost"]),
    EvaporationLoss: toNumericFormulaValue(values["EvaporationLoss"]),
    Efficiency: toNumericFormulaValue(values["Efficiency"]),
    CostPerKg: toNumericFormulaValue(values["CostPerKg"])
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


export interface Recete_maliyet_checkOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { TheoreticalCost: number; ActualCost: number; Variance: number; YieldLossCost: number; EvaporationLoss: number; Efficiency: number; CostPerKg: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Recete_maliyet_checkOutputMeta = {
  primaryKey: "CostPerKg",
  unit: "USD",
  breakdownKeys: ["TheoreticalCost","ActualCost","Variance","YieldLossCost","EvaporationLoss","Efficiency","CostPerKg"],
} as const;

