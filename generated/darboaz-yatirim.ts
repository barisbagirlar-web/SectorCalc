// Auto-generated from darboaz-yatirim-schema.json
import * as z from 'zod';

export interface Darboaz_yatirimInput {
  tasarimGercekKapasite: number;
  talep: number;
  darbogazSuresi: number;
  taktTime: number;
  oEE: number;
  yatirimBedeli: number;
  marj: number;
  dataConfidence?: number;
}

export const Darboaz_yatirimInputSchema = z.object({
  tasarimGercekKapasite: z.number().min(0).default(0),
  talep: z.number().min(0).default(0),
  darbogazSuresi: z.number().min(0).default(0),
  taktTime: z.number().min(0).default(0),
  oEE: z.number().min(0).default(0),
  yatirimBedeli: z.number().min(0).default(0),
  marj: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Darboaz_yatirimInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tasarimGercekKapasite * input.talep * input.darbogazSuresi * input.taktTime; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.tasarimGercekKapasite * input.talep * input.darbogazSuresi * input.taktTime * (input.oEE * input.yatirimBedeli * input.marj); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.oEE * input.yatirimBedeli * input.marj; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateDarboaz_yatirim(input: Darboaz_yatirimInput): Darboaz_yatirimOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    normalized_product: toNumericFormulaValue(values["normalized_product"]),
    adjustment_factor: toNumericFormulaValue(values["adjustment_factor"])
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    unit: "units",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Darboaz_yatirimOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Darboaz_yatirimOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

