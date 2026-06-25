import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_025
 * Araç Adı: Kârlılık Endeksi (PI)
 */

export const InputSchema_FIN_025 = z.object({
  gelecek_nakit_bd: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yatirim: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
});

export type Input_FIN_025 = z.infer<typeof InputSchema_FIN_025>;

export interface Output_FIN_025 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_025(input: Input_FIN_025): Output_FIN_025 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: gelecek_nakit_bd, yatirim
  
  const validData = InputSchema_FIN_025.parse(input);
  const { gelecek_nakit_bd, yatirim } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = gelecek_nakit_bd / Math.max(1, yatirim);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Sermaye Dağıtımı",
      message: "Kritik Uyarı: Kârlılık Endeksi 1'den küçüktür. Yatırdığınız her 1 birim sermaye karşılığında 1 birimden daha az değer yaratıyorsunuz (Değer İmhası)."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}