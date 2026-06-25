import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: CORP_092
 * Araç Adı: Kısıtlı Hisse (RSU)
 */

export const InputSchema_CORP_092 = z.object({
  hisse_sayisi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  hak_kazanma: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
  vergi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_CORP_092 = z.infer<typeof InputSchema_CORP_092>;

export interface Output_CORP_092 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CORP_092(input: Input_CORP_092): Output_CORP_092 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: hisse_sayisi, hak_kazanma, vergi
  
  const validData = InputSchema_CORP_092.parse(input);
  const { hisse_sayisi, hak_kazanma, vergi } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = (hisse_sayisi * (hak_kazanma / 100)) * (1 - (vergi / 100)); 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Uluslararası Vergi Mevzuatı",
      message: "Uyarı: RSU (Kısıtlı Hisse) hak edişleri çoğu ülkede bordro geliri sayılır ve en yüksek gelir vergisi diliminden (Örn: %40+) vergilendirilir. Hisse satıp nakde çevirmeden doğacak 'Kuru Vergi' (Dry Income) yüküne dikkat edin."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}