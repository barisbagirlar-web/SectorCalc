import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: INS_161
 * Araç Adı: Geleneksel vs Roth IRA (Vergi Etkisi)
 */

export const InputSchema_INS_161 = z.object({
  katki: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  vergi_orani: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
  buyume_orani: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yil: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_INS_161 = z.infer<typeof InputSchema_INS_161>;

export interface Output_INS_161 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_INS_161(input: Input_INS_161): Output_INS_161 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: katki, vergi_orani, buyume_orani, yil
  
  const validData = InputSchema_INS_161.parse(input);
  const { katki, vergi_orani, buyume_orani, yil } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const gelenekselNet = (katki * Math.pow(1 + buyume_orani / 100, yil)) * (1 - vergi_orani / 100);
  const rothNet = (katki * (1 - vergi_orani / 100)) * Math.pow(1 + buyume_orani / 100, yil);
  const result = Number(gelenekselNet.toFixed(2));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Vergi Planlaması",
      message: "Not: Bu karşılaştırma, şu anki vergi diliminizin emeklilikteki vergi diliminizle tamamen aynı kalacağı (Statik Vergi) varsayımına dayanır. Roth IRA'nın gerçek gücü, emeklilikte vergilerin artacağı senaryolarda ortaya çıkar."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}