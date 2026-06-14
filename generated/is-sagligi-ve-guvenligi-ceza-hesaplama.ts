// Auto-generated from is-sagligi-ve-guvenligi-ceza-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface IsSagligiVeGuvenligiCezaHesaplamaInput {
  employeeCount: number;
  violationType: 'genel' | 'ciddi' | 'olumsuz';
  previousPenalty: number;
  hazardSeverity: 'az' | 'orta' | 'yuksek';
  dataConfidence: number;
}

export const IsSagligiVeGuvenligiCezaHesaplamaInputSchema = z.object({
  employeeCount: z.number().min(1).max(10000).default(50),
  violationType: z.enum(['genel', 'ciddi', 'olumsuz']).default('genel'),
  previousPenalty: z.number().min(0).max(100).default(0),
  hazardSeverity: z.enum(['az', 'orta', 'yuksek']).default('orta'),
  dataConfidence: z.number().min(0).max(100).default(100),
});

export interface IsSagligiVeGuvenligiCezaHesaplamaOutput {
  totalPenalty: number;
  breakdown: {
    basePenalty: number;
    severityMultiplier: number;
    hazardMultiplier: number;
    recidivismMultiplier: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: IsSagligiVeGuvenligiCezaHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.basePenalty = ((): number => { try { const __v = input.employeeCount * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.severityMultiplier = ((): number => { try { const __v = input.violationType == 'genel' ? 1 : (input.violationType == 'ciddi' ? 2 : 3); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.hazardMultiplier = ((): number => { try { const __v = input.hazardSeverity == 'az' ? 0.8 : (input.hazardSeverity == 'orta' ? 1 : 1.2); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.recidivismMultiplier = ((): number => { try { const __v = 1 + Math.min(input.previousPenalty, 3) * 0.5; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalPenalty = ((): number => { try { const __v = results.basePenalty * results.severityMultiplier * results.hazardMultiplier * results.recidivismMultiplier; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalPenalty * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateIsSagligiVeGuvenligiCezaHesaplama(input: IsSagligiVeGuvenligiCezaHesaplamaInput): IsSagligiVeGuvenligiCezaHesaplamaOutput {
  const results = evaluateFormulas(input);
  const totalPenalty = results.totalPenalty ?? 0;
  const breakdown = {
    basePenalty: results.basePenalty,
    severityMultiplier: results.severityMultiplier,
    hazardMultiplier: results.hazardMultiplier,
    recidivismMultiplier: results.recidivismMultiplier,
  };

  // rule: employeeCount >= 1
  // rule: previousPenalty >= 0
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Tekerrur sayisi yuksek, ceza artis orani maksimuma ulasti.
  // threshold skipped (non-JS): Olumlu ihlal ve yuksek tehlike sinifi: en ust ceza limiti uygulanmali.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalPenalty; } })();

  return {
    totalPenalty,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
