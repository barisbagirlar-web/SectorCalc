// Auto-generated from supplier-performans-tco-schema.json
import * as z from 'zod';

export interface Supplier_performans_tcoInput {
  PurchasePrice: number;
  OrderingCost: number;
  TransportCost: number;
  DefectRate: number;
  AnnualVolume: number;
  CostPerDefect: number;
  AvgLeadTime: number;
  SafetyStockDays: number;
  DailyDemand: number;
  HoldingRate: number;
  ProbabilityOfDisruption: number;
  ImpactCost: number;
  QualityWeight: number;
  QualityScore: number;
  DeliveryWeight: number;
  DeliveryScore: number;
  CostWeight: number;
  CostScore: number;
  TCO_Actual: number;
  TCO_Quoted: number;
  dataConfidence?: number;
}

export const Supplier_performans_tcoInputSchema = z.object({
  PurchasePrice: z.number().min(0).default(0),
  OrderingCost: z.number().min(0).default(0),
  TransportCost: z.number().min(0).default(0),
  DefectRate: z.number().min(0).default(0),
  AnnualVolume: z.number().min(0).default(0),
  CostPerDefect: z.number().min(0).default(0),
  AvgLeadTime: z.number().min(0).default(0),
  SafetyStockDays: z.number().min(0).default(0),
  DailyDemand: z.number().min(0).default(0),
  HoldingRate: z.number().min(0).default(0),
  ProbabilityOfDisruption: z.number().min(0).default(0),
  ImpactCost: z.number().min(0).default(0),
  QualityWeight: z.number().min(0).default(0),
  QualityScore: z.number().min(0).default(0),
  DeliveryWeight: z.number().min(0).default(0),
  DeliveryScore: z.number().min(0).default(0),
  CostWeight: z.number().min(0).default(0),
  CostScore: z.number().min(0).default(0),
  TCO_Actual: z.number().min(0).default(0),
  TCO_Quoted: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Supplier_performans_tcoInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.PurchasePrice + input.OrderingCost + input.TransportCost + (toNumericFormulaValue(results["QualityCost"])) + (toNumericFormulaValue(results["InventoryCost"])) + (toNumericFormulaValue(results["RiskCost"])); results["TCO"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TCO"] = Number.NaN; }
  try { const v = input.DefectRate * input.AnnualVolume * input.CostPerDefect; results["QualityCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["QualityCost"] = Number.NaN; }
  try { const v = (input.AvgLeadTime + input.SafetyStockDays) * input.DailyDemand * input.HoldingRate; results["InventoryCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["InventoryCost"] = Number.NaN; }
  try { const v = input.ProbabilityOfDisruption * input.ImpactCost; results["RiskCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RiskCost"] = Number.NaN; }
  try { const v = (input.QualityWeight * input.QualityScore) + (input.DeliveryWeight * input.DeliveryScore) + (input.CostWeight * input.CostScore); results["SupplierScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SupplierScore"] = Number.NaN; }
  try { const v = input.TCO_Actual - input.TCO_Quoted; results["TCO_Variance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TCO_Variance"] = Number.NaN; }
  return results;
}


export function calculateSupplier_performans_tco(input: Supplier_performans_tcoInput): Supplier_performans_tcoOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TCO_Variance"]);
  const breakdown = {
    TCO: toNumericFormulaValue(values["TCO"]),
    QualityCost: toNumericFormulaValue(values["QualityCost"]),
    InventoryCost: toNumericFormulaValue(values["InventoryCost"]),
    RiskCost: toNumericFormulaValue(values["RiskCost"]),
    SupplierScore: toNumericFormulaValue(values["SupplierScore"]),
    TCO_Variance: toNumericFormulaValue(values["TCO_Variance"])
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


export interface Supplier_performans_tcoOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { TCO: number; QualityCost: number; InventoryCost: number; RiskCost: number; SupplierScore: number; TCO_Variance: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Supplier_performans_tcoOutputMeta = {
  primaryKey: "TCO_Variance",
  unit: "USD",
  breakdownKeys: ["TCO","QualityCost","InventoryCost","RiskCost","SupplierScore","TCO_Variance"],
} as const;

