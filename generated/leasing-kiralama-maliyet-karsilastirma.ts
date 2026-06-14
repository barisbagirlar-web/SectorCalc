// Auto-generated from leasing-kiralama-maliyet-karsilastirma-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface LeasingKiralamaMaliyetKarsilastirmaInput {
  purchasePrice: number;
  leaseTermMonths: number;
  monthlyLeasePayment: number;
  residualValue: number;
  discountRateAnnual: number;
  taxRate: number;
  maintenanceCostAnnual: number;
  insuranceCostAnnual: number;
  leaseIncludesMaintenance: boolean;
  leaseIncludesInsurance: boolean;
}

export const LeasingKiralamaMaliyetKarsilastirmaInputSchema = z.object({
  purchasePrice: z.number().min(0).default(100000),
  leaseTermMonths: z.number().min(1).max(120).default(36),
  monthlyLeasePayment: z.number().min(0).default(3000),
  residualValue: z.number().min(0).default(20000),
  discountRateAnnual: z.number().min(0).max(100).default(10),
  taxRate: z.number().min(0).max(100).default(25),
  maintenanceCostAnnual: z.number().min(0).default(5000),
  insuranceCostAnnual: z.number().min(0).default(2000),
  leaseIncludesMaintenance: z.boolean().default(true),
  leaseIncludesInsurance: z.boolean().default(true),
});

export interface LeasingKiralamaMaliyetKarsilastirmaOutput {
  costDifference: number;
  breakdown: {
    netLeaseCost: number;
    netPurchaseCost: number;
    leaseCostPV: number;
    purchaseCostPV: number;
    taxShieldLease: number;
    taxShieldPurchase: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: LeasingKiralamaMaliyetKarsilastirmaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.monthlyDiscountRate = ((): number => { try { const __v = input.discountRateAnnual / 12 / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.leaseCostPV = ((): number => { try { const __v = input.monthlyLeasePayment * (1 - (1 + results.monthlyDiscountRate)^(-input.leaseTermMonths)) / results.monthlyDiscountRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.purchaseCostPV = ((): number => { try { const __v = input.purchasePrice + (input.maintenanceCostAnnual + input.insuranceCostAnnual) * (1 - (1 + input.discountRateAnnual/100)^(-input.leaseTermMonths/12)) / (input.discountRateAnnual/100) - input.residualValue / (1 + input.discountRateAnnual/100)^(input.leaseTermMonths/12); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.taxShieldLease = ((): number => { try { const __v = results.leaseCostPV * input.taxRate / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.taxShieldPurchase = ((): number => { try { const __v = (input.maintenanceCostAnnual + input.insuranceCostAnnual) * (1 - (1 + input.discountRateAnnual/100)^(-input.leaseTermMonths/12)) / (input.discountRateAnnual/100) * input.taxRate / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netLeaseCost = ((): number => { try { const __v = results.leaseCostPV - results.taxShieldLease; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netPurchaseCost = ((): number => { try { const __v = results.purchaseCostPV - results.taxShieldPurchase; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costDifference = ((): number => { try { const __v = results.netLeaseCost - results.netPurchaseCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.leaseVsPurchaseAdvice = ((): number => { try { const __v = results.costDifference < 0 ? 'Kiralama daha avantajli' : 'Satin alma daha avantajli'; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateLeasingKiralamaMaliyetKarsilastirma(input: LeasingKiralamaMaliyetKarsilastirmaInput): LeasingKiralamaMaliyetKarsilastirmaOutput {
  const results = evaluateFormulas(input);
  const costDifference = results.costDifference ?? 0;
  const breakdown = {
    netLeaseCost: results.netLeaseCost,
    netPurchaseCost: results.netPurchaseCost,
    leaseCostPV: results.leaseCostPV,
    purchaseCostPV: results.purchaseCostPV,
    taxShieldLease: results.taxShieldLease,
    taxShieldPurchase: results.taxShieldPurchase,
  };

  // rule: monthlyLeasePayment > 0
  // rule: leaseTermMonths >= 1
  // rule: purchasePrice > 0
  // rule: discountRateAnnual >= 0
  // rule: taxRate >= 0 && taxRate <= 100
  // rule: if (leaseIncludesMaintenance == false) then maintenanceCostAnnual > 0
  // rule: if (leaseIncludesInsurance == false) then insuranceCostAnnual > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Kiralama maliyeti satin almadan yuksek, satin alma daha avantajli olabilir.
  // threshold skipped (non-JS): Yuksek iskonto orani, nakit akislarinin bugunku degerini dusurur; sonuclar hassas olabilir.

  const dataConfidenceAdjusted = (() => { try { return results.costDifference; } catch { return costDifference; } })();

  return {
    costDifference,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV disa aktarimi","Trend analizi (farkli senaryolar)","Detayli vergi ve nakit akisi raporu"],
  };
}
