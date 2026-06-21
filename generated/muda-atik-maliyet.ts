// Auto-generated from muda-atik-maliyet-schema.json
import * as z from 'zod';

export interface Muda_atik_maliyetInput {
  ExcessUnits: number;
  UnitCost: number;
  WaitingHours: number;
  LaborRate: number;
  MachineRate: number;
  TransportDistance: number;
  CostPerMeter: number;
  Trips: number;
  ActualTime: number;
  StandardTime: number;
  ExcessInventory: number;
  HoldingCostRate: number;
  UnnecessaryMotionTime: number;
  DefectUnits: number;
  MaterialCost: number;
  ReworkCost: number;
  dataConfidence?: number;
}

export const Muda_atik_maliyetInputSchema = z.object({
  ExcessUnits: z.number().min(0).default(0),
  UnitCost: z.number().min(0).default(0),
  WaitingHours: z.number().min(0).default(0),
  LaborRate: z.number().min(0).default(0),
  MachineRate: z.number().min(0).default(0),
  TransportDistance: z.number().min(0).default(0),
  CostPerMeter: z.number().min(0).default(0),
  Trips: z.number().min(0).default(0),
  ActualTime: z.number().min(0).default(0),
  StandardTime: z.number().min(0).default(0),
  ExcessInventory: z.number().min(0).default(0),
  HoldingCostRate: z.number().min(0).default(0),
  UnnecessaryMotionTime: z.number().min(0).default(0),
  DefectUnits: z.number().min(0).default(0),
  MaterialCost: z.number().min(0).default(0),
  ReworkCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Muda_atik_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ExcessUnits * input.UnitCost; results["Overproduction"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Overproduction"] = Number.NaN; }
  try { const v = input.WaitingHours * (input.LaborRate + input.MachineRate); results["Waiting"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Waiting"] = Number.NaN; }
  try { const v = input.TransportDistance * input.CostPerMeter * input.Trips; results["Transport"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Transport"] = Number.NaN; }
  try { const v = (input.ActualTime - input.StandardTime) * input.LaborRate; results["Overprocessing"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Overprocessing"] = Number.NaN; }
  results["Inventory"] = Number.NaN;
  try { const v = input.UnnecessaryMotionTime * input.LaborRate; results["Motion"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Motion"] = Number.NaN; }
  try { const v = input.DefectUnits * (input.MaterialCost + input.ReworkCost); results["Defects"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Defects"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Overproduction"])) + (toNumericFormulaValue(results["Waiting"])) + (toNumericFormulaValue(results["Transport"])) + (toNumericFormulaValue(results["Overprocessing"])) + (toNumericFormulaValue(results["Inventory"])) + (toNumericFormulaValue(results["Motion"])) + (toNumericFormulaValue(results["Defects"])); results["TotalMudaCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalMudaCost"] = Number.NaN; }
  return results;
}


export function calculateMuda_atik_maliyet(input: Muda_atik_maliyetInput): Muda_atik_maliyetOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TotalMudaCost"]);
  const breakdown = {
    Overproduction: toNumericFormulaValue(values["Overproduction"]),
    Waiting: toNumericFormulaValue(values["Waiting"]),
    Transport: toNumericFormulaValue(values["Transport"]),
    Overprocessing: toNumericFormulaValue(values["Overprocessing"]),
    Inventory: toNumericFormulaValue(values["Inventory"]),
    Motion: toNumericFormulaValue(values["Motion"]),
    Defects: toNumericFormulaValue(values["Defects"]),
    TotalMudaCost: toNumericFormulaValue(values["TotalMudaCost"])
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


export interface Muda_atik_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Overproduction: number; Waiting: number; Transport: number; Overprocessing: number; Inventory: number; Motion: number; Defects: number; TotalMudaCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Muda_atik_maliyetOutputMeta = {
  primaryKey: "TotalMudaCost",
  unit: "USD",
  breakdownKeys: ["Overproduction","Waiting","Transport","Overprocessing","Inventory","Motion","Defects","TotalMudaCost"],
} as const;

