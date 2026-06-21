// Auto-generated from indike-beygir-gucu-ihp-hesaplama-schema.json
import * as z from 'zod';

export interface Indike_beygir_gucu_ihp_hesaplamaInput {
  basinc: number;
  strok: number;
  alan: number;
  devir: number;
  dataConfidence?: number;
}

export const Indike_beygir_gucu_ihp_hesaplamaInputSchema = z.object({
  basinc: z.number().min(0).default(1000000),
  strok: z.number().min(0).default(0.1),
  alan: z.number().min(0).default(0.01),
  devir: z.number().min(0).default(3000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Indike_beygir_gucu_ihp_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (1e6 * 0.1 * 0.01 * 3000) / 60000; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateIndike_beygir_gucu_ihp_hesaplama(input: Indike_beygir_gucu_ihp_hesaplamaInput): Indike_beygir_gucu_ihp_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["High fuel/energy consumption indicates efficiency losses."];
  const suggestedActions: string[] = ["Regular maintenance improves overall equipment efficiency.","Simulate real-world driving conditions for accurate range estimates."];
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
    unit: "kW",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Indike_beygir_gucu_ihp_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Indike_beygir_gucu_ihp_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "kW",
  breakdownKeys: ["sonuc"],
} as const;

