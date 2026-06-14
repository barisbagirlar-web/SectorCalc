// Auto-generated from volume-converter-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface VolumeConverterInput {
  volume: number;
  fromUnit: 'cubicMeters' | 'liters' | 'gallons' | 'cubicFeet' | 'barrels';
  toUnit: 'cubicMeters' | 'liters' | 'gallons' | 'cubicFeet' | 'barrels';
}

export const VolumeConverterInputSchema = z.object({
  volume: z.number().min(0).default(1),
  fromUnit: z.enum(['cubicMeters', 'liters', 'gallons', 'cubicFeet', 'barrels']).default('cubicMeters'),
  toUnit: z.enum(['cubicMeters', 'liters', 'gallons', 'cubicFeet', 'barrels']).default('liters'),
});

export interface VolumeConverterOutput {
  result: number;
  breakdown: {
    volumeInCubicMeters: number;
    conversionFactorUsed: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: VolumeConverterInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.conversionFactor = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateVolumeConverter(input: VolumeConverterInput): VolumeConverterOutput {
  const results = evaluateFormulas(input);
  const result = results.result ?? 0;
  const breakdown = {
    volumeInCubicMeters: results.volumeInCubicMeters,
    conversionFactorUsed: results.conversionFactorUsed,
  };

  // rule: volume >= 0
  // rule: fromUnit != toUnit
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];


  const dataConfidenceAdjusted = (() => { try { return result; } catch { return result; } })();

  return {
    result,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","trend analysis","comparison","detailed report"],
  };
}
