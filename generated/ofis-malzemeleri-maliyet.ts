// Auto-generated from ofis-malzemeleri-maliyet-schema.json
import * as z from 'zod';

export interface Ofis_malzemeleri_maliyetInput {
  TotalConsumed: number;
  EmployeeCount: number;
  Item_i: number;
  UnitPrice_i: number;
  AnnualUsage_i: number;
  AverageInventory: number;
  HoldingRate: number;
  EmergencyOrders: number;
  PremiumFreight: number;
  AnnualUsage: number;
  OrderCost: number;
  HoldingCost: number;
  Purchased: number;
  Consumed: number;
  CurrentCost: number;
  EOQ_Cost: number;
  dataConfidence?: number;
}

export const Ofis_malzemeleri_maliyetInputSchema = z.object({
  TotalConsumed: z.number().min(0).default(0),
  EmployeeCount: z.number().min(0).default(0),
  Item_i: z.number().min(0).default(0),
  UnitPrice_i: z.number().min(0).default(0),
  AnnualUsage_i: z.number().min(0).default(0),
  AverageInventory: z.number().min(0).default(0),
  HoldingRate: z.number().min(0).default(0),
  EmergencyOrders: z.number().min(0).default(0),
  PremiumFreight: z.number().min(0).default(0),
  AnnualUsage: z.number().min(0).default(0),
  OrderCost: z.number().min(0).default(0),
  HoldingCost: z.number().min(0).default(0),
  Purchased: z.number().min(0).default(0),
  Consumed: z.number().min(0).default(0),
  CurrentCost: z.number().min(0).default(0),
  EOQ_Cost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ofis_malzemeleri_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.TotalConsumed / input.EmployeeCount; results["ConsumptionRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ConsumptionRate"] = Number.NaN; }
  results["AnnualCost"] = Number.NaN;
  try { const v = input.AverageInventory * input.HoldingRate; results["CarryingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CarryingCost"] = Number.NaN; }
  try { const v = input.EmergencyOrders * input.PremiumFreight; results["StockoutCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["StockoutCost"] = Number.NaN; }
  try { const v = Math.sqrt((2 * input.AnnualUsage * input.OrderCost) / input.HoldingCost); results["EOQ_Office"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EOQ_Office"] = Number.NaN; }
  try { const v = (input.Purchased - input.Consumed) / input.Purchased; results["WastePct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["WastePct"] = Number.NaN; }
  try { const v = (input.CurrentCost - input.EOQ_Cost) + ((toNumericFormulaValue(results["WastePct"])) * input.CurrentCost); results["OptimizationSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OptimizationSavings"] = Number.NaN; }
  return results;
}


export function calculateOfis_malzemeleri_maliyet(input: Ofis_malzemeleri_maliyetInput): Ofis_malzemeleri_maliyetOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["OptimizationSavings"]);
  const breakdown = {
    ConsumptionRate: toNumericFormulaValue(values["ConsumptionRate"]),
    AnnualCost: toNumericFormulaValue(values["AnnualCost"]),
    CarryingCost: toNumericFormulaValue(values["CarryingCost"]),
    StockoutCost: toNumericFormulaValue(values["StockoutCost"]),
    EOQ_Office: toNumericFormulaValue(values["EOQ_Office"]),
    WastePct: toNumericFormulaValue(values["WastePct"]),
    OptimizationSavings: toNumericFormulaValue(values["OptimizationSavings"])
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


export interface Ofis_malzemeleri_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { ConsumptionRate: number; AnnualCost: number; CarryingCost: number; StockoutCost: number; EOQ_Office: number; WastePct: number; OptimizationSavings: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ofis_malzemeleri_maliyetOutputMeta = {
  primaryKey: "OptimizationSavings",
  unit: "USD",
  breakdownKeys: ["ConsumptionRate","AnnualCost","CarryingCost","StockoutCost","EOQ_Office","WastePct","OptimizationSavings"],
} as const;

