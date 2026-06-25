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
 * ID: MECH_220
 * Name: Kasnak ve Dişli Çevrim Oranı
 */

export const InputSchema_MECH_220 = z.object({
  cap_1: z.number(),
  cap_2: z.number(),
  devir_1: z.number(),
});

export type Input_MECH_220 = z.infer<typeof InputSchema_MECH_220>;

export interface Output_MECH_220 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_220(input: Input_MECH_220): Output_MECH_220 {
  const validData = InputSchema_MECH_220.parse(input);
  const { cap_1, cap_2, devir_1 } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((cap_2 / cap_1) > 10 || (cap_1 / cap_2) > 10) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Mekanik Tasarım (Redüktör)",
        message: "Uyarı: Çevrim oranı tek kademede 1:10'u aşmaktadır. Kayış kasnak sistemlerinde bu denli yüksek oran kavrama (Sarımlık Açısı) kaybına ve kaymaya neden olur; kademeli redüktör sistemine geçilmelidir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
