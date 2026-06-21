// Auto-generated from kaynak-maliyeti-schema.json
import * as z from 'zod';

export interface Kaynak_maliyetiInput {
  ArcTime: number;
  TotalShiftTime: number;
  Weight_Deposited: number;
  Length: number;
  TravelSpeed: number;
  LaborRate: number;
  OverheadRate: number;
  FillerCost: number;
  GasCost: number;
  PowerCost: number;
  LaborCost: number;
  dataConfidence?: number;
}

export const Kaynak_maliyetiInputSchema = z.object({
  ArcTime: z.number().min(0).default(0),
  TotalShiftTime: z.number().min(0).default(0),
  Weight_Deposited: z.number().min(0).default(0),
  Length: z.number().min(0).default(0),
  TravelSpeed: z.number().min(0).default(0),
  LaborRate: z.number().min(0).default(0),
  OverheadRate: z.number().min(0).default(0),
  FillerCost: z.number().min(0).default(0),
  GasCost: z.number().min(0).default(0),
  PowerCost: z.number().min(0).default(0),
  LaborCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kaynak_maliyetiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ArcTime / input.TotalShiftTime; results["OperatingFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OperatingFactor"] = Number.NaN; }
  try { const v = input.Weight_Deposited / input.ArcTime; results["DepositionRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DepositionRate"] = Number.NaN; }
  try { const v = (input.Length / input.TravelSpeed) * (input.LaborRate + input.OverheadRate) / (toNumericFormulaValue(results["OperatingFactor"])) + input.FillerCost + input.GasCost + input.PowerCost; results["TotalJointCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalJointCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TotalJointCost"])) / input.Length; results["CostPerMeter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostPerMeter"] = Number.NaN; }
  try { const v = input.FillerCost / (toNumericFormulaValue(results["TotalJointCost"])); results["ConsumableCostPct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ConsumableCostPct"] = Number.NaN; }
  try { const v = input.LaborCost / (toNumericFormulaValue(results["TotalJointCost"])); results["LaborCostPct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LaborCostPct"] = Number.NaN; }
  return results;
}


export function calculateKaynak_maliyeti(input: Kaynak_maliyetiInput): Kaynak_maliyetiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["LaborCostPct"]);
  const breakdown = {
    OperatingFactor: toNumericFormulaValue(values["OperatingFactor"]),
    DepositionRate: toNumericFormulaValue(values["DepositionRate"]),
    TotalJointCost: toNumericFormulaValue(values["TotalJointCost"]),
    CostPerMeter: toNumericFormulaValue(values["CostPerMeter"]),
    ConsumableCostPct: toNumericFormulaValue(values["ConsumableCostPct"]),
    LaborCostPct: toNumericFormulaValue(values["LaborCostPct"])
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


export interface Kaynak_maliyetiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { OperatingFactor: number; DepositionRate: number; TotalJointCost: number; CostPerMeter: number; ConsumableCostPct: number; LaborCostPct: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kaynak_maliyetiOutputMeta = {
  primaryKey: "LaborCostPct",
  unit: "USD",
  breakdownKeys: ["OperatingFactor","DepositionRate","TotalJointCost","CostPerMeter","ConsumableCostPct","LaborCostPct"],
} as const;

