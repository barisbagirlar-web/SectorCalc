// Auto-generated from motor-tork-devri-hesaplama-schema.json
import * as z from 'zod';

export interface Motor_tork_devri_hesaplamaInput {
  guc: number;
  devir: number;
  dataConfidence?: number;
}

export const Motor_tork_devri_hesaplamaInputSchema = z.object({
  guc: z.number().min(0).default(100),
  devir: z.number().min(0).default(3000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Motor_tork_devri_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.guc * 9550) / Math.max(0.0001, input.devir); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateMotor_tork_devri_hesaplama(input: Motor_tork_devri_hesaplamaInput): Motor_tork_devri_hesaplamaOutput {
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
    unit: "N.m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Motor_tork_devri_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Motor_tork_devri_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "N.m",
  breakdownKeys: ["sonuc"],
} as const;

