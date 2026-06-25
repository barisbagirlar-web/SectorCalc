import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MECH_183
 * Araç Adı: Kiriş Sehimi (Deflection)
 */

export const InputSchema_MECH_183 = z.object({
  yayili_yuk: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  aciklik: z.number().min(0.1, "Endüstriyel minimum tolerans: 0.1"),
  elastisite: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  atalet: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_MECH_183 = z.infer<typeof InputSchema_MECH_183>;

export interface Output_MECH_183 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_183(input: Input_MECH_183): Output_MECH_183 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: yayili_yuk, aciklik, elastisite, atalet
  
  const validData = InputSchema_MECH_183.parse(input);
  const { yayili_yuk, aciklik, elastisite, atalet } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = (5 * yayili_yuk * Math.pow(aciklik, 4)) / Math.max(0.0001, (384 * elastisite * atalet));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result > (aciklik / 250)) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "AISC / Eurocode 3",
      message: "Kritik Uyarı: Çıkan maksimum sehim değeri (Deflection), endüstri standardı olan L/250 limitini aşmaktadır. Taşıyıcı sistemin rijitliği yetersizdir, kiriş kesiti (Atalet Momenti) acilen büyütülmelidir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}