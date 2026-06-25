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
 * ID: FIN_029
 * Name: FCFE ve FCFF
 */

export const InputSchema_FIN_029 = z.object({
  net_kar: z.number(),
  amortisman: z.number(),
  isletme_sermayesi: z.number(),
  capex: z.number(),
  borc: z.number(),
});

export type Input_FIN_029 = z.infer<typeof InputSchema_FIN_029>;

export interface Output_FIN_029 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_029(input: Input_FIN_029): Output_FIN_029 {
  const validData = InputSchema_FIN_029.parse(input);
  const { net_kar, amortisman, isletme_sermayesi, capex, borc } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (capex < amortisman) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Şirket Büyüme Analizi",
        message: "Uyarı: Sermaye harcamaları (CAPEX) amortismandan düşüktür. Bu, şirketin eskiyen varlıklarını yenilemekte yetersiz kaldığı ve zamanla küçülme eğiliminde (shrinking) olduğu şeklinde yorumlanabilir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
