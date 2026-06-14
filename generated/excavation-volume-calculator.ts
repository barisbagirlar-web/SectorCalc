// Auto-generated from excavation-volume-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ExcavationVolumeCalculatorInput {
  length: number;
  width: number;
  depth: number;
  slopeAngle: number;
  soilType: 'Type A' | 'Type B' | 'Type C';
  swellFactor: number;
  compactionFactor: number;
}

export const ExcavationVolumeCalculatorInputSchema = z.object({
  length: z.number().min(0).default(10),
  width: z.number().min(0).default(5),
  depth: z.number().min(0).default(3),
  slopeAngle: z.number().min(0).max(90).default(30),
  soilType: z.enum(['Type A', 'Type B', 'Type C']).default('Type A'),
  swellFactor: z.number().min(0).max(100).default(25),
  compactionFactor: z.number().min(0).max(100).default(90),
});

export interface ExcavationVolumeCalculatorOutput {
  compactedVolume: number;
  breakdown: {
    bankVolume: number;
    slopeAdjustedVolume: number;
    looseVolume: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ExcavationVolumeCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.bankVolume = ((): number => { try { const __v = input.length * input.width * input.depth; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.slopeAdjustedVolume = ((): number => { try { const __v = results.bankVolume + (0.5 * input.depth * input.depth * (input.length + input.width) * tan(input.slopeAngle * PI / 180)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.looseVolume = ((): number => { try { const __v = results.slopeAdjustedVolume * (1 + input.swellFactor / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.compactedVolume = ((): number => { try { const __v = results.looseVolume * (input.compactionFactor / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.primary = ((): number => { try { const __v = results.compactedVolume; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateExcavationVolumeCalculator(input: ExcavationVolumeCalculatorInput): ExcavationVolumeCalculatorOutput {
  const results = evaluateFormulas(input);
  const compactedVolume = results.compactedVolume ?? 0;
  const breakdown = {
    bankVolume: results.bankVolume,
    slopeAdjustedVolume: results.slopeAdjustedVolume,
    looseVolume: results.looseVolume,
  };

  // rule: length > 0
  // rule: width > 0
  // rule: depth > 0
  // rule: slopeAngle >= 0 and slopeAngle <= 90
  // rule: swellFactor >= 0 and swellFactor <= 100
  // rule: compactionFactor >= 0 and compactionFactor <= 100
  // rule: if soilType == 'Type A' then slopeAngle <= 34
  // rule: if soilType == 'Type B' then slopeAngle <= 45
  // rule: if soilType == 'Type C' then slopeAngle <= 53
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Deep excavation warning: additional shoring may be required.
  // threshold skipped (non-JS): Steep slope warning: risk of collapse.
  // threshold skipped (non-JS): High swell factor: consider material handling costs.

  const dataConfidenceAdjusted = (() => { try { return results.compactedVolume * (1 - (1 - dataConfidence) * 0.1); } catch { return compactedVolume; } })();

  return {
    compactedVolume,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with historical projects","Detailed report with cost estimation"],
  };
}
