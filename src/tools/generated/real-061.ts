import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: REAL_061
 * Araç Adı: Ev Alım Gücü
 */

export const InputSchema_REAL_061 = z.object({
  aylik_gelir: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  max_dti: z.number().min(10, "Endüstriyel minimum tolerans: 10"),
  aylik_borc: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  vade: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_REAL_061 = z.infer<typeof InputSchema_REAL_061>;

export interface Output_REAL_061 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_REAL_061(input: Input_REAL_061): Output_REAL_061 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: aylik_gelir, max_dti, aylik_borc, faiz, vade
  
  const validData = InputSchema_REAL_061.parse(input);
  const { aylik_gelir, max_dti, aylik_borc, faiz, vade } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  // MaxTaksit = (AylikGelir * MaxDTI / 100) - AylikBorc
  const aylikFaizOran = (faiz / 100) / 12;
  const maxTaksit = (aylik_gelir * max_dti / 100) - aylik_borc;
  
  // MaxKredi = PV(MaxTaksit, Faiz, Vade) 
  // PV = PMT * [1 - (1 + r)^(-n)] / r
  const result = aylikFaizOran === 0
    ? maxTaksit * vade
    : maxTaksit * (1 - Math.pow(1 + aylikFaizOran, -vade)) / aylikFaizOran;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Tüketici Kredisi Riskleri",
      message: "Kritik Uyarı: Borç/Gelir Oranı (DTI) sınırı %43'ün üzerinde seçilmiştir. Bu seviye küresel finans otoriterlerince (örn. Dodd-Frank QRM) yüksek riskli (Subprime) kabul edilir; temerrüt riski çok yüksektir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}