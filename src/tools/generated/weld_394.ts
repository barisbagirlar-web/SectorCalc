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
 * ID: WELD_394
 * Name: Kaynaklı Dairesel Bağlantı Burulma Gerilmesi
 */

export const InputSchema_WELD_394 = z.object({
  tork: z.number(),
  kaynak_bogazi: z.number(),
  mil_cap: z.number(),
  kaynak_akma: z.number(),
});

export type Input_WELD_394 = z.infer<typeof InputSchema_WELD_394>;

export interface Output_WELD_394 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_WELD_394(input: Input_WELD_394): Output_WELD_394 {
  const validData = InputSchema_WELD_394.parse(input);
  const { tork, kaynak_bogazi, mil_cap, kaynak_akma } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (((2 * tork * 1000) / (3.14159 * (mil_cap/2) * (mil_cap/2) * kaynak_bogazi)) > (kaynak_akma * 0.577)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "AWS D1.1 / Von Mises",
        message: "Uyarı: Kaynak dikişinde oluşan kayma gerilmesi (Shear Stress), kaynak metalinin kayma akma sınırını (Sy * 0.577) aşmaktadır. Tork altında kaynak dikişinde plastik deformasyon veya yırtılma başlayacaktır. Kaynak bacak boyunu artırın."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
