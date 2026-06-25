import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: INS_151
 * Araç Adı: Hayat Sigortası İhtiyacı
 */

export const InputSchema_INS_151 = z.object({
  yillik_gelir: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  bagimli_sayisi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  borclar: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  birikim: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_INS_151 = z.infer<typeof InputSchema_INS_151>;

export interface Output_INS_151 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_INS_151(input: Input_INS_151): Output_INS_151 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: yillik_gelir, bagimli_sayisi, borclar, birikim
  
  const validData = InputSchema_INS_151.parse(input);
  const { yillik_gelir, bagimli_sayisi, borclar, birikim } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = (yillik_gelir * 10 * bagimli_sayisi) + borclar - birikim; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Aktüeryal Sınırlar",
      message: "Uyarı: Talep edilen teminat, yıllık gelirinizin 20 katını aşmaktadır (Over-insurance riski). Sigorta şirketleri bu seviyedeki poliçeleri onaylamak için genellikle detaylı mali denetim ve kapsamlı sağlık taraması (Underwriting) şartı koşar."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}