// Auto-generated from sut-kr-dedektoru-schema.json
import * as z from 'zod';

export interface Sut_kr_dedektoruInput {
  MilkYield: number;
  FatYield: number;
  ProteinYield: number;
  TotalFeedCost: number;
  MilkPrice: number;
  VetCost: number;
  BreedingCost: number;
  LaborCost: number;
  FixedOverhead: number;
  SCC: number;
  Threshold: number;
  PenaltyRate: number;
  dataConfidence?: number;
}

export const Sut_kr_dedektoruInputSchema = z.object({
  MilkYield: z.number().min(0).default(0),
  FatYield: z.number().min(0).default(0),
  ProteinYield: z.number().min(0).default(0),
  TotalFeedCost: z.number().min(0).default(0),
  MilkPrice: z.number().min(0).default(0),
  VetCost: z.number().min(0).default(0),
  BreedingCost: z.number().min(0).default(0),
  LaborCost: z.number().min(0).default(0),
  FixedOverhead: z.number().min(0).default(0),
  SCC: z.number().min(0).default(0),
  Threshold: z.number().min(0).default(0),
  PenaltyRate: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sut_kr_dedektoruInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (0.4 * input.MilkYield) + (15 * input.FatYield); results["FatCorrectedMilk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FatCorrectedMilk"] = Number.NaN; }
  try { const v = (0.337 * input.MilkYield) + (11.6 * input.ProteinYield); results["ProteinCorrectedMilk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ProteinCorrectedMilk"] = Number.NaN; }
  try { const v = input.TotalFeedCost / input.MilkYield; results["FeedCostPerLiter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FeedCostPerLiter"] = Number.NaN; }
  try { const v = (input.MilkPrice * input.MilkYield) - input.TotalFeedCost; results["IncomeOverFeedCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["IncomeOverFeedCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["IncomeOverFeedCost"])) - (input.VetCost + input.BreedingCost + input.LaborCost); results["MarginPerCow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MarginPerCow"] = Number.NaN; }
  results["HerdProfitability"] = Number.NaN;
  try { const v = ((input.SCC > input.Threshold) ? (input.MilkYield * input.PenaltyRate) : (0)); results["SomaticCellPenalty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SomaticCellPenalty"] = Number.NaN; }
  return results;
}


export function calculateSut_kr_dedektoru(input: Sut_kr_dedektoruInput): Sut_kr_dedektoruOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["SomaticCellPenalty"]);
  const breakdown = {
    FatCorrectedMilk: toNumericFormulaValue(values["FatCorrectedMilk"]),
    ProteinCorrectedMilk: toNumericFormulaValue(values["ProteinCorrectedMilk"]),
    FeedCostPerLiter: toNumericFormulaValue(values["FeedCostPerLiter"]),
    IncomeOverFeedCost: toNumericFormulaValue(values["IncomeOverFeedCost"]),
    MarginPerCow: toNumericFormulaValue(values["MarginPerCow"]),
    HerdProfitability: toNumericFormulaValue(values["HerdProfitability"]),
    SomaticCellPenalty: toNumericFormulaValue(values["SomaticCellPenalty"])
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


export interface Sut_kr_dedektoruOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { FatCorrectedMilk: number; ProteinCorrectedMilk: number; FeedCostPerLiter: number; IncomeOverFeedCost: number; MarginPerCow: number; HerdProfitability: number; SomaticCellPenalty: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sut_kr_dedektoruOutputMeta = {
  primaryKey: "SomaticCellPenalty",
  unit: "USD",
  breakdownKeys: ["FatCorrectedMilk","ProteinCorrectedMilk","FeedCostPerLiter","IncomeOverFeedCost","MarginPerCow","HerdProfitability","SomaticCellPenalty"],
} as const;

