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
 * ID: MECH_221
 * Name: V-Kayışı Uzunluğu (Merkezler Arası)
 */

export const InputSchema_MECH_221 = z.object({
  mesafe: z.number(),
  cap_buyuk: z.number(),
  cap_kucuk: z.number(),
});

export type Input_MECH_221 = z.infer<typeof InputSchema_MECH_221>;

export interface Output_MECH_221 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_221(input: Input_MECH_221): Output_MECH_221 {
  const validData = InputSchema_MECH_221.parse(input);
  const { mesafe, cap_buyuk, cap_kucuk } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (mesafe > 3 * (cap_buyuk + cap_kucuk)) {
      smartWarnings.push({
        severity: "INFO",
        source: "Kayış Titreşimi",
        message: "Not: Eksenler arası mesafe oldukça uzundur. Çalışma esnasında kayışta aşırı salınım (Whipping/Kamçılama) oluşabilir. Avare kasnak (Tensioner/Idler) kullanımı gerekebilir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
