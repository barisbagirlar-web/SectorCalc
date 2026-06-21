// Auto-generated from dupont-roi-calculator-schema.json
import * as z from 'zod';

export interface Dupont_roi_calculatorInput {
  netKar: number;
  satislar: number;
  varliklar: number;
  ozsermaye: number;
  dataConfidence?: number;
}

export const Dupont_roi_calculatorInputSchema = z.object({
  netKar: z.number().min(0).default(150000),
  satislar: z.number().min(0).default(2000000),
  varliklar: z.number().min(0).default(3000000),
  ozsermaye: z.number().min(0).default(1500000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dupont_roi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.netKar / Math.max(1, input.satislar); results["karMarji"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["karMarji"] = Number.NaN; }
  try { const v = input.satislar / Math.max(1, input.varliklar); results["varlikDevri"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["varlikDevri"] = Number.NaN; }
  try { const v = input.varliklar / Math.max(1, input.ozsermaye); results["kaldırac"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["kaldırac"] = Number.NaN; }
  try { const v = (input.netKar / Math.max(1, input.satislar)) * (input.satislar / Math.max(1, input.varliklar)) * (input.varliklar / Math.max(1, input.ozsermaye)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDupont_roi_calculator(input: Dupont_roi_calculatorInput): Dupont_roi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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


export interface Dupont_roi_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Dupont_roi_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

