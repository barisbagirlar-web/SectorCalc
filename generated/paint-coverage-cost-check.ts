// Auto-generated from paint-coverage-cost-check-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PaintCoverageCostCheckInput {
  paintType: 'latex' | 'oil' | 'acrylic' | 'enamel';
  surfaceArea: number;
  coveragePerLiter: number;
  costPerLiter: number;
  numberOfCoats: number;
  laborCostPerHour: number;
  laborProductivity: number;
  wasteFactor: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const PaintCoverageCostCheckInputSchema = z.object({
  paintType: z.enum(['latex', 'oil', 'acrylic', 'enamel']).default('latex'),
  surfaceArea: z.number().min(1).max(10000).default(100),
  coveragePerLiter: z.number().min(1).max(50).default(10),
  costPerLiter: z.number().min(1).max(200).default(20),
  numberOfCoats: z.number().min(1).max(5).default(2),
  laborCostPerHour: z.number().min(0).max(100).default(25),
  laborProductivity: z.number().min(1).max(100).default(20),
  wasteFactor: z.number().min(0).max(50).default(10),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface PaintCoverageCostCheckOutput {
  totalCost: number;
  breakdown: {
    materialCost: number;
    laborCost: number;
    totalPaintNeeded: number;
    laborHours: number;
    costPerSquareMeter: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PaintCoverageCostCheckInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalPaintNeeded = ((): number => { try { const __v = input.surfaceArea * input.numberOfCoats / input.coveragePerLiter * (1 + input.wasteFactor / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialCost = ((): number => { try { const __v = results.totalPaintNeeded * input.costPerLiter; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborHours = ((): number => { try { const __v = input.surfaceArea * input.numberOfCoats / input.laborProductivity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCost = ((): number => { try { const __v = results.laborHours * input.laborCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.materialCost + results.laborCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerSquareMeter = ((): number => { try { const __v = results.totalCost / input.surfaceArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.costPerSquareMeter * (1 + (input.dataConfidence == 'low' ? 0.2 : input.dataConfidence == 'medium' ? 0.1 : 0)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePaintCoverageCostCheck(input: PaintCoverageCostCheckInput): PaintCoverageCostCheckOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    materialCost: results.materialCost,
    laborCost: results.laborCost,
    totalPaintNeeded: results.totalPaintNeeded,
    laborHours: results.laborHours,
    costPerSquareMeter: results.costPerSquareMeter,
  };

  // rule: surfaceArea > 0
  // rule: coveragePerLiter > 0
  // rule: costPerLiter > 0
  // rule: numberOfCoats >= 1
  // rule: laborCostPerHour >= 0
  // rule: laborProductivity > 0
  // rule: wasteFactor >= 0
  // rule: if paintType == 'oil' then coveragePerLiter <= 15 (typical oil coverage lower)
  // rule: if laborCostPerHour > 0 then laborProductivity > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High waste factor indicates inefficiency; consider process improvement (Lean).
  // threshold skipped (non-JS): Low coverage may indicate poor paint quality or incorrect application.
  // threshold skipped (non-JS): Low productivity; consider training or method improvement (Six Sigma).

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Benchmarks","Detailed Report with Charts"],
  };
}
