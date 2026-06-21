// Auto-generated from fore-kazik-tasiyicilik-hesaplama-schema.json
import * as z from 'zod';

export interface Fore_kazik_tasiyicilik_hesaplamaInput {
  cap: number;
  boy: number;
  kohezyon: number;
  suratme: number;
  dataConfidence?: number;
}

export const Fore_kazik_tasiyicilik_hesaplamaInputSchema = z.object({
  cap: z.number().min(0).default(0.6),
  boy: z.number().min(0).default(15),
  kohezyon: z.number().min(0).default(100),
  suratme: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fore_kazik_tasiyicilik_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (Math.PI * Math.pow(input.cap / 2, 2)) * (9 * input.kohezyon); results["ucDayanimi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ucDayanimi"] = Number.NaN; }
  try { const v = Math.PI * input.cap * input.boy * input.suratme; results["yuzeySuratmesi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yuzeySuratmesi"] = Number.NaN; }
  try { const v = ((Math.PI * Math.pow(input.cap / 2, 2)) * (9 * input.kohezyon)) + (Math.PI * input.cap * input.boy * input.suratme); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateFore_kazik_tasiyicilik_hesaplama(input: Fore_kazik_tasiyicilik_hesaplamaInput): Fore_kazik_tasiyicilik_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low efficiency may indicate equipment or process issues."];
  const suggestedActions: string[] = ["Calibrate all measuring equipment regularly.","Use site-specific data when available."];
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
    unit: "kN",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Fore_kazik_tasiyicilik_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Fore_kazik_tasiyicilik_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "kN",
  breakdownKeys: ["sonuc"],
} as const;

