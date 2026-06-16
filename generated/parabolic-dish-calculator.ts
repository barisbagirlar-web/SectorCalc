// Auto-generated from parabolic-dish-calculator-schema.json
import * as z from 'zod';

export interface Parabolic_dish_calculatorInput {
  cap: number;
  derinlik: number;
  frekans: number;
  verim: number;
}

export const Parabolic_dish_calculatorInputSchema = z.object({
  cap: z.number().default(1),
  derinlik: z.number().default(0.25),
  frekans: z.number().default(3000),
  verim: z.number().default(60),
});

function evaluateAllFormulas(input: Parabolic_dish_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cap ** 2 / (16 * input.derinlik); results["Odak Uzaklığı (m)"] = Number.isFinite(v) ? v : 0; } catch { results["Odak Uzaklığı (m)"] = 0; }
  try { const v = input.cap / (16 * input.derinlik); results["f/D Oranı"] = Number.isFinite(v) ? v : 0; } catch { results["f/D Oranı"] = 0; }
  try { const v = Math.PI * (input.cap / 2) ** 2; results["Açıklık Alanı (m²)"] = Number.isFinite(v) ? v : 0; } catch { results["Açıklık Alanı (m²)"] = 0; }
  try { const v = 299792458 / (input.frekans * 1e6); results["Dalga Boyu (m)"] = Number.isFinite(v) ? v : 0; } catch { results["Dalga Boyu (m)"] = 0; }
  try { const v = 70 * (299792458 / (input.frekans * 1e6)) / input.cap; results["Yarım Güç Hüzme Genişliği (°)"] = Number.isFinite(v) ? v : 0; } catch { results["Yarım Güç Hüzme Genişliği (°)"] = 0; }
  try { const v = 10 * Math.log10((Math.PI * input.cap / (299792458 / (input.frekans * 1e6))) ** 2 * (input.verim / 100)); results["Kazanç (dBi)"] = Number.isFinite(v) ? v : 0; } catch { results["Kazanç (dBi)"] = 0; }
  return results;
}


export function calculateParabolic_dish_calculator(input: Parabolic_dish_calculatorInput): Parabolic_dish_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Kazan"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
