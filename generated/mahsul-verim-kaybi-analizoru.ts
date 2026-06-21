// Auto-generated from mahsul-verim-kaybi-analizoru-schema.json
import * as z from 'zod';

export interface Mahsul_verim_kaybi_analizoruInput {
  GeneticPotential: number;
  EnvironmentFactor: number;
  HarvestedWeight: number;
  Area: number;
  PestDamagePct: number;
  WeatherStressPct: number;
  NutrientDeficiencyPct: number;
  MarketPrice: number;
  FinancialLoss_Recovered: number;
  InterventionCost: number;
  dataConfidence?: number;
}

export const Mahsul_verim_kaybi_analizoruInputSchema = z.object({
  GeneticPotential: z.number().min(0).default(0),
  EnvironmentFactor: z.number().min(0).default(0),
  HarvestedWeight: z.number().min(0).default(0),
  Area: z.number().min(0).default(0),
  PestDamagePct: z.number().min(0).default(0),
  WeatherStressPct: z.number().min(0).default(0),
  NutrientDeficiencyPct: z.number().min(0).default(0),
  MarketPrice: z.number().min(0).default(0),
  FinancialLoss_Recovered: z.number().min(0).default(0),
  InterventionCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mahsul_verim_kaybi_analizoruInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.GeneticPotential * input.EnvironmentFactor; results["PotentialYield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PotentialYield"] = Number.NaN; }
  try { const v = input.HarvestedWeight / input.Area; results["ActualYield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ActualYield"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["PotentialYield"])) - (toNumericFormulaValue(results["ActualYield"])); results["YieldGap"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["YieldGap"] = Number.NaN; }
  try { const v = input.PestDamagePct * (toNumericFormulaValue(results["PotentialYield"])); results["Loss_Pest"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Loss_Pest"] = Number.NaN; }
  try { const v = input.WeatherStressPct * (toNumericFormulaValue(results["PotentialYield"])); results["Loss_Weather"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Loss_Weather"] = Number.NaN; }
  try { const v = input.NutrientDeficiencyPct * (toNumericFormulaValue(results["PotentialYield"])); results["Loss_Nutrient"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Loss_Nutrient"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["YieldGap"])) * input.MarketPrice; results["FinancialLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FinancialLoss"] = Number.NaN; }
  try { const v = (input.FinancialLoss_Recovered - input.InterventionCost) / input.InterventionCost; results["ROI_Intervention"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ROI_Intervention"] = Number.NaN; }
  return results;
}


export function calculateMahsul_verim_kaybi_analizoru(input: Mahsul_verim_kaybi_analizoruInput): Mahsul_verim_kaybi_analizoruOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ROI_Intervention"]);
  const breakdown = {
    PotentialYield: toNumericFormulaValue(values["PotentialYield"]),
    ActualYield: toNumericFormulaValue(values["ActualYield"]),
    YieldGap: toNumericFormulaValue(values["YieldGap"]),
    Loss_Pest: toNumericFormulaValue(values["Loss_Pest"]),
    Loss_Weather: toNumericFormulaValue(values["Loss_Weather"]),
    Loss_Nutrient: toNumericFormulaValue(values["Loss_Nutrient"]),
    FinancialLoss: toNumericFormulaValue(values["FinancialLoss"]),
    ROI_Intervention: toNumericFormulaValue(values["ROI_Intervention"])
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


export interface Mahsul_verim_kaybi_analizoruOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { PotentialYield: number; ActualYield: number; YieldGap: number; Loss_Pest: number; Loss_Weather: number; Loss_Nutrient: number; FinancialLoss: number; ROI_Intervention: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Mahsul_verim_kaybi_analizoruOutputMeta = {
  primaryKey: "ROI_Intervention",
  unit: "USD",
  breakdownKeys: ["PotentialYield","ActualYield","YieldGap","Loss_Pest","Loss_Weather","Loss_Nutrient","FinancialLoss","ROI_Intervention"],
} as const;

