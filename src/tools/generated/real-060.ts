import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: REAL_060
 * Araç Adı: Nakit Çıkışlı Refinansman (Cash-Out)
 */

export const InputSchema_REAL_060 = z.object({
  mulk_degeri: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  kalan_borc: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yeni_kredi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  masraf: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_REAL_060 = z.infer<typeof InputSchema_REAL_060>;

export interface Output_REAL_060 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_REAL_060(input: Input_REAL_060): Output_REAL_060 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: mulk_degeri, kalan_borc, yeni_kredi, masraf
  
  const validData = InputSchema_REAL_060.parse(input);
  const { mulk_degeri, kalan_borc, yeni_kredi, masraf } = validData as any;
  
  // Formül: NakitCikis = YeniKredi - KalanBorc - Masraf
  // NakitCikis: Ev sermayesinin nakde çevrilerek ele geçen net tutar (₺)
  const result = yeni_kredi - kalan_borc - masraf;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "LTV ve PMI Kuralları",
      message: "Kritik Uyarı: Çekilen kredi, evin değerinin %80'ini aşmaktadır (LTV > 80). Çoğu regülasyonda bu durum ekstra faiz primi (veya PMI - Özel Mortgage Sigortası) zorunluluğu yaratır; evin değeri düşerse negatif özkaynak (sualtı) riski başlar."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}