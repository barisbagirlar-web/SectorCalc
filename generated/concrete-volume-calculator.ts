// Auto-generated from concrete-volume-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ConcreteVolumeCalculatorInput {
  length: number;
  width: number;
  height: number;
  shape: 'rectangular' | 'circular' | 'custom';
  diameter: number;
  quantity: number;
  wasteFactor: number;
  unitCost: number;
}

export const ConcreteVolumeCalculatorInputSchema = z.object({
  length: z.number().min(0).max(1000).default(0),
  width: z.number().min(0).max(1000).default(0),
  height: z.number().min(0).max(100).default(0),
  shape: z.enum(['rectangular', 'circular', 'custom']).default('rectangular'),
  diameter: z.number().min(0).max(100).default(0),
  quantity: z.number().min(1).max(10000).default(1),
  wasteFactor: z.number().min(0).max(50).default(5),
  unitCost: z.number().min(0).max(1000).default(120),
});

export interface ConcreteVolumeCalculatorOutput {
  totalCost: number;
  breakdown: {
    netVolume: number;
    totalVolume: number;
    totalCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ConcreteVolumeCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.netVolume = ((): number => { try { const __v = input.shape === 'rectangular' ? input.length * input.width * input.height : input.shape === 'circular' ? Math.PI * (input.diameter/2)**2 * input.height : 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalVolume = ((): number => { try { const __v = results.netVolume * input.quantity * (1 + input.wasteFactor/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalVolume * input.unitCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateConcreteVolumeCalculator(input: ConcreteVolumeCalculatorInput): ConcreteVolumeCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    netVolume: results.netVolume,
    totalVolume: results.totalVolume,
    totalCost: results.totalCost,
  };

  // rule: If shape is 'circular', diameter must be > 0 and length, width, height must be 0.
  // rule: If shape is 'rectangular', length, width, height must be > 0 and diameter must be 0.
  // rule: If shape is 'custom', additional inputs may be required (not implemented).
  // rule: length, width, height, diameter must be non-negative.
  // rule: quantity must be integer >= 1.
  // rule: wasteFactor must be between 0 and 50.
  // rule: unitCost must be > 0.
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Warning: High waste factor may indicate inefficiency.
  // threshold skipped (non-JS): Warning: Concrete cost is above typical market range.

  const dataConfidenceAdjusted = (() => { try { return results.totalCost; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with benchmarks","Detailed report with cost breakdown"],
  };
}
