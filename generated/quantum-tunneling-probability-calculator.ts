// Auto-generated from quantum-tunneling-probability-calculator-schema.json
import * as z from 'zod';

export interface Quantum_tunneling_probability_calculatorInput {
  engelGenisligi: number;
  engelYuksekligi: number;
  enerji: number;
  kutle: number;
  dataConfidence?: number;
}

export const Quantum_tunneling_probability_calculatorInputSchema = z.object({
  engelGenisligi: z.number().min(0).default(1e-10),
  engelYuksekligi: z.number().min(0).default(1.6e-19),
  enerji: z.number().min(0).default(8e-20),
  kutle: z.number().min(0).default(9.11e-31),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Quantum_tunneling_probability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1.054e-34; results["hbar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hbar"] = Number.NaN; }
  try { const v = Math.exp(-2 * Math.sqrt(Math.max(0, 2 * input.kutle * (input.engelYuksekligi - input.enerji))) / 1.054e-34 * input.engelGenisligi) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateQuantum_tunneling_probability_calculator(input: Quantum_tunneling_probability_calculatorInput): Quantum_tunneling_probability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Quantum effects are only observable at microscopic scales.","These are idealized models."];
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


export interface Quantum_tunneling_probability_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Quantum_tunneling_probability_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

