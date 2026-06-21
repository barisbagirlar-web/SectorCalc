// Auto-generated from stok-devir-hizi-risk-schema.json
import * as z from 'zod';

export interface Stok_devir_hizi_riskInput {
  COGS: number;
  AverageInventory: number;
  AgingBracket_i: number;
  ObsolescenceRate_i: number;
  InventoryValue_i: number;
  WACC: number;
  Storage: number;
  Insurance: number;
  Obsolescence: number;
  IndustryBenchmark: number;
  AdjustmentFactor: number;
  Turnover: number;
  MaxThreshold: number;
  High: number;
  Low: number;
  SlowMovingInventory: number;
  SalvageValuePct: number;
  dataConfidence?: number;
}

export const Stok_devir_hizi_riskInputSchema = z.object({
  COGS: z.number().min(0).default(0),
  AverageInventory: z.number().min(0).default(0),
  AgingBracket_i: z.number().min(0).default(0),
  ObsolescenceRate_i: z.number().min(0).default(0),
  InventoryValue_i: z.number().min(0).default(0),
  WACC: z.number().min(0).default(0),
  Storage: z.number().min(0).default(0),
  Insurance: z.number().min(0).default(0),
  Obsolescence: z.number().min(0).default(0),
  IndustryBenchmark: z.number().min(0).default(0),
  AdjustmentFactor: z.number().min(0).default(0),
  Turnover: z.number().min(0).default(0),
  MaxThreshold: z.number().min(0).default(0),
  High: z.number().min(0).default(0),
  Low: z.number().min(0).default(0),
  SlowMovingInventory: z.number().min(0).default(0),
  SalvageValuePct: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Stok_devir_hizi_riskInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.COGS / input.AverageInventory; results["InventoryTurnover"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["InventoryTurnover"] = Number.NaN; }
  try { const v = 365 / (toNumericFormulaValue(results["InventoryTurnover"])); results["DaysSalesInventory"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DaysSalesInventory"] = Number.NaN; }
  results["ObsolescenceRisk"] = Number.NaN;
  try { const v = input.AverageInventory * (input.WACC + input.Storage + input.Insurance + input.Obsolescence); results["CarryingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CarryingCost"] = Number.NaN; }
  try { const v = input.IndustryBenchmark * input.AdjustmentFactor; results["OptimalTurnover"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OptimalTurnover"] = Number.NaN; }
  try { const v = ((input.Turnover > input.MaxThreshold) ? (input.High) : (input.Low)); results["StockoutRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["StockoutRisk"] = Number.NaN; }
  try { const v = input.SlowMovingInventory * (1 - input.SalvageValuePct); results["LiquidationLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LiquidationLoss"] = Number.NaN; }
  return results;
}


export function calculateStok_devir_hizi_risk(input: Stok_devir_hizi_riskInput): Stok_devir_hizi_riskOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["LiquidationLoss"]);
  const breakdown = {
    InventoryTurnover: toNumericFormulaValue(values["InventoryTurnover"]),
    DaysSalesInventory: toNumericFormulaValue(values["DaysSalesInventory"]),
    ObsolescenceRisk: toNumericFormulaValue(values["ObsolescenceRisk"]),
    CarryingCost: toNumericFormulaValue(values["CarryingCost"]),
    OptimalTurnover: toNumericFormulaValue(values["OptimalTurnover"]),
    StockoutRisk: toNumericFormulaValue(values["StockoutRisk"]),
    LiquidationLoss: toNumericFormulaValue(values["LiquidationLoss"])
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


export interface Stok_devir_hizi_riskOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { InventoryTurnover: number; DaysSalesInventory: number; ObsolescenceRisk: number; CarryingCost: number; OptimalTurnover: number; StockoutRisk: number; LiquidationLoss: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Stok_devir_hizi_riskOutputMeta = {
  primaryKey: "LiquidationLoss",
  unit: "USD",
  breakdownKeys: ["InventoryTurnover","DaysSalesInventory","ObsolescenceRisk","CarryingCost","OptimalTurnover","StockoutRisk","LiquidationLoss"],
} as const;

