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
 * ID: FIN_018
 * Name: Hisse Senedi Getirisi
 */

export const InputSchema_FIN_018 = z.object({
  alis: z.number(),
  satis: z.number(),
  temettu: z.number(),
});

export type Input_FIN_018 = z.infer<typeof InputSchema_FIN_018>;

export interface Output_FIN_018 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_018(input: Input_FIN_018): Output_FIN_018 {
  const validData = InputSchema_FIN_018.parse(input);
  const { alis, satis, temettu } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (satis < alis) {
      smartWarnings.push({
        severity: "INFO",
        source: "Portföy Analizi",
        message: "Durum: Sermaye zararı söz konusudur. Toplam getiri, alınan temettünün zararı ne kadar telafi ettiğine bağlıdır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
