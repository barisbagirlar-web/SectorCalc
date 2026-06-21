// Auto-generated from auto-repair-comeback-schema.json
import * as z from 'zod';

export interface Auto_repair_comebackInput {
  ComebackOrders: number;
  TotalCompleted: number;
  DiagTime: number;
  RepairTime: number;
  LaborRate: number;
  WastedPartsValue: number;
  BayOccupancyHours: number;
  RevenuePerBayHour: number;
  Direct: number;
  Parts: number;
  Warranty: number;
  Goodwill: number;
  Opportunity: number;
  dataConfidence?: number;
}

export const Auto_repair_comebackInputSchema = z.object({
  ComebackOrders: z.number().min(0).default(0),
  TotalCompleted: z.number().min(0).default(0),
  DiagTime: z.number().min(0).default(0),
  RepairTime: z.number().min(0).default(0),
  LaborRate: z.number().min(0).default(0),
  WastedPartsValue: z.number().min(0).default(0),
  BayOccupancyHours: z.number().min(0).default(0),
  RevenuePerBayHour: z.number().min(0).default(0),
  Direct: z.number().min(0).default(0),
  Parts: z.number().min(0).default(0),
  Warranty: z.number().min(0).default(0),
  Goodwill: z.number().min(0).default(0),
  Opportunity: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Auto_repair_comebackInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.ComebackOrders / input.TotalCompleted) * 100; results["ComebackRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ComebackRate"] = Number.NaN; }
  try { const v = input.ComebackOrders * (input.DiagTime + input.RepairTime) * input.LaborRate; results["ComebackCost_Direct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ComebackCost_Direct"] = Number.NaN; }
  try { const v = input.ComebackOrders * input.WastedPartsValue; results["ComebackCost_Parts"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ComebackCost_Parts"] = Number.NaN; }
  try { const v = input.ComebackOrders * input.BayOccupancyHours * input.RevenuePerBayHour; results["ComebackCost_Opportunity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ComebackCost_Opportunity"] = Number.NaN; }
  try { const v = (input.ComebackOrders / input.TotalCompleted) * 1000000; results["DPMO"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DPMO"] = Number.NaN; }
  try { const v = input.Direct + input.Parts + input.Warranty + input.Goodwill + input.Opportunity; results["TotalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalCost"] = Number.NaN; }
  return results;
}


export function calculateAuto_repair_comeback(input: Auto_repair_comebackInput): Auto_repair_comebackOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TotalCost"]);
  const breakdown = {
    ComebackRate: toNumericFormulaValue(values["ComebackRate"]),
    ComebackCost_Direct: toNumericFormulaValue(values["ComebackCost_Direct"]),
    ComebackCost_Parts: toNumericFormulaValue(values["ComebackCost_Parts"]),
    ComebackCost_Opportunity: toNumericFormulaValue(values["ComebackCost_Opportunity"]),
    DPMO: toNumericFormulaValue(values["DPMO"]),
    TotalCost: toNumericFormulaValue(values["TotalCost"])
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


export interface Auto_repair_comebackOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { ComebackRate: number; ComebackCost_Direct: number; ComebackCost_Parts: number; ComebackCost_Opportunity: number; DPMO: number; TotalCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Auto_repair_comebackOutputMeta = {
  primaryKey: "TotalCost",
  unit: "USD",
  breakdownKeys: ["ComebackRate","ComebackCost_Direct","ComebackCost_Parts","ComebackCost_Opportunity","DPMO","TotalCost"],
} as const;

