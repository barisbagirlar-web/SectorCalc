// Auto-generated from painting-rework-coverage-risk-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PaintingReworkCoverageRiskInput {
  totalPaintedArea: number;
  reworkArea: number;
  reworkCostPerM2: number;
  coverageRatio: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const PaintingReworkCoverageRiskInputSchema = z.object({
  totalPaintedArea: z.number().min(0).default(1000),
  reworkArea: z.number().min(0).default(50),
  reworkCostPerM2: z.number().min(0).default(15),
  coverageRatio: z.number().min(0).max(100).default(95),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface PaintingReworkCoverageRiskOutput {
  adjustedRiskScore: number;
  breakdown: {
    defectRate: number;
    reworkCost: number;
    coverageRiskScore: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PaintingReworkCoverageRiskInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.defectRate = ((): number => { try { const __v = input.reworkArea / input.totalPaintedArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reworkCost = ((): number => { try { const __v = input.reworkArea * input.reworkCostPerM2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.coverageRiskScore = ((): number => { try { const __v = results.defectRate * (1 - input.coverageRatio / 100) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedRiskScore = ((): number => { try { const __v = input.dataConfidence == 'low' ? results.coverageRiskScore * 1.2 : (input.dataConfidence == 'medium' ? results.coverageRiskScore * 1.0 : results.coverageRiskScore * 0.8); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePaintingReworkCoverageRisk(input: PaintingReworkCoverageRiskInput): PaintingReworkCoverageRiskOutput {
  const results = evaluateFormulas(input);
  const adjustedRiskScore = results.adjustedRiskScore ?? 0;
  const breakdown = {
    defectRate: results.defectRate,
    reworkCost: results.reworkCost,
    coverageRiskScore: results.coverageRiskScore,
  };

  // rule: reworkArea <= totalPaintedArea
  // rule: coverageRatio >= 0 and coverageRatio <= 100
  // rule: reworkCostPerM2 > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): 0.05
  // threshold skipped (non-JS): 90

  const dataConfidenceAdjusted = (() => { try { return results.adjustedRiskScore; } catch { return adjustedRiskScore; } })();

  return {
    adjustedRiskScore,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis over time","Benchmarking against industry standards","Detailed report with recommendations"],
  };
}
