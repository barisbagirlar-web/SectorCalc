// Auto-generated from kompresor-tanki-boyutlandirma-schema.json
import * as z from 'zod';

export interface Kompresor_tanki_boyutlandirmaInput {
  P_atm: number;
  TimeToFill: number;
  FreeAirDelivery: number;
  CutOutPressure: number;
  CutInPressure: number;
  MaxStarts: number;
  FAIL: number;
  Volume: number;
  PricePerLiter: number;
  dataConfidence?: number;
}

export const Kompresor_tanki_boyutlandirmaInputSchema = z.object({
  P_atm: z.number().min(0).default(0),
  TimeToFill: z.number().min(0).default(0),
  FreeAirDelivery: z.number().min(0).default(0),
  CutOutPressure: z.number().min(0).default(0),
  CutInPressure: z.number().min(0).default(0),
  MaxStarts: z.number().min(0).default(0),
  FAIL: z.number().min(0).default(0),
  Volume: z.number().min(0).default(0),
  PricePerLiter: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kompresor_tanki_boyutlandirmaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((toNumericFormulaValue(results["t"])) * (toNumericFormulaValue(results["Q"])) * input.P_atm) / ((toNumericFormulaValue(results["P_Max"])) - (toNumericFormulaValue(results["P_Min"]))); results["V_Tank"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["V_Tank"] = Number.NaN; }
  try { const v = input.TimeToFill; results["t"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["t"] = Number.NaN; }
  try { const v = input.FreeAirDelivery; results["Q"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Q"] = Number.NaN; }
  try { const v = input.CutOutPressure; results["P_Max"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["P_Max"] = Number.NaN; }
  try { const v = input.CutInPressure; results["P_Min"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["P_Min"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["V_Tank"])) * ((toNumericFormulaValue(results["P_Max"])) - (toNumericFormulaValue(results["P_Min"]))) / ((toNumericFormulaValue(results["Q"])) * input.P_atm); results["CycleTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CycleTime"] = Number.NaN; }
  try { const v = 60 / (toNumericFormulaValue(results["CycleTime"])); results["CyclesPerHour"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CyclesPerHour"] = Number.NaN; }
  try { const v = (((toNumericFormulaValue(results["CyclesPerHour"])) > input.MaxStarts) ? ("input.FAIL") : ("PASS")); results["MotorStartLimit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MotorStartLimit"] = Number.NaN; }
  try { const v = input.Volume * input.PricePerLiter; results["Cost_Tank"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Tank"] = Number.NaN; }
  return results;
}


export function calculateKompresor_tanki_boyutlandirma(input: Kompresor_tanki_boyutlandirmaInput): Kompresor_tanki_boyutlandirmaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Cost_Tank"]);
  const breakdown = {
    V_Tank: toNumericFormulaValue(values["V_Tank"]),
    t: toNumericFormulaValue(values["t"]),
    Q: toNumericFormulaValue(values["Q"]),
    P_Max: toNumericFormulaValue(values["P_Max"]),
    P_Min: toNumericFormulaValue(values["P_Min"]),
    CycleTime: toNumericFormulaValue(values["CycleTime"]),
    CyclesPerHour: toNumericFormulaValue(values["CyclesPerHour"]),
    MotorStartLimit: toNumericFormulaValue(values["MotorStartLimit"]),
    Cost_Tank: toNumericFormulaValue(values["Cost_Tank"])
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


export interface Kompresor_tanki_boyutlandirmaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { V_Tank: number; t: number; Q: number; P_Max: number; P_Min: number; CycleTime: number; CyclesPerHour: number; MotorStartLimit: number; Cost_Tank: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kompresor_tanki_boyutlandirmaOutputMeta = {
  primaryKey: "Cost_Tank",
  unit: "USD",
  breakdownKeys: ["V_Tank","t","Q","P_Max","P_Min","CycleTime","CyclesPerHour","MotorStartLimit","Cost_Tank"],
} as const;

