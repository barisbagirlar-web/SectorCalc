import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_039
 * Araç Adı: Treynor Oranı
 */

export const InputSchema_FIN_039 = z.object({
  portfoy_getirisi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  risksiz_faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  beta: z.number().min(0.001, "Endüstriyel minimum tolerans: 0.001"),
});

export type Input_FIN_039 = z.infer<typeof InputSchema_FIN_039>;

export interface Output_FIN_039 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_039(input: Input_FIN_039): Output_FIN_039 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: portfoy_getirisi, risksiz_faiz, beta
  
  const validData = InputSchema_FIN_039.parse(input);
  const { portfoy_getirisi, risksiz_faiz, beta } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = (portfoy_getirisi - risksiz_faiz) / Math.max(0.0001, beta);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Finansal Model Kısıtı",
      message: "Kritik Uyarı: Beta negatif olduğunda Treynor Oranı matematiksel sonuç üretse dahi yorumlanması geleneksel risk/getiri modellerine uymaz."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}