// Auto-generated from hydraulic-sistem-kayip-schema.json
import * as z from 'zod';

export interface Hydraulic_sistem_kayipInput {
  Q_Leak: number;
  P: number;
  DeltaP_Pipe: number;
  Q_Flow: number;
  DeltaP_Valve: number;
  P_Out: number;
  P_In: number;
  Hours: number;
  ElecRate: number;
  T_Avg: number;
  Thresh: number;
  FluidCost: number;
  COP: number;
  dataConfidence?: number;
}

export const Hydraulic_sistem_kayipInputSchema = z.object({
  Q_Leak: z.number().min(0).default(0),
  P: z.number().min(0).default(0),
  DeltaP_Pipe: z.number().min(0).default(0),
  Q_Flow: z.number().min(0).default(0),
  DeltaP_Valve: z.number().min(0).default(0),
  P_Out: z.number().min(0).default(0),
  P_In: z.number().min(0).default(0),
  Hours: z.number().min(0).default(0),
  ElecRate: z.number().min(0).default(0),
  T_Avg: z.number().min(0).default(0),
  Thresh: z.number().min(0).default(0),
  FluidCost: z.number().min(0).default(0),
  COP: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hydraulic_sistem_kayipInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Q_Leak * input.P; results["Loss_Leak"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Loss_Leak"] = Number.NaN; }
  try { const v = input.DeltaP_Pipe * input.Q_Flow; results["Loss_Fric"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Loss_Fric"] = Number.NaN; }
  try { const v = input.DeltaP_Valve * input.Q_Flow; results["Loss_Valve"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Loss_Valve"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Loss_Leak"])) + (toNumericFormulaValue(results["Loss_Fric"])) + (toNumericFormulaValue(results["Loss_Valve"])); results["Heat"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Heat"] = Number.NaN; }
  try { const v = (input.P_Out / input.P_In) * 100; results["Eff"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Eff"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Heat"])) * input.Hours * input.ElecRate; results["Cost_Loss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Loss"] = Number.NaN; }
  try { const v = (input.T_Avg - input.Thresh) * input.FluidCost; results["Degrade"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Degrade"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Heat"])) * input.COP * input.ElecRate; results["Cool"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cool"] = Number.NaN; }
  return results;
}


export function calculateHydraulic_sistem_kayip(input: Hydraulic_sistem_kayipInput): Hydraulic_sistem_kayipOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Cool"]);
  const breakdown = {
    Loss_Leak: toNumericFormulaValue(values["Loss_Leak"]),
    Loss_Fric: toNumericFormulaValue(values["Loss_Fric"]),
    Loss_Valve: toNumericFormulaValue(values["Loss_Valve"]),
    Heat: toNumericFormulaValue(values["Heat"]),
    Eff: toNumericFormulaValue(values["Eff"]),
    Cost_Loss: toNumericFormulaValue(values["Cost_Loss"]),
    Degrade: toNumericFormulaValue(values["Degrade"]),
    Cool: toNumericFormulaValue(values["Cool"])
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


export interface Hydraulic_sistem_kayipOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Loss_Leak: number; Loss_Fric: number; Loss_Valve: number; Heat: number; Eff: number; Cost_Loss: number; Degrade: number; Cool: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hydraulic_sistem_kayipOutputMeta = {
  primaryKey: "Cool",
  unit: "USD",
  breakdownKeys: ["Loss_Leak","Loss_Fric","Loss_Valve","Heat","Eff","Cost_Loss","Degrade","Cool"],
} as const;

