// Auto-generated from ise-giris-cikis-bildirgesi-sureleri-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface IseGirisCikisBildirgesiSureleriInput {
  bildirgeTuru: 'giris' | 'cikis';
  isverenTuru: 'ozel' | 'kamu' | 'varlikYonetim';
  calisanSayisi: number;
  bildirimGunu: number;
  dataConfidence: number;
}

export const IseGirisCikisBildirgesiSureleriInputSchema = z.object({
  bildirgeTuru: z.enum(['giris', 'cikis']).default('giris'),
  isverenTuru: z.enum(['ozel', 'kamu', 'varlikYonetim']).default('ozel'),
  calisanSayisi: z.number().min(1).max(100000).default(10),
  bildirimGunu: z.number().min(0).max(30).default(0),
  dataConfidence: z.number().min(0).max(100).default(100),
});

export interface IseGirisCikisBildirgesiSureleriOutput {
  cezaPuani: number;
  breakdown: {
    yasalSure: number;
    gecikmeGunu: number;
    riskSeviyesi: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: IseGirisCikisBildirgesiSureleriInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.yasalSure = ((): number => { try { const __v = input.bildirgeTuru == 'giris' ? (input.isverenTuru == 'kamu' ? 1 : 3) : (input.isverenTuru == 'kamu' ? 1 : 10); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.gecikmeGunu = ((): number => { try { const __v = input.bildirimGunu - results.yasalSure; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cezaPuani = ((): number => { try { const __v = results.gecikmeGunu > 0 ? (results.gecikmeGunu * (input.isverenTuru == 'kamu' ? 2 : 1.5)) : 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.riskSeviyesi = ((): number => { try { const __v = results.cezaPuani > 10 ? 'yuksek' : (results.cezaPuani > 5 ? 'orta' : 'dusuk'); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.cezaPuani * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateIseGirisCikisBildirgesiSureleri(input: IseGirisCikisBildirgesiSureleriInput): IseGirisCikisBildirgesiSureleriOutput {
  const results = evaluateFormulas(input);
  const cezaPuani = results.cezaPuani ?? 0;
  const breakdown = {
    yasalSure: results.yasalSure,
    gecikmeGunu: results.gecikmeGunu,
    riskSeviyesi: results.riskSeviyesi,
  };

  // rule: bildirimGunu >= 0
  // rule: calisanSayisi >= 1
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.bildirimGunu > 15) hiddenLossDrivers.push("gecikmeUyarisi");
  if (input.bildirimGunu > 30) hiddenLossDrivers.push("kritikGecikme");

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return cezaPuani; } })();

  return {
    cezaPuani,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi (gecmis bildirimler)","Karsilastirma (farkli isyerleri)"],
  };
}
