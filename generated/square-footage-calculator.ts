// Auto-generated from square-footage-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SquareFootageCalculatorInput {
  length: number;
  width: number;
  shape: 'rectangle' | 'circle' | 'triangle';
  radius: number;
  base: number;
  height: number;
}

export const SquareFootageCalculatorInputSchema = z.object({
  length: z.number().min(0).default(0),
  width: z.number().min(0).default(0),
  shape: z.enum(['rectangle', 'circle', 'triangle']).default('rectangle'),
  radius: z.number().min(0).default(0),
  base: z.number().min(0).default(0),
  height: z.number().min(0).default(0),
});

export interface SquareFootageCalculatorOutput {
  squareFootage: number;
  breakdown: {

  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SquareFootageCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.squareFootage = ((): number => { try { const __v = input.shape === 'rectangle' ? input.length * input.width : input.shape === 'circle' ? Math.PI * input.radius * input.radius : input.shape === 'triangle' ? 0.5 * input.base * input.height : 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSquareFootageCalculator(input: SquareFootageCalculatorInput): SquareFootageCalculatorOutput {
  const results = evaluateFormulas(input);
  const squareFootage = results.squareFootage ?? 0;
  const breakdown = {

  };

  // rule: If shape is 'rectangle', length and width must be > 0.
  // rule: If shape is 'circle', radius must be > 0.
  // rule: If shape is 'triangle', base and height must be > 0.
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];


  const dataConfidenceAdjusted = (() => { try { return squareFootage; } catch { return squareFootage; } })();

  return {
    squareFootage,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Comparison","Detailed report"],
  };
}
