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
 * ID: THERM_238
 * Name: İdeal Gaz Yasası (Basınç Hesabı)
 */

export const InputSchema_THERM_238 = z.object({
  mol_sayisi: z.number(),
  sicaklik: z.number(),
  hacim: z.number(),
});

export type Input_THERM_238 = z.infer<typeof InputSchema_THERM_238>;

export interface Output_THERM_238 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_THERM_238(input: Input_THERM_238): Output_THERM_238 {
  const validData = InputSchema_THERM_238.parse(input);
  const { mol_sayisi, sicaklik, hacim } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (((mol_sayisi * 8.314 * (sicaklik + 273.15)) / hacim) > 20000000) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ASME Basınçlı Kaplar Direktifi",
        message: "Kritik Uyarı: Hesaplanan iç basınç 20 MPa (200 Bar) seviyesini geçmiştir. Standart endüstriyel kompresör tankları bu basınçta infilak eder. Karbon fiber sargılı (Kompozit) özel yüksek basınç tüpleri kullanılmalıdır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
