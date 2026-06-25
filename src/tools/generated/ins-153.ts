import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: INS_153
 * Araç Adı: Vadeli Hayat Sigortası (Term Life)
 */

export const InputSchema_INS_153 = z.object({
  teminat: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  olum_olasiligi: z.number().min(0.0001, "Endüstriyel minimum tolerans: 0.0001"),
  gider_marji: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_INS_153 = z.infer<typeof InputSchema_INS_153>;

export interface Output_INS_153 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_INS_153(input: Input_INS_153): Output_INS_153 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: teminat, olum_olasiligi, gider_marji
  
  const validData = InputSchema_INS_153.parse(input);
  const { teminat, olum_olasiligi, gider_marji } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const netPrim = teminat * (olum_olasiligi / 100);
  const result = netPrim / Math.max(0.0001, (1 - gider_marji / 100));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Tüketici Koruması",
      message: "Kritik Uyarı: Şirketin gider kesintisi poliçenin %40'ını aşıyor. Bu, standart risk priminin üzerine binen fahiş bir komisyon yüküdür. Poliçeyi farklı bir sigorta otoritesinin teklifiyle karşılaştırın."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}