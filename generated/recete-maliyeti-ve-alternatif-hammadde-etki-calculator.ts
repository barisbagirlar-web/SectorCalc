// Auto-generated from recete-maliyeti-ve-alternatif-hammadde-etki-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInput {
  hammaddeMaliyeti: number;
  alternatifHammaddeMaliyeti: number;
  kullanimMiktari: number;
  uretimAdedi: number;
  alternatifVerimOrani: number;
  kaliteKaybiOrani: number;
  lojistikMaliyetFarki: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInputSchema = z.object({
  hammaddeMaliyeti: z.number().min(0).default(0),
  alternatifHammaddeMaliyeti: z.number().min(0).default(0),
  kullanimMiktari: z.number().min(0).default(1),
  uretimAdedi: z.number().min(0).default(1000),
  alternatifVerimOrani: z.number().min(0).max(100).default(100),
  kaliteKaybiOrani: z.number().min(0).max(100).default(0),
  lojistikMaliyetFarki: z.number().default(0),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorOutput {
  maliyetTasarrufu: number;
  breakdown: {
    mevcutToplamMaliyet: number;
    alternatifToplamMaliyet: number;
    maliyetTasarrufuYuzde: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.mevcutToplamMaliyet = ((): number => { try { const __v = input.hammaddeMaliyeti * input.kullanimMiktari * input.uretimAdedi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.alternatifBirimMaliyet = ((): number => { try { const __v = input.alternatifHammaddeMaliyeti + input.lojistikMaliyetFarki; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.alternatifToplamMaliyet = ((): number => { try { const __v = results.alternatifBirimMaliyet * input.kullanimMiktari * input.uretimAdedi * (input.alternatifVerimOrani / 100) * (1 + input.kaliteKaybiOrani / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.maliyetTasarrufu = ((): number => { try { const __v = results.mevcutToplamMaliyet - results.alternatifToplamMaliyet; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.maliyetTasarrufuYuzde = ((): number => { try { const __v = (results.maliyetTasarrufu / results.mevcutToplamMaliyet) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.maliyetTasarrufu * (input.dataConfidence === 'high' ? 1 : input.dataConfidence === 'medium' ? 0.8 : 0.5); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateReceteMaliyetiVeAlternatifHammaddeEtkiCalculator(input: ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorInput): ReceteMaliyetiVeAlternatifHammaddeEtkiCalculatorOutput {
  const results = evaluateFormulas(input);
  const maliyetTasarrufu = results.maliyetTasarrufu ?? 0;
  const breakdown = {
    mevcutToplamMaliyet: results.mevcutToplamMaliyet,
    alternatifToplamMaliyet: results.alternatifToplamMaliyet,
    maliyetTasarrufuYuzde: results.maliyetTasarrufuYuzde,
  };

  // rule: hammaddeMaliyeti >= 0
  // rule: alternatifHammaddeMaliyeti >= 0
  // rule: kullanimMiktari > 0
  // rule: uretimAdedi > 0
  // rule: alternatifVerimOrani >= 0 && alternatifVerimOrani <= 100
  // rule: kaliteKaybiOrani >= 0 && kaliteKaybiOrani <= 100
  // rule: if (alternatifVerimOrani < 100) then kaliteKaybiOrani >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if maliyetTasarrufuYuzde < 0 then 'Alternatif hammadde daha pahali, onerilmez'
  // threshold skipped (non-JS): if kaliteKaybiOrani > 5 then 'Kalite kaybi yuksek, proses iyilestirme gerekli'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return maliyetTasarrufu; } })();

  return {
    maliyetTasarrufu,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi (zaman serisi)","Alternatif hammadde karsilastirma (birden fazla alternatif)"],
  };
}
