// Auto-generated from atik-depolama-saha-hesaplama-schema.json
import * as z from 'zod';

export interface Atik_depolama_saha_hesaplamaInput {
  atikHacmi: number;
  sikistirma: number;
  derinlik: number;
  dataConfidence?: number;
}

export const Atik_depolama_saha_hesaplamaInputSchema = z.object({
  atikHacmi: z.number().min(0).default(50000),
  sikistirma: z.number().min(0).default(20),
  derinlik: z.number().min(0).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Atik_depolama_saha_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.atikHacmi * (1 - input.sikistirma / 100)) / Math.max(0.0001, input.derinlik); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateAtik_depolama_saha_hesaplama(input: Atik_depolama_saha_hesaplamaInput): Atik_depolama_saha_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["High environmental score may reduce operational costs.","Low ESG score may increase capital costs."];
  const suggestedActions: string[] = ["Set improvement targets for each ESG pillar.","Consider carbon offset programs for residual emissions."];
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
    unit: "m2",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Atik_depolama_saha_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Atik_depolama_saha_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "m2",
  breakdownKeys: ["sonuc"],
} as const;

