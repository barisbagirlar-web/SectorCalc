// Auto-generated from paketleme-malzemesi-strec-koli-sarfiyati-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PaketlemeMalzemesiStrecKoliSarfiyatiInput {
  unitType: 'koli' | 'palet' | 'adet';
  unitCount: number;
  filmWidth: number;
  filmThickness: number;
  wrapLayers: number;
  overlapRatio: number;
  filmDensity: number;
  unitLength: number;
  unitWidth: number;
  unitHeight: number;
  filmCostPerKg: number;
  wasteRate: number;
  dataConfidence: number;
}

export const PaketlemeMalzemesiStrecKoliSarfiyatiInputSchema = z.object({
  unitType: z.enum(['koli', 'palet', 'adet']).default('koli'),
  unitCount: z.number().min(1).max(1000000).default(1000),
  filmWidth: z.number().min(10).max(200).default(50),
  filmThickness: z.number().min(5).max(50).default(20),
  wrapLayers: z.number().min(1).max(10).default(2),
  overlapRatio: z.number().min(0).max(100).default(30),
  filmDensity: z.number().min(0.9).max(0.96).default(0.92),
  unitLength: z.number().min(1).max(200).default(40),
  unitWidth: z.number().min(1).max(200).default(30),
  unitHeight: z.number().min(1).max(200).default(20),
  filmCostPerKg: z.number().min(0).max(1000).default(30),
  wasteRate: z.number().min(0).max(50).default(5),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface PaketlemeMalzemesiStrecKoliSarfiyatiOutput {
  totalFilmCost: number;
  breakdown: {
    totalFilmWeight: number;
    filmPerUnit: number;
    filmWeightPerUnit: number;
    costPerUnit: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PaketlemeMalzemesiStrecKoliSarfiyatiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.unitPerimeter = ((): number => { try { const __v = 2 * (input.unitLength + input.unitWidth); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.filmPerUnit = ((): number => { try { const __v = (results.unitPerimeter * input.unitHeight * input.wrapLayers * (1 + input.overlapRatio/100)) / 10000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.filmVolumePerUnit = ((): number => { try { const __v = results.filmPerUnit * input.filmThickness / 10000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.filmWeightPerUnit = ((): number => { try { const __v = results.filmVolumePerUnit * input.filmDensity * 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalFilmWeight = ((): number => { try { const __v = input.unitCount * results.filmWeightPerUnit * (1 + input.wasteRate/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalFilmCost = ((): number => { try { const __v = results.totalFilmWeight * input.filmCostPerKg; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerUnit = ((): number => { try { const __v = results.totalFilmCost / input.unitCount; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalFilmCost * (1 + (100 - input.dataConfidence)/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePaketlemeMalzemesiStrecKoliSarfiyati(input: PaketlemeMalzemesiStrecKoliSarfiyatiInput): PaketlemeMalzemesiStrecKoliSarfiyatiOutput {
  const results = evaluateFormulas(input);
  const totalFilmCost = results.totalFilmCost ?? 0;
  const breakdown = {
    totalFilmWeight: results.totalFilmWeight,
    filmPerUnit: results.filmPerUnit,
    filmWeightPerUnit: results.filmWeightPerUnit,
    costPerUnit: results.costPerUnit,
  };

  // rule: filmWidth > 0
  // rule: filmThickness > 0
  // rule: wrapLayers >= 1
  // rule: overlapRatio >= 0 && overlapRatio <= 100
  // rule: filmDensity > 0
  // rule: unitLength > 0
  // rule: unitWidth > 0
  // rule: unitHeight > 0
  // rule: filmCostPerKg >= 0
  // rule: wasteRate >= 0 && wasteRate <= 50
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Fire orani %10'un uzerinde, surec iyilestirme onerilir.
  // threshold skipped (non-JS): Katman sayisi 5'ten fazla, maliyet artisina dikkat.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalFilmCost; } })();

  return {
    totalFilmCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
