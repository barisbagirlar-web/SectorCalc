// Auto-generated from roofing-area-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface RoofingAreaCalculatorInput {
  roofLength: number;
  roofWidth: number;
  roofPitch: number;
  overhang: number;
  wasteFactor: number;
  roofType: 'gable' | 'hip' | 'flat' | 'shed';
}

export const RoofingAreaCalculatorInputSchema = z.object({
  roofLength: z.number().min(0.1).max(1000).default(10),
  roofWidth: z.number().min(0.1).max(1000).default(8),
  roofPitch: z.number().min(0.1).max(2).default(0.5),
  overhang: z.number().min(0).max(1).default(0.3),
  wasteFactor: z.number().min(0).max(50).default(10),
  roofType: z.enum(['gable', 'hip', 'flat', 'shed']).default('gable'),
});

export interface RoofingAreaCalculatorOutput {
  finalArea: number;
  breakdown: {
    baseArea: number;
    slopedArea: number;
    overhangArea: number;
    materialArea: number;
    hipAdjustment: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: RoofingAreaCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.baseArea = ((): number => { try { const __v = input.roofLength * input.roofWidth; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.pitchFactor = ((): number => { try { const __v = Math.sqrt(1 + input.roofPitch^2); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.slopedArea = ((): number => { try { const __v = results.baseArea * results.pitchFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overhangArea = ((): number => { try { const __v = (input.roofLength + 2*input.overhang) * (input.roofWidth + 2*input.overhang) * results.pitchFactor - results.slopedArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalArea = ((): number => { try { const __v = results.slopedArea + results.overhangArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialArea = ((): number => { try { const __v = results.totalArea * (1 + input.wasteFactor/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.hipAdjustment = ((): number => { try { const __v = input.roofType == 'hip' ? results.totalArea * 0.05 : 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.finalArea = ((): number => { try { const __v = results.materialArea + results.hipAdjustment; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateRoofingAreaCalculator(input: RoofingAreaCalculatorInput): RoofingAreaCalculatorOutput {
  const results = evaluateFormulas(input);
  const finalArea = results.finalArea ?? 0;
  const breakdown = {
    baseArea: results.baseArea,
    slopedArea: results.slopedArea,
    overhangArea: results.overhangArea,
    materialArea: results.materialArea,
    hipAdjustment: results.hipAdjustment,
  };

  // rule: roofLength > 0
  // rule: roofWidth > 0
  // rule: roofPitch between 0.1 and 2.0
  // rule: overhang >= 0
  // rule: wasteFactor between 0 and 50
  // rule: if roofType == 'flat' then roofPitch must be <= 0.25
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High waste factor may indicate inefficiency; consider optimizing cuts.
  // threshold skipped (non-JS): Steep roof; safety precautions required for installation.

  const dataConfidenceAdjusted = (() => { try { return results.finalArea * (1 - 0.05); } catch { return finalArea; } })();

  return {
    finalArea,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with historical projects","Detailed material breakdown report"],
  };
}
