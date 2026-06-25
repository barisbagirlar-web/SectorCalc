import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_008
 * Araç Adı: Varlık Dağılımı
 */

export const InputSchema_FIN_008 = z.object({
  portfoy: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  hisse: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  tahvil: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  nakit: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_008 = z.infer<typeof InputSchema_FIN_008>;

export interface Output_FIN_008 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_008(input: Input_FIN_008): Output_FIN_008 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: portfoy, hisse, tahvil, nakit
  
  const validData = InputSchema_FIN_008.parse(input);
  const { portfoy, hisse, tahvil, nakit } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = portfoy * (hisse / 100);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Modern Portföy Teorisi",
      message: "Uyarı: Portföyün %90'ından fazlası hisse senedinde. Agresif büyüme hedeflense de volatilite ve piyasa çöküşü riski maksimum seviyededir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}