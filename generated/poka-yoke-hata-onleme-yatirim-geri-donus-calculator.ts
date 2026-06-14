// Auto-generated from poka-yoke-hata-onleme-yatirim-geri-donus-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PokaYokeHataOnlemeYatirimGeriDonusCalculatorInput {
  annualDefectCost: number;
  defectReductionRate: number;
  implementationCost: number;
  annualMaintenanceCost: number;
  projectLifeYears: number;
  discountRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const PokaYokeHataOnlemeYatirimGeriDonusCalculatorInputSchema = z.object({
  annualDefectCost: z.number().min(0).default(50000),
  defectReductionRate: z.number().min(0).max(100).default(80),
  implementationCost: z.number().min(0).default(20000),
  annualMaintenanceCost: z.number().min(0).default(2000),
  projectLifeYears: z.number().min(1).max(20).default(5),
  discountRate: z.number().min(0).max(100).default(10),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface PokaYokeHataOnlemeYatirimGeriDonusCalculatorOutput {
  npv: number;
  breakdown: {
    annualSavings: number;
    netAnnualCashFlow: number;
    paybackPeriod: number;
    irr: number;
    roi: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PokaYokeHataOnlemeYatirimGeriDonusCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualSavings = ((): number => { try { const __v = input.annualDefectCost * (input.defectReductionRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netAnnualCashFlow = ((): number => { try { const __v = results.annualSavings - input.annualMaintenanceCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.paybackPeriod = ((): number => { try { const __v = input.implementationCost / results.netAnnualCashFlow; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.npv = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.irr = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.roi = ((): number => { try { const __v = (results.npv + input.implementationCost) / input.implementationCost * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedNpv = ((): number => { try { const __v = results.npv * (input.dataConfidence == 'low' ? 0.8 : (input.dataConfidence == 'medium' ? 1.0 : 1.2)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePokaYokeHataOnlemeYatirimGeriDonusCalculator(input: PokaYokeHataOnlemeYatirimGeriDonusCalculatorInput): PokaYokeHataOnlemeYatirimGeriDonusCalculatorOutput {
  const results = evaluateFormulas(input);
  const npv = results.npv ?? 0;
  const breakdown = {
    annualSavings: results.annualSavings,
    netAnnualCashFlow: results.netAnnualCashFlow,
    paybackPeriod: results.paybackPeriod,
    irr: results.irr,
    roi: results.roi,
  };

  // rule: annualDefectCost > 0
  // rule: defectReductionRate >= 0 AND defectReductionRate <= 100
  // rule: implementationCost > 0
  // rule: annualMaintenanceCost >= 0
  // rule: projectLifeYears >= 1 AND projectLifeYears <= 20
  // rule: discountRate >= 0 AND discountRate <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Low reduction rate; consider alternative solutions.
  // threshold skipped (non-JS): Small defect cost; investment may not be justified.
  // threshold skipped (non-JS): Payback exceeds project life; investment not viable.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedNpv; } catch { return npv; } })();

  return {
    npv,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis (multi-year comparison)","Benchmarking against industry standards","Detailed sensitivity analysis report"],
  };
}
