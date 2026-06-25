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
 * ID: THERM_236
 * Name: Kazan Verimi (Doğrudan Metot)
 */

export const InputSchema_THERM_236 = z.object({
  buhar_debisi: z.number(),
  entalpi_farki: z.number(),
  yakit_debisi: z.number(),
  alt_isil_deger: z.number(),
});

export type Input_THERM_236 = z.infer<typeof InputSchema_THERM_236>;

export interface Output_THERM_236 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_THERM_236(input: Input_THERM_236): Output_THERM_236 {
  const validData = InputSchema_THERM_236.parse(input);
  const { buhar_debisi, entalpi_farki, yakit_debisi, alt_isil_deger } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (((buhar_debisi * entalpi_farki) / (yakit_debisi * alt_isil_deger)) * 100 > 98) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ASME PTC 4.1 Kazan Test Kodları",
        message: "Uyarı: Yoğuşmalı kazan (Condensing Boiler) kullanmıyorsanız %98 üzeri ısıl verim fiziksel olarak şüphelidir. Baca gazı kayıpları (Dry Flue Gas Loss) ve radyasyon kayıpları hesaba katılmamış olabilir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
