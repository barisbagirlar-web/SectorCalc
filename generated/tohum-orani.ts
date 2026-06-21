// Auto-generated from tohum-orani-schema.json
import * as z from 'zod';

export interface Tohum_oraniInput {
  Area: number;
  DesiredPlantsPerSqm: number;
  GerminationRate: number;
  FieldEmergenceRate: number;
  PricePerKg: number;
  PlantPopulation: number;
  SoilFertility: number;
  Water: number;
  TargetYield: number;
  ActualYield: number;
  CropPrice: number;
  ActualSeed: number;
  OptimalSeed: number;
  dataConfidence?: number;
}

export const Tohum_oraniInputSchema = z.object({
  Area: z.number().min(0).default(0),
  DesiredPlantsPerSqm: z.number().min(0).default(0),
  GerminationRate: z.number().min(0).default(0),
  FieldEmergenceRate: z.number().min(0).default(0),
  PricePerKg: z.number().min(0).default(0),
  PlantPopulation: z.number().min(0).default(0),
  SoilFertility: z.number().min(0).default(0),
  Water: z.number().min(0).default(0),
  TargetYield: z.number().min(0).default(0),
  ActualYield: z.number().min(0).default(0),
  CropPrice: z.number().min(0).default(0),
  ActualSeed: z.number().min(0).default(0),
  OptimalSeed: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tohum_oraniInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Area * input.DesiredPlantsPerSqm; results["TargetPlantPopulation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TargetPlantPopulation"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TargetPlantPopulation"])) / (input.GerminationRate * input.FieldEmergenceRate); results["SeedRequirement"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SeedRequirement"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["SeedRequirement"])) * input.PricePerKg; results["SeedCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SeedCost"] = Number.NaN; }
  results["OptimalYield"] = Number.NaN;
  try { const v = (input.TargetYield - input.ActualYield) * input.CropPrice; results["FinancialLoss_Under"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FinancialLoss_Under"] = Number.NaN; }
  try { const v = (input.ActualSeed - input.OptimalSeed) * (toNumericFormulaValue(results["SeedCost"])); results["FinancialLoss_Over"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FinancialLoss_Over"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["OptimalYield"])) * input.CropPrice - (toNumericFormulaValue(results["SeedCost"]))) / (toNumericFormulaValue(results["SeedCost"])); results["ROI_Seed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ROI_Seed"] = Number.NaN; }
  return results;
}


export function calculateTohum_orani(input: Tohum_oraniInput): Tohum_oraniOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ROI_Seed"]);
  const breakdown = {
    TargetPlantPopulation: toNumericFormulaValue(values["TargetPlantPopulation"]),
    SeedRequirement: toNumericFormulaValue(values["SeedRequirement"]),
    SeedCost: toNumericFormulaValue(values["SeedCost"]),
    OptimalYield: toNumericFormulaValue(values["OptimalYield"]),
    FinancialLoss_Under: toNumericFormulaValue(values["FinancialLoss_Under"]),
    FinancialLoss_Over: toNumericFormulaValue(values["FinancialLoss_Over"]),
    ROI_Seed: toNumericFormulaValue(values["ROI_Seed"])
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


export interface Tohum_oraniOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { TargetPlantPopulation: number; SeedRequirement: number; SeedCost: number; OptimalYield: number; FinancialLoss_Under: number; FinancialLoss_Over: number; ROI_Seed: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Tohum_oraniOutputMeta = {
  primaryKey: "ROI_Seed",
  unit: "USD",
  breakdownKeys: ["TargetPlantPopulation","SeedRequirement","SeedCost","OptimalYield","FinancialLoss_Under","FinancialLoss_Over","ROI_Seed"],
} as const;

