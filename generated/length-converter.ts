// Auto-generated from length-converter-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface LengthConverterInput {
  value: number;
  fromUnit: 'm' | 'km' | 'cm' | 'mm' | 'μm' | 'nm' | 'mi' | 'yd' | 'ft' | 'in' | 'nmi';
  toUnit: 'm' | 'km' | 'cm' | 'mm' | 'μm' | 'nm' | 'mi' | 'yd' | 'ft' | 'in' | 'nmi';
}

export const LengthConverterInputSchema = z.object({
  value: z.number().min(0).default(1),
  fromUnit: z.enum(['m', 'km', 'cm', 'mm', 'μm', 'nm', 'mi', 'yd', 'ft', 'in', 'nmi']).default('m'),
  toUnit: z.enum(['m', 'km', 'cm', 'mm', 'μm', 'nm', 'mi', 'yd', 'ft', 'in', 'nmi']).default('ft'),
});

export interface LengthConverterOutput {
  result: number;
  breakdown: {
    inputValue: number;
    fromUnit: number;
    toUnit: number;
    conversionFactor: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: LengthConverterInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.conversionFactor = ((): number => { try { const __v = getConversionFactor(input.fromUnit, input.toUnit); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.result = ((): number => { try { const __v = input.value * results.conversionFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateLengthConverter(input: LengthConverterInput): LengthConverterOutput {
  const results = evaluateFormulas(input);
  const result = results.result ?? 0;
  const breakdown = {
    inputValue: results.inputValue,
    fromUnit: results.fromUnit,
    toUnit: results.toUnit,
    conversionFactor: results.conversionFactor,
  };

  // rule: value must be >= 0
  // rule: fromUnit and toUnit must be different
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if value > 1e6, warn 'Large value may cause precision issues'

  const dataConfidenceAdjusted = (() => { try { return results.result; } catch { return result; } })();

  return {
    result,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison","Detailed Report"],
  };
}
