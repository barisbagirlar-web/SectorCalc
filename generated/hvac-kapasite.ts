// Auto-generated from hvac-kapasite-schema.json
import * as z from 'zod';

export interface Hvac_kapasiteInput {
  CFM: number;
  DeltaT: number;
  DeltaW: number;
  U: number;
  Area: number;
  Occ: number;
  SensPer: number;
  Light: number;
  Equip: number;
  CFM_Out: number;
  T_Out: number;
  T_In: number;
  BTU: number;
  W: number;
  Hours: number;
  ElecRate: number;
  dataConfidence?: number;
}

export const Hvac_kapasiteInputSchema = z.object({
  CFM: z.number().min(0).default(0),
  DeltaT: z.number().min(0).default(0),
  DeltaW: z.number().min(0).default(0),
  U: z.number().min(0).default(0),
  Area: z.number().min(0).default(0),
  Occ: z.number().min(0).default(0),
  SensPer: z.number().min(0).default(0),
  Light: z.number().min(0).default(0),
  Equip: z.number().min(0).default(0),
  CFM_Out: z.number().min(0).default(0),
  T_Out: z.number().min(0).default(0),
  T_In: z.number().min(0).default(0),
  BTU: z.number().min(0).default(0),
  W: z.number().min(0).default(0),
  Hours: z.number().min(0).default(0),
  ElecRate: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hvac_kapasiteInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1.08 * input.CFM * input.DeltaT; results["Sensible"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Sensible"] = Number.NaN; }
  try { const v = 0.68 * input.CFM * input.DeltaW; results["Latent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Latent"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Sensible"])) + (toNumericFormulaValue(results["Latent"])); results["Total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Total"] = Number.NaN; }
  try { const v = input.U * input.Area * input.DeltaT; results["Envelope"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Envelope"] = Number.NaN; }
  try { const v = input.Occ * input.SensPer + input.Light + input.Equip; results["Internal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Internal"] = Number.NaN; }
  try { const v = input.CFM_Out * 1.08 * (input.T_Out - input.T_In); results["Vent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Vent"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Total"])) / 12000; results["Tons"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Tons"] = Number.NaN; }
  try { const v = input.BTU / input.W; results["EER"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EER"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["Total"])) / (toNumericFormulaValue(results["EER"]))) * input.Hours * input.ElecRate; results["AnnualCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AnnualCost"] = Number.NaN; }
  return results;
}


export function calculateHvac_kapasite(input: Hvac_kapasiteInput): Hvac_kapasiteOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["AnnualCost"]);
  const breakdown = {
    Sensible: toNumericFormulaValue(values["Sensible"]),
    Latent: toNumericFormulaValue(values["Latent"]),
    Total: toNumericFormulaValue(values["Total"]),
    Envelope: toNumericFormulaValue(values["Envelope"]),
    Internal: toNumericFormulaValue(values["Internal"]),
    Vent: toNumericFormulaValue(values["Vent"]),
    Tons: toNumericFormulaValue(values["Tons"]),
    EER: toNumericFormulaValue(values["EER"]),
    AnnualCost: toNumericFormulaValue(values["AnnualCost"])
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


export interface Hvac_kapasiteOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Sensible: number; Latent: number; Total: number; Envelope: number; Internal: number; Vent: number; Tons: number; EER: number; AnnualCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hvac_kapasiteOutputMeta = {
  primaryKey: "AnnualCost",
  unit: "USD",
  breakdownKeys: ["Sensible","Latent","Total","Envelope","Internal","Vent","Tons","EER","AnnualCost"],
} as const;

