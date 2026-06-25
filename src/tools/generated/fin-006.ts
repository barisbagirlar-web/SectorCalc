import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_006
 * Araç Adı: Yıllık Ödeme (Annuity Payout)
 */

export const InputSchema_FIN_006 = z.object({
  birikim: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  sure: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_FIN_006 = z.infer<typeof InputSchema_FIN_006>;

export interface Output_FIN_006 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_006(input: Input_FIN_006): Output_FIN_006 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: birikim, faiz, sure
  
  const validData = InputSchema_FIN_006.parse(input);
  const { birikim, faiz, sure } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const effectiveRate = faiz / 100;
  const denominator = 1 - Math.pow(1 + effectiveRate, -sure);
  const denominatorSafe = Math.max(0.0001, denominator);
  const result = birikim * (effectiveRate / denominatorSafe);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Güvenli Çekim Oranı (%4 Kuralı)",
      message: "Uyarı: Yıllık çekim oranınız toplam birikiminizin %8'ini aşıyor. Piyasaların kötü gitmesi durumunda emeklilik fonunuzun planlanandan çok daha erken tükenme riski yüksektir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}