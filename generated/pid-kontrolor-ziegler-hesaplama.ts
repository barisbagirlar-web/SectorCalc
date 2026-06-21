// Auto-generated from pid-kontrolor-ziegler-hesaplama-schema.json
import * as z from 'zod';

export interface Pid_kontrolor_ziegler_hesaplamaInput {
  kritikKazanc: number;
  kritikPeriyot: number;
  dataConfidence?: number;
}

export const Pid_kontrolor_ziegler_hesaplamaInputSchema = z.object({
  kritikKazanc: z.number().min(0).default(5),
  kritikPeriyot: z.number().min(0).default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pid_kontrolor_ziegler_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.6 * input.kritikKazanc; results["Kp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Kp"] = Number.NaN; }
  try { const v = 2 * (0.6 * input.kritikKazanc) / Math.max(0.0001, input.kritikPeriyot); results["Ki"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Ki"] = Number.NaN; }
  try { const v = (0.6 * input.kritikKazanc) * input.kritikPeriyot / 8; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculatePid_kontrolor_ziegler_hesaplama(input: Pid_kontrolor_ziegler_hesaplamaInput): Pid_kontrolor_ziegler_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    Kp: toNumericFormulaValue(values["Kp"]),
    Ki: toNumericFormulaValue(values["Ki"]),
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["High asymmetry increases injury risk.","Low H-index may indicate limited academic impact."];
  const suggestedActions: string[] = ["Balance training for injury prevention.","Use peer review to validate research quality."];
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
    unit: "Kd",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Pid_kontrolor_ziegler_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Kp: number; Ki: number; sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Pid_kontrolor_ziegler_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "Kd",
  breakdownKeys: ["Kp","Ki","sonuc"],
} as const;

