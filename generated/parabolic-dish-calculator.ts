// Auto-generated from parabolic-dish-calculator-schema.json
import * as z from 'zod';

export interface Parabolic_dish_calculatorInput {
  cap: number;
  derinlik: number;
  frekans: number;
  verim: number;
  dataConfidence?: number;
}

export const Parabolic_dish_calculatorInputSchema = z.object({
  cap: z.number().default(1),
  derinlik: z.number().default(0.25),
  frekans: z.number().default(3000),
  verim: z.number().default(60),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Parabolic_dish_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cap ** 2 / (16 * input.derinlik); results["Odak Uzaklığı (m)"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Odak Uzaklığı (m)"] = Number.NaN; }
  try { const v = input.cap / (16 * input.derinlik); results["f/D Oranı"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["f/D Oranı"] = Number.NaN; }
  try { const v = Math.PI * (input.cap / 2) ** 2; results["Açıklık Alanı (m²)"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Açıklık Alanı (m²)"] = Number.NaN; }
  try { const v = 299792458 / (input.frekans * 1e6); results["Dalga Boyu (m)"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Dalga Boyu (m)"] = Number.NaN; }
  try { const v = 70 * (299792458 / (input.frekans * 1e6)) / input.cap; results["Yarım Güç Hüzme Genişliği (°)"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Yarım Güç Hüzme Genişliği (°)"] = Number.NaN; }
  return results;
}


export function calculateParabolic_dish_calculator(input: Parabolic_dish_calculatorInput): Parabolic_dish_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Yar"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Parabolic_dish_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
