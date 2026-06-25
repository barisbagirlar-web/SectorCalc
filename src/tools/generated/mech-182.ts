import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MECH_182
 * Araç Adı: Kaynak Boyutlandırma
 */

export const InputSchema_MECH_182 = z.object({
  yuk: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  kaynak_boyu: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
  emniyetli_gerilme: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_MECH_182 = z.infer<typeof InputSchema_MECH_182>;

export interface Output_MECH_182 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_182(input: Input_MECH_182): Output_MECH_182 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: yuk, kaynak_boyu, emniyetli_gerilme
  
  const validData = InputSchema_MECH_182.parse(input);
  const { yuk, kaynak_boyu, emniyetli_gerilme } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = yuk / Math.max(0.0001, (kaynak_boyu * emniyetli_gerilme));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result < 0.003) {
    smartWarnings.push({
      severity: "WARNING",
      source: "AWS D1.1 (Amerikan Kaynak Cemiyeti)",
      message: "Uyarı: Hesaplanan minimum kaynak boğaz kalınlığı 3 mm'nin altındadır. Yapısal çelik montajında teknolojik olarak 3 mm'den ince köşe kaynağı (fillet weld) çekilmesi kaynak penetrasyon hatalarına (Lack of Fusion) yol açar; asgari 3mm kullanılmalıdır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}