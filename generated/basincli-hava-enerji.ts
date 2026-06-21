// Auto-generated from basincli-hava-enerji-schema.json
import * as z from 'zod';

export interface Basincli_hava_enerjiInput {
  Q: number;
  DeltaP: number;
  Eff_isothermal: number;
  Eff_motor: number;
  Eff_drive: number;
  Q_actual: number;
  OpHours: number;
  ElecRate: number;
  LoadFactor: number;
  LeakFlow: number;
  PressureDropCost: number;
  UnloadWaste: number;
  HeatRecoverySavings: number;
  dataConfidence?: number;
}

export const Basincli_hava_enerjiInputSchema = z.object({
  Q: z.number().min(0).default(0),
  DeltaP: z.number().min(0).default(0),
  Eff_isothermal: z.number().min(0).default(0),
  Eff_motor: z.number().min(0).default(0),
  Eff_drive: z.number().min(0).default(0),
  Q_actual: z.number().min(0).default(0),
  OpHours: z.number().min(0).default(0),
  ElecRate: z.number().min(0).default(0),
  LoadFactor: z.number().min(0).default(0),
  LeakFlow: z.number().min(0).default(0),
  PressureDropCost: z.number().min(0).default(0),
  UnloadWaste: z.number().min(0).default(0),
  HeatRecoverySavings: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Basincli_hava_enerjiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.Q * input.DeltaP) / (input.Eff_isothermal * input.Eff_motor * input.Eff_drive); results["CompressorPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CompressorPower"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["CompressorPower"])) / input.Q_actual; results["SpecificPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SpecificPower"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["CompressorPower"])) * input.OpHours * input.ElecRate * input.LoadFactor; results["AnnualEnergyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AnnualEnergyCost"] = Number.NaN; }
  results["LeakageCost"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["AnnualEnergyCost"])) + (toNumericFormulaValue(results["LeakageCost"])) + input.PressureDropCost + input.UnloadWaste - input.HeatRecoverySavings; results["TotalAnnualCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalAnnualCost"] = Number.NaN; }
  return results;
}


export function calculateBasincli_hava_enerji(input: Basincli_hava_enerjiInput): Basincli_hava_enerjiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TotalAnnualCost"]);
  const breakdown = {
    CompressorPower: toNumericFormulaValue(values["CompressorPower"]),
    SpecificPower: toNumericFormulaValue(values["SpecificPower"]),
    AnnualEnergyCost: toNumericFormulaValue(values["AnnualEnergyCost"]),
    LeakageCost: toNumericFormulaValue(values["LeakageCost"]),
    TotalAnnualCost: toNumericFormulaValue(values["TotalAnnualCost"])
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


export interface Basincli_hava_enerjiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { CompressorPower: number; SpecificPower: number; AnnualEnergyCost: number; LeakageCost: number; TotalAnnualCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Basincli_hava_enerjiOutputMeta = {
  primaryKey: "TotalAnnualCost",
  unit: "USD",
  breakdownKeys: ["CompressorPower","SpecificPower","AnnualEnergyCost","LeakageCost","TotalAnnualCost"],
} as const;

