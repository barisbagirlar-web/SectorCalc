// Auto-generated from makine-ekonomik-omru-hurda-deger-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface MakineEkonomikOmruHurdaDegerHesabiInput {
  purchaseCost: number;
  salvageValue: number;
  economicLife: number;
  annualMaintenanceCost: number;
  annualOperatingCost: number;
  discountRate: number;
  inflationRate: number;
  depreciationMethod: 'straight-line' | 'double-declining' | 'sum-of-years';
}

export const MakineEkonomikOmruHurdaDegerHesabiInputSchema = z.object({
  purchaseCost: z.number().min(0).default(100000),
  salvageValue: z.number().min(0).default(5000),
  economicLife: z.number().min(1).max(50).default(10),
  annualMaintenanceCost: z.number().min(0).default(5000),
  annualOperatingCost: z.number().min(0).default(20000),
  discountRate: z.number().min(0).max(100).default(10),
  inflationRate: z.number().min(0).max(100).default(5),
  depreciationMethod: z.enum(['straight-line', 'double-declining', 'sum-of-years']).default('straight-line'),
});

export interface MakineEkonomikOmruHurdaDegerHesabiOutput {
  equivalentAnnualCost: number;
  breakdown: {
    annualDepreciation: number;
    totalAnnualCost: number;
    presentValueOfCosts: number;
    netPresentValue: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: MakineEkonomikOmruHurdaDegerHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualDepreciation = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualCost = ((): number => { try { const __v = input.annualMaintenanceCost + input.annualOperatingCost + results.annualDepreciation; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.presentValueOfCosts = ((): number => { try { const __v = results.totalAnnualCost * ((1 - (1 + input.discountRate/100)^(-input.economicLife)) / (input.discountRate/100)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netPresentValue = ((): number => { try { const __v = -input.purchaseCost + results.presentValueOfCosts + input.salvageValue / (1 + input.discountRate/100)^input.economicLife; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.equivalentAnnualCost = ((): number => { try { const __v = results.netPresentValue * (input.discountRate/100) / (1 - (1 + input.discountRate/100)^(-input.economicLife)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.economicLifeOptimal = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateMakineEkonomikOmruHurdaDegerHesabi(input: MakineEkonomikOmruHurdaDegerHesabiInput): MakineEkonomikOmruHurdaDegerHesabiOutput {
  const results = evaluateFormulas(input);
  const equivalentAnnualCost = results.equivalentAnnualCost ?? 0;
  const breakdown = {
    annualDepreciation: results.annualDepreciation,
    totalAnnualCost: results.totalAnnualCost,
    presentValueOfCosts: results.presentValueOfCosts,
    netPresentValue: results.netPresentValue,
  };

  // rule: salvageValue must be less than purchaseCost
  // rule: economicLife must be a positive integer
  // rule: discountRate must be between 0 and 100
  // rule: inflationRate must be between 0 and 100
  // rule: annualMaintenanceCost must be non-negative
  // rule: annualOperatingCost must be non-negative
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yillik bakim maliyeti satin alma maliyetinin %10'unu asiyor; makineyi degistirmeyi dusunun.
  // threshold skipped (non-JS): Hurda degeri cok dusuk; alternatif elden cikarma yontemleri arastirilmali.

  const dataConfidenceAdjusted = (() => { try { return results.equivalentAnnualCost * (1 + (1 - dataConfidence/100)); } catch { return equivalentAnnualCost; } })();

  return {
    equivalentAnnualCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (ekonomik omur boyunca maliyet projeksiyonu)","Karsilastirma (farkli makineler arasinda)","Detayli rapor (duyarlilik analizi, senaryo analizi)"],
  };
}
