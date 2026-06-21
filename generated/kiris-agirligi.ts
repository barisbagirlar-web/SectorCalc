// Auto-generated from kiris-agirligi-schema.json
import * as z from 'zod';

export interface Kiris_agirligiInput {
  ProfileType: number;
  Size: number;
  Density_Steel: number;
  Length: number;
  Quantity: number;
  PricePerTon: number;
  Perimeter: number;
  w: number;
  L: number;
  E: number;
  I: number;
  dataConfidence?: number;
}

export const Kiris_agirligiInputSchema = z.object({
  ProfileType: z.number().min(0).default(0),
  Size: z.number().min(0).default(0),
  Density_Steel: z.number().min(0).default(0),
  Length: z.number().min(0).default(0),
  Quantity: z.number().min(0).default(0),
  PricePerTon: z.number().min(0).default(0),
  Perimeter: z.number().min(0).default(0),
  w: z.number().min(0).default(0),
  L: z.number().min(0).default(0),
  E: z.number().min(0).default(0),
  I: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kiris_agirligiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["Area_Cross"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["Area_Cross"])) * input.Density_Steel; results["Weight_PerMeter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Weight_PerMeter"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Weight_PerMeter"])) * input.Length * input.Quantity; results["TotalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalWeight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TotalWeight"])) * input.PricePerTon; results["Cost_Material"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Material"] = Number.NaN; }
  try { const v = input.Perimeter * input.Length; results["PaintArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PaintArea"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["PaintArea"])); results["FireproofingArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FireproofingArea"] = Number.NaN; }
  try { const v = (5 * input.w * input.L**4) / (384 * input.E * input.I); results["Deflection_Max"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Deflection_Max"] = Number.NaN; }
  try { const v = (input.w * input.L**2) / 8; results["Moment_Max"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Moment_Max"] = Number.NaN; }
  return results;
}


export function calculateKiris_agirligi(input: Kiris_agirligiInput): Kiris_agirligiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Moment_Max"]);
  const breakdown = {
    Area_Cross: toNumericFormulaValue(values["Area_Cross"]),
    Weight_PerMeter: toNumericFormulaValue(values["Weight_PerMeter"]),
    TotalWeight: toNumericFormulaValue(values["TotalWeight"]),
    Cost_Material: toNumericFormulaValue(values["Cost_Material"]),
    PaintArea: toNumericFormulaValue(values["PaintArea"]),
    FireproofingArea: toNumericFormulaValue(values["FireproofingArea"]),
    Deflection_Max: toNumericFormulaValue(values["Deflection_Max"]),
    Moment_Max: toNumericFormulaValue(values["Moment_Max"])
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


export interface Kiris_agirligiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Area_Cross: number; Weight_PerMeter: number; TotalWeight: number; Cost_Material: number; PaintArea: number; FireproofingArea: number; Deflection_Max: number; Moment_Max: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kiris_agirligiOutputMeta = {
  primaryKey: "Moment_Max",
  unit: "USD",
  breakdownKeys: ["Area_Cross","Weight_PerMeter","TotalWeight","Cost_Material","PaintArea","FireproofingArea","Deflection_Max","Moment_Max"],
} as const;

