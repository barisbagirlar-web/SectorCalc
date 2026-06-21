// Auto-generated from magaza-saatlik-ucret-schema.json
import * as z from 'zod';

export interface Magaza_saatlik_ucretInput {
  TechnicianWages: number;
  ManagerWages: number;
  AdminWages: number;
  Rent: number;
  Utilities: number;
  Insurance: number;
  Tools: number;
  Depreciation: number;
  TotalAvailableHours: number;
  UtilizationRate: number;
  ActualBillingRate: number;
  dataConfidence?: number;
}

export const Magaza_saatlik_ucretInputSchema = z.object({
  TechnicianWages: z.number().min(0).default(0),
  ManagerWages: z.number().min(0).default(0),
  AdminWages: z.number().min(0).default(0),
  Rent: z.number().min(0).default(0),
  Utilities: z.number().min(0).default(0),
  Insurance: z.number().min(0).default(0),
  Tools: z.number().min(0).default(0),
  Depreciation: z.number().min(0).default(0),
  TotalAvailableHours: z.number().min(0).default(0),
  UtilizationRate: z.number().min(0).default(0),
  ActualBillingRate: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Magaza_saatlik_ucretInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["DirectLabor"] = Number.NaN;
  results["IndirectLabor"] = Number.NaN;
  try { const v = input.Rent + input.Utilities + input.Insurance + input.Tools + input.Depreciation; results["Overhead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Overhead"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["DirectLabor"])) + (toNumericFormulaValue(results["IndirectLabor"])) + (toNumericFormulaValue(results["Overhead"])); results["TotalShopCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalShopCost"] = Number.NaN; }
  try { const v = input.TotalAvailableHours * input.UtilizationRate; results["BillableHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["BillableHours"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TotalShopCost"])) / (toNumericFormulaValue(results["BillableHours"])); results["ShopHourlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ShopHourlyRate"] = Number.NaN; }
  try { const v = (input.ActualBillingRate - (toNumericFormulaValue(results["ShopHourlyRate"]))) / input.ActualBillingRate; results["EffectiveMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EffectiveMargin"] = Number.NaN; }
  return results;
}


export function calculateMagaza_saatlik_ucret(input: Magaza_saatlik_ucretInput): Magaza_saatlik_ucretOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["EffectiveMargin"]);
  const breakdown = {
    DirectLabor: toNumericFormulaValue(values["DirectLabor"]),
    IndirectLabor: toNumericFormulaValue(values["IndirectLabor"]),
    Overhead: toNumericFormulaValue(values["Overhead"]),
    TotalShopCost: toNumericFormulaValue(values["TotalShopCost"]),
    BillableHours: toNumericFormulaValue(values["BillableHours"]),
    ShopHourlyRate: toNumericFormulaValue(values["ShopHourlyRate"]),
    EffectiveMargin: toNumericFormulaValue(values["EffectiveMargin"])
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


export interface Magaza_saatlik_ucretOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { DirectLabor: number; IndirectLabor: number; Overhead: number; TotalShopCost: number; BillableHours: number; ShopHourlyRate: number; EffectiveMargin: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Magaza_saatlik_ucretOutputMeta = {
  primaryKey: "EffectiveMargin",
  unit: "USD",
  breakdownKeys: ["DirectLabor","IndirectLabor","Overhead","TotalShopCost","BillableHours","ShopHourlyRate","EffectiveMargin"],
} as const;

