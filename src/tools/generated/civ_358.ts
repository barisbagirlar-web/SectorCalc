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
 * ID: CIV_358
 * Name: Perçin Kesme ve Ezilme (Bearing) Dayanımı
 */

export const InputSchema_CIV_358 = z.object({
  percin_cap: z.number(),
  sac_kalinlik: z.number(),
  kesme_kuvveti: z.number(),
});

export type Input_CIV_358 = z.infer<typeof InputSchema_CIV_358>;

export interface Output_CIV_358 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CIV_358(input: Input_CIV_358): Output_CIV_358 {
  const validData = InputSchema_CIV_358.parse(input);
  const { percin_cap, sac_kalinlik, kesme_kuvveti } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (percin_cap > (3 * sac_kalinlik)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "DIN 100 Perçinli Birleşimler",
        message: "Uyarı: Perçin çapı sac kalınlığının 3 katından büyüktür. Bu durumda perçin kesilerek kopmayacak, aksine sac delinecek veya uzayarak 'Ezilme (Bearing Failure)' göçmesi yaşanacaktır. Perçin çapını küçültüp sayısını artırın."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
