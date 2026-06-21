// Auto-generated from standard-deviation-variance-calculator-schema.json
import * as z from 'zod';

export interface Standard_deviation_variance_calculatorInput {
  deger1: number;
  deger2: number;
  deger3: number;
  deger4: number;
  deger5: number;
  dataConfidence?: number;
}

export const Standard_deviation_variance_calculatorInputSchema = z.object({
  deger1: z.number().min(0).default(10),
  deger2: z.number().min(0).default(20),
  deger3: z.number().min(0).default(30),
  deger4: z.number().min(0).default(40),
  deger5: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Standard_deviation_variance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.deger1 + input.deger2 + input.deger3 + input.deger4 + input.deger5) / 5; results["ort"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ort"] = Number.NaN; }
  try { const v = Math.sqrt((Math.pow(input.deger1 - (input.deger1+input.deger2+input.deger3+input.deger4+input.deger5)/5, 2) + Math.pow(input.deger2 - (input.deger1+input.deger2+input.deger3+input.deger4+input.deger5)/5, 2) + Math.pow(input.deger3 - (input.deger1+input.deger2+input.deger3+input.deger4+input.deger5)/5, 2) + Math.pow(input.deger4 - (input.deger1+input.deger2+input.deger3+input.deger4+input.deger5)/5, 2) + Math.pow(input.deger5 - (input.deger1+input.deger2+input.deger3+input.deger4+input.deger5)/5, 2)) / 4); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateStandard_deviation_variance_calculator(input: Standard_deviation_variance_calculatorInput): Standard_deviation_variance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify statistical assumptions before making decisions.","Use larger sample sizes for better accuracy."];
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
    unit: "number",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Standard_deviation_variance_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Standard_deviation_variance_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "number",
  breakdownKeys: ["sonuc"],
} as const;

