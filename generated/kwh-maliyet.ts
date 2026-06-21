// Auto-generated from kwh-maliyet-schema.json
import * as z from 'zod';

export interface Kwh_maliyetInput {
  ActiveEnergy: number;
  EnergyRate: number;
  PeakDemand: number;
  DemandRate: number;
  PowerFactor: number;
  Threshold: number;
  ReactiveEnergy: number;
  PenaltyRate: number;
  TaxRate: number;
  OldPeak: number;
  NewPeak: number;
  dataConfidence?: number;
}

export const Kwh_maliyetInputSchema = z.object({
  ActiveEnergy: z.number().min(0).default(0),
  EnergyRate: z.number().min(0).default(0),
  PeakDemand: z.number().min(0).default(0),
  DemandRate: z.number().min(0).default(0),
  PowerFactor: z.number().min(0).default(0),
  Threshold: z.number().min(0).default(0),
  ReactiveEnergy: z.number().min(0).default(0),
  PenaltyRate: z.number().min(0).default(0),
  TaxRate: z.number().min(0).default(0),
  OldPeak: z.number().min(0).default(0),
  NewPeak: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kwh_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ActiveEnergy * input.EnergyRate; results["EnergyCharge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EnergyCharge"] = Number.NaN; }
  try { const v = input.PeakDemand * input.DemandRate; results["DemandCharge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DemandCharge"] = Number.NaN; }
  try { const v = ((input.PowerFactor < input.Threshold) ? (input.ReactiveEnergy * input.PenaltyRate) : (0)); results["ReactivePenalty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ReactivePenalty"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["EnergyCharge"])) + (toNumericFormulaValue(results["DemandCharge"]))) * input.TaxRate; results["TaxesAndFees"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TaxesAndFees"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["EnergyCharge"])) + (toNumericFormulaValue(results["DemandCharge"])) + (toNumericFormulaValue(results["ReactivePenalty"])) + (toNumericFormulaValue(results["TaxesAndFees"])); results["TotalBill"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalBill"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TotalBill"])) / input.ActiveEnergy; results["UnitCost_kWh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["UnitCost_kWh"] = Number.NaN; }
  try { const v = (input.OldPeak - input.NewPeak) * input.DemandRate; results["PeakShavingSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PeakShavingSavings"] = Number.NaN; }
  return results;
}


export function calculateKwh_maliyet(input: Kwh_maliyetInput): Kwh_maliyetOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["PeakShavingSavings"]);
  const breakdown = {
    EnergyCharge: toNumericFormulaValue(values["EnergyCharge"]),
    DemandCharge: toNumericFormulaValue(values["DemandCharge"]),
    ReactivePenalty: toNumericFormulaValue(values["ReactivePenalty"]),
    TaxesAndFees: toNumericFormulaValue(values["TaxesAndFees"]),
    TotalBill: toNumericFormulaValue(values["TotalBill"]),
    UnitCost_kWh: toNumericFormulaValue(values["UnitCost_kWh"]),
    PeakShavingSavings: toNumericFormulaValue(values["PeakShavingSavings"])
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


export interface Kwh_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { EnergyCharge: number; DemandCharge: number; ReactivePenalty: number; TaxesAndFees: number; TotalBill: number; UnitCost_kWh: number; PeakShavingSavings: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kwh_maliyetOutputMeta = {
  primaryKey: "PeakShavingSavings",
  unit: "USD",
  breakdownKeys: ["EnergyCharge","DemandCharge","ReactivePenalty","TaxesAndFees","TotalBill","UnitCost_kWh","PeakShavingSavings"],
} as const;

