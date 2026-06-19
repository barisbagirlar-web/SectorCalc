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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Parabolic_dish_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cap ** 2 / (16 * input.derinlik); results["Odak Uzaklığı (m)"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Odak Uzaklığı (m)"] = 0; }
  try { const v = input.cap / (16 * input.derinlik); results["f/D Oranı"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["f/D Oranı"] = 0; }
  try { const v = Math.PI * (input.cap / 2) ** 2; results["Açıklık Alanı (m²)"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Açıklık Alanı (m²)"] = 0; }
  try { const v = 299792458 / (input.frekans * 1e6); results["Dalga Boyu (m)"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Dalga Boyu (m)"] = 0; }
  try { const v = 70 * (299792458 / (input.frekans * 1e6)) / input.cap; results["Yarım Güç Hüzme Genişliği (°)"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Yarım Güç Hüzme Genişliği (°)"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateParabolic_dish_calculator(input: Parabolic_dish_calculatorInput): Parabolic_dish_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["Yar"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
