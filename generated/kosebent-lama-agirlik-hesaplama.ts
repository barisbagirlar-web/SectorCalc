// Auto-generated from kosebent-lama-agirlik-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KosebentLamaAgirlikHesaplamaInput {
  profileType: 'esit kollu' | 'esit olmayan kollu';
  widthA: number;
  widthB: number;
  thickness: number;
  length: number;
  materialDensity: number;
  quantity: number;
}

export const KosebentLamaAgirlikHesaplamaInputSchema = z.object({
  profileType: z.enum(['esit kollu', 'esit olmayan kollu']).default('esit kollu'),
  widthA: z.number().min(20).max(250).default(50),
  widthB: z.number().min(20).max(250).default(50),
  thickness: z.number().min(3).max(25).default(5),
  length: z.number().min(1).max(12).default(6),
  materialDensity: z.number().min(7000).max(9000).default(7850),
  quantity: z.number().min(1).max(10000).default(1),
});

export interface KosebentLamaAgirlikHesaplamaOutput {
  totalWeight: number;
  breakdown: {
    crossSectionArea: number;
    volume: number;
    weightPerUnit: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KosebentLamaAgirlikHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.crossSectionArea = ((): number => { try { const __v = ((input.widthA - input.thickness) * input.thickness + (input.widthB - input.thickness) * input.thickness + input.thickness * input.thickness) / 1000000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.volume = ((): number => { try { const __v = results.crossSectionArea * input.length; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.weightPerUnit = ((): number => { try { const __v = results.volume * input.materialDensity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalWeight = ((): number => { try { const __v = results.weightPerUnit * input.quantity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKosebentLamaAgirlikHesaplama(input: KosebentLamaAgirlikHesaplamaInput): KosebentLamaAgirlikHesaplamaOutput {
  const results = evaluateFormulas(input);
  const totalWeight = results.totalWeight ?? 0;
  const breakdown = {
    crossSectionArea: results.crossSectionArea,
    volume: results.volume,
    weightPerUnit: results.weightPerUnit,
  };

  // rule: widthA >= 20 ve widthA <= 250
  // rule: widthB >= 20 ve widthB <= 250
  // rule: thickness >= 3 ve thickness <= 25
  // rule: length >= 1 ve length <= 12
  // rule: materialDensity >= 7000 ve materialDensity <= 9000
  // rule: quantity >= 1
  // rule: Eger profileType = 'esit kollu' ise widthA == widthB olmalidir
  // rule: Eger profileType = 'esit olmayan kollu' ise widthA != widthB olmalidir
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.thickness < 5) hiddenLossDrivers.push("UYARI: Et kalinligi cok ince, burkulma riski artar");
  if (input.widthA > 200) hiddenLossDrivers.push("UYARI: Genislik buyuk, ozel uretim gerekebilir");

  const dataConfidenceAdjusted = (() => { try { return results.totalWeight * (1 - 0.05); } catch { return totalWeight; } })();

  return {
    totalWeight,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
