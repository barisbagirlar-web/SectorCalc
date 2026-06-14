// Auto-generated from disli-modul-cap-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface DisliModulCapHesaplamaInput {
  disliSayisi: number;
  modul: number;
  basincAcisi: '14.5' | '20' | '25';
  disliTipi: 'duz' | 'helis';
  helisAcisi: number;
}

export const DisliModulCapHesaplamaInputSchema = z.object({
  disliSayisi: z.number().min(5).max(200).default(20),
  modul: z.number().min(0.5).max(50).default(2),
  basincAcisi: z.enum(['14.5', '20', '25']).default('20'),
  disliTipi: z.enum(['duz', 'helis']).default('duz'),
  helisAcisi: z.number().min(0).max(45).default(0),
});

export interface DisliModulCapHesaplamaOutput {
  bolumDairesiCapi: number;
  breakdown: {
    bolumDairesiCapi: number;
    disUstuCapi: number;
    disDibiCapi: number;
    disYuksekligi: number;
    disAraligi: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: DisliModulCapHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.bolumDairesiCapi = ((): number => { try { const __v = input.disliSayisi * input.modul / cos(input.helisAcisi * PI / 180); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.disUstuCapi = ((): number => { try { const __v = results.bolumDairesiCapi + 2 * input.modul; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.disDibiCapi = ((): number => { try { const __v = results.bolumDairesiCapi - 2.5 * input.modul; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.disYuksekligi = ((): number => { try { const __v = 2.25 * input.modul; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.disAraligi = ((): number => { try { const __v = PI * input.modul; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateDisliModulCapHesaplama(input: DisliModulCapHesaplamaInput): DisliModulCapHesaplamaOutput {
  const results = evaluateFormulas(input);
  const bolumDairesiCapi = results.bolumDairesiCapi ?? 0;
  const breakdown = {
    bolumDairesiCapi: results.bolumDairesiCapi,
    disUstuCapi: results.disUstuCapi,
    disDibiCapi: results.disDibiCapi,
    disYuksekligi: results.disYuksekligi,
    disAraligi: results.disAraligi,
  };

  // rule: disliSayisi >= 5 ve <= 200
  // rule: modul >= 0.5 ve <= 50
  // rule: helisAcisi >= 0 ve <= 45
  // rule: Eger disliTipi = 'duz' ise helisAcisi = 0 olmalidir
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Uyari: Modul cok kucuk, disli dayanimi dusuk olabilir.
  // threshold skipped (non-JS): Uyari: Disli sayisi az, alttan kesme riski var.

  const dataConfidenceAdjusted = (() => { try { return results.bolumDairesiCapi * (1 - 0.05); } catch { return bolumDairesiCapi; } })();

  return {
    bolumDairesiCapi,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma modulu","Detayli tolerans raporu"],
  };
}
