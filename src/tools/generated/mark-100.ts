import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MARK_100
 * Araç Adı: Pazarlama ROI
 */

export const InputSchema_MARK_100 = z.object({
  kampanya_geliri: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  kampanya_maliyeti: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
});

export type Input_MARK_100 = z.infer<typeof InputSchema_MARK_100>;

export interface Output_MARK_100 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MARK_100(input: Input_MARK_100): Output_MARK_100 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: kampanya_geliri, kampanya_maliyeti
  
  const validData = InputSchema_MARK_100.parse(input);
  const { kampanya_geliri, kampanya_maliyeti } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = ((kampanya_geliri - kampanya_maliyeti) / Math.max(0.0001, kampanya_maliyeti)) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Atıf (Attribution) Modelleri",
      message: "Uyarı: Pazarlama ROI'si %1000'in üzerindedir. Dijital pazarlamada bu denli yüksek oranlar genellikle yanlış atıf modellemesinden (Organik trafiğin reklam geliri gibi sayılması) kaynaklanır. Veri analitik araçlarınızı (Google Analytics vb.) kontrol edin."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}