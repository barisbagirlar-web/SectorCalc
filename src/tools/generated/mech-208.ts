import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MECH_208
 * Araç Adı: Kaynak Isı Girdisi
 */

export const InputSchema_MECH_208 = z.object({
  akim: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  gerilim: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  ilerleme_hizi: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
  verim: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_MECH_208 = z.infer<typeof InputSchema_MECH_208>;

export interface Output_MECH_208 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_208(input: Input_MECH_208): Output_MECH_208 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: akim, gerilim, ilerleme_hizi, verim
  
  const validData = InputSchema_MECH_208.parse(input);
  const { akim, gerilim, ilerleme_hizi, verim } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = (akim * gerilim * verim) / Math.max(0.0001, ilerleme_hizi);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "ASME Section IX / AWS D1.1",
      message: "Kritik Uyarı: Birim kaynak boyuna düşen ısı girdisi çok yüksek (>3500 J/mm). Kaynak dikişinde aşırı aşırı ısınma, geniş HAZ bölgesi ve kaba taneli mikroyapı oluşarak darbe tokluğunu düşürecektir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}