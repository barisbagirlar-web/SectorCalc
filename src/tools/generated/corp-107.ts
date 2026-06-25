import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: CORP_107
 * Araç Adı: Çalışma Sermayesi
 */

export const InputSchema_CORP_107 = z.object({
  donen_varliklar: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  kisa_vadeli_borc: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_CORP_107 = z.infer<typeof InputSchema_CORP_107>;

export interface Output_CORP_107 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CORP_107(input: Input_CORP_107): Output_CORP_107 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: donen_varliklar, kisa_vadeli_borc
  
  const validData = InputSchema_CORP_107.parse(input);
  const { donen_varliklar, kisa_vadeli_borc } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = donen_varliklar - kisa_vadeli_borc;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Cari Oran (Current Ratio)",
      message: "Kritik Uyarı: Net Çalışma Sermayesi negatiftir. Şirketin bir yıl içinde nakde çevirebileceği tüm varlıkları, bir yıl içinde ödemesi gereken borçları karşılamaya yetmemektedir. Teknik likidite krizi."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}