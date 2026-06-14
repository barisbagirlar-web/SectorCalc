// Auto-generated from internet-telefon-paketi-karsilastirma-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface InternetTelefonPaketiKarsilastirmaInput {
  paketAdi: 'Paket A' | 'Paket B' | 'Paket C';
  aylikUcret: number;
  internetHizi: number;
  internetKotasi: number;
  telefonDakikasi: number;
  ekstraInternetUcreti: number;
  ekstraTelefonUcreti: number;
  tahminiInternetKullanim: number;
  tahminiTelefonKullanim: number;
  dataConfidence: number;
}

export const InternetTelefonPaketiKarsilastirmaInputSchema = z.object({
  paketAdi: z.enum(['Paket A', 'Paket B', 'Paket C']).default('Paket A'),
  aylikUcret: z.number().min(0).max(10000).default(100),
  internetHizi: z.number().min(1).max(10000).default(100),
  internetKotasi: z.number().min(0).max(10000).default(100),
  telefonDakikasi: z.number().min(0).max(100000).default(500),
  ekstraInternetUcreti: z.number().min(0).max(1000).default(10),
  ekstraTelefonUcreti: z.number().min(0).max(100).default(0.5),
  tahminiInternetKullanim: z.number().min(0).max(10000).default(80),
  tahminiTelefonKullanim: z.number().min(0).max(100000).default(400),
  dataConfidence: z.number().min(0).max(1).default(1),
});

export interface InternetTelefonPaketiKarsilastirmaOutput {
  toplamMaliyet: number;
  breakdown: {
    aylikUcret: number;
    ekstraInternet: number;
    ekstraTelefon: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: InternetTelefonPaketiKarsilastirmaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.ekstraInternet = ((): number => { try { const __v = Math.max(0, input.tahminiInternetKullanim - input.internetKotasi) * input.ekstraInternetUcreti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.ekstraTelefon = ((): number => { try { const __v = Math.max(0, input.tahminiTelefonKullanim - input.telefonDakikasi) * input.ekstraTelefonUcreti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamMaliyet = ((): number => { try { const __v = input.aylikUcret + results.ekstraInternet + results.ekstraTelefon; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.birimMaliyet = ((): number => { try { const __v = results.toplamMaliyet / (input.tahminiInternetKullanim + input.tahminiTelefonKullanim / 60); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.toplamMaliyet * (1 + (1 - input.dataConfidence) * 0.1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateInternetTelefonPaketiKarsilastirma(input: InternetTelefonPaketiKarsilastirmaInput): InternetTelefonPaketiKarsilastirmaOutput {
  const results = evaluateFormulas(input);
  const toplamMaliyet = results.toplamMaliyet ?? 0;
  const breakdown = {
    aylikUcret: results.aylikUcret,
    ekstraInternet: results.ekstraInternet,
    ekstraTelefon: results.ekstraTelefon,
  };

  // rule: aylikUcret >= 0
  // rule: internetHizi > 0
  // rule: internetKotasi >= 0
  // rule: telefonDakikasi >= 0
  // rule: ekstraInternetUcreti >= 0
  // rule: ekstraTelefonUcreti >= 0
  // rule: tahminiInternetKullanim >= 0
  // rule: tahminiTelefonKullanim >= 0
  // rule: dataConfidence >= 0 and dataConfidence <= 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Uyari: Tahmini kullanim kotayi asiyor, ek ucret olusabilir.
  // threshold skipped (non-JS): Uyari: Tahmini konusma suresi paket dakikasini asiyor, ek ucret olusabilir.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return toplamMaliyet; } })();

  return {
    toplamMaliyet,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
