// Auto-generated from abonelik-yazilim-cloud-yillik-maliyet-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AbonelikYazilimCloudYillikMaliyetHesabiInput {
  subscriptionType: 'monthly' | 'annual' | 'perUser';
  monthlyCostPerUser: number;
  numberOfUsers: number;
  annualDiscount: number;
  additionalServicesCost: number;
  implementationCost: number;
  trainingCost: number;
  maintenanceCost: number;
  contractDuration: '1' | '2' | '3' | '5';
  currency: 'USD' | 'EUR' | 'TRY' | 'GBP';
}

export const AbonelikYazilimCloudYillikMaliyetHesabiInputSchema = z.object({
  subscriptionType: z.enum(['monthly', 'annual', 'perUser']).default('monthly'),
  monthlyCostPerUser: z.number().min(0).max(10000).default(10),
  numberOfUsers: z.number().min(1).max(100000).default(50),
  annualDiscount: z.number().min(0).max(100).default(20),
  additionalServicesCost: z.number().min(0).max(1000000).default(0),
  implementationCost: z.number().min(0).max(1000000).default(5000),
  trainingCost: z.number().min(0).max(1000000).default(2000),
  maintenanceCost: z.number().min(0).max(1000000).default(1000),
  contractDuration: z.enum(['1', '2', '3', '5']).default('1'),
  currency: z.enum(['USD', 'EUR', 'TRY', 'GBP']).default('USD'),
});

export interface AbonelikYazilimCloudYillikMaliyetHesabiOutput {
  totalAnnualCost: number;
  breakdown: {
    baseAnnualCost: number;
    additionalServicesCost: number;
    implementationCostAmortized: number;
    trainingCost: number;
    maintenanceCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AbonelikYazilimCloudYillikMaliyetHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.baseAnnualCost = (() => { try { return input.subscriptionType == 'monthly' ? input.monthlyCostPerUser * input.numberOfUsers * 12 : (input.subscriptionType == 'annual' ? input.monthlyCostPerUser * input.numberOfUsers * 12 * (1 - input.annualDiscount/100) : input.monthlyCostPerUser * input.numberOfUsers * 12); } catch { return 0; } })();
  results.totalAnnualCost = (() => { try { return results.baseAnnualCost + input.additionalServicesCost + input.implementationCost/input.contractDuration + input.trainingCost + input.maintenanceCost; } catch { return 0; } })();
  results.costPerUserPerMonth = (() => { try { return results.totalAnnualCost / (input.numberOfUsers * 12); } catch { return 0; } })();
  results.totalCostOverContract = (() => { try { return results.totalAnnualCost * input.contractDuration; } catch { return 0; } })();
  return results;
}

export function calculateAbonelikYazilimCloudYillikMaliyetHesabi(input: AbonelikYazilimCloudYillikMaliyetHesabiInput): AbonelikYazilimCloudYillikMaliyetHesabiOutput {
  const results = evaluateFormulas(input);
  const totalAnnualCost = results.totalAnnualCost ?? 0;
  const breakdown = {
    baseAnnualCost: results.baseAnnualCost,
    additionalServicesCost: results.additionalServicesCost,
    implementationCostAmortized: results.implementationCostAmortized,
    trainingCost: results.trainingCost,
    maintenanceCost: results.maintenanceCost,
  };

  // rule: monthlyCostPerUser >= 0
  // rule: numberOfUsers >= 1
  // rule: annualDiscount >= 0 && annualDiscount <= 100
  // rule: additionalServicesCost >= 0
  // rule: implementationCost >= 0
  // rule: trainingCost >= 0
  // rule: maintenanceCost >= 0
  // rule: if subscriptionType == 'perUser' then monthlyCostPerUser > 0
  // rule: if subscriptionType == 'annual' then annualDiscount >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): > 100 -> 'Yuksek birim maliyet, pazarlik onerilir'
  // threshold skipped (non-JS): < 10 -> 'Dusuk indirim, yillik taahhut yeniden muzakere edilmeli'
  // threshold skipped (non-JS): > 10000 -> 'Ek hizmet maliyetleri yuksek, alternatif saglayici degerlendirilmeli'

  const dataConfidenceAdjusted = (() => { try { return results.totalAnnualCost * (1 - 0.05); } catch { return totalAnnualCost; } })();

  return {
    totalAnnualCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (gecmis yillar karsilastirmasi)","Rakiplerle karsilastirma","Detayli rapor (maliyet kirilimi grafikleri)"],
  };
}
