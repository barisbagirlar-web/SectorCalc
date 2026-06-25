import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MARK_099
 * Araç Adı: CAC/CLV Oranı
 */

export const InputSchema_MARK_099 = z.object({
  clv: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  cac: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
});

export type Input_MARK_099 = z.infer<typeof InputSchema_MARK_099>;

export interface Output_MARK_099 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MARK_099(input: Input_MARK_099): Output_MARK_099 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: clv, cac
  
  const validData = InputSchema_MARK_099.parse(input);
  const { clv, cac } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = clv / Math.max(0.0001, cac); 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result < 1) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "SaaS Unit Economics",
      message: "Kritik Uyarı: CLV/CAC oranı 1'in altındadır. Bir müşteri edinmek için, o müşteriden ömrü boyunca kazanacağınız kârdan daha fazla para harcıyorsunuz. Bu model ölçeklendikçe şirketi iflasa sürükler (Death Spiral)."
    });
  }

  if (result > 5) {
    smartWarnings.push({
      severity: "INFO",
      source: "Büyüme Stratejisi",
      message: "Not: CLV/CAC oranı 5'in üzerindedir. Oldukça kârlı bir model olmakla birlikte, pazarlama kanalına yeterince yatırım yapmayarak pazar payı büyümesini rakiplere bıraktığınız anlamına gelebilir. Agresif büyüme için CAC artırılabilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}