// Auto-generated from overall-equipment-effectiveness-calculator-schema.json
import * as z from 'zod';

export interface Overall_equipment_effectiveness_calculatorInput {
  kullanilabilirlik: number;
  performans: number;
  kalite: number;
  dataConfidence?: number;
}

export const Overall_equipment_effectiveness_calculatorInputSchema = z.object({
  kullanilabilirlik: z.number().min(0).max(100).default(90),
  performans: z.number().min(0).max(100).default(85),
  kalite: z.number().min(0).max(100).default(98),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Overall_equipment_effectiveness_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.kullanilabilirlik / 100) * (input.performans / 100) * (input.kalite / 100) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateOverall_equipment_effectiveness_calculator(input: Overall_equipment_effectiveness_calculatorInput): Overall_equipment_effectiveness_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Conduct regular OEE audits for improvement.","Use SMED to reduce setup times."];
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


export interface Overall_equipment_effectiveness_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Overall_equipment_effectiveness_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

