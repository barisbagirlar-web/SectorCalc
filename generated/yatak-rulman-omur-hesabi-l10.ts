// Auto-generated from yatak-rulman-omur-hesabi-l10-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface YatakRulmanOmurHesabiL10Input {
  dynamicLoad: number;
  equivalentLoad: number;
  lifeExponent: '3' | '10/3';
  reliabilityFactor: number;
  operatingHoursPerDay: number;
  operatingDaysPerYear: number;
}

export const YatakRulmanOmurHesabiL10InputSchema = z.object({
  dynamicLoad: z.number().min(0).max(10000).default(100),
  equivalentLoad: z.number().min(0).max(10000).default(50),
  lifeExponent: z.enum(['3', '10/3']).default('3'),
  reliabilityFactor: z.number().min(0.1).max(1).default(1),
  operatingHoursPerDay: z.number().min(0).max(24).default(8),
  operatingDaysPerYear: z.number().min(1).max(365).default(250),
});

export interface YatakRulmanOmurHesabiL10Output {
  lifeYears: number;
  breakdown: {
    lifeHours: number;
    lifeYears: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: YatakRulmanOmurHesabiL10Input): Record<string, number> {
  const results: Record<string, number> = {};
  results.lifeHours = ((): number => { try { const __v = input.dynamicLoad / input.equivalentLoad ** input.lifeExponent * 1e6 / (60 * input.operatingHoursPerDay * input.operatingDaysPerYear / 365) * input.reliabilityFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.lifeYears = ((): number => { try { const __v = results.lifeHours / (input.operatingHoursPerDay * input.operatingDaysPerYear); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateYatakRulmanOmurHesabiL10(input: YatakRulmanOmurHesabiL10Input): YatakRulmanOmurHesabiL10Output {
  const results = evaluateFormulas(input);
  const lifeYears = results.lifeYears ?? 0;
  const breakdown = {
    lifeHours: results.lifeHours,
    lifeYears: results.lifeYears,
  };

  // rule: dynamicLoad > 0
  // rule: equivalentLoad > 0
  // rule: equivalentLoad <= dynamicLoad
  // rule: reliabilityFactor > 0 && reliabilityFactor <= 1
  // rule: operatingHoursPerDay >= 0 && operatingHoursPerDay <= 24
  // rule: operatingDaysPerYear >= 1 && operatingDaysPerYear <= 365
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (lifeHours < 1000) hiddenLossDrivers.push("KRITIK: Rulman omru cok dusuk, acil bakim gerekli.' : lifeHours < 10000 ? 'UYARI: Rulman omru dusuk, planli bakim onerilir.");

  const dataConfidenceAdjusted = (() => { try { return results.lifeYears * (1 - (1 - input.reliabilityFactor) * 0.1); } catch { return lifeYears; } })();

  return {
    lifeYears,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi (zaman icinde omur degisimi)","Karsilastirma (farkli rulman tipleri)","Detayli rapor (alt bilesenler ve grafikler)"],
  };
}
