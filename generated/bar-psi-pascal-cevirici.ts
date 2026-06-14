// Auto-generated from bar-psi-pascal-cevirici-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BarPsiPascalCeviriciInput {
  value: number;
  fromUnit: 'bar' | 'psi' | 'Pa';
  toUnit: 'bar' | 'psi' | 'Pa';
}

export const BarPsiPascalCeviriciInputSchema = z.object({
  value: z.number().min(0).default(1),
  fromUnit: z.enum(['bar', 'psi', 'Pa']).default('bar'),
  toUnit: z.enum(['bar', 'psi', 'Pa']).default('psi'),
});

export interface BarPsiPascalCeviriciOutput {
  convertedValue: number;
  breakdown: {

  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BarPsiPascalCeviriciInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.convertedValue = if (input.fromUnit == 'bar' && input.toUnit == 'psi') input.value * 14.503773773; else if (input.fromUnit == 'bar' && input.toUnit == 'Pa') input.value * 100000; else if (input.fromUnit == 'psi' && input.toUnit == 'bar') input.value / 14.503773773; else if (input.fromUnit == 'psi' && input.toUnit == 'Pa') input.value * 6894.757293; else if (input.fromUnit == 'Pa' && input.toUnit == 'bar') input.value / 100000; else if (input.fromUnit == 'Pa' && input.toUnit == 'psi') input.value / 6894.757293; else input.value;
  return results;
}

export function calculateBarPsiPascalCevirici(input: BarPsiPascalCeviriciInput): BarPsiPascalCeviriciOutput {
  const results = evaluateFormulas(input);
  const convertedValue = results.convertedValue;
  const breakdown = {

  };

  // rule: value >= 0
  // rule: fromUnit ve toUnit farklı olmalıdır
  // rule: value sayısal olmalıdır
  // threshold value: value > 1000 bar ise yüksek basınç uyarısı
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted = results.convertedValue;

  return {
    convertedValue,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF rapor","CSV export","Trend analizi","Karşılaştırma"],
  };
}
