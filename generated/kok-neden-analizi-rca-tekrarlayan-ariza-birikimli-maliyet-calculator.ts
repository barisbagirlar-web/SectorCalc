// Auto-generated from kok-neden-analizi-rca-tekrarlayan-ariza-birikimli-maliyet-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculatorInput {
  failureFrequency: number;
  downtimePerFailure: number;
  hourlyProductionValue: number;
  repairCostPerFailure: number;
  rootCauseAnalysisCost: number;
  implementationCost: number;
  expectedLifeAfterFix: number;
  discountRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const KokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculatorInputSchema = z.object({
  failureFrequency: z.number().min(0).max(1000).default(1),
  downtimePerFailure: z.number().min(0).max(168).default(2),
  hourlyProductionValue: z.number().min(0).max(100000).default(500),
  repairCostPerFailure: z.number().min(0).max(1000000).default(1000),
  rootCauseAnalysisCost: z.number().min(0).max(1000000).default(5000),
  implementationCost: z.number().min(0).max(10000000).default(20000),
  expectedLifeAfterFix: z.number().min(1).max(120).default(36),
  discountRate: z.number().min(0).max(100).default(10),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface KokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculatorOutput {
  npv: number;
  breakdown: {
    monthlyLoss: number;
    annualLoss: number;
    totalFixCost: number;
    monthlySavings: number;
    annualSavings: number;
    paybackPeriodMonths: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.monthlyLoss = ((): number => { try { const __v = input.failureFrequency * (input.downtimePerFailure * input.hourlyProductionValue + input.repairCostPerFailure); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualLoss = ((): number => { try { const __v = results.monthlyLoss * 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalFixCost = ((): number => { try { const __v = input.rootCauseAnalysisCost + input.implementationCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.monthlySavings = ((): number => { try { const __v = results.monthlyLoss; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualSavings = ((): number => { try { const __v = results.monthlySavings * 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.paybackPeriodMonths = ((): number => { try { const __v = results.totalFixCost / results.monthlySavings; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.npv = ((): number => { try { const __v = -results.totalFixCost + (results.annualSavings / (input.discountRate/100)) * (1 - 1 / Math.Math.pow(1 + input.discountRate/100, input.expectedLifeAfterFix/12)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedNpv = ((): number => { try { const __v = input.dataConfidence === 'low' ? results.npv * 0.7 : input.dataConfidence === 'medium' ? results.npv * 0.85 : results.npv; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculator(input: KokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculatorInput): KokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculatorOutput {
  const results = evaluateFormulas(input);
  const npv = results.npv ?? 0;
  const breakdown = {
    monthlyLoss: results.monthlyLoss,
    annualLoss: results.annualLoss,
    totalFixCost: results.totalFixCost,
    monthlySavings: results.monthlySavings,
    annualSavings: results.annualSavings,
    paybackPeriodMonths: results.paybackPeriodMonths,
  };

  // rule: failureFrequency >= 0
  // rule: downtimePerFailure >= 0
  // rule: hourlyProductionValue >= 0
  // rule: repairCostPerFailure >= 0
  // rule: rootCauseAnalysisCost >= 0
  // rule: implementationCost >= 0
  // rule: expectedLifeAfterFix >= 1
  // rule: discountRate >= 0 && discountRate <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): > 100000
  // threshold skipped (non-JS): > 12

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedNpv; } catch { return npv; } })();

  return {
    npv,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV raporu","Trend analizi (zaman serisi)","Senaryo karsilastirma","Detayli maliyet kirilimi raporu"],
  };
}
