// Auto-generated from paint-coverage-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PaintCoverageCalculatorInput {
  paintVolume: number;
  coverageRate: number;
  numberOfCoats: number;
  surfaceArea: number;
  wasteFactor: number;
  paintType: 'latex' | 'oil' | 'acrylic' | 'enamel';
  surfaceCondition: 'smooth' | 'rough' | 'porous';
  applicationMethod: 'brush' | 'roller' | 'spray';
}

export const PaintCoverageCalculatorInputSchema = z.object({
  paintVolume: z.number().min(0.1).max(1000).default(1),
  coverageRate: z.number().min(1).max(50).default(10),
  numberOfCoats: z.number().min(1).max(5).default(2),
  surfaceArea: z.number().min(1).max(10000).default(100),
  wasteFactor: z.number().min(0).max(50).default(10),
  paintType: z.enum(['latex', 'oil', 'acrylic', 'enamel']).default('latex'),
  surfaceCondition: z.enum(['smooth', 'rough', 'porous']).default('smooth'),
  applicationMethod: z.enum(['brush', 'roller', 'spray']).default('brush'),
});

export interface PaintCoverageCalculatorOutput {
  totalPaintNeeded: number;
  breakdown: {
    paintUtilization: number;
    coverageEfficiency: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PaintCoverageCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalPaintNeeded = ((): number => { try { const __v = input.surfaceArea * input.numberOfCoats / (input.coverageRate * (1 - input.wasteFactor/100)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.paintUtilization = ((): number => { try { const __v = input.paintVolume / results.totalPaintNeeded * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.coverageEfficiency = ((): number => { try { const __v = input.surfaceArea * input.numberOfCoats / (input.paintVolume * input.coverageRate) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePaintCoverageCalculator(input: PaintCoverageCalculatorInput): PaintCoverageCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalPaintNeeded = results.totalPaintNeeded ?? 0;
  const breakdown = {
    paintUtilization: results.paintUtilization,
    coverageEfficiency: results.coverageEfficiency,
  };

  // rule: paintVolume > 0
  // rule: coverageRate > 0
  // rule: numberOfCoats >= 1
  // rule: surfaceArea > 0
  // rule: wasteFactor >= 0
  // rule: if applicationMethod == 'spray' then wasteFactor >= 15
  // rule: if surfaceCondition == 'rough' then coverageRate <= 8
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High waste factor; consider improving application technique.
  // threshold skipped (non-JS): Low coverage rate; check paint quality or surface preparation.
  // threshold skipped (non-JS): Multiple coats may indicate poor coverage; consider primer.

  const dataConfidenceAdjusted = (() => { try { return results.totalPaintNeeded * (1 + (1 - dataConfidence/100)); } catch { return totalPaintNeeded; } })();

  return {
    totalPaintNeeded,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Comparison with benchmarks","Detailed report with cost analysis"],
  };
}
