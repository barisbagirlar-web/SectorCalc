// Auto-generated from vardiya-maliyet-verimliligi-schema.json
import * as z from 'zod';

export interface Vardiya_maliyet_verimliligiInput {
  ShiftDuration: number;
  PlannedDowntime: number;
  UnplannedDowntime: number;
  Operators: number;
  ShiftHours: number;
  HourlyRate: number;
  MachinePower: number;
  ElecRate: number;
  GoodUnits: number;
  UnitContributionMargin: number;
  Overhead: number;
  dataConfidence?: number;
}

export const Vardiya_maliyet_verimliligiInputSchema = z.object({
  ShiftDuration: z.number().min(0).default(0),
  PlannedDowntime: z.number().min(0).default(0),
  UnplannedDowntime: z.number().min(0).default(0),
  Operators: z.number().min(0).default(0),
  ShiftHours: z.number().min(0).default(0),
  HourlyRate: z.number().min(0).default(0),
  MachinePower: z.number().min(0).default(0),
  ElecRate: z.number().min(0).default(0),
  GoodUnits: z.number().min(0).default(0),
  UnitContributionMargin: z.number().min(0).default(0),
  Overhead: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vardiya_maliyet_verimliligiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ShiftDuration - input.PlannedDowntime; results["PlannedProductionTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PlannedProductionTime"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["PlannedProductionTime"])) - input.UnplannedDowntime; results["ActualRunTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ActualRunTime"] = Number.NaN; }
  try { const v = input.Operators * input.ShiftHours * input.HourlyRate; results["LaborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LaborCost"] = Number.NaN; }
  try { const v = input.MachinePower * (toNumericFormulaValue(results["ActualRunTime"])) * input.ElecRate; results["EnergyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EnergyCost"] = Number.NaN; }
  try { const v = input.GoodUnits * input.UnitContributionMargin; results["OutputValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OutputValue"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["OutputValue"])) / ((toNumericFormulaValue(results["LaborCost"])) + (toNumericFormulaValue(results["EnergyCost"])) + input.Overhead); results["ShiftEfficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ShiftEfficiency"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["LaborCost"])) + (toNumericFormulaValue(results["EnergyCost"])) + input.Overhead) / input.GoodUnits; results["CostPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostPerUnit"] = Number.NaN; }
  return results;
}


export function calculateVardiya_maliyet_verimliligi(input: Vardiya_maliyet_verimliligiInput): Vardiya_maliyet_verimliligiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["CostPerUnit"]);
  const breakdown = {
    PlannedProductionTime: toNumericFormulaValue(values["PlannedProductionTime"]),
    ActualRunTime: toNumericFormulaValue(values["ActualRunTime"]),
    LaborCost: toNumericFormulaValue(values["LaborCost"]),
    EnergyCost: toNumericFormulaValue(values["EnergyCost"]),
    OutputValue: toNumericFormulaValue(values["OutputValue"]),
    ShiftEfficiency: toNumericFormulaValue(values["ShiftEfficiency"]),
    CostPerUnit: toNumericFormulaValue(values["CostPerUnit"])
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


export interface Vardiya_maliyet_verimliligiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { PlannedProductionTime: number; ActualRunTime: number; LaborCost: number; EnergyCost: number; OutputValue: number; ShiftEfficiency: number; CostPerUnit: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Vardiya_maliyet_verimliligiOutputMeta = {
  primaryKey: "CostPerUnit",
  unit: "USD",
  breakdownKeys: ["PlannedProductionTime","ActualRunTime","LaborCost","EnergyCost","OutputValue","ShiftEfficiency","CostPerUnit"],
} as const;

