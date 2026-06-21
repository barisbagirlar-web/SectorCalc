// Auto-generated from degisim-matrisi-smed-schema.json
import * as z from 'zod';

export interface Degisim_matrisi_smedInput {
  SetupStopped: number;
  SetupRunning: number;
  ConversionRate: number;
  Demand: number;
  HoldingCost: number;
  MachineRate: number;
  Labor: number;
  Freq: number;
  Available: number;
  dataConfidence?: number;
}

export const Degisim_matrisi_smedInputSchema = z.object({
  SetupStopped: z.number().min(0).default(0),
  SetupRunning: z.number().min(0).default(0),
  ConversionRate: z.number().min(0).default(0),
  Demand: z.number().min(0).default(0),
  HoldingCost: z.number().min(0).default(0),
  MachineRate: z.number().min(0).default(0),
  Labor: z.number().min(0).default(0),
  Freq: z.number().min(0).default(0),
  Available: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Degisim_matrisi_smedInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.SetupStopped; results["T_internal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["T_internal"] = Number.NaN; }
  try { const v = input.SetupRunning; results["T_external"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["T_external"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["T_internal"])) + (toNumericFormulaValue(results["T_external"])); results["T_total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["T_total"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["T_internal"])) * (1 - input.ConversionRate) + (toNumericFormulaValue(results["T_external"])); results["T_target"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["T_target"] = Number.NaN; }
  try { const v = Math.sqrt((2 * input.Demand * (toNumericFormulaValue(results["SetupCost"]))) / input.HoldingCost); results["EBQ"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EBQ"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["T_total"])) * input.MachineRate + input.Labor; results["SetupCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SetupCost"] = Number.NaN; }
  results["AnnualSavings"] = Number.NaN;
  try { const v = ((toNumericFormulaValue(results["T_total"])) - (toNumericFormulaValue(results["T_target"]))) * input.Freq / input.Available; results["CapacityGain"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CapacityGain"] = Number.NaN; }
  return results;
}


export function calculateDegisim_matrisi_smed(input: Degisim_matrisi_smedInput): Degisim_matrisi_smedOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["CapacityGain"]);
  const breakdown = {
    T_internal: toNumericFormulaValue(values["T_internal"]),
    T_external: toNumericFormulaValue(values["T_external"]),
    T_total: toNumericFormulaValue(values["T_total"]),
    T_target: toNumericFormulaValue(values["T_target"]),
    EBQ: toNumericFormulaValue(values["EBQ"]),
    SetupCost: toNumericFormulaValue(values["SetupCost"]),
    AnnualSavings: toNumericFormulaValue(values["AnnualSavings"]),
    CapacityGain: toNumericFormulaValue(values["CapacityGain"])
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


export interface Degisim_matrisi_smedOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { T_internal: number; T_external: number; T_total: number; T_target: number; EBQ: number; SetupCost: number; AnnualSavings: number; CapacityGain: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Degisim_matrisi_smedOutputMeta = {
  primaryKey: "CapacityGain",
  unit: "USD",
  breakdownKeys: ["T_internal","T_external","T_total","T_target","EBQ","SetupCost","AnnualSavings","CapacityGain"],
} as const;

