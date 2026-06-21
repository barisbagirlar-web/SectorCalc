// Auto-generated from urun-complexity-hidden-maliyet-schema.json
import * as z from 'zod';

export interface Urun_complexity_hidden_maliyetInput {
  NumberOfSKUs: number;
  AverageBOMDepth: number;
  Changeovers: number;
  SetupCostPerChange: number;
  SafetyStock_AllSKUs: number;
  HoldingRate: number;
  TotalIndirectCosts: number;
  ComplexityDriverPct: number;
  TraditionalOverhead: number;
  Revenue_SKU: number;
  DirectCost_SKU: number;
  HiddenCost_SKU: number;
  dataConfidence?: number;
}

export const Urun_complexity_hidden_maliyetInputSchema = z.object({
  NumberOfSKUs: z.number().min(0).default(0),
  AverageBOMDepth: z.number().min(0).default(0),
  Changeovers: z.number().min(0).default(0),
  SetupCostPerChange: z.number().min(0).default(0),
  SafetyStock_AllSKUs: z.number().min(0).default(0),
  HoldingRate: z.number().min(0).default(0),
  TotalIndirectCosts: z.number().min(0).default(0),
  ComplexityDriverPct: z.number().min(0).default(0),
  TraditionalOverhead: z.number().min(0).default(0),
  Revenue_SKU: z.number().min(0).default(0),
  DirectCost_SKU: z.number().min(0).default(0),
  HiddenCost_SKU: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Urun_complexity_hidden_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.NumberOfSKUs * input.AverageBOMDepth; results["ComplexityIndex"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ComplexityIndex"] = Number.NaN; }
  try { const v = input.Changeovers * input.SetupCostPerChange; results["SetupCostComplexity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SetupCostComplexity"] = Number.NaN; }
  try { const v = input.SafetyStock_AllSKUs * input.HoldingRate; results["InventoryCostComplexity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["InventoryCostComplexity"] = Number.NaN; }
  try { const v = input.TotalIndirectCosts * input.ComplexityDriverPct; results["OverheadAllocation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OverheadAllocation"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["SetupCostComplexity"])) + (toNumericFormulaValue(results["InventoryCostComplexity"])) + ((toNumericFormulaValue(results["OverheadAllocation"])) - input.TraditionalOverhead); results["HiddenCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["HiddenCost"] = Number.NaN; }
  try { const v = (input.Revenue_SKU - input.DirectCost_SKU - input.HiddenCost_SKU); results["ProfitabilityPerSKU"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ProfitabilityPerSKU"] = Number.NaN; }
  return results;
}


export function calculateUrun_complexity_hidden_maliyet(input: Urun_complexity_hidden_maliyetInput): Urun_complexity_hidden_maliyetOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ProfitabilityPerSKU"]);
  const breakdown = {
    ComplexityIndex: toNumericFormulaValue(values["ComplexityIndex"]),
    SetupCostComplexity: toNumericFormulaValue(values["SetupCostComplexity"]),
    InventoryCostComplexity: toNumericFormulaValue(values["InventoryCostComplexity"]),
    OverheadAllocation: toNumericFormulaValue(values["OverheadAllocation"]),
    HiddenCost: toNumericFormulaValue(values["HiddenCost"]),
    ProfitabilityPerSKU: toNumericFormulaValue(values["ProfitabilityPerSKU"])
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


export interface Urun_complexity_hidden_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { ComplexityIndex: number; SetupCostComplexity: number; InventoryCostComplexity: number; OverheadAllocation: number; HiddenCost: number; ProfitabilityPerSKU: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Urun_complexity_hidden_maliyetOutputMeta = {
  primaryKey: "ProfitabilityPerSKU",
  unit: "USD",
  breakdownKeys: ["ComplexityIndex","SetupCostComplexity","InventoryCostComplexity","OverheadAllocation","HiddenCost","ProfitabilityPerSKU"],
} as const;

