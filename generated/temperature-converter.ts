// Auto-generated from temperature-converter-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface TemperatureConverterInput {
  temperatureValue: number;
  fromUnit: 'Celsius' | 'Fahrenheit' | 'Kelvin';
  toUnit: 'Celsius' | 'Fahrenheit' | 'Kelvin';
}

export const TemperatureConverterInputSchema = z.object({
  temperatureValue: z.number().min(-273.15).default(0),
  fromUnit: z.enum(['Celsius', 'Fahrenheit', 'Kelvin']).default('Celsius'),
  toUnit: z.enum(['Celsius', 'Fahrenheit', 'Kelvin']).default('Fahrenheit'),
});

export interface TemperatureConverterOutput {
  result: number;
  breakdown: {
    celsiusIntermediate: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: TemperatureConverterInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.convertToCelsius = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.convertFromCelsius = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.result = ((): number => { try { const __v = results.convertFromCelsius(results.convertToCelsius(input.temperatureValue, input.fromUnit), input.toUnit); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateTemperatureConverter(input: TemperatureConverterInput): TemperatureConverterOutput {
  const results = evaluateFormulas(input);
  const result = results.result ?? 0;
  const breakdown = {
    celsiusIntermediate: results.celsiusIntermediate,
  };

  // rule: temperatureValue >= -273.15
  // rule: fromUnit != toUnit
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Temperature below absolute zero is physically impossible.
  // threshold skipped (non-JS): Extreme temperature, verify input.

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
