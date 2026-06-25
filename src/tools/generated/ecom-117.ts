import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: ECOM_117
 * Araç Adı: Amazon FBA Kârı
 */

export const InputSchema_ECOM_117 = z.object({
  satis: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  urun_maliyeti: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  fba_ucreti: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  komisyon: z.number().min(5, "Endüstriyel minimum tolerans: 5"),
});

export type Input_ECOM_117 = z.infer<typeof InputSchema_ECOM_117>;

export interface Output_ECOM_117 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ECOM_117(input: Input_ECOM_117): Output_ECOM_117 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: satis, urun_maliyeti, fba_ucreti, komisyon
  
  const validData = InputSchema_ECOM_117.parse(input);
  const { satis, urun_maliyeti, fba_ucreti, komisyon } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = satis - urun_maliyeti - fba_ucreti - (satis * komisyon / 100);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if ((result / satis) * 100 < 20) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Amazon Satıcı Metrikleri",
      message: "Uyarı: Net Kâr Marjınız %20'nin altında kalıyor. Amazon PPC (Reklam) maliyetleri, iadeler (Returns) ve uzun süreli depolama cezaları bu marjı kolayca yutarak sizi eksiye düşürebilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}