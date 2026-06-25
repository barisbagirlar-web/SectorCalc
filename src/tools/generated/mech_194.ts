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
 * ID: MECH_194
 * Name: Kayma Gerilmesi (Burulma)
 */

export const InputSchema_MECH_194 = z.object({
  tork: z.number(),
  yaricap: z.number(),
  kutupsal_atalet: z.number(),
});

export type Input_MECH_194 = z.infer<typeof InputSchema_MECH_194>;

export interface Output_MECH_194 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_194(input: Input_MECH_194): Output_MECH_194 {
  const validData = InputSchema_MECH_194.parse(input);
  const { tork, yaricap, kutupsal_atalet } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (0 > 150000000) {
      smartWarnings.push({
        severity: "INFO",
        source: "Tresca (Maksimum Kayma) Kriteri",
        message: "Not: Çıkan kayma gerilmesi 150 MPa'yı aşmaktadır. Yumuşak çeliklerde (S275, St37 vb.) kayma akma sınırı, çekme akma sınırının yaklaşık %50-57'si kadardır (Tresca/Von Mises). Malzemenizin kayma akma dayanımını kontrol edin."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
