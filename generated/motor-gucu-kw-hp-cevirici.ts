// Auto-generated from motor-gucu-kw-hp-cevirici-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface MotorGucuKwHpCeviriciInput {
  powerKw: number;
  powerHp: number;
  conversionType: 'kWtoHP' | 'HPtoKW';
}

export const MotorGucuKwHpCeviriciInputSchema = z.object({
  powerKw: z.number().min(0).default(0),
  powerHp: z.number().min(0).default(0),
  conversionType: z.enum(['kWtoHP', 'HPtoKW']).default('kWtoHP'),
});

export interface MotorGucuKwHpCeviriciOutput {
  convertedPower: number;
  breakdown: {
    inputPower: number;
    conversionFactor: number;
    outputUnit: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: MotorGucuKwHpCeviriciInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.convertedPower = ((): number => { try { const __v = input.conversionType === 'kWtoHP' ? input.powerKw * 1.35962 : input.powerHp * 0.7355; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.primaryResult = ((): number => { try { const __v = results.convertedPower; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateMotorGucuKwHpCevirici(input: MotorGucuKwHpCeviriciInput): MotorGucuKwHpCeviriciOutput {
  const results = evaluateFormulas(input);
  const convertedPower = results.convertedPower ?? 0;
  const breakdown = {
    inputPower: results.inputPower,
    conversionFactor: results.conversionFactor,
    outputUnit: results.outputUnit,
  };

  // rule: powerKw >= 0
  // rule: powerHp >= 0
  // rule: Eger conversionType='kWtoHP' ise powerKw > 0
  // rule: Eger conversionType='HPtoKW' ise powerHp > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Eger powerKw > 1000 ise 'Yuksek guc seviyesi'
  // threshold skipped (non-JS): Eger powerHp > 1341 ise 'Yuksek guc seviyesi'

  const dataConfidenceAdjusted = (() => { try { return results.convertedPower; } catch { return convertedPower; } })();

  return {
    convertedPower,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison"],
  };
}
