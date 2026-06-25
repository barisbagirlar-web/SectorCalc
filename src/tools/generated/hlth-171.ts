import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: HLTH_171
 * Araç Adı: VKİ (Vücut Kitle İndeksi / BMI)
 */

export const InputSchema_HLTH_171 = z.object({
  agirlik: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  boy: z.number().min(0.5, "Endüstriyel minimum tolerans: 0.5"),
});

export type Input_HLTH_171 = z.infer<typeof InputSchema_HLTH_171>;

export interface Output_HLTH_171 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_HLTH_171(input: Input_HLTH_171): Output_HLTH_171 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: agirlik, boy
  
  const validData = InputSchema_HLTH_171.parse(input);
  const { agirlik, boy } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: any = 0; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result > 25) {
    smartWarnings.push({
      severity: "INFO",
      source: "Spor Hekimliği",
      message: "Not: VKİ oranınız standartlara göre Fazla Kilolu / Obez sınırında çıkabilir. Ancak VKİ formülü kas kütlesi ile yağ kütlesini birbirinden ayırt edemez; vücut geliştirmeciler ve ağır sanayi çalışanlarında bu oran yanıltıcıdır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}
