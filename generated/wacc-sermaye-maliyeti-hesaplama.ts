// Auto-generated from wacc-sermaye-maliyeti-hesaplama-schema.json
import * as z from 'zod';

export interface Wacc_sermaye_maliyeti_hesaplamaInput {
  E: number;
  D: number;
  Re: number;
  Rd: number;
  vergi: number;
  dataConfidence?: number;
}

export const Wacc_sermaye_maliyeti_hesaplamaInputSchema = z.object({
  E: z.number().min(0).default(1000000),
  D: z.number().min(0).default(500000),
  Re: z.number().min(0).default(15),
  Rd: z.number().min(0).default(10),
  vergi: z.number().min(0).default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wacc_sermaye_maliyeti_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.E + input.D; results["V"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["V"] = Number.NaN; }
  try { const v = (input.E / Math.max(1, input.E + input.D) * input.Re) + (input.D / Math.max(1, input.E + input.D) * input.Rd * (1 - input.vergi / 100)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateWacc_sermaye_maliyeti_hesaplama(input: Wacc_sermaye_maliyeti_hesaplamaInput): Wacc_sermaye_maliyeti_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Wacc_sermaye_maliyeti_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Wacc_sermaye_maliyeti_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

