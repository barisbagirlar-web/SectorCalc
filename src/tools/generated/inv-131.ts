import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: INV_131
 * Araç Adı: Envanter Devir Hızı
 */

export const InputSchema_INV_131 = z.object({
  yillik_cogs: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  ort_stok: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_INV_131 = z.infer<typeof InputSchema_INV_131>;

export interface Output_INV_131 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_INV_131(input: Input_INV_131): Output_INV_131 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: yillik_cogs, ort_stok
  
  const validData = InputSchema_INV_131.parse(input);
  const { yillik_cogs, ort_stok } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = yillik_cogs / Math.max(0.0001, ort_stok);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result > 24) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Tedarik Zinciri Risk Yönetimi",
      message: "Uyarı: Envanter devir hızınız yılda 24'ün üzerinde (Yani stoklarınız 15 günden daha az sürede tükeniyor). Bu yüksek hız sermaye verimliliği sağlasa da, tedarik zincirindeki ufak bir kırılma üretim hattının anında durmasına (Stockout) yol açabilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}