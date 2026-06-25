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
 * ID: MECH_200
 * Name: Birim Şekil Değiştirme (Strain)
 */

export const InputSchema_MECH_200 = z.object({
  ilk_boy: z.number(),
  son_boy: z.number(),
});

export type Input_MECH_200 = z.infer<typeof InputSchema_MECH_200>;

export interface Output_MECH_200 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_200(input: Input_MECH_200): Output_MECH_200 {
  const validData = InputSchema_MECH_200.parse(input);
  const { ilk_boy, son_boy } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (ABS((son_boy - ilk_boy) / ilk_boy) > 0.005) {
      smartWarnings.push({
        severity: "INFO",
        source: "Malzeme Kopma Davranışı",
        message: "Not: Birim şekil değiştirme %0.5'in (0.005) üzerindedir. Metaller için bu değer kalıcı (Plastik) deformasyon bölgesine girildiğini; polimer/kauçuk malzemeler için ise viskoelastik akmanın başladığını gösterir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
