// Auto-generated from dongusel-ekonomi-ve-urun-omru-uzatma-roi-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInput {
  initialInvestment: number;
  annualRevenuePerUnit: number;
  unitsSoldPerYear: number;
  currentProductLifeYears: number;
  extendedProductLifeYears: number;
  annualOperatingCostPerUnit: number;
  discountRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInputSchema = z.object({
  initialInvestment: z.number().min(0).default(100000),
  annualRevenuePerUnit: z.number().min(0).default(500),
  unitsSoldPerYear: z.number().min(0).default(1000),
  currentProductLifeYears: z.number().min(0.5).max(20).default(3),
  extendedProductLifeYears: z.number().min(0.5).max(20).default(5),
  annualOperatingCostPerUnit: z.number().min(0).default(200),
  discountRate: z.number().min(0).max(100).default(10),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorOutput {
  roi: number;
  breakdown: {
    npv: number;
    paybackPeriod: number;
    annualSavingsFromReplacement: number;
    totalAnnualBenefit: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualRevenue = ((): number => { try { const __v = input.unitsSoldPerYear * input.annualRevenuePerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualOperatingCost = ((): number => { try { const __v = input.unitsSoldPerYear * input.annualOperatingCostPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualNetCashFlow = ((): number => { try { const __v = results.annualRevenue - results.annualOperatingCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.currentLifeCycleYears = ((): number => { try { const __v = input.currentProductLifeYears; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.extendedLifeCycleYears = ((): number => { try { const __v = input.extendedProductLifeYears; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.currentReplacementFrequency = ((): number => { try { const __v = 1 / input.currentProductLifeYears; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.extendedReplacementFrequency = ((): number => { try { const __v = 1 / input.extendedProductLifeYears; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.replacementReduction = ((): number => { try { const __v = results.currentReplacementFrequency - results.extendedReplacementFrequency; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualSavingsFromReplacement = ((): number => { try { const __v = results.replacementReduction * input.initialInvestment; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualBenefit = ((): number => { try { const __v = results.annualNetCashFlow + results.annualSavingsFromReplacement; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.npv = ((): number => { try { const __v = results.totalAnnualBenefit * (1 - (1 + input.discountRate/100)^(-input.extendedProductLifeYears)) / (input.discountRate/100) - input.initialInvestment; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.roi = ((): number => { try { const __v = (results.npv / input.initialInvestment) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.paybackPeriod = ((): number => { try { const __v = input.initialInvestment / results.totalAnnualBenefit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedNpv = ((): number => { try { const __v = results.npv * (input.dataConfidence == 'high' ? 1.0 : (input.dataConfidence == 'medium' ? 0.9 : 0.8)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateDonguselEkonomiVeUrunOmruUzatmaRoiCalculator(input: DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInput): DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorOutput {
  const results = evaluateFormulas(input);
  const roi = results.roi ?? 0;
  const breakdown = {
    npv: results.npv,
    paybackPeriod: results.paybackPeriod,
    annualSavingsFromReplacement: results.annualSavingsFromReplacement,
    totalAnnualBenefit: results.totalAnnualBenefit,
  };

  // rule: extendedProductLifeYears > currentProductLifeYears
  // rule: initialInvestment >= 0
  // rule: annualRevenuePerUnit >= 0
  // rule: unitsSoldPerYear >= 0
  // rule: annualOperatingCostPerUnit >= 0
  // rule: discountRate >= 0 && discountRate <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if extendedProductLifeYears <= currentProductLifeYears then 'ERROR: Extended life must be greater than current life'
  // threshold skipped (non-JS): if discountRate > 20 then 'WARNING: High discount rate may indicate high risk'
  // threshold skipped (non-JS): if annualOperatingCostPerUnit > annualRevenuePerUnit then 'WARNING: Operating cost exceeds revenue per unit'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedNpv; } catch { return roi; } })();

  return {
    roi,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Scenario Comparison","Detailed Report with Charts"],
  };
}
