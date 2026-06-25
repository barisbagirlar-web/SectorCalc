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
 * ID: CNC_252
 * Name: Rigid Kılavuz Çekme (Tapping) İlerlemesi
 */

export const InputSchema_CNC_252 = z.object({
  devir: z.number(),
  hatve: z.number(),
});

export type Input_CNC_252 = z.infer<typeof InputSchema_CNC_252>;

export interface Output_CNC_252 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CNC_252(input: Input_CNC_252): Output_CNC_252 {
  const validData = InputSchema_CNC_252.parse(input);
  const { devir, hatve } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (devir > 3000) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Sandvik Coromant Tapping Kılavuzu",
        message: "Uyarı: Kılavuz çekme devri 3000 RPM'in üzerindedir. Senkronize (Rigid) kılavuz çekmede bu hızlar, Z ekseni servo motoru ile fener mili arasındaki interpolasyonun milisaniyelik gecikmesi durumunda kılavuzun parça içinde kırılmasına (Tool Breakage) neden olur."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
