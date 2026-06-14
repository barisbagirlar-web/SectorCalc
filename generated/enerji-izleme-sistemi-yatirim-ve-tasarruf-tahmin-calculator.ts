// Auto-generated from enerji-izleme-sistemi-yatirim-ve-tasarruf-tahmin-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface EnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculatorInput {
  annualEnergyConsumption: number;
  energyCostPerKwh: number;
  systemInstallationCost: number;
  annualMaintenanceCost: number;
  expectedSavingsPercentage: number;
  systemLifetime: number;
  discountRate: number;
  inflationRate: number;
  dataConfidence: number;
}

export const EnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculatorInputSchema = z.object({
  annualEnergyConsumption: z.number().min(0).default(1000000),
  energyCostPerKwh: z.number().min(0).default(0.1),
  systemInstallationCost: z.number().min(0).default(50000),
  annualMaintenanceCost: z.number().min(0).default(2000),
  expectedSavingsPercentage: z.number().min(0).max(100).default(10),
  systemLifetime: z.number().min(1).max(30).default(10),
  discountRate: z.number().min(0).max(100).default(8),
  inflationRate: z.number().min(0).max(100).default(2),
  dataConfidence: z.number().min(0).max(100).default(80),
});

export interface EnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculatorOutput {
  npv: number;
  breakdown: {
    annualEnergyCost: number;
    annualSavings: number;
    netAnnualCashFlow: number;
    paybackPeriod: number;
    roi: number;
    irr: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: EnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualEnergyCost = ((): number => { try { const __v = input.annualEnergyConsumption * input.energyCostPerKwh; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualSavings = ((): number => { try { const __v = results.annualEnergyCost * (input.expectedSavingsPercentage / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netAnnualCashFlow = ((): number => { try { const __v = results.annualSavings - input.annualMaintenanceCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalInvestment = ((): number => { try { const __v = input.systemInstallationCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.paybackPeriod = ((): number => { try { const __v = results.totalInvestment / results.netAnnualCashFlow; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.npv = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.irr = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.roi = ((): number => { try { const __v = (results.netAnnualCashFlow * input.systemLifetime - results.totalInvestment) / results.totalInvestment * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedNpv = ((): number => { try { const __v = results.npv * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateEnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculator(input: EnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculatorInput): EnerjiIzlemeSistemiYatirimVeTasarrufTahminCalculatorOutput {
  const results = evaluateFormulas(input);
  const npv = results.npv ?? 0;
  const breakdown = {
    annualEnergyCost: results.annualEnergyCost,
    annualSavings: results.annualSavings,
    netAnnualCashFlow: results.netAnnualCashFlow,
    paybackPeriod: results.paybackPeriod,
    roi: results.roi,
    irr: results.irr,
  };

  // rule: annualEnergyConsumption > 0
  // rule: energyCostPerKwh > 0
  // rule: systemInstallationCost > 0
  // rule: annualMaintenanceCost >= 0
  // rule: expectedSavingsPercentage >= 0 && expectedSavingsPercentage <= 100
  // rule: systemLifetime >= 1
  // rule: discountRate >= 0
  // rule: inflationRate >= 0
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Dusuk tasarruf potansiyeli, yatirim fizibilitesi sorgulanmali.
  // threshold skipped (non-JS): Geri odeme suresi sistem omrunu asiyor, yatirim onerilmez.
  // threshold skipped (non-JS): Veri guveni dusuk, sonuclar dikkatle yorumlanmali.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedNpv; } catch { return npv; } })();

  return {
    npv,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV veri indirme","Trend analizi (gecmis verilerle karsilastirma)","Senaryo karsilastirma (farkli tasarruf oranlari)","Detayli duyarlilik analizi"],
  };
}
