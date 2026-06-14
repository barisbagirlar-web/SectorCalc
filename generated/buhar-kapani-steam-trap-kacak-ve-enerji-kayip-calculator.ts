// Auto-generated from buhar-kapani-steam-trap-kacak-ve-enerji-kayip-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInput {
  steamPressure: number;
  orificeDiameter: number;
  steamCost: number;
  operatingHours: number;
  steamType: 'doymus' | 'kizgin';
  dischargeCoefficient: number;
}

export const BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInputSchema = z.object({
  steamPressure: z.number().min(0.5).max(30).default(7),
  orificeDiameter: z.number().min(0.5).max(25).default(3),
  steamCost: z.number().min(0).max(200).default(30),
  operatingHours: z.number().min(0).max(8760).default(8000),
  steamType: z.enum(['doymus', 'kizgin']).default('doymus'),
  dischargeCoefficient: z.number().min(0.5).max(0.9).default(0.65),
});

export interface BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorOutput {
  annualCost: number;
  breakdown: {
    leakRate: number;
    annualSteamLoss: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.leakRate = (() => { try { return 0.0001 * input.dischargeCoefficient * input.orificeDiameter^2 * Math.sqrt(input.steamPressure * 10) * (input.steamType === 'kizgin' ? 1.2 : 1.0); } catch { return 0; } })();
  results.annualSteamLoss = (() => { try { return results.leakRate * input.operatingHours; } catch { return 0; } })();
  results.annualCost = (() => { try { return results.annualSteamLoss * input.steamCost; } catch { return 0; } })();
  return results;
}

export function calculateBuharKapaniSteamTrapKacakVeEnerjiKayipCalculator(input: BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorInput): BuharKapaniSteamTrapKacakVeEnerjiKayipCalculatorOutput {
  const results = evaluateFormulas(input);
  const annualCost = results.annualCost ?? 0;
  const breakdown = {
    leakRate: results.leakRate,
    annualSteamLoss: results.annualSteamLoss,
  };

  // rule: steamPressure >= 0.5 ve <= 30
  // rule: orificeDiameter >= 0.5 ve <= 25
  // rule: steamCost >= 0
  // rule: operatingHours >= 0 ve <= 8760
  // rule: dischargeCoefficient >= 0.5 ve <= 0.9
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (leakRate > 50) hiddenLossDrivers.push("leakRate");
  if (annualCost > 10000) hiddenLossDrivers.push("annualCost");

  const dataConfidenceAdjusted = (() => { try { return results.annualCost * 0.9; } catch { return annualCost; } })();

  return {
    annualCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
