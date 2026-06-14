// Auto-generated from joule-kalori-watt-saat-cevirici-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface JouleKaloriWattSaatCeviriciInput {
  energyJoules: number;
  energyCalories: number;
  energyWattHours: number;
  conversionDirection: 'J_to_cal' | 'J_to_Wh' | 'cal_to_J' | 'cal_to_Wh' | 'Wh_to_J' | 'Wh_to_cal';
}

export const JouleKaloriWattSaatCeviriciInputSchema = z.object({
  energyJoules: z.number().min(0).default(0),
  energyCalories: z.number().min(0).default(0),
  energyWattHours: z.number().min(0).default(0),
  conversionDirection: z.enum(['J_to_cal', 'J_to_Wh', 'cal_to_J', 'cal_to_Wh', 'Wh_to_J', 'Wh_to_cal']).default('J_to_cal'),
});

export interface JouleKaloriWattSaatCeviriciOutput {
  result: number;
  breakdown: {
    inputUnit: number;
    outputUnit: number;
    conversionFactor: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: JouleKaloriWattSaatCeviriciInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.convertEnergy = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateJouleKaloriWattSaatCevirici(input: JouleKaloriWattSaatCeviriciInput): JouleKaloriWattSaatCeviriciOutput {
  const results = evaluateFormulas(input);
  const result = results.result ?? 0;
  const breakdown = {
    inputUnit: results.inputUnit,
    outputUnit: results.outputUnit,
    conversionFactor: results.conversionFactor,
  };

  // rule: Girilen enerji degerlerinden yalnizca biri sifirdan farkli olmalidir (digerleri 0 olmali).
  // rule: Enerji degerleri negatif olamaz.
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Enerji degeri 1e9 J'den buyukse 'Yuksek enerji seviyesi' uyarisi.
  // threshold skipped (non-JS): Enerji degeri 1e6 cal'den buyukse 'Yuksek enerji seviyesi' uyarisi.
  // threshold skipped (non-JS): Enerji degeri 1e6 Wh'den buyukse 'Yuksek enerji seviyesi' uyarisi.

  const dataConfidenceAdjusted = (() => { try { return dataConfidenceAdjusted; } catch { return result; } })();

  return {
    result,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
