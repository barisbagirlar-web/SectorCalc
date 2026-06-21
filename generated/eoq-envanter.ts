// Auto-generated from eoq-envanter-schema.json
import * as z from 'zod';

export interface Eoq_envanterInput {
  Demand: number;
  OrderCost: number;
  HoldingCost: number;
  LeadTime: number;
  DailyDemand: number;
  Z: number;
  StdDev: number;
  Safety: number;
  AvgInv: number;
  dataConfidence?: number;
}

export const Eoq_envanterInputSchema = z.object({
  Demand: z.number().min(0).default(0),
  OrderCost: z.number().min(0).default(0),
  HoldingCost: z.number().min(0).default(0),
  LeadTime: z.number().min(0).default(0),
  DailyDemand: z.number().min(0).default(0),
  Z: z.number().min(0).default(0),
  StdDev: z.number().min(0).default(0),
  Safety: z.number().min(0).default(0),
  AvgInv: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Eoq_envanterInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt((2 * input.Demand * input.OrderCost) / input.HoldingCost); results["EOQ"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EOQ"] = Number.NaN; }
  try { const v = (input.LeadTime * input.DailyDemand) + (toNumericFormulaValue(results["SafetyStock"])); results["ROP"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ROP"] = Number.NaN; }
  try { const v = input.Z * input.StdDev * Math.sqrt(input.LeadTime); results["SafetyStock"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SafetyStock"] = Number.NaN; }
  try { const v = (input.Demand / (toNumericFormulaValue(results["EOQ"]))) * input.OrderCost + ((toNumericFormulaValue(results["EOQ"])) / 2 + input.Safety) * input.HoldingCost; results["TotalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["EOQ"])) / 2; results["CycleStock"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CycleStock"] = Number.NaN; }
  try { const v = input.Demand / input.AvgInv; results["Turnover"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Turnover"] = Number.NaN; }
  try { const v = 365 / (toNumericFormulaValue(results["Turnover"])); results["DaysSales"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DaysSales"] = Number.NaN; }
  return results;
}


export function calculateEoq_envanter(input: Eoq_envanterInput): Eoq_envanterOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["DaysSales"]);
  const breakdown = {
    EOQ: toNumericFormulaValue(values["EOQ"]),
    ROP: toNumericFormulaValue(values["ROP"]),
    SafetyStock: toNumericFormulaValue(values["SafetyStock"]),
    TotalCost: toNumericFormulaValue(values["TotalCost"]),
    CycleStock: toNumericFormulaValue(values["CycleStock"]),
    Turnover: toNumericFormulaValue(values["Turnover"]),
    DaysSales: toNumericFormulaValue(values["DaysSales"])
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


export interface Eoq_envanterOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { EOQ: number; ROP: number; SafetyStock: number; TotalCost: number; CycleStock: number; Turnover: number; DaysSales: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Eoq_envanterOutputMeta = {
  primaryKey: "DaysSales",
  unit: "USD",
  breakdownKeys: ["EOQ","ROP","SafetyStock","TotalCost","CycleStock","Turnover","DaysSales"],
} as const;

