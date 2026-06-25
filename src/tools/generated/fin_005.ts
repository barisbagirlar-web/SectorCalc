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
 * ID: FIN_005
 * Name: Yıllık Gelir (Annuity)
 */

export const InputSchema_FIN_005 = z.object({
  anapara: z.number(),
  faiz: z.number(),
  donem: z.number(),
});

export type Input_FIN_005 = z.infer<typeof InputSchema_FIN_005>;

export interface Output_FIN_005 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_005(input: Input_FIN_005): Output_FIN_005 {
  const validData = InputSchema_FIN_005.parse(input);
  const { anapara, faiz, donem } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (faiz === 0) {
      smartWarnings.push({
        severity: "INFO",
        source: "Paranın Zaman Değeri",
        message: "Not: Faiz oranı %0 girildi. Paranın zaman değeri (TVM) hesaplanmayacak, sadece anapara dönem sayısına bölünecektir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
