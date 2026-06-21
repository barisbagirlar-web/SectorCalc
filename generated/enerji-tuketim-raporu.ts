// Auto-generated from enerji-tuketim-raporu-schema.json
import * as z from 'zod';

export interface Enerji_tuketim_raporuInput {
  kWh: number;
  kVArh: number;
  Thresh: number;
  Tariff: number;
  Peak_kW: number;
  DemandRate: number;
  TOU_Rate: number;
  Base: number;
  Demand: number;
  Penalty: number;
  Tax: number;
  EmisFactor: number;
  CarbonPrice: number;
  dataConfidence?: number;
}

export const Enerji_tuketim_raporuInputSchema = z.object({
  kWh: z.number().min(0).default(0),
  kVArh: z.number().min(0).default(0),
  Thresh: z.number().min(0).default(0),
  Tariff: z.number().min(0).default(0),
  Peak_kW: z.number().min(0).default(0),
  DemandRate: z.number().min(0).default(0),
  TOU_Rate: z.number().min(0).default(0),
  Base: z.number().min(0).default(0),
  Demand: z.number().min(0).default(0),
  Penalty: z.number().min(0).default(0),
  Tax: z.number().min(0).default(0),
  EmisFactor: z.number().min(0).default(0),
  CarbonPrice: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Enerji_tuketim_raporuInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["Active"] = Number.NaN;
  results["Reactive"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["Active"])) / Math.sqrt((toNumericFormulaValue(results["Active"]))**2 + (toNumericFormulaValue(results["Reactive"]))**2); results["PF"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PF"] = Number.NaN; }
  results["ReactivePenalty"] = Number.NaN;
  try { const v = input.Peak_kW * input.DemandRate; results["DemandCharge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DemandCharge"] = Number.NaN; }
  results["TOU"] = Number.NaN;
  try { const v = input.Base + (toNumericFormulaValue(results["TOU"])) + input.Demand + input.Penalty + input.Tax; results["Total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Total"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Active"])) * input.EmisFactor * input.CarbonPrice; results["Carbon"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Carbon"] = Number.NaN; }
  return results;
}


export function calculateEnerji_tuketim_raporu(input: Enerji_tuketim_raporuInput): Enerji_tuketim_raporuOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Carbon"]);
  const breakdown = {
    Active: toNumericFormulaValue(values["Active"]),
    Reactive: toNumericFormulaValue(values["Reactive"]),
    PF: toNumericFormulaValue(values["PF"]),
    ReactivePenalty: toNumericFormulaValue(values["ReactivePenalty"]),
    DemandCharge: toNumericFormulaValue(values["DemandCharge"]),
    TOU: toNumericFormulaValue(values["TOU"]),
    Total: toNumericFormulaValue(values["Total"]),
    Carbon: toNumericFormulaValue(values["Carbon"])
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


export interface Enerji_tuketim_raporuOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Active: number; Reactive: number; PF: number; ReactivePenalty: number; DemandCharge: number; TOU: number; Total: number; Carbon: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Enerji_tuketim_raporuOutputMeta = {
  primaryKey: "Carbon",
  unit: "USD",
  breakdownKeys: ["Active","Reactive","PF","ReactivePenalty","DemandCharge","TOU","Total","Carbon"],
} as const;

