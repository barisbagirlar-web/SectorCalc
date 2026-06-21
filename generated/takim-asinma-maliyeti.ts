// Auto-generated from takim-asinma-maliyeti-schema.json
import * as z from 'zod';

export interface Takim_asinma_maliyetiInput {
  InsertCost: number;
  Edges: number;
  MachiningTime: number;
  ToolLife: number;
  ToolChangeTime: number;
  MachineRate: number;
  FlankWear: number;
  n: number;
  ExpectedLife: number;
  ActualLife: number;
  dataConfidence?: number;
}

export const Takim_asinma_maliyetiInputSchema = z.object({
  InsertCost: z.number().min(0).default(0),
  Edges: z.number().min(0).default(0),
  MachiningTime: z.number().min(0).default(0),
  ToolLife: z.number().min(0).default(0),
  ToolChangeTime: z.number().min(0).default(0),
  MachineRate: z.number().min(0).default(0),
  FlankWear: z.number().min(0).default(0),
  n: z.number().min(0).default(0),
  ExpectedLife: z.number().min(0).default(0),
  ActualLife: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Takim_asinma_maliyetiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.InsertCost / input.Edges) * (input.MachiningTime / input.ToolLife); results["ToolCostPerPart"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ToolCostPerPart"] = Number.NaN; }
  try { const v = (input.ToolChangeTime * input.MachineRate) * (input.MachiningTime / input.ToolLife); results["ChangeCostPerPart"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ChangeCostPerPart"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ToolCostPerPart"])) + (toNumericFormulaValue(results["ChangeCostPerPart"])); results["TotalToolingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalToolingCost"] = Number.NaN; }
  try { const v = input.FlankWear / input.MachiningTime; results["WearRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["WearRate"] = Number.NaN; }
  try { const v = ((1/input.n - 1) * (input.ToolChangeTime + input.InsertCost/input.Edges / input.MachineRate)); results["OptimalToolLife"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OptimalToolLife"] = Number.NaN; }
  try { const v = (input.ExpectedLife - input.ActualLife) / input.ExpectedLife * input.InsertCost; results["CostOfPrematureFailure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostOfPrematureFailure"] = Number.NaN; }
  return results;
}


export function calculateTakim_asinma_maliyeti(input: Takim_asinma_maliyetiInput): Takim_asinma_maliyetiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["CostOfPrematureFailure"]);
  const breakdown = {
    ToolCostPerPart: toNumericFormulaValue(values["ToolCostPerPart"]),
    ChangeCostPerPart: toNumericFormulaValue(values["ChangeCostPerPart"]),
    TotalToolingCost: toNumericFormulaValue(values["TotalToolingCost"]),
    WearRate: toNumericFormulaValue(values["WearRate"]),
    OptimalToolLife: toNumericFormulaValue(values["OptimalToolLife"]),
    CostOfPrematureFailure: toNumericFormulaValue(values["CostOfPrematureFailure"])
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


export interface Takim_asinma_maliyetiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { ToolCostPerPart: number; ChangeCostPerPart: number; TotalToolingCost: number; WearRate: number; OptimalToolLife: number; CostOfPrematureFailure: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Takim_asinma_maliyetiOutputMeta = {
  primaryKey: "CostOfPrematureFailure",
  unit: "USD",
  breakdownKeys: ["ToolCostPerPart","ChangeCostPerPart","TotalToolingCost","WearRate","OptimalToolLife","CostOfPrematureFailure"],
} as const;

