// Auto-generated from forklift-transpalet-kullanim-maliyeti-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ForkliftTranspaletKullanimMaliyetiInput {
  purchasePrice: number;
  economicLife: number;
  residualValue: number;
  annualOperatingHours: number;
  fuelCostPerHour: number;
  maintenanceCostPerHour: number;
  operatorHourlyWage: number;
  annualInsuranceCost: number;
  annualTaxAndLicense: number;
  annualStorageCost: number;
  annualInterestRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const ForkliftTranspaletKullanimMaliyetiInputSchema = z.object({
  purchasePrice: z.number().min(0).default(500000),
  economicLife: z.number().min(1).max(20).default(5),
  residualValue: z.number().min(0).default(50000),
  annualOperatingHours: z.number().min(0).max(8760).default(2000),
  fuelCostPerHour: z.number().min(0).default(50),
  maintenanceCostPerHour: z.number().min(0).default(20),
  operatorHourlyWage: z.number().min(0).default(40),
  annualInsuranceCost: z.number().min(0).default(5000),
  annualTaxAndLicense: z.number().min(0).default(2000),
  annualStorageCost: z.number().min(0).default(3000),
  annualInterestRate: z.number().min(0).max(100).default(10),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface ForkliftTranspaletKullanimMaliyetiOutput {
  hourlyTotalCost: number;
  breakdown: {
    annualDepreciation: number;
    annualFixedCost: number;
    annualVariableCost: number;
    annualTotalCost: number;
    npvTotalCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ForkliftTranspaletKullanimMaliyetiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualDepreciation = (() => { try { return (input.purchasePrice - input.residualValue) / input.economicLife; } catch { return 0; } })();
  results.annualFixedCost = (() => { try { return results.annualDepreciation + input.annualInsuranceCost + input.annualTaxAndLicense + input.annualStorageCost; } catch { return 0; } })();
  results.annualVariableCost = (() => { try { return (input.fuelCostPerHour + input.maintenanceCostPerHour + input.operatorHourlyWage) * input.annualOperatingHours; } catch { return 0; } })();
  results.annualTotalCost = (() => { try { return results.annualFixedCost + results.annualVariableCost; } catch { return 0; } })();
  results.hourlyTotalCost = (() => { try { return results.annualTotalCost / input.annualOperatingHours; } catch { return 0; } })();
  results.npvTotalCost = (() => { try { return -input.purchasePrice + (results.annualTotalCost * (1 - (1 + input.annualInterestRate/100)^(-input.economicLife)) / (input.annualInterestRate/100)) + input.residualValue / (1 + input.annualInterestRate/100)^input.economicLife; } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return results.hourlyTotalCost * (input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.9)); } catch { return 0; } })();
  return results;
}

export function calculateForkliftTranspaletKullanimMaliyeti(input: ForkliftTranspaletKullanimMaliyetiInput): ForkliftTranspaletKullanimMaliyetiOutput {
  const results = evaluateFormulas(input);
  const hourlyTotalCost = results.hourlyTotalCost ?? 0;
  const breakdown = {
    annualDepreciation: results.annualDepreciation,
    annualFixedCost: results.annualFixedCost,
    annualVariableCost: results.annualVariableCost,
    annualTotalCost: results.annualTotalCost,
    npvTotalCost: results.npvTotalCost,
  };

  // rule: purchasePrice > 0
  // rule: economicLife > 0
  // rule: residualValue >= 0
  // rule: annualOperatingHours >= 0
  // rule: fuelCostPerHour >= 0
  // rule: maintenanceCostPerHour >= 0
  // rule: operatorHourlyWage >= 0
  // rule: annualInsuranceCost >= 0
  // rule: annualTaxAndLicense >= 0
  // rule: annualStorageCost >= 0
  // rule: annualInterestRate >= 0
  // rule: residualValue <= purchasePrice
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yakit maliyeti cok yuksek, alternatif enerji kaynaklari degerlendirilmeli.
  // threshold skipped (non-JS): Bakim maliyeti yuksek, ekipman yasi veya ariza sikligi gozden gecirilmeli.
  // threshold skipped (non-JS): Ekipman dusuk kullanimda, kiralama veya paylasim secenekleri degerlendirilmeli.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return hourlyTotalCost; } })();

  return {
    hourlyTotalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (gecmis verilerle karsilastirma)","Ekipman karsilastirma (birden fazla forklift/transpalet)","Detayli rapor (amortisman, nakit akisi, NPV)"],
  };
}
