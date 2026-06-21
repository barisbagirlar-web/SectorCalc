// Auto-generated from temizlik-teklifi-optimize-edici-schema.json
import * as z from 'zod';

export interface Temizlik_teklifi_optimize_ediciInput {
  TotalSqM: number;
  CleanablePct: number;
  ProductionRatePerHour: number;
  HourlyWage: number;
  Burden: number;
  ConsumableCostPerSqM: number;
  MachineHours: number;
  DepreciationRate: number;
  OverheadPct: number;
  TargetMargin: number;
  dataConfidence?: number;
}

export const Temizlik_teklifi_optimize_ediciInputSchema = z.object({
  TotalSqM: z.number().min(0).default(0),
  CleanablePct: z.number().min(0).default(0),
  ProductionRatePerHour: z.number().min(0).default(0),
  HourlyWage: z.number().min(0).default(0),
  Burden: z.number().min(0).default(0),
  ConsumableCostPerSqM: z.number().min(0).default(0),
  MachineHours: z.number().min(0).default(0),
  DepreciationRate: z.number().min(0).default(0),
  OverheadPct: z.number().min(0).default(0),
  TargetMargin: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Temizlik_teklifi_optimize_ediciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.TotalSqM * input.CleanablePct; results["AreaToClean"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AreaToClean"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["AreaToClean"])) / input.ProductionRatePerHour; results["LaborHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LaborHours"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["LaborHours"])) * input.HourlyWage * (1 + input.Burden); results["LaborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LaborCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["AreaToClean"])) * input.ConsumableCostPerSqM; results["MaterialCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MaterialCost"] = Number.NaN; }
  try { const v = input.MachineHours * input.DepreciationRate; results["EquipmentCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EquipmentCost"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["LaborCost"])) + (toNumericFormulaValue(results["MaterialCost"]))) * input.OverheadPct; results["Overhead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Overhead"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["LaborCost"])) + (toNumericFormulaValue(results["MaterialCost"])) + (toNumericFormulaValue(results["EquipmentCost"])) + (toNumericFormulaValue(results["Overhead"]))) / (1 - input.TargetMargin); results["BidPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["BidPrice"] = Number.NaN; }
  return results;
}


export function calculateTemizlik_teklifi_optimize_edici(input: Temizlik_teklifi_optimize_ediciInput): Temizlik_teklifi_optimize_ediciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["BidPrice"]);
  const breakdown = {
    AreaToClean: toNumericFormulaValue(values["AreaToClean"]),
    LaborHours: toNumericFormulaValue(values["LaborHours"]),
    LaborCost: toNumericFormulaValue(values["LaborCost"]),
    MaterialCost: toNumericFormulaValue(values["MaterialCost"]),
    EquipmentCost: toNumericFormulaValue(values["EquipmentCost"]),
    Overhead: toNumericFormulaValue(values["Overhead"]),
    BidPrice: toNumericFormulaValue(values["BidPrice"])
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


export interface Temizlik_teklifi_optimize_ediciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { AreaToClean: number; LaborHours: number; LaborCost: number; MaterialCost: number; EquipmentCost: number; Overhead: number; BidPrice: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Temizlik_teklifi_optimize_ediciOutputMeta = {
  primaryKey: "BidPrice",
  unit: "USD",
  breakdownKeys: ["AreaToClean","LaborHours","LaborCost","MaterialCost","EquipmentCost","Overhead","BidPrice"],
} as const;

