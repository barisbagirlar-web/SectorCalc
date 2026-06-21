// Auto-generated from runway-length-calculator-schema.json
import * as z from 'zod';

export interface Runway_length_calculatorInput {
  kalkisHiz: number;
  ivme: number;
  ruzgarHiz: number;
  dataConfidence?: number;
}

export const Runway_length_calculatorInputSchema = z.object({
  kalkisHiz: z.number().min(0).default(80),
  ivme: z.number().min(0).default(3),
  ruzgarHiz: z.number().min(0).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Runway_length_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.kalkisHiz - input.ruzgarHiz; results["etkiliHiz"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["etkiliHiz"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["etkiliHiz"])) * (toNumericFormulaValue(results["etkiliHiz"]))) / Math.max(0.0001, (2 * input.ivme)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateRunway_length_calculator(input: Runway_length_calculatorInput): Runway_length_calculatorOutput {
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
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Runway_length_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Runway_length_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: ["sonuc"],
} as const;

