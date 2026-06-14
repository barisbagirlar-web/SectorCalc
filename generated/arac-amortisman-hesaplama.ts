// Auto-generated from arac-amortisman-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AracAmortismanHesaplamaInput {
  purchasePrice: number;
  residualValue: number;
  usefulLifeYears: number;
  depreciationMethod: 'straightLine' | 'decliningBalance' | 'sumOfYearsDigits';
  decliningBalanceFactor: number;
  annualMileage: number;
  fuelCostPerKm: number;
  maintenanceCostPerYear: number;
  insuranceCostPerYear: number;
  taxCostPerYear: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const AracAmortismanHesaplamaInputSchema = z.object({
  purchasePrice: z.number().min(0).default(0),
  residualValue: z.number().min(0).default(0),
  usefulLifeYears: z.number().min(1).max(50).default(5),
  depreciationMethod: z.enum(['straightLine', 'decliningBalance', 'sumOfYearsDigits']).default('straightLine'),
  decliningBalanceFactor: z.number().min(1).max(3).default(2),
  annualMileage: z.number().min(0).default(20000),
  fuelCostPerKm: z.number().min(0).default(1.5),
  maintenanceCostPerYear: z.number().min(0).default(3000),
  insuranceCostPerYear: z.number().min(0).default(5000),
  taxCostPerYear: z.number().min(0).default(2000),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface AracAmortismanHesaplamaOutput {
  costPerKm: number;
  breakdown: {
    annualDepreciation: number;
    annualFuelCost: number;
    annualMaintenanceCost: number;
    annualInsuranceCost: number;
    annualTaxCost: number;
    totalAnnualCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AracAmortismanHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualDepreciation = (() => { try { return 0; } catch { return 0; } })();
  results.totalAnnualCost = (() => { try { return results.annualDepreciation + (input.annualMileage * input.fuelCostPerKm) + input.maintenanceCostPerYear + input.insuranceCostPerYear + input.taxCostPerYear; } catch { return 0; } })();
  results.costPerKm = (() => { try { return results.totalAnnualCost / input.annualMileage; } catch { return 0; } })();
  results.accumulatedDepreciation = (() => { try { return 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedCostPerKm = (() => { try { return 0; } catch { return 0; } })();
  return results;
}

export function calculateAracAmortismanHesaplama(input: AracAmortismanHesaplamaInput): AracAmortismanHesaplamaOutput {
  const results = evaluateFormulas(input);
  const costPerKm = results.costPerKm ?? 0;
  const breakdown = {
    annualDepreciation: results.annualDepreciation,
    annualFuelCost: results.annualFuelCost,
    annualMaintenanceCost: results.annualMaintenanceCost,
    annualInsuranceCost: results.annualInsuranceCost,
    annualTaxCost: results.annualTaxCost,
    totalAnnualCost: results.totalAnnualCost,
  };

  // rule: purchasePrice > 0
  // rule: usefulLifeYears >= 1
  // rule: residualValue <= purchasePrice
  // rule: if depreciationMethod == 'decliningBalance' then decliningBalanceFactor >= 1 and decliningBalanceFactor <= 3
  // rule: annualMileage >= 0
  // rule: fuelCostPerKm >= 0
  // rule: maintenanceCostPerYear >= 0
  // rule: insuranceCostPerYear >= 0
  // rule: taxCostPerYear >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek kilometre: bakim maliyetleri artabilir.
  // threshold skipped (non-JS): Yakit maliyeti ortalamanin uzerinde, verimlilik kontrolu onerilir.
  // threshold skipped (non-JS): Bakim maliyeti yuksek, arac degisimi dusunulebilir.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCostPerKm; } catch { return costPerKm; } })();

  return {
    costPerKm,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (yillik maliyet degisimi)","Karsilastirma (farkli arac modelleri)","Detayli rapor (amortisman tablosu)"],
  };
}
