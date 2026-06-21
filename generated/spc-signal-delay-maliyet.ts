// Auto-generated from spc-signal-delay-maliyet-schema.json
import * as z from 'zod';

export interface Spc_signal_delay_maliyetInput {
  Alpha: number;
  Beta: number;
  SamplingInterval: number;
  ProductionRate: number;
  DefectRate_OOC: number;
  CostPerDefect: number;
  FalseAlarmRate: number;
  SamplingFrequency: number;
  LaborRate: number;
  SamplingCost: number;
  ShiftMagnitude: number;
  dataConfidence?: number;
}

export const Spc_signal_delay_maliyetInputSchema = z.object({
  Alpha: z.number().min(0).default(0),
  Beta: z.number().min(0).default(0),
  SamplingInterval: z.number().min(0).default(0),
  ProductionRate: z.number().min(0).default(0),
  DefectRate_OOC: z.number().min(0).default(0),
  CostPerDefect: z.number().min(0).default(0),
  FalseAlarmRate: z.number().min(0).default(0),
  SamplingFrequency: z.number().min(0).default(0),
  LaborRate: z.number().min(0).default(0),
  SamplingCost: z.number().min(0).default(0),
  ShiftMagnitude: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Spc_signal_delay_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 / input.Alpha; results["ARL_InControl"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ARL_InControl"] = Number.NaN; }
  try { const v = 1 / (1 - input.Beta); results["ARL_OutOfControl"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ARL_OutOfControl"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ARL_OutOfControl"])) * input.SamplingInterval; results["DetectionDelay_Hours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DetectionDelay_Hours"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["DetectionDelay_Hours"])) * input.ProductionRate * input.DefectRate_OOC; results["DefectsProduced"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DefectsProduced"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["DefectsProduced"])) * input.CostPerDefect; results["Cost_Delay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Delay"] = Number.NaN; }
  try { const v = input.FalseAlarmRate * input.SamplingFrequency * input.LaborRate; results["InvestigationCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["InvestigationCost"] = Number.NaN; }
  try { const v = Math.sqrt((2 * input.SamplingCost * input.ProductionRate) / ((toNumericFormulaValue(results["Cost_Delay"])) * input.ShiftMagnitude**2)); results["OptimalInterval"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OptimalInterval"] = Number.NaN; }
  return results;
}


export function calculateSpc_signal_delay_maliyet(input: Spc_signal_delay_maliyetInput): Spc_signal_delay_maliyetOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["OptimalInterval"]);
  const breakdown = {
    ARL_InControl: toNumericFormulaValue(values["ARL_InControl"]),
    ARL_OutOfControl: toNumericFormulaValue(values["ARL_OutOfControl"]),
    DetectionDelay_Hours: toNumericFormulaValue(values["DetectionDelay_Hours"]),
    DefectsProduced: toNumericFormulaValue(values["DefectsProduced"]),
    Cost_Delay: toNumericFormulaValue(values["Cost_Delay"]),
    InvestigationCost: toNumericFormulaValue(values["InvestigationCost"]),
    OptimalInterval: toNumericFormulaValue(values["OptimalInterval"])
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


export interface Spc_signal_delay_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { ARL_InControl: number; ARL_OutOfControl: number; DetectionDelay_Hours: number; DefectsProduced: number; Cost_Delay: number; InvestigationCost: number; OptimalInterval: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Spc_signal_delay_maliyetOutputMeta = {
  primaryKey: "OptimalInterval",
  unit: "USD",
  breakdownKeys: ["ARL_InControl","ARL_OutOfControl","DetectionDelay_Hours","DefectsProduced","Cost_Delay","InvestigationCost","OptimalInterval"],
} as const;

