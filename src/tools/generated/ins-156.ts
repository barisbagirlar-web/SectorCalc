import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: INS_156
 * Araç Adı: Medicare Prim (Gelire Endeksli)
 */

export const InputSchema_INS_156 = z.object({
  yillik_gelir: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  baz_prim: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
  ek_oran: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_INS_156 = z.infer<typeof InputSchema_INS_156>;

export interface Output_INS_156 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_INS_156(input: Input_INS_156): Output_INS_156 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: yillik_gelir, baz_prim, ek_oran
  
  const validData = InputSchema_INS_156.parse(input);
  const { yillik_gelir, baz_prim, ek_oran } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const esik = 0;
  const result = baz_prim + Math.max(0, (yillik_gelir - esik) * ek_oran / 100);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  

  
  return {
    result,
    smartWarnings
  };
}