import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_079
 * Araç Adı: Öğrenci Kredisi Refinansman
 */

export const InputSchema_FIN_079 = z.object({
  eski_bakiye: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  eski_faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yeni_faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  vade: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_079 = z.infer<typeof InputSchema_FIN_079>;

export interface Output_FIN_079 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

/**
 * PMT fonksiyonu: Aylık taksit hesaplar
 * "Eşit Taksitli Kredi" (Annuity) formülü ile çalışır
 */
function pmt(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return principal / months;
  const monthlyRate = annualRate / 100 / 12;
  const denominator = 1 - Math.pow(1 + monthlyRate, -months);
  if (denominator === 0) return principal / months; // bölünme riskine karşı
  return (principal * monthlyRate) / denominator;
}

export function execute_FIN_079(input: Input_FIN_079): Output_FIN_079 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: eski_bakiye, eski_faiz, yeni_faiz, vade
  
  const validData = InputSchema_FIN_079.parse(input);
  const { eski_bakiye, eski_faiz, yeni_faiz, vade } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  // Tasarruf = (PMT(EskiBakiye, EskiFaiz, Vade) - PMT(EskiBakiye, YeniFaiz, Vade)) * Vade
  const result: number = (pmt(eski_bakiye, eski_faiz, vade) - pmt(eski_bakiye, yeni_faiz, vade)) * vade;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Eğitim Kredisi Regülasyonları",
      message: "Kritik Karar: Devlet (Devlet/Federal) destekli bir öğrenci kredisini özel bir bankaya refinanse ediyorsanız; gelire endeksli geri ödeme, işsizlik ertelemesi ve borç affı (forgiveness) gibi yasal haklarınızı kalıcı olarak kaybedersiniz."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}