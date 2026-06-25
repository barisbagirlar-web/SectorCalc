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
 * ID: FIN_014
 * Name: Nominal ve Efektif Faiz
 */

export const InputSchema_FIN_014 = z.object({
  nominal: z.number(),
  siklik: z.number(),
});

export type Input_FIN_014 = z.infer<typeof InputSchema_FIN_014>;

export interface Output_FIN_014 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_014(input: Input_FIN_014): Output_FIN_014 {
  const validData = InputSchema_FIN_014.parse(input);
  const { nominal, siklik } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (siklik === 1) {
      smartWarnings.push({
        severity: "INFO",
        source: "Matematiksel Eşitlik",
        message: "Not: Bileşim sıklığı 1 (Yıllık) olduğunda, efektif faiz nominal faize eşittir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
