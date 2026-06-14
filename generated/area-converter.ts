// Auto-generated from area-converter-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AreaConverterInput {
  value: number;
  fromUnit: 'm²' | 'km²' | 'ha' | 'acre' | 'ft²' | 'in²' | 'yd²' | 'mi²';
  toUnit: 'm²' | 'km²' | 'ha' | 'acre' | 'ft²' | 'in²' | 'yd²' | 'mi²';
}

export const AreaConverterInputSchema = z.object({
  value: z.number().min(0).default(1),
  fromUnit: z.enum(['m²', 'km²', 'ha', 'acre', 'ft²', 'in²', 'yd²', 'mi²']).default('m²'),
  toUnit: z.enum(['m²', 'km²', 'ha', 'acre', 'ft²', 'in²', 'yd²', 'mi²']).default('ft²'),
});

export interface AreaConverterOutput {
  result: number;
  breakdown: {
    valueInSqm: number;
    conversionFactor: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AreaConverterInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.result = (() => { try { return input.value * conversionFactors[input.fromUnit] / conversionFactors[input.toUnit]; } catch { return 0; } })();
  return results;
}

export function calculateAreaConverter(input: AreaConverterInput): AreaConverterOutput {
  const results = evaluateFormulas(input);
  const result = results.result ?? 0;
  const breakdown = {
    valueInSqm: results.valueInSqm,
    conversionFactor: results.conversionFactor,
  };

  // rule: value must be >= 0
  // rule: fromUnit and toUnit must be different
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];


  const dataConfidenceAdjusted = (() => { try { return results.result; } catch { return result; } })();

  return {
    result,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Comparison","Detailed report"],
  };
}
