// Auto-generated from sgk-prim-hesaplama-isci-plus-isveren-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SgkPrimHesaplamaIsciPlusIsverenInput {
  brutUcret: number;
  isciPrimOrani: number;
  isverenPrimOrani: number;
  isverenISSizlikOrani: number;
  isciISSizlikOrani: number;
  asgariUcret: number;
  sgkTavanKatSayi: number;
}

export const SgkPrimHesaplamaIsciPlusIsverenInputSchema = z.object({
  brutUcret: z.number().min(0).default(10000),
  isciPrimOrani: z.number().min(0).max(100).default(14),
  isverenPrimOrani: z.number().min(0).max(100).default(20.5),
  isverenISSizlikOrani: z.number().min(0).max(100).default(2),
  isciISSizlikOrani: z.number().min(0).max(100).default(1),
  asgariUcret: z.number().min(0).default(17002),
  sgkTavanKatSayi: z.number().min(1).max(10).default(7.5),
});

export interface SgkPrimHesaplamaIsciPlusIsverenOutput {
  genelToplamPrim: number;
  breakdown: {
    isciSGKPrimi: number;
    isverenSGKPrimi: number;
    isciISSizlikPrimi: number;
    isverenISSizlikPrimi: number;
    toplamIsciKesintisi: number;
    toplamIsverenMaliyeti: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SgkPrimHesaplamaIsciPlusIsverenInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.sgkTaban = ((): number => { try { const __v = input.asgariUcret; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sgkTavan = ((): number => { try { const __v = input.asgariUcret * input.sgkTavanKatSayi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.primMatrah = ((): number => { try { const __v = input.brutUcret < results.sgkTaban ? results.sgkTaban : (input.brutUcret > results.sgkTavan ? results.sgkTavan : input.brutUcret); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.isciSGKPrimi = ((): number => { try { const __v = results.primMatrah * input.isciPrimOrani / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.isverenSGKPrimi = ((): number => { try { const __v = results.primMatrah * input.isverenPrimOrani / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.isciISSizlikPrimi = ((): number => { try { const __v = results.primMatrah * input.isciISSizlikOrani / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.isverenISSizlikPrimi = ((): number => { try { const __v = results.primMatrah * input.isverenISSizlikOrani / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamIsciKesintisi = ((): number => { try { const __v = results.isciSGKPrimi + results.isciISSizlikPrimi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamIsverenMaliyeti = ((): number => { try { const __v = results.isverenSGKPrimi + results.isverenISSizlikPrimi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.genelToplamPrim = ((): number => { try { const __v = results.toplamIsciKesintisi + results.toplamIsverenMaliyeti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSgkPrimHesaplamaIsciPlusIsveren(input: SgkPrimHesaplamaIsciPlusIsverenInput): SgkPrimHesaplamaIsciPlusIsverenOutput {
  const results = evaluateFormulas(input);
  const genelToplamPrim = results.genelToplamPrim ?? 0;
  const breakdown = {
    isciSGKPrimi: results.isciSGKPrimi,
    isverenSGKPrimi: results.isverenSGKPrimi,
    isciISSizlikPrimi: results.isciISSizlikPrimi,
    isverenISSizlikPrimi: results.isverenISSizlikPrimi,
    toplamIsciKesintisi: results.toplamIsciKesintisi,
    toplamIsverenMaliyeti: results.toplamIsverenMaliyeti,
  };

  // rule: brutUcret >= 0
  // rule: isciPrimOrani >= 0 && isciPrimOrani <= 100
  // rule: isverenPrimOrani >= 0 && isverenPrimOrani <= 100
  // rule: isverenISSizlikOrani >= 0 && isverenISSizlikOrani <= 100
  // rule: isciISSizlikOrani >= 0 && isciISSizlikOrani <= 100
  // rule: asgariUcret > 0
  // rule: sgkTavanKatSayi >= 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Brut ucret SGK tavanini asiyor, prim tavan uzerinden hesaplanacak.
  // threshold skipped (non-JS): Brut ucret asgari ucretin altinda, prim asgari ucret uzerinden hesaplanacak.

  const dataConfidenceAdjusted = (() => { try { return results.genelToplamPrim; } catch { return genelToplamPrim; } })();

  return {
    genelToplamPrim,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma (farkli ucret senaryolari)","Detayli rapor (kesinti dokumu)"],
  };
}
