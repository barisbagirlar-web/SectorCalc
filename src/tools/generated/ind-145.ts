import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: IND_145
 * Araç Adı: Hurda Oranı Optimizasyon
 */

export const InputSchema_IND_145 = z.object({
  uretim: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  hurda: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  birim_maliyet: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_IND_145 = z.infer<typeof InputSchema_IND_145>;

export interface Output_IND_145 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_IND_145(input: Input_IND_145): Output_IND_145 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: uretim, hurda, birim_maliyet
  
  const validData = InputSchema_IND_145.parse(input);
  const { uretim, hurda, birim_maliyet } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const oran = (hurda / Math.max(1, uretim)) * 100;
  const result = hurda * birim_maliyet;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (oran > 5) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Altı Sigma (Six Sigma)",
      message: "Kritik Uyarı: Hurda oranınız %5'in üzerindedir. Endüstriyel seri üretimde (Özellikle Talaşlı imalat ve Enjeksiyonda) bu oran kök neden analizi (Ishikawa/Balıkkılçığı) gerektiren yapısal bir proses hatasına işaret eder."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}