// Auto-generated from abonelik-yazilim-cloud-yillik-maliyet-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AbonelikYazilimCloudYillikMaliyetHesabiInput {
  subscriptionType: 'monthly' | 'annual' | 'perUser';
  monthlyFee: number;
  annualFee: number;
  numberOfUsers: number;
  pricePerUser: number;
  cloudStorageGB: number;
  storageCostPerGB: number;
  additionalServicesCost: number;
  contractDurationYears: number;
  discountRate: number;
  currency: 'USD' | 'EUR' | 'TRY';
  dataConfidence: number;
}

export const AbonelikYazilimCloudYillikMaliyetHesabiInputSchema = z.object({
  subscriptionType: z.enum(['monthly', 'annual', 'perUser']).default('monthly'),
  monthlyFee: z.number().min(0).max(100000).default(100),
  annualFee: z.number().min(0).max(1000000).default(1000),
  numberOfUsers: z.number().min(1).max(10000).default(10),
  pricePerUser: z.number().min(0).max(1000).default(20),
  cloudStorageGB: z.number().min(0).max(100000).default(100),
  storageCostPerGB: z.number().min(0).max(10).default(0.1),
  additionalServicesCost: z.number().min(0).max(100000).default(0),
  contractDurationYears: z.number().min(1).max(5).default(1),
  discountRate: z.number().min(0).max(100).default(0),
  currency: z.enum(['USD', 'EUR', 'TRY']).default('USD'),
  dataConfidence: z.number().min(0).max(100).default(100),
});

export interface AbonelikYazilimCloudYillikMaliyetHesabiOutput {
  totalAnnualCost: number;
  breakdown: {
    baseAnnualCost: number;
    discountedAnnualCost: number;
    storageAnnualCost: number;
    additionalServicesCost: number;
    costPerUser: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AbonelikYazilimCloudYillikMaliyetHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.baseAnnualCost = input.subscriptionType === 'monthly' ? input.monthlyFee * 12 : input.subscriptionType === 'annual' ? input.annualFee : input.pricePerUser * input.numberOfUsers * 12;
  results.discountedAnnualCost = results.baseAnnualCost * (1 - input.discountRate / 100);
  results.storageAnnualCost = input.cloudStorageGB * input.storageCostPerGB * 12;
  results.totalAnnualCost = results.discountedAnnualCost + results.storageAnnualCost + input.additionalServicesCost;
  results.costPerUser = results.totalAnnualCost / input.numberOfUsers;
  results.dataConfidenceAdjustedCost = results.totalAnnualCost * (input.dataConfidence / 100);
  return results;
}

export function calculateAbonelikYazilimCloudYillikMaliyetHesabi(input: AbonelikYazilimCloudYillikMaliyetHesabiInput): AbonelikYazilimCloudYillikMaliyetHesabiOutput {
  const results = evaluateFormulas(input);
  const totalAnnualCost = results.totalAnnualCost;
  const breakdown = {
    baseAnnualCost: results.baseAnnualCost,
    discountedAnnualCost: results.discountedAnnualCost,
    storageAnnualCost: results.storageAnnualCost,
    additionalServicesCost: results.additionalServicesCost,
    costPerUser: results.costPerUser,
  };

  // rule: subscriptionType must be one of: monthly, annual, perUser
  // rule: If subscriptionType='monthly' then monthlyFee > 0
  // rule: If subscriptionType='annual' then annualFee > 0
  // rule: If subscriptionType='perUser' then pricePerUser > 0 and numberOfUsers > 0
  // rule: monthlyFee >= 0
  // rule: annualFee >= 0
  // rule: numberOfUsers >= 1
  // rule: pricePerUser >= 0
  // rule: cloudStorageGB >= 0
  // rule: storageCostPerGB >= 0
  // rule: additionalServicesCost >= 0
  // rule: contractDurationYears >= 1
  // rule: discountRate between 0 and 100
  // rule: dataConfidence between 0 and 100
  // threshold highStorageCost: cloudStorageGB * storageCostPerGB * 12 > 1000
  // threshold lowConfidence: dataConfidence < 50
  const hiddenLossDrivers: string[] = ["highStorageCost: Depolama maliyeti yıllık 1000 USD'yi aşıyor.","lowConfidence: Veri güveni düşük, sonuçlar güvenilir olmayabilir."];
  const suggestedActions: string[] = ["Uzun vadeli sözleşme ile indirim almayı değerlendirin.","Depolama kullanımını optimize ederek maliyeti düşürün.","Kullanıcı başına maliyeti azaltmak için toplu lisanslama seçeneklerini inceleyin."];
  const dataConfidenceAdjusted = results.dataConfidenceAdjustedCost;

  return {
    totalAnnualCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi (geçmiş verilerle karşılaştırma)","Detaylı maliyet kırılımı grafikleri","Farklı senaryoların karşılaştırılması"],
  };
}
