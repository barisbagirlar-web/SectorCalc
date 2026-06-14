// Auto-generated from silindir-hacmi-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SilindirHacmiHesaplamaInput {
  cap: number;
  stroke: number;
  cylinderCount: number;
}

export const SilindirHacmiHesaplamaInputSchema = z.object({
  cap: z.number().min(1).max(10000).default(100),
  stroke: z.number().min(1).max(10000).default(100),
  cylinderCount: z.number().min(1).max(100).default(1),
});

export interface SilindirHacmiHesaplamaOutput {
  totalVolumeL: number;
  breakdown: {
    singleCylinderVolumeCm3: number;
    totalVolumeCm3: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SilindirHacmiHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.singleCylinderVolumeCm3 = ((): number => { try { const __v = ((input.cap / 10) ** 2 * Math.PI * (input.stroke / 10)) / 4; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalVolumeCm3 = ((): number => { try { const __v = results.singleCylinderVolumeCm3 * input.cylinderCount; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalVolumeL = ((): number => { try { const __v = results.totalVolumeCm3 / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSilindirHacmiHesaplama(input: SilindirHacmiHesaplamaInput): SilindirHacmiHesaplamaOutput {
  const results = evaluateFormulas(input);
  const totalVolumeL = results.totalVolumeL ?? 0;
  const breakdown = {
    singleCylinderVolumeCm3: results.singleCylinderVolumeCm3,
    totalVolumeCm3: results.totalVolumeCm3,
  };

  // rule: cap > 0
  // rule: stroke > 0
  // rule: cylinderCount > 0
  // rule: cap <= 10000
  // rule: stroke <= 10000
  // rule: cylinderCount <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.cap > 500) hiddenLossDrivers.push("Buyuk capli silindir, ozel isleme gerekebilir.");
  if (input.stroke > 500) hiddenLossDrivers.push("Uzun strok, burkulma riski artar.");

  const dataConfidenceAdjusted = (() => { try { return results.totalVolumeL; } catch { return totalVolumeL; } })();

  return {
    totalVolumeL,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
