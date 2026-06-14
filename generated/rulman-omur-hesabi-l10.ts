// Auto-generated from rulman-omur-hesabi-l10-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface RulmanOmurHesabiL10Input {
  dynamicLoad: number;
  equivalentLoad: number;
  lifeExponent: '3' | '10/3';
  reliabilityFactor: number;
  operatingHoursPerDay: number;
  operatingDaysPerYear: number;
}

export const RulmanOmurHesabiL10InputSchema = z.object({
  dynamicLoad: z.number().min(0).default(10000),
  equivalentLoad: z.number().min(0).default(5000),
  lifeExponent: z.enum(['3', '10/3']).default('3'),
  reliabilityFactor: z.number().min(0.1).max(1).default(1),
  operatingHoursPerDay: z.number().min(0).max(24).default(8),
  operatingDaysPerYear: z.number().min(1).max(365).default(250),
});

export interface RulmanOmurHesabiL10Output {
  l10y: number;
  breakdown: {
    l10: number;
    l10Exp: number;
    l10Reliability: number;
    l10h: number;
    l10y: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: RulmanOmurHesabiL10Input): Record<string, number> {
  const results: Record<string, number> = {};
  results.l10 = ((): number => { try { const __v = input.dynamicLoad / input.equivalentLoad; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.l10Exp = ((): number => { try { const __v = Math.Math.pow(results.l10, input.lifeExponent); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.l10Reliability = ((): number => { try { const __v = results.l10Exp * input.reliabilityFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.l10h = ((): number => { try { const __v = results.l10Reliability * 1000000 / (60 * input.operatingHoursPerDay * input.operatingDaysPerYear / 365); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.l10y = ((): number => { try { const __v = results.l10h / (input.operatingHoursPerDay * input.operatingDaysPerYear); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateRulmanOmurHesabiL10(input: RulmanOmurHesabiL10Input): RulmanOmurHesabiL10Output {
  const results = evaluateFormulas(input);
  const l10y = results.l10y ?? 0;
  const breakdown = {
    l10: results.l10,
    l10Exp: results.l10Exp,
    l10Reliability: results.l10Reliability,
    l10h: results.l10h,
    l10y: results.l10y,
  };

  // rule: dynamicLoad > 0
  // rule: equivalentLoad > 0
  // rule: equivalentLoad <= dynamicLoad
  // rule: reliabilityFactor > 0 && reliabilityFactor <= 1
  // rule: operatingHoursPerDay > 0 && operatingHoursPerDay <= 24
  // rule: operatingDaysPerYear > 0 && operatingDaysPerYear <= 365
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Kritik: Rulman omru cok dusuk, yeniden boyutlandirma gerekebilir.
  // threshold skipped (non-JS): Uyari: Rulman omru sinirda, bakim plani gozden gecirilmeli.
  // threshold skipped (non-JS): Uyari: Yuk orani yuksek, rulman asiri yuklenmis olabilir.

  const dataConfidenceAdjusted = (() => { try { return results.l10y * dataConfidenceFactor; } catch { return l10y; } })();

  return {
    l10y,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma (farkli rulman tipleri)","Detayli rapor (alt bilesenler ve grafikler)"],
  };
}
