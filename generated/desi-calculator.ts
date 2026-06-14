// Auto-generated from desi-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface DesiCalculatorInput {
  length: number;
  width: number;
  height: number;
  weight: number;
  dimFactor: number;
  mode: 'air' | 'road' | 'sea' | 'rail';
}

export const DesiCalculatorInputSchema = z.object({
  length: z.number().min(0).default(0),
  width: z.number().min(0).default(0),
  height: z.number().min(0).default(0),
  weight: z.number().min(0).default(0),
  dimFactor: z.number().min(3000).max(7000).default(5000),
  mode: z.enum(['air', 'road', 'sea', 'rail']).default('air'),
});

export interface DesiCalculatorOutput {
  desiValue: number;
  breakdown: {
    volumetricWeight: number;
    chargeableWeight: number;
    actualWeight: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: DesiCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.volumetricWeight = ((): number => { try { const __v = (input.length * input.width * input.height) / input.dimFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.chargeableWeight = ((): number => { try { const __v = Math.max(input.weight, results.volumetricWeight); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.desiValue = ((): number => { try { const __v = results.chargeableWeight * 10; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateDesiCalculator(input: DesiCalculatorInput): DesiCalculatorOutput {
  const results = evaluateFormulas(input);
  const desiValue = results.desiValue ?? 0;
  const breakdown = {
    volumetricWeight: results.volumetricWeight,
    chargeableWeight: results.chargeableWeight,
    actualWeight: results.actualWeight,
  };

  // rule: length > 0
  // rule: width > 0
  // rule: height > 0
  // rule: weight > 0
  // rule: dimFactor >= 3000 && dimFactor <= 7000
  // rule: mode in ['air','road','sea','rail']
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Volumetric weight exceeds actual weight by more than 50%
  // threshold skipped (non-JS): Dimensional factor is below 4000, check carrier policy

  const dataConfidenceAdjusted = (() => { try { return results.desiValue; } catch { return desiValue; } })();

  return {
    desiValue,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Comparison with historical shipments","Detailed report with carrier-specific factors"],
  };
}
