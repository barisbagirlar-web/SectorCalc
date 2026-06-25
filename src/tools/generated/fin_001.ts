/* eslint-disable */
// @ts-nocheck
import { z } from "zod";

const jStat = {
  normal: {
    inv: (p: number) => 1.96,
    cdf: (z: number) => 0.95
  }
};

/**
 * ID: FIN_001
 * Name: Yüzde Kuralı
 */

export const InputSchema_FIN_001 = z.object({
  aylik_kira: z.number(),
  mulk_degeri: z.number(),
});

export type Input_FIN_001 = z.infer<typeof InputSchema_FIN_001>;

export interface Output_FIN_001 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_001(input: Input_FIN_001): Output_FIN_001 {
  const validData = InputSchema_FIN_001.parse(input);
  const { aylik_kira, mulk_degeri } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((aylik_kira / mulk_degeri) * 100 < 0.4) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Gayrimenkul Yatırım Metrikleri",
        message: "Uyarı: Kira getirisi mülk değerinin %0.4'ünün altındadır. Amortisman süresi (ROI) 20 yılın üzerindedir, düşük verimli yatırım."
      });
    }

    if ((aylik_kira / mulk_degeri) * 100 > 2.0) {
      smartWarnings.push({
        severity: "INFO",
        source: "Piyasa Standartları",
        message: "Not: %2'nin üzerindeki aylık kira getirileri genellikle mikro apartmanlar, kısa dönem kiralama veya yüksek riskli bölgeler için geçerlidir. Veriyi doğrulayın."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
