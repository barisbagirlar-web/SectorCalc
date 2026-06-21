// Auto-generated from vsm-finansal-donusturucu-schema.json
import * as z from 'zod';

export interface Vsm_finansal_donusturucuInput {
  WIP_Inventory: number;
  DailyCarryingCost: number;
  TotalLeadTimeDays: number;
  ValueAddedTime: number;
  TotalLeadTime: number;
  CostPerMinute: number;
  OldWIP: number;
  NewWIP: number;
  CarryingRate: number;
  OldCycleTime: number;
  NewCycleTime: number;
  AnnualVolume: number;
  LaborRate: number;
  QualityImprovementSavings: number;
  dataConfidence?: number;
}

export const Vsm_finansal_donusturucuInputSchema = z.object({
  WIP_Inventory: z.number().min(0).default(0),
  DailyCarryingCost: z.number().min(0).default(0),
  TotalLeadTimeDays: z.number().min(0).default(0),
  ValueAddedTime: z.number().min(0).default(0),
  TotalLeadTime: z.number().min(0).default(0),
  CostPerMinute: z.number().min(0).default(0),
  OldWIP: z.number().min(0).default(0),
  NewWIP: z.number().min(0).default(0),
  CarryingRate: z.number().min(0).default(0),
  OldCycleTime: z.number().min(0).default(0),
  NewCycleTime: z.number().min(0).default(0),
  AnnualVolume: z.number().min(0).default(0),
  LaborRate: z.number().min(0).default(0),
  QualityImprovementSavings: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vsm_finansal_donusturucuInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.WIP_Inventory * input.DailyCarryingCost * input.TotalLeadTimeDays; results["LeadTimeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LeadTimeCost"] = Number.NaN; }
  try { const v = input.ValueAddedTime / input.TotalLeadTime; results["ValueAddedRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ValueAddedRatio"] = Number.NaN; }
  try { const v = (input.TotalLeadTime - input.ValueAddedTime) * input.CostPerMinute; results["NonValueAddedCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NonValueAddedCost"] = Number.NaN; }
  try { const v = (input.OldWIP - input.NewWIP) * input.CarryingRate; results["InventoryReductionSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["InventoryReductionSavings"] = Number.NaN; }
  try { const v = (input.OldCycleTime - input.NewCycleTime) * input.AnnualVolume * input.LaborRate; results["ProductivityGain"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ProductivityGain"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["InventoryReductionSavings"])) + (toNumericFormulaValue(results["ProductivityGain"])) + input.QualityImprovementSavings; results["TotalFinancialImpact"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalFinancialImpact"] = Number.NaN; }
  return results;
}


export function calculateVsm_finansal_donusturucu(input: Vsm_finansal_donusturucuInput): Vsm_finansal_donusturucuOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TotalFinancialImpact"]);
  const breakdown = {
    LeadTimeCost: toNumericFormulaValue(values["LeadTimeCost"]),
    ValueAddedRatio: toNumericFormulaValue(values["ValueAddedRatio"]),
    NonValueAddedCost: toNumericFormulaValue(values["NonValueAddedCost"]),
    InventoryReductionSavings: toNumericFormulaValue(values["InventoryReductionSavings"]),
    ProductivityGain: toNumericFormulaValue(values["ProductivityGain"]),
    TotalFinancialImpact: toNumericFormulaValue(values["TotalFinancialImpact"])
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


export interface Vsm_finansal_donusturucuOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { LeadTimeCost: number; ValueAddedRatio: number; NonValueAddedCost: number; InventoryReductionSavings: number; ProductivityGain: number; TotalFinancialImpact: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Vsm_finansal_donusturucuOutputMeta = {
  primaryKey: "TotalFinancialImpact",
  unit: "USD",
  breakdownKeys: ["LeadTimeCost","ValueAddedRatio","NonValueAddedCost","InventoryReductionSavings","ProductivityGain","TotalFinancialImpact"],
} as const;

