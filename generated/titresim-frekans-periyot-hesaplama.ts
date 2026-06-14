// Auto-generated from titresim-frekans-periyot-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface TitresimFrekansPeriyotHesaplamaInput {
  frequency: number;
  period: number;
  calculationMode: 'frequencyFromPeriod' | 'periodFromFrequency';
}

export const TitresimFrekansPeriyotHesaplamaInputSchema = z.object({
  frequency: z.number().min(0.1).max(10000).default(50),
  period: z.number().min(0.0001).max(10).default(0.02),
  calculationMode: z.enum(['frequencyFromPeriod', 'periodFromFrequency']).default('frequencyFromPeriod'),
});

export interface TitresimFrekansPeriyotHesaplamaOutput {
  hesaplanan: number;
  breakdown: {
    frequency: number;
    period: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: TitresimFrekansPeriyotHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.frequencyFromPeriod = ((): number => { try { const __v = input.frequency = 1 / input.period; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.periodFromFrequency = ((): number => { try { const __v = input.period = 1 / input.frequency; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateTitresimFrekansPeriyotHesaplama(input: TitresimFrekansPeriyotHesaplamaInput): TitresimFrekansPeriyotHesaplamaOutput {
  const results = evaluateFormulas(input);
  const hesaplanan = results.hesaplanan ?? 0;
  const breakdown = {
    frequency: results.frequencyFromPeriod,
    period: results.frequencyFromPeriod,
  };

  // rule: if calculationMode == 'frequencyFromPeriod' then period > 0
  // rule: if calculationMode == 'periodFromFrequency' then frequency > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): frequency > 1000 -> 'Yuksek frekans, rezonans riski olabilir'
  // threshold skipped (non-JS): period > 1 -> 'Uzun periyot, dusuk frekansli sistem'

  const dataConfidenceAdjusted = (() => { try { return hesaplanan; } catch { return hesaplanan; } })();

  return {
    hesaplanan,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
