import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_036
 * Araç Adı: EVA (Ekonomik Katma Değer)
 */

export const InputSchema_FIN_036 = z.object({
  nopat: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  sermaye: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  wacc: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_036 = z.infer<typeof InputSchema_FIN_036>;

export interface Output_FIN_036 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_036(input: Input_FIN_036): Output_FIN_036 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: nopat, sermaye, wacc
  
  const validData = InputSchema_FIN_036.parse(input);
  const { nopat, sermaye, wacc } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = nopat - (sermaye * wacc / 100);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Ekonomik Kâr Teorisi",
      message: "Uyarı: Ekonomik Katma Değer (EVA) negatiftir. Muhasebesel olarak kâr ediliyor (Net Kâr > 0) olsa bile, şirket operasyonları sermayenin alternatif maliyetini karşılamadığı için aslında değer imha etmektedir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}