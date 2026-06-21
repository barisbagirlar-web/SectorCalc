// Auto-generated from tamirhane-parca-ve-iscilik-teklif-schema.json
import * as z from 'zod';

export interface Tamirhane_parca_ve_iscilik_teklifInput {
  Quantity_i: number;
  DealerPrice_i: number;
  PartMarkupPct: number;
  FlatRateHours: number;
  ShopHourlyRate: number;
  SubletInvoices: number;
  ShopSuppliesFee: number;
  EnvironmentalFee: number;
  ActualHours: number;
  ActualLaborCost: number;
  dataConfidence?: number;
}

export const Tamirhane_parca_ve_iscilik_teklifInputSchema = z.object({
  Quantity_i: z.number().min(0).default(0),
  DealerPrice_i: z.number().min(0).default(0),
  PartMarkupPct: z.number().min(0).default(0),
  FlatRateHours: z.number().min(0).default(0),
  ShopHourlyRate: z.number().min(0).default(0),
  SubletInvoices: z.number().min(0).default(0),
  ShopSuppliesFee: z.number().min(0).default(0),
  EnvironmentalFee: z.number().min(0).default(0),
  ActualHours: z.number().min(0).default(0),
  ActualLaborCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tamirhane_parca_ve_iscilik_teklifInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["PartCost"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["PartCost"])) * input.PartMarkupPct; results["PartMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PartMargin"] = Number.NaN; }
  try { const v = input.FlatRateHours * input.ShopHourlyRate; results["LaborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LaborCost"] = Number.NaN; }
  results["SubletCost"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["PartCost"])) + (toNumericFormulaValue(results["PartMargin"])) + (toNumericFormulaValue(results["LaborCost"])) + (toNumericFormulaValue(results["SubletCost"])) + input.ShopSuppliesFee + input.EnvironmentalFee; results["TotalQuote"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalQuote"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["LaborCost"])) + (toNumericFormulaValue(results["PartMargin"]))) / input.ActualHours; results["EffectiveLaborRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EffectiveLaborRate"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["TotalQuote"])) - (toNumericFormulaValue(results["PartCost"])) - input.ActualLaborCost) / (toNumericFormulaValue(results["TotalQuote"])); results["GrossProfitPct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["GrossProfitPct"] = Number.NaN; }
  return results;
}


export function calculateTamirhane_parca_ve_iscilik_teklif(input: Tamirhane_parca_ve_iscilik_teklifInput): Tamirhane_parca_ve_iscilik_teklifOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["GrossProfitPct"]);
  const breakdown = {
    PartCost: toNumericFormulaValue(values["PartCost"]),
    PartMargin: toNumericFormulaValue(values["PartMargin"]),
    LaborCost: toNumericFormulaValue(values["LaborCost"]),
    SubletCost: toNumericFormulaValue(values["SubletCost"]),
    TotalQuote: toNumericFormulaValue(values["TotalQuote"]),
    EffectiveLaborRate: toNumericFormulaValue(values["EffectiveLaborRate"]),
    GrossProfitPct: toNumericFormulaValue(values["GrossProfitPct"])
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


export interface Tamirhane_parca_ve_iscilik_teklifOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { PartCost: number; PartMargin: number; LaborCost: number; SubletCost: number; TotalQuote: number; EffectiveLaborRate: number; GrossProfitPct: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Tamirhane_parca_ve_iscilik_teklifOutputMeta = {
  primaryKey: "GrossProfitPct",
  unit: "USD",
  breakdownKeys: ["PartCost","PartMargin","LaborCost","SubletCost","TotalQuote","EffectiveLaborRate","GrossProfitPct"],
} as const;

