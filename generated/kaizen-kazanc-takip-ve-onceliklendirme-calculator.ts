// Auto-generated from kaizen-kazanc-takip-ve-onceliklendirme-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KaizenKazancTakipVeOnceliklendirmeCalculatorInput {
  processName: 'Uretim' | 'Lojistik' | 'Kalite' | 'Bakim' | 'Ofis';
  improvementType: 'Zaman' | 'Kalite' | 'Maliyet' | 'Guvenlik' | 'Morale';
  currentValue: number;
  targetValue: number;
  implementationCost: number;
  annualSavingsPerUnit: number;
  affectedUnits: number;
  implementationTime: number;
  riskFactor: number;
  dataConfidence: number;
}

export const KaizenKazancTakipVeOnceliklendirmeCalculatorInputSchema = z.object({
  processName: z.enum(['Uretim', 'Lojistik', 'Kalite', 'Bakim', 'Ofis']).default('Uretim'),
  improvementType: z.enum(['Zaman', 'Kalite', 'Maliyet', 'Guvenlik', 'Morale']).default('Zaman'),
  currentValue: z.number().min(0).max(1000000).default(100),
  targetValue: z.number().min(0).max(1000000).default(80),
  implementationCost: z.number().min(0).max(10000000).default(5000),
  annualSavingsPerUnit: z.number().min(0).max(10000000).default(2000),
  affectedUnits: z.number().min(1).max(100000).default(10),
  implementationTime: z.number().min(0.5).max(24).default(3),
  riskFactor: z.number().min(0).max(100).default(10),
  dataConfidence: z.number().min(0).max(100).default(80),
});

export interface KaizenKazancTakipVeOnceliklendirmeCalculatorOutput {
  priorityScore: number;
  breakdown: {
    annualSavingsTotal: number;
    netAnnualSavings: number;
    paybackPeriodMonths: number;
    roi: number;
    riskAdjustedROI: number;
    dataConfidenceAdjustedROI: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KaizenKazancTakipVeOnceliklendirmeCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualSavingsTotal = ((): number => { try { const __v = input.annualSavingsPerUnit * input.affectedUnits; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netAnnualSavings = ((): number => { try { const __v = results.annualSavingsTotal - (input.implementationCost / input.implementationTime * 12); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.paybackPeriodMonths = ((): number => { try { const __v = input.implementationCost / (results.annualSavingsTotal / 12); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.roi = ((): number => { try { const __v = (results.netAnnualSavings / input.implementationCost) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.riskAdjustedROI = ((): number => { try { const __v = results.roi * (1 - input.riskFactor / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedROI = ((): number => { try { const __v = results.riskAdjustedROI * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.priorityScore = ((): number => { try { const __v = results.dataConfidenceAdjustedROI * (1 / input.implementationTime) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKaizenKazancTakipVeOnceliklendirmeCalculator(input: KaizenKazancTakipVeOnceliklendirmeCalculatorInput): KaizenKazancTakipVeOnceliklendirmeCalculatorOutput {
  const results = evaluateFormulas(input);
  const priorityScore = results.priorityScore ?? 0;
  const breakdown = {
    annualSavingsTotal: results.annualSavingsTotal,
    netAnnualSavings: results.netAnnualSavings,
    paybackPeriodMonths: results.paybackPeriodMonths,
    roi: results.roi,
    riskAdjustedROI: results.riskAdjustedROI,
    dataConfidenceAdjustedROI: results.dataConfidenceAdjustedROI,
  };

  // rule: targetValue < currentValue (iyilestirme olmali)
  // rule: implementationCost > 0
  // rule: annualSavingsPerUnit > 0
  // rule: affectedUnits >= 1
  // rule: implementationTime > 0
  // rule: riskFactor >= 0 && riskFactor <= 100
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): > 50 -> 'Yuksek risk: Kaizen basarisiz olabilir'
  // threshold skipped (non-JS): < 50 -> 'Dusuk veri guveni: Sonuclar guvenilir olmayabilir'
  // threshold skipped (non-JS): < 0 -> 'Negatif ROI: Kaizen maliyetli'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedROI; } catch { return priorityScore; } })();

  return {
    priorityScore,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (gecmis kaizen karsilastirmasi)","Portfoy karsilastirma (birden fazla kaizen)","Detayli rapor (grafikler, duyarlilik analizi)"],
  };
}
