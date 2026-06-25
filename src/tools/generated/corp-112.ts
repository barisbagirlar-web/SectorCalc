import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: CORP_112
 * Araç Adı: Katkı Marjı
 */

export const InputSchema_CORP_112 = z.object({
  satis_fiyati: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
  degisken_maliyet: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_CORP_112 = z.infer<typeof InputSchema_CORP_112>;

export interface Output_CORP_112 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CORP_112(input: Input_CORP_112): Output_CORP_112 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: satis_fiyati, degisken_maliyet
  
  const validData = InputSchema_CORP_112.parse(input);
  const { satis_fiyati, degisken_maliyet } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const katki = satis_fiyati - degisken_maliyet;
  const result = (katki / Math.max(0.0001, satis_fiyati)) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (degisken_maliyet >= satis_fiyati) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Birim Ekonomisi",
      message: "Kritik Uyarı: Değişken maliyet satış fiyatına eşit veya ondan büyüktür. Katkı marjı negatiftir; satılan her birim ürün şirketin doğrudan zarar etmesine ve sabit giderlerin hiçbir şekilde karşılanamamasına yol açar."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}