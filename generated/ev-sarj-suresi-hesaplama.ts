// Auto-generated from ev-sarj-suresi-hesaplama-schema.json
import * as z from 'zod';

export interface Ev_sarj_suresi_hesaplamaInput {
  bataryaKapasite: number;
  sarjGuc: number;
  verim: number;
  dataConfidence?: number;
}

export const Ev_sarj_suresi_hesaplamaInputSchema = z.object({
  bataryaKapasite: z.number().min(0).default(60),
  sarjGuc: z.number().min(0).default(7.4),
  verim: z.number().min(0).default(90),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ev_sarj_suresi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bataryaKapasite / Math.max(0.0001, (input.sarjGuc * (input.verim / 100))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateEv_sarj_suresi_hesaplama(input: Ev_sarj_suresi_hesaplamaInput): Ev_sarj_suresi_hesaplamaOutput {
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
    unit: "hours",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Ev_sarj_suresi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ev_sarj_suresi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "hours",
  breakdownKeys: ["sonuc"],
} as const;

