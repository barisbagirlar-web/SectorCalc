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
 * ID: FIN_026
 * Name: Sermaye Maliyeti (WACC)
 */

export const InputSchema_FIN_026 = z.object({
  ozsermaye: z.number(),
  borc: z.number(),
  re: z.number(),
  rd: z.number(),
  vergi: z.number(),
});

export type Input_FIN_026 = z.infer<typeof InputSchema_FIN_026>;

export interface Output_FIN_026 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_026(input: Input_FIN_026): Output_FIN_026 {
  const validData = InputSchema_FIN_026.parse(input);
  const { ozsermaye, borc, re, rd, vergi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (borc / (ozsermaye + borc) > 0.8) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Sermaye Yapısı",
        message: "Uyarı: Şirketin sermaye yapısındaki borç oranı (Kaldıraç) %80'in üzerindedir. Vergi kalkanı (tax shield) avantajı sağlasa da, iflas ve finansal sıkıntı (distress) riski çok yüksektir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
