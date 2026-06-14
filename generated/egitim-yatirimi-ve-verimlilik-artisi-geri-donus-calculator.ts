// Auto-generated from egitim-yatirimi-ve-verimlilik-artisi-geri-donus-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInput {
  trainingCostPerEmployee: number;
  numberOfEmployeesTrained: number;
  currentProductivity: number;
  expectedProductivityGain: number;
  laborCostPerHour: number;
  workingHoursPerDay: number;
  workingDaysPerYear: number;
  additionalBenefitsPerEmployee: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInputSchema = z.object({
  trainingCostPerEmployee: z.number().min(0).max(100000).default(5000),
  numberOfEmployeesTrained: z.number().min(1).max(10000).default(50),
  currentProductivity: z.number().min(0.1).max(1000).default(10),
  expectedProductivityGain: z.number().min(0).max(100).default(20),
  laborCostPerHour: z.number().min(0).max(1000).default(50),
  workingHoursPerDay: z.number().min(1).max(24).default(8),
  workingDaysPerYear: z.number().min(1).max(365).default(250),
  additionalBenefitsPerEmployee: z.number().min(0).max(100000).default(2000),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorOutput {
  roi: number;
  breakdown: {
    totalTrainingCost: number;
    totalAnnualBenefit: number;
    annualLaborCostSaving: number;
    paybackPeriodYears: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalTrainingCost = ((): number => { try { const __v = input.trainingCostPerEmployee * input.numberOfEmployeesTrained; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.productivityAfterTraining = ((): number => { try { const __v = input.currentProductivity * (1 + input.expectedProductivityGain / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.productivityIncreasePerEmployeePerHour = ((): number => { try { const __v = results.productivityAfterTraining - input.currentProductivity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualProductivityIncreasePerEmployee = ((): number => { try { const __v = results.productivityIncreasePerEmployeePerHour * input.workingHoursPerDay * input.workingDaysPerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualLaborCostSavingPerEmployee = ((): number => { try { const __v = results.annualProductivityIncreasePerEmployee * input.laborCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualLaborCostSaving = ((): number => { try { const __v = results.annualLaborCostSavingPerEmployee * input.numberOfEmployeesTrained; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualBenefit = ((): number => { try { const __v = results.totalAnnualLaborCostSaving + (input.additionalBenefitsPerEmployee * input.numberOfEmployeesTrained); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.paybackPeriodYears = ((): number => { try { const __v = results.totalTrainingCost / results.totalAnnualBenefit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.roi = ((): number => { try { const __v = (results.totalAnnualBenefit - results.totalTrainingCost) / results.totalTrainingCost * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedROI = ((): number => { try { const __v = input.dataConfidence == 'low' ? results.roi * 0.8 : (input.dataConfidence == 'medium' ? results.roi * 0.95 : results.roi); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateEgitimYatirimiVeVerimlilikArtisiGeriDonusCalculator(input: EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorInput): EgitimYatirimiVeVerimlilikArtisiGeriDonusCalculatorOutput {
  const results = evaluateFormulas(input);
  const roi = results.roi ?? 0;
  const breakdown = {
    totalTrainingCost: results.totalTrainingCost,
    totalAnnualBenefit: results.totalAnnualBenefit,
    annualLaborCostSaving: results.annualLaborCostSavingPerEmployee,
    paybackPeriodYears: results.paybackPeriodYears,
  };

  // rule: trainingCostPerEmployee >= 0
  // rule: numberOfEmployeesTrained >= 1
  // rule: currentProductivity > 0
  // rule: expectedProductivityGain >= 0 && expectedProductivityGain <= 100
  // rule: laborCostPerHour >= 0
  // rule: workingHoursPerDay >= 1 && workingHoursPerDay <= 24
  // rule: workingDaysPerYear >= 1 && workingDaysPerYear <= 365
  // rule: additionalBenefitsPerEmployee >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Beklenen verimlilik artisi %30'un uzerinde; gercekci olmayabilir, verileri kontrol edin.
  // threshold skipped (non-JS): Egitim maliyeti cok yuksek; alternatif egitim yontemleri degerlendirilmeli.
  // threshold skipped (non-JS): Isgucu maliyeti sektor ortalamasinin uzerinde; verimlilik kazanci daha kritik.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedROI; } catch { return roi; } })();

  return {
    roi,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV veri indirme","Trend analizi (zaman serisi)","Sektor karsilastirmasi","Detayli maliyet kirilimi"],
  };
}
