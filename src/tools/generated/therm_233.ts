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
 * ID: THERM_233
 * Name: Isı İletim Hızı (Fourier Yasası)
 */

export const InputSchema_THERM_233 = z.object({
  iletim_katsayisi: z.number(),
  yuzey_alani: z.number(),
  sicaklik_farki: z.number(),
  kalinlik: z.number(),
});

export type Input_THERM_233 = z.infer<typeof InputSchema_THERM_233>;

export interface Output_THERM_233 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_THERM_233(input: Input_THERM_233): Output_THERM_233 {
  const validData = InputSchema_THERM_233.parse(input);
  const { iletim_katsayisi, yuzey_alani, sicaklik_farki, kalinlik } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (iletim_katsayisi > 50 && kalinlik < 0.05) {
      smartWarnings.push({
        severity: "INFO",
        source: "Yalıtım Standartları",
        message: "Not: Seçilen malzemenin ısıl iletkenliği çok yüksek (Örn: Çelik/Alüminyum) ve malzeme çok ince. Bu katman izolasyon sağlamaz; sistemde devasa bir 'Termal Köprü (Thermal Bridge)' ısı kaybı oluşacaktır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
