// Auto-generated from duvar-kagidi-seramik-adet-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface DuvarKagidiSeramikAdetHesaplamaInput {
  wallWidth: number;
  wallHeight: number;
  tileWidth: number;
  tileHeight: number;
  wasteFactor: number;
  patternRepeat: number;
  doorArea: number;
  windowArea: number;
}

export const DuvarKagidiSeramikAdetHesaplamaInputSchema = z.object({
  wallWidth: z.number().min(0.1).max(50).default(4),
  wallHeight: z.number().min(0.1).max(10).default(2.5),
  tileWidth: z.number().min(1).max(100).default(30),
  tileHeight: z.number().min(1).max(200).default(60),
  wasteFactor: z.number().min(0).max(50).default(10),
  patternRepeat: z.number().min(0).max(100).default(0),
  doorArea: z.number().min(0).max(10).default(1.6),
  windowArea: z.number().min(0).max(20).default(2),
});

export interface DuvarKagidiSeramikAdetHesaplamaOutput {
  tileCount: number;
  breakdown: {
    wallArea: number;
    netArea: number;
    tileArea: number;
    patternWaste: number;
    totalWaste: number;
    totalAreaNeeded: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: DuvarKagidiSeramikAdetHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.wallArea = ((): number => { try { const __v = input.wallWidth * input.wallHeight; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netArea = ((): number => { try { const __v = results.wallArea - input.doorArea - input.windowArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.tileArea = ((): number => { try { const __v = (input.tileWidth / 100) * (input.tileHeight / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.patternWaste = ((): number => { try { const __v = input.patternRepeat > 0 ? (input.wallHeight / (input.tileHeight / 100)) * (input.patternRepeat / 100) * (input.tileWidth / 100) : 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalWaste = ((): number => { try { const __v = results.netArea * (input.wasteFactor / 100) + results.patternWaste; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAreaNeeded = ((): number => { try { const __v = results.netArea + results.totalWaste; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.tileCount = ((): number => { try { const __v = Math.Math.ceil(results.totalAreaNeeded / results.tileArea); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateDuvarKagidiSeramikAdetHesaplama(input: DuvarKagidiSeramikAdetHesaplamaInput): DuvarKagidiSeramikAdetHesaplamaOutput {
  const results = evaluateFormulas(input);
  const tileCount = results.tileCount ?? 0;
  const breakdown = {
    wallArea: results.wallArea,
    netArea: results.netArea,
    tileArea: results.tileArea,
    patternWaste: results.patternWaste,
    totalWaste: results.totalWaste,
    totalAreaNeeded: results.totalAreaNeeded,
  };

  // rule: wallWidth > 0
  // rule: wallHeight > 0
  // rule: tileWidth > 0
  // rule: tileHeight > 0
  // rule: wasteFactor >= 0 && wasteFactor <= 50
  // rule: patternRepeat >= 0
  // rule: doorArea >= 0
  // rule: windowArea >= 0
  // rule: doorArea + windowArea < wallWidth * wallHeight
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.wasteFactor > 15) hiddenLossDrivers.push("Yuksek fire orani, surec iyilestirme onerilir.");
  if (input.patternRepeat > 0) hiddenLossDrivers.push("Desen tekrari nedeniyle ek fire olusabilir.");

  const dataConfidenceAdjusted = (() => { try { return results.tileCount; } catch { return tileCount; } })();

  return {
    tileCount,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (gecmis hesaplamalar)","Karsilastirma (farkli seramik/kagit boyutlari)","Detayli rapor (fire analizi, maliyet tahmini)"],
  };
}
