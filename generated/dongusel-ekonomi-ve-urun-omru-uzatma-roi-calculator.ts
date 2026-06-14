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
  results.annualRevenue = (() => { try { return input.unitsSoldPerYear * input.annualRevenuePerUnit; } catch { return 0; } })();
  results.annualOperatingCost = (() => { try { return input.unitsSoldPerYear * input.annualOperatingCostPerUnit; } catch { return 0; } })();
  results.annualNetCashFlow = (() => { try { return results.annualRevenue - results.annualOperatingCost; } catch { return 0; } })();
  results.currentLifeCycleYears = (() => { try { return input.currentProductLifeYears; } catch { return 0; } })();
  results.extendedLifeCycleYears = (() => { try { return input.extendedProductLifeYears; } catch { return 0; } })();
  results.currentReplacementFrequency = (() => { try { return 1 / input.currentProductLifeYears; } catch { return 0; } })();
  results.extendedReplacementFrequency = (() => { try { return 1 / input.extendedProductLifeYears; } catch { return 0; } })();
  results.replacementReduction = (() => { try { return results.currentReplacementFrequency - results.extendedReplacementFrequency; } catch { return 0; } })();
  results.annualSavingsFromReplacement = (() => { try { return results.replacementReduction * input.initialInvestment; } catch { return 0; } })();
  results.totalAnnualBenefit = (() => { try { return results.annualNetCashFlow + results.annualSavingsFromReplacement; } catch { return 0; } })();
  results.npv = (() => { try { return results.totalAnnualBenefit * (1 - (1 + input.discountRate/100)^(-input.extendedProductLifeYears)) / (input.discountRate/100) - input.initialInvestment; } catch { return 0; } })();
  results.roi = (() => { try { return (results.npv / input.initialInvestment) * 100; } catch { return 0; } })();
  results.paybackPeriod = (() => { try { return input.initialInvestment / results.totalAnnualBenefit; } catch { return 0; } })();
  results.dataConfidenceAdjustedNpv = (() => { try { return results.npv * (input.dataConfidence == 'high' ? 1.0 : (input.dataConfidence == 'medium' ? 0.9 : 0.8)); } catch { return 0; } })();
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
