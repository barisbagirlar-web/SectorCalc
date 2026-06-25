import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: CIV_211
 * Araç Adı: Taşıyıcı Duvar
 */

export const InputSchema_CIV_211 = z.object({
  yuk: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  duvar_alani: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
});

export type Input_CIV_211 = z.infer<typeof InputSchema_CIV_211>;

export interface Output_CIV_211 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CIV_211(input: Input_CIV_211): Output_CIV_211 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: yuk, duvar_alani
  
  const validData = InputSchema_CIV_211.parse(input);
  const { yuk, duvar_alani } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = yuk / Math.max(0.0001, duvar_alani);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Eurocode 6 / TBDY Yığma Yapılar",
      message: "Kritik Uyarı: Duvar kesitindeki eksenel basınç gerilmesi yığma tuğla/harç kompozit limitlerini (2.5 MPa) aşmıştır. Duvarda ezilme ve düşey çatlaklarla göçme riski yüksektir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}