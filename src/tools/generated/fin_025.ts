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
 * ID: FIN_025
 * Name: Kârlılık Endeksi (PI)
 */

export const InputSchema_FIN_025 = z.object({
  gelecek_nakit_bd: z.number(),
  yatirim: z.number(),
});

export type Input_FIN_025 = z.infer<typeof InputSchema_FIN_025>;

export interface Output_FIN_025 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_025(input: Input_FIN_025): Output_FIN_025 {
  const validData = InputSchema_FIN_025.parse(input);
  const { gelecek_nakit_bd, yatirim } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((gelecek_nakit_bd / yatirim) < 1) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Sermaye Dağıtımı",
        message: "Kritik Uyarı: Kârlılık Endeksi 1'den küçüktür. Yatırdığınız her 1 birim sermaye karşılığında 1 birimden daha az değer yaratıyorsunuz (Değer İmhası)."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
