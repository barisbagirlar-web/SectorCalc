// Auto-generated from arac-kira-satin-alma-karsilastirma-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AracKiraSatinAlmaKarsilastirmaInput {
  vehiclePrice: number;
  monthlyLeasePayment: number;
  leaseTermMonths: number;
  annualInterestRate: number;
  downPayment: number;
  residualValue: number;
  annualMaintenanceCost: number;
  annualInsuranceCost: number;
  usageYears: number;
  annualMileage: number;
  fuelCostPerKm: number;
  inflationRate: number;
  discountRate: number;
  taxRate: number;
  includeResidualInLease: boolean;
}

export const AracKiraSatinAlmaKarsilastirmaInputSchema = z.object({
  vehiclePrice: z.number().min(0).default(500000),
  monthlyLeasePayment: z.number().min(0).default(10000),
  leaseTermMonths: z.number().min(1).max(120).default(36),
  annualInterestRate: z.number().min(0).max(100).default(15),
  downPayment: z.number().min(0).max(100).default(20),
  residualValue: z.number().min(0).default(200000),
  annualMaintenanceCost: z.number().min(0).default(5000),
  annualInsuranceCost: z.number().min(0).default(8000),
  usageYears: z.number().min(1).max(20).default(5),
  annualMileage: z.number().min(0).default(20000),
  fuelCostPerKm: z.number().min(0).default(1.5),
  inflationRate: z.number().min(0).max(100).default(10),
  discountRate: z.number().min(0).max(100).default(12),
  taxRate: z.number().min(0).max(100).default(18),
  includeResidualInLease: z.boolean().default(false),
});

export interface AracKiraSatinAlmaKarsilastirmaOutput {
  costDifference: number;
  breakdown: {
    totalLeaseCost: number;
    totalPurchaseCost: number;
    netPresentValueLease: number;
    netPresentValuePurchase: number;
    monthlyCostLease: number;
    monthlyCostPurchase: number;
    breakEvenMileage: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AracKiraSatinAlmaKarsilastirmaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalLeaseCost = (() => { try { return input.monthlyLeasePayment * input.leaseTermMonths + (input.includeResidualInLease ? 0 : input.residualValue); } catch { return 0; } })();
  results.totalPurchaseCost = (() => { try { return input.vehiclePrice * (1 + input.taxRate/100) - input.residualValue + (input.annualMaintenanceCost + input.annualInsuranceCost) * input.usageYears + input.fuelCostPerKm * input.annualMileage * input.usageYears; } catch { return 0; } })();
  results.netPresentValueLease = (() => { try { return results.totalLeaseCost / ((1 + input.discountRate/100) ^ (input.usageYears)); } catch { return 0; } })();
  results.netPresentValuePurchase = (() => { try { return results.totalPurchaseCost / ((1 + input.discountRate/100) ^ (input.usageYears)); } catch { return 0; } })();
  results.monthlyCostLease = (() => { try { return results.totalLeaseCost / input.leaseTermMonths; } catch { return 0; } })();
  results.monthlyCostPurchase = (() => { try { return results.totalPurchaseCost / (input.usageYears * 12); } catch { return 0; } })();
  results.breakEvenMileage = (() => { try { return (input.monthlyLeasePayment * 12 - (input.annualMaintenanceCost + input.annualInsuranceCost)) / input.fuelCostPerKm; } catch { return 0; } })();
  results.costDifference = (() => { try { return results.totalLeaseCost - results.totalPurchaseCost; } catch { return 0; } })();
  results.recommendation = (() => { try { return results.costDifference < 0 ? 'Kiralamak daha avantajli' : 'Satin almak daha avantajli'; } catch { return 0; } })();
  return results;
}

export function calculateAracKiraSatinAlmaKarsilastirma(input: AracKiraSatinAlmaKarsilastirmaInput): AracKiraSatinAlmaKarsilastirmaOutput {
  const results = evaluateFormulas(input);
  const costDifference = results.costDifference ?? 0;
  const breakdown = {
    totalLeaseCost: results.totalLeaseCost,
    totalPurchaseCost: results.totalPurchaseCost,
    netPresentValueLease: results.netPresentValueLease,
    netPresentValuePurchase: results.netPresentValuePurchase,
    monthlyCostLease: results.monthlyCostLease,
    monthlyCostPurchase: results.monthlyCostPurchase,
    breakEvenMileage: results.breakEvenMileage,
  };

  // rule: vehiclePrice > 0
  // rule: monthlyLeasePayment > 0
  // rule: leaseTermMonths >= 1
  // rule: annualInterestRate >= 0
  // rule: downPayment >= 0 && downPayment <= 100
  // rule: residualValue >= 0
  // rule: annualMaintenanceCost >= 0
  // rule: annualInsuranceCost >= 0
  // rule: usageYears >= 1
  // rule: annualMileage >= 0
  // rule: fuelCostPerKm >= 0
  // rule: inflationRate >= 0
  // rule: discountRate >= 0
  // rule: taxRate >= 0 && taxRate <= 100
  // rule: if (includeResidualInLease == true) then residualValue > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.vehiclePrice > 1000000) hiddenLossDrivers.push("Yuksek arac fiyati, alternatif modeller degerlendirilmeli");
  if (input.monthlyLeasePayment > 20000) hiddenLossDrivers.push("Kira odemesi yuksek, pazarlik yapilabilir");
  if (input.annualInterestRate > 20) hiddenLossDrivers.push("Faiz orani yuksek, alternatif finansman arastirilmali");
  if (input.residualValue < input.vehiclePrice * 0.2) hiddenLossDrivers.push("Hurda degeri dusuk, satin alma dezavantajli olabilir");

  const dataConfidenceAdjusted = (() => { try { return results.costDifference * (1 - (input.inflationRate/100) * 0.1); } catch { return costDifference; } })();

  return {
    costDifference,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (fiyat, faiz, enflasyon degisimlerine duyarlilik)","Karsilastirma (farkli senaryolari yan yana gorme)","Detayli rapor (amortisman, nakit akisi tablosu)"],
  };
}
