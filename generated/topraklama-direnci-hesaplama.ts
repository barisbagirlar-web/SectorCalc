// Auto-generated from topraklama-direnci-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface TopraklamaDirenciHesaplamaInput {
  toprakOzdirenc: number;
  elektrotBoyu: number;
  elektrotCap: number;
  elektrotTipi: 'cubuk' | 'sekil' | 'plaka';
  mevsimFaktoru: number;
}

export const TopraklamaDirenciHesaplamaInputSchema = z.object({
  toprakOzdirenc: z.number().min(1).max(10000).default(100),
  elektrotBoyu: z.number().min(0.5).max(50).default(2.5),
  elektrotCap: z.number().min(8).max(50).default(16),
  elektrotTipi: z.enum(['cubuk', 'sekil', 'plaka']).default('cubuk'),
  mevsimFaktoru: z.number().min(1).max(2).default(1.2),
});

export interface TopraklamaDirenciHesaplamaOutput {
  topraklamaDirenci: number;
  breakdown: {
    toprakOzdirencDuzeltilmis: number;
    elektrotYuzeyAlani: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: TopraklamaDirenciHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.topraklamaDirenci = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateTopraklamaDirenciHesaplama(input: TopraklamaDirenciHesaplamaInput): TopraklamaDirenciHesaplamaOutput {
  const results = evaluateFormulas(input);
  const topraklamaDirenci = results.topraklamaDirenci ?? 0;
  const breakdown = {
    toprakOzdirencDuzeltilmis: results.toprakOzdirencDuzeltilmis,
    elektrotYuzeyAlani: results.elektrotYuzeyAlani,
  };

  // rule: elektrotBoyu > 0
  // rule: elektrotCap > 0
  // rule: toprakOzdirenc > 0
  // rule: mevsimFaktoru >= 1.0 ve <= 2.0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Topraklama direnci 10 Ω uzerinde, iyilestirme gerekebilir.
  // threshold skipped (non-JS): Kritik: Topraklama direnci cok yuksek, acil onlem alinmali.

  const dataConfidenceAdjusted = (() => { try { return results.topraklamaDirenci * 1.1; } catch { return topraklamaDirenci; } })();

  return {
    topraklamaDirenci,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
