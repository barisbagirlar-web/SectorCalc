// Auto-generated from ev-menzil-hesaplama-schema.json
import * as z from 'zod';

export interface Ev_menzil_hesaplamaInput {
  bataryaEnerji: number;
  tuketim: number;
  verim: number;
  dataConfidence?: number;
}

export const Ev_menzil_hesaplamaInputSchema = z.object({
  bataryaEnerji: z.number().min(0).default(60),
  tuketim: z.number().min(0).default(180),
  verim: z.number().min(0).default(90),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ev_menzil_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.bataryaEnerji * 1000 * (input.verim / 100)) / Math.max(0.0001, input.tuketim); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateEv_menzil_hesaplama(input: Ev_menzil_hesaplamaInput): Ev_menzil_hesaplamaOutput {
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
    unit: "km",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Ev_menzil_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ev_menzil_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "km",
  breakdownKeys: ["sonuc"],
} as const;

