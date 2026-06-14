// Auto-generated from square-meter-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SquareMeterCalculatorInput {
  length: number;
  width: number;
  shape: 'rectangle' | 'circle' | 'triangle' | 'trapezoid';
  radius: number;
  base: number;
  height: number;
  topBase: number;
}

export const SquareMeterCalculatorInputSchema = z.object({
  length: z.number().min(0).default(0),
  width: z.number().min(0).default(0),
  shape: z.enum(['rectangle', 'circle', 'triangle', 'trapezoid']).default('rectangle'),
  radius: z.number().min(0).default(0),
  base: z.number().min(0).default(0),
  height: z.number().min(0).default(0),
  topBase: z.number().min(0).default(0),
});

export interface SquareMeterCalculatorOutput {
  area: number;
  breakdown: {
    area: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SquareMeterCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.area = ((): number => { try { const __v = input.shape === 'rectangle' ? input.length * input.width : input.shape === 'circle' ? Math.PI * input.radius * input.radius : input.shape === 'triangle' ? 0.5 * input.base * input.height : input.shape === 'trapezoid' ? 0.5 * (input.base + input.topBase) * input.height : 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSquareMeterCalculator(input: SquareMeterCalculatorInput): SquareMeterCalculatorOutput {
  const results = evaluateFormulas(input);
  const area = results.area ?? 0;
  const breakdown = {
    area: results.area,
  };

  // rule: If shape is 'rectangle', length and width must be > 0.
  // rule: If shape is 'circle', radius must be > 0.
  // rule: If shape is 'triangle', base and height must be > 0.
  // rule: If shape is 'trapezoid', base, topBase, and height must be > 0.
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): If area > 10000, warning: 'Large area, consider breaking into smaller sections.'

  const dataConfidenceAdjusted = (() => { try { return results.area; } catch { return area; } })();

  return {
    area,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Comparison","Detailed report"],
  };
}
