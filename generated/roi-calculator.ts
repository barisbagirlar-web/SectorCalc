// Auto-generated from roi-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface RoiCalculatorInput {
  initialInvestment: number;
  annualNetCashInflow: number;
  projectLifetime: number;
  discountRate: number;
  salvageValue: number;
  annualOperatingCost: number;
  annualRevenueIncrease: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const RoiCalculatorInputSchema = z.object({
  initialInvestment: z.number().min(0).default(0),
  annualNetCashInflow: z.number().min(0).default(0),
  projectLifetime: z.number().min(1).max(50).default(5),
  discountRate: z.number().min(0).max(100).default(10),
  salvageValue: z.number().min(0).default(0),
  annualOperatingCost: z.number().min(0).default(0),
  annualRevenueIncrease: z.number().min(0).default(0),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface RoiCalculatorOutput {
  roiPercent: number;
  breakdown: {
    npv: number;
    paybackPeriod: number;
    totalCashInflows: number;
    presentValueSalvage: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: RoiCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualNetCashFlow = ((): number => { try { const __v = input.annualRevenueIncrease - input.annualOperatingCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCashInflows = ((): number => { try { const __v = results.annualNetCashFlow * ((1 - (1 + input.discountRate/100)^(-input.projectLifetime)) / (input.discountRate/100)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.presentValueSalvage = ((): number => { try { const __v = input.salvageValue / (1 + input.discountRate/100)^input.projectLifetime; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.npv = ((): number => { try { const __v = -input.initialInvestment + results.totalCashInflows + results.presentValueSalvage; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.roiPercent = ((): number => { try { const __v = (results.npv / input.initialInvestment) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.paybackPeriod = ((): number => { try { const __v = input.initialInvestment / results.annualNetCashFlow; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.roiPercent * (input.dataConfidence == 'low' ? 0.8 : (input.dataConfidence == 'medium' ? 0.95 : 1.0)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateRoiCalculator(input: RoiCalculatorInput): RoiCalculatorOutput {
  const results = evaluateFormulas(input);
  const roiPercent = results.roiPercent ?? 0;
  const breakdown = {
    npv: results.npv,
    paybackPeriod: results.paybackPeriod,
    totalCashInflows: results.totalCashInflows,
    presentValueSalvage: results.presentValueSalvage,
  };

  // rule: initialInvestment must be >= 0
  // rule: annualNetCashInflow must be >= 0
  // rule: projectLifetime must be >= 1 and <= 50
  // rule: discountRate must be >= 0 and <= 100
  // rule: salvageValue must be >= 0
  // rule: annualOperatingCost must be >= 0
  // rule: annualRevenueIncrease must be >= 0
  // rule: If dataConfidence is 'low', discountRate must be increased by 2% (handled in formulas)
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): roiPercent
  // threshold skipped (non-string): paybackPeriod

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return roiPercent; } })();

  return {
    roiPercent,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Scenario Comparison","Detailed Report with Charts"],
  };
}
