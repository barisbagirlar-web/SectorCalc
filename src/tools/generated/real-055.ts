import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: REAL_055
 * Araç Adı: Mortgage (Aylık Taksit)
 */

export const InputSchema_REAL_055 = z.object({
  kredi: z.number().min(1000, "Endüstriyel minimum tolerans: 1000"),
  faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  vade: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_REAL_055 = z.infer<typeof InputSchema_REAL_055>;

export interface Output_REAL_055 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_REAL_055(input: Input_REAL_055): Output_REAL_055 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: kredi, faiz, vade
  
  const validData = InputSchema_REAL_055.parse(input);
  const { kredi, faiz, vade } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = faiz === 0 
    ? kredi / Math.max(1, vade)
    : kredi * ((faiz / 1200) / (1 - Math.pow(1 + faiz / 1200, -vade)));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (vade > 360) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Bankacılık Standartları",
      message: "Uyarı: Vade 30 yılı (360 ay) aşmaktadır. Dünyada standart mortgage süreleri maksimum 30 yıldır, vade uzadıkça aylık taksit düşüşü marjinalleşir ancak toplam faiz yükü geometrik olarak artar."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}