// Auto-generated from baca-havalandirma-kanali-cap-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BacaHavalandirmaKanaliCapHesabiInput {
  havaDebisi: number;
  hizSiniri: number;
  kanalSekli: 'yuvarlak' | 'dikdortgen';
  enBoyOrani: number;
}

export const BacaHavalandirmaKanaliCapHesabiInputSchema = z.object({
  havaDebisi: z.number().min(0.1).max(100).default(1),
  hizSiniri: z.number().min(1).max(30).default(10),
  kanalSekli: z.enum(['yuvarlak', 'dikdortgen']).default('yuvarlak'),
  enBoyOrani: z.number().min(1).max(5).default(1),
});

export interface BacaHavalandirmaKanaliCapHesabiOutput {
  cap: number;
  breakdown: {
    kesitAlani: number;
    digerKenar: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BacaHavalandirmaKanaliCapHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.kesitAlani = ((): number => { try { const __v = input.havaDebisi / input.hizSiniri; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cap = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.digerKenar = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateBacaHavalandirmaKanaliCapHesabi(input: BacaHavalandirmaKanaliCapHesabiInput): BacaHavalandirmaKanaliCapHesabiOutput {
  const results = evaluateFormulas(input);
  const cap = results.cap ?? 0;
  const breakdown = {
    kesitAlani: results.kesitAlani,
    digerKenar: results.digerKenar,
  };

  // rule: havaDebisi > 0
  // rule: hizSiniri > 0
  // rule: if kanalSekli == 'dikdortgen' then enBoyOrani >= 1
  // rule: if kanalSekli == 'yuvarlak' then enBoyOrani == 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek hiz: gurultu ve basinc kaybi artabilir.
  // threshold skipped (non-JS): Yuksek en/boy orani: basinc kaybi onemli olcude artar.

  const dataConfidenceAdjusted = (() => { try { return results.cap; } catch { return cap; } })();

  return {
    cap,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
