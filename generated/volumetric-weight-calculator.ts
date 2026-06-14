// Auto-generated from volumetric-weight-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface VolumetricWeightCalculatorInput {
  length: number;
  width: number;
  height: number;
  actualWeight: number;
  dimFactor: '5000' | '6000' | '7000';
}

export const VolumetricWeightCalculatorInputSchema = z.object({
  length: z.number().min(0).default(0),
  width: z.number().min(0).default(0),
  height: z.number().min(0).default(0),
  actualWeight: z.number().min(0).default(0),
  dimFactor: z.enum(['5000', '6000', '7000']).default('6000'),
});

export interface VolumetricWeightCalculatorOutput {
  chargeableWeight: number;
  breakdown: {
    volumetricWeight: number;
    actualWeight: number;
    weightDifference: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: VolumetricWeightCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.volumetricWeight = ((): number => { try { const __v = (Number(input.dimFactor) > 0 ? (input.length * input.width * input.height) / (Number(input.dimFactor) || 0) : 0); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.chargeableWeight = ((): number => { try { const __v = Math.max(input.actualWeight, results.volumetricWeight); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.weightDifference = ((): number => { try { const __v = results.chargeableWeight - input.actualWeight; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateVolumetricWeightCalculator(input: VolumetricWeightCalculatorInput): VolumetricWeightCalculatorOutput {
  const results = evaluateFormulas(input);
  const chargeableWeight = results.chargeableWeight ?? 0;
  const breakdown = {
    volumetricWeight: results.volumetricWeight,
    actualWeight: results.actualWeight,
    weightDifference: results.weightDifference,
  };

  // rule: length > 0
  // rule: width > 0
  // rule: height > 0
  // rule: actualWeight > 0
  // rule: dimFactor must be one of 5000, 6000, 7000
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High volume-to-weight ratio; consider repackaging
  // threshold skipped (non-JS): Dense package; check for potential damage

  const dataConfidenceAdjusted = (() => { try { return results.chargeableWeight; } catch { return chargeableWeight; } })();

  return {
    chargeableWeight,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Comparison with carrier-specific factors","Detailed report with breakdown"],
  };
}
