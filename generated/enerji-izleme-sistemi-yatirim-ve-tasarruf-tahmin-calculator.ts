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
  results.annualEnergyCost = (() => { try { return input.annualEnergyConsumption * input.energyCostPerKwh; } catch { return 0; } })();
  results.annualSavings = (() => { try { return results.annualEnergyCost * (input.expectedSavingsPercentage / 100); } catch { return 0; } })();
  results.netAnnualCashFlow = (() => { try { return results.annualSavings - input.annualMaintenanceCost; } catch { return 0; } })();
  results.totalInvestment = (() => { try { return input.systemInstallationCost; } catch { return 0; } })();
  results.paybackPeriod = (() => { try { return results.totalInvestment / results.netAnnualCashFlow; } catch { return 0; } })();
  results.npv = (() => { try { return 0; } catch { return 0; } })();
  results.irr = (() => { try { return 0; } catch { return 0; } })();
  results.roi = (() => { try { return (results.netAnnualCashFlow * input.systemLifetime - results.totalInvestment) / results.totalInvestment * 100; } catch { return 0; } })();
  results.dataConfidenceAdjustedNpv = (() => { try { return results.npv * (input.dataConfidence / 100); } catch { return 0; } })();
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
