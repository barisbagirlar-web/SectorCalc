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
 * ID: FIN_020
 * Name: Bileşik Yıllık Büyüme (CAGR)
 */

export const InputSchema_FIN_020 = z.object({
  ilk_deger: z.number(),
  son_deger: z.number(),
  yil: z.number(),
});

export type Input_FIN_020 = z.infer<typeof InputSchema_FIN_020>;

export interface Output_FIN_020 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_020(input: Input_FIN_020): Output_FIN_020 {
  const validData = InputSchema_FIN_020.parse(input);
  const { ilk_deger, son_deger, yil } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (yil < 3) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Yatırım Analitiği",
        message: "Uyarı: CAGR, yılları pürüzsüzleştirerek ortalama bir oran verir. 3 yıldan kısa vadelerde aradaki yüksek volatiliteyi (düşüşleri ve çıkışları) gizleyebileceği için riski eksik gösterir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
