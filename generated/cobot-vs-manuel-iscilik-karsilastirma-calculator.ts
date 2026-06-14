// Auto-generated from cobot-vs-manuel-iscilik-karsilastirma-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CobotVsManuelIscilikKarsilastirmaCalculatorInput {
  annualOperatingHours: number;
  manualLaborCostPerHour: number;
  cobotPurchaseCost: number;
  cobotMaintenanceCostPerYear: number;
  cobotEnergyCostPerHour: number;
  cobotLifespanYears: number;
  discountRate: number;
  manualLaborProductivity: number;
  cobotProductivity: number;
  defectRateManual: number;
  defectRateCobot: number;
  reworkCostPerDefect: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const CobotVsManuelIscilikKarsilastirmaCalculatorInputSchema = z.object({
  annualOperatingHours: z.number().min(0).max(8760).default(2000),
  manualLaborCostPerHour: z.number().min(0).default(50),
  cobotPurchaseCost: z.number().min(0).default(500000),
  cobotMaintenanceCostPerYear: z.number().min(0).default(10000),
  cobotEnergyCostPerHour: z.number().min(0).default(5),
  cobotLifespanYears: z.number().min(1).max(20).default(10),
  discountRate: z.number().min(0).max(100).default(10),
  manualLaborProductivity: z.number().min(0).max(100).default(85),
  cobotProductivity: z.number().min(0).max(100).default(95),
  defectRateManual: z.number().min(0).max(100).default(5),
  defectRateCobot: z.number().min(0).max(100).default(1),
  reworkCostPerDefect: z.number().min(0).default(100),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface CobotVsManuelIscilikKarsilastirmaCalculatorOutput {
  npv: number;
  breakdown: {
    annualSavings: number;
    paybackPeriodYears: number;
    roi: number;
    totalManualCostPerYear: number;
    totalCobotCostPerYear: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CobotVsManuelIscilikKarsilastirmaCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.effectiveManualCostPerYear = (() => { try { return input.annualOperatingHours * input.manualLaborCostPerHour * (input.manualLaborProductivity / 100); } catch { return 0; } })();
  results.effectiveCobotCostPerYear = (() => { try { return input.annualOperatingHours * (input.cobotEnergyCostPerHour + (input.cobotMaintenanceCostPerYear / input.annualOperatingHours)) * (input.cobotProductivity / 100); } catch { return 0; } })();
  results.qualityCostManualPerYear = (() => { try { return input.annualOperatingHours * (input.defectRateManual / 100) * input.reworkCostPerDefect; } catch { return 0; } })();
  results.qualityCostCobotPerYear = (() => { try { return input.annualOperatingHours * (input.defectRateCobot / 100) * input.reworkCostPerDefect; } catch { return 0; } })();
  results.totalManualCostPerYear = (() => { try { return results.effectiveManualCostPerYear + results.qualityCostManualPerYear; } catch { return 0; } })();
  results.totalCobotCostPerYear = (() => { try { return results.effectiveCobotCostPerYear + results.qualityCostCobotPerYear; } catch { return 0; } })();
  results.annualSavings = (() => { try { return results.totalManualCostPerYear - results.totalCobotCostPerYear; } catch { return 0; } })();
  results.npv = (() => { try { return input.cobotPurchaseCost + (results.annualSavings * ((1 - (1 + input.discountRate/100)^(-input.cobotLifespanYears)) / (input.discountRate/100))); } catch { return 0; } })();
  results.paybackPeriodYears = (() => { try { return input.cobotPurchaseCost / results.annualSavings; } catch { return 0; } })();
  results.roi = (() => { try { return (results.annualSavings * input.cobotLifespanYears - input.cobotPurchaseCost) / input.cobotPurchaseCost * 100; } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return input.dataConfidence == 'low' ? results.npv * 0.8 : (input.dataConfidence == 'medium' ? results.npv * 0.95 : results.npv); } catch { return 0; } })();
  return results;
}

export function calculateCobotVsManuelIscilikKarsilastirmaCalculator(input: CobotVsManuelIscilikKarsilastirmaCalculatorInput): CobotVsManuelIscilikKarsilastirmaCalculatorOutput {
  const results = evaluateFormulas(input);
  const npv = results.npv ?? 0;
  const breakdown = {
    annualSavings: results.annualSavings,
    paybackPeriodYears: results.paybackPeriodYears,
    roi: results.roi,
    totalManualCostPerYear: results.totalManualCostPerYear,
    totalCobotCostPerYear: results.totalCobotCostPerYear,
  };

  // rule: manualLaborCostPerHour > 0
  // rule: cobotPurchaseCost > 0
  // rule: annualOperatingHours > 0
  // rule: cobotLifespanYears >= 1
  // rule: discountRate >= 0
  // rule: manualLaborProductivity between 0 and 100
  // rule: cobotProductivity between 0 and 100
  // rule: defectRateManual between 0 and 100
  // rule: defectRateCobot between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek manuel hata orani, kalite iyilestirme gerekli.
  // threshold skipped (non-JS): Cobot hata orani beklenenden yuksek, bakim/kalibrasyon onerilir.
  // threshold skipped (non-JS): Dusuk manuel verimlilik, surec iyilestirme onerilir.
  // threshold skipped (non-JS): Cobot verimliligi dusuk, OEE analizi yapilmali.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return npv; } })();

  return {
    npv,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi (yillik karsilastirma)","Detayli maliyet kirilimi raporu"],
  };
}
