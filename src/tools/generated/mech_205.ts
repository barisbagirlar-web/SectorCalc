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
 * ID: MECH_205
 * Name: Burulma Açısı
 */

export const InputSchema_MECH_205 = z.object({
  tork: z.number(),
  uzunluk: z.number(),
  kayma_modulu: z.number(),
  kutupsal_atalet: z.number(),
});

export type Input_MECH_205 = z.infer<typeof InputSchema_MECH_205>;

export interface Output_MECH_205 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_205(input: Input_MECH_205): Output_MECH_205 {
  const validData = InputSchema_MECH_205.parse(input);
  const { tork, uzunluk, kayma_modulu, kutupsal_atalet } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((tork * uzunluk) / (kayma_modulu * kutupsal_atalet) > 0.087) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ISO Transmisyon Şaft Kriterleri",
        message: "Uyarı: Şaftta oluşan burulma açısı metre başına 5 dereceyi (0.087 radyan) aşmaktadır. Esnek yapı millerde aşırı dinamik titreşime ve rulman yorulmasına yol açar."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
