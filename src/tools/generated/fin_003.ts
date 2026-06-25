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
 * ID: FIN_003
 * Name: 50/30/20 Bütçe Kuralı
 */

export const InputSchema_FIN_003 = z.object({
  net_gelir: z.number(),
});

export type Input_FIN_003 = z.infer<typeof InputSchema_FIN_003>;

export interface Output_FIN_003 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_003(input: Input_FIN_003): Output_FIN_003 {
  const validData = InputSchema_FIN_003.parse(input);
  const { net_gelir } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (net_gelir < 17002) {
      smartWarnings.push({
        severity: "INFO",
        source: "Asgari Yaşam Maliyeti",
        message: "Not: Gelir asgari ücret sınırının altındadır. %50 İhtiyaç kuralı reel yaşam maliyetleri karşısında yetersiz kalabilir; temel ihtiyaçlara daha fazla pay ayrılması gerekebilir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
