// Auto-generated from sirket-telefon-faturasi-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SirketTelefonFaturasiHesaplamaInput {
  monthlyBaseFee: number;
  voiceMinutes: number;
  voiceRatePerMinute: number;
  dataUsageGB: number;
  dataRatePerGB: number;
  smsCount: number;
  smsRatePerSms: number;
  numEmployees: number;
  contractDiscount: number;
  taxRate: number;
}

export const SirketTelefonFaturasiHesaplamaInputSchema = z.object({
  monthlyBaseFee: z.number().min(0).max(1000).default(50),
  voiceMinutes: z.number().min(0).max(10000).default(500),
  voiceRatePerMinute: z.number().min(0).max(5).default(0.25),
  dataUsageGB: z.number().min(0).max(1000).default(10),
  dataRatePerGB: z.number().min(0).max(100).default(10),
  smsCount: z.number().min(0).max(10000).default(100),
  smsRatePerSms: z.number().min(0).max(5).default(0.5),
  numEmployees: z.number().min(1).max(10000).default(50),
  contractDiscount: z.number().min(0).max(50).default(10),
  taxRate: z.number().min(0).max(50).default(18),
});

export interface SirketTelefonFaturasiHesaplamaOutput {
  totalCost: number;
  breakdown: {
    voiceCost: number;
    dataCost: number;
    smsCost: number;
    discountAmount: number;
    taxAmount: number;
    totalCostPerEmployee: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SirketTelefonFaturasiHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.voiceCost = ((): number => { try { const __v = input.voiceMinutes * input.voiceRatePerMinute; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataCost = ((): number => { try { const __v = input.dataUsageGB * input.dataRatePerGB; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.smsCost = ((): number => { try { const __v = input.smsCount * input.smsRatePerSms; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalBeforeDiscount = ((): number => { try { const __v = input.monthlyBaseFee + results.voiceCost + results.dataCost + results.smsCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.discountAmount = ((): number => { try { const __v = results.totalBeforeDiscount * (input.contractDiscount / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAfterDiscount = ((): number => { try { const __v = results.totalBeforeDiscount - results.discountAmount; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.taxAmount = ((): number => { try { const __v = results.totalAfterDiscount * (input.taxRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalAfterDiscount + results.taxAmount; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostPerEmployee = ((): number => { try { const __v = results.totalCost / input.numEmployees; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSirketTelefonFaturasiHesaplama(input: SirketTelefonFaturasiHesaplamaInput): SirketTelefonFaturasiHesaplamaOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    voiceCost: results.voiceCost,
    dataCost: results.dataCost,
    smsCost: results.smsCost,
    discountAmount: results.discountAmount,
    taxAmount: results.taxAmount,
    totalCostPerEmployee: results.totalCostPerEmployee,
  };

  // rule: monthlyBaseFee >= 0
  // rule: voiceMinutes >= 0
  // rule: voiceRatePerMinute >= 0
  // rule: dataUsageGB >= 0
  // rule: dataRatePerGB >= 0
  // rule: smsCount >= 0
  // rule: smsRatePerSms >= 0
  // rule: numEmployees >= 1
  // rule: contractDiscount >= 0 && contractDiscount <= 50
  // rule: taxRate >= 0 && taxRate <= 50
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): > 200 TL/calisan -> 'Yuksek maliyet uyarisi'
  // threshold skipped (non-JS): > 50 GB -> 'Veri kullanimi cok yuksek'
  // threshold skipped (non-JS): > 2000 dk -> 'Ses kullanimi cok yuksek'

  const dataConfidenceAdjusted = (() => { try { return results.totalCost; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (gecmis faturalarla karsilastirma)","Karsilastirma (farkli operator tarifeleri)","Detayli rapor (calisan bazinda kirilim)"],
  };
}
