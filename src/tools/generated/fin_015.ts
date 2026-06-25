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
 * ID: FIN_015
 * Name: Tahvil Fiyat ve Getiri
 */

export const InputSchema_FIN_015 = z.object({
  nominal: z.number(),
  kupon: z.number(),
  piyasa_faizi: z.number(),
  vade: z.number(),
});

export type Input_FIN_015 = z.infer<typeof InputSchema_FIN_015>;

export interface Output_FIN_015 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_015(input: Input_FIN_015): Output_FIN_015 {
  const validData = InputSchema_FIN_015.parse(input);
  const { nominal, kupon, piyasa_faizi, vade } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (piyasa_faizi > kupon) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Tahvil Değerleme",
        message: "Durum: Piyasa faizi kupon oranından yüksek. Bu tahvil 'İskontolu' (Nominal değerinin altında) fiyatlanacaktır."
      });
    }

    if (piyasa_faizi < kupon) {
      smartWarnings.push({
        severity: "INFO",
        source: "Tahvil Değerleme",
        message: "Durum: Piyasa faizi kupon oranından düşük. Bu tahvil 'Primli' (Nominal değerinin üzerinde) fiyatlanacaktır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
