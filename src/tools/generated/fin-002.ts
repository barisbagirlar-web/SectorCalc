import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_002
 * Araç Adı: 1031 Vergi Erteleme Takası
 */

export const InputSchema_FIN_002 = z.object({
  satis_fiyati: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  kalan_borc: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yeni_yatirim: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_002 = z.infer<typeof InputSchema_FIN_002>;

export interface Output_FIN_002 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_002(input: Input_FIN_002): Output_FIN_002 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: satis_fiyati, kalan_borc, yeni_yatirim
  
  const validData = InputSchema_FIN_002.parse(input);
  const { satis_fiyati, kalan_borc, yeni_yatirim } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const nakitCikis = satis_fiyati - kalan_borc;
  const result = Math.max(0, nakitCikis - yeni_yatirim);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (kalan_borc > satis_fiyati) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Finansal Mantık",
      message: "Kritik Uyarı: Kalan borç satış fiyatından yüksek. Gayrimenkul 'sualtında' (underwater) durumdadır."
    });
  }

  if (yeni_yatirim < nakitCikis) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Vergi Mevzuatı",
      message: "Uyarı: Yeni yatırım bedeli, elde edilen net nakitten (Satış - Borç) düşüktür. Aradaki fark (Boot) doğrudan sermaye kazancı vergisine tabidir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}