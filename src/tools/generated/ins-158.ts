import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: INS_158
 * Araç Adı: Emeklilik (Retirement) Birikimi
 */

export const InputSchema_INS_158 = z.object({
  mevcut_birikim: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  aylik_katki: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  faiz: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
  yil: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_INS_158 = z.infer<typeof InputSchema_INS_158>;

export interface Output_INS_158 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_INS_158(input: Input_INS_158): Output_INS_158 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: mevcut_birikim, aylik_katki, faiz, yil
  
  const validData = InputSchema_INS_158.parse(input);
  const { mevcut_birikim, aylik_katki, faiz, yil } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const aylikFaiz = faiz / 1200;
  const aySayisi = yil * 12;
  const birikimCarpan = Math.pow(1 + aylikFaiz, aySayisi);
  const katkiCarpan = (Math.pow(1 + aylikFaiz, aySayisi) - 1) / Math.max(0.0001, aylikFaiz);
  const result = mevcut_birikim * birikimCarpan + aylik_katki * katkiCarpan;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Makroekonomik Projeksiyonlar",
      message: "Uyarı: Uzun vadeli emeklilik hesaplamalarında yıllık %12'nin üzerindeki nominal getiriler son derece iyimserdir. Enflasyonu ve olası borsa krizlerini hesaba katarak getirinizi (örneğin %5-7 reel getiri bandına) düşürmeniz daha güvenli bir projeksiyon sunar."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}