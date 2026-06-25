import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_021
 * Araç Adı: Yatırım Getirisi (ROI)
 */

export const InputSchema_FIN_021 = z.object({
  net_kar: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  maliyet: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
});

export type Input_FIN_021 = z.infer<typeof InputSchema_FIN_021>;

export interface Output_FIN_021 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_021(input: Input_FIN_021): Output_FIN_021 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: net_kar, maliyet
  
  const validData = InputSchema_FIN_021.parse(input);
  const { net_kar, maliyet } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = (net_kar / Math.max(1, maliyet)) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result > 500) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Finansal Analiz",
      message: "Uyarı: ROI %500'ün üzerinde. Bu tür olağanüstü getiriler genellikle çok yüksek riskli girişim sermayesi (VC) projelerinde veya kripto piyasalarında görülür; girdi maliyetlerinin eksiksiz yazıldığından emin olun."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}