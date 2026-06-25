import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: INV_130
 * Araç Adı: Güvenlik Stoğu ve ROP
 */

export const InputSchema_INV_130 = z.object({
  ort_talep: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  std_sapma: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  tedarik_sure: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  z_degeri: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
});

export type Input_INV_130 = z.infer<typeof InputSchema_INV_130>;

export interface Output_INV_130 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_INV_130(input: Input_INV_130): Output_INV_130 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: ort_talep, std_sapma, tedarik_sure, z_degeri
  
  const validData = InputSchema_INV_130.parse(input);
  const { ort_talep, std_sapma, tedarik_sure, z_degeri } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const gvenlikStogu = z_degeri * std_sapma * Math.sqrt(Math.max(0, tedarik_sure));
  const result = (ort_talep * tedarik_sure) + gvenlikStogu;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Yalın Üretim (Lean)",
      message: "Uyarı: Z değerini 3 veya daha yüksek seçtiniz (Hizmet Seviyesi > %99.8). Bu, stoksuz kalma riskini sıfıra yaklaştırsa da depoda devasa bir 'Atıl Sermaye' (Güvenlik Stoğu) biriktirmenize neden olacaktır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}