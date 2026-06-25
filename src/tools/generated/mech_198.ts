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
 * ID: MECH_198
 * Name: Statik Basınç (Akışkan)
 */

export const InputSchema_MECH_198 = z.object({
  yogunluk: z.number(),
  derinlik: z.number(),
});

export type Input_MECH_198 = z.infer<typeof InputSchema_MECH_198>;

export interface Output_MECH_198 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_198(input: Input_MECH_198): Output_MECH_198 {
  const validData = InputSchema_MECH_198.parse(input);
  const { yogunluk, derinlik } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Basinc_Result > 1000000) {
      smartWarnings.push({
        severity: "INFO",
        source: "Basınçlı Ekipmanlar",
        message: "Not: Hidrostatik basınç 1 MPa'nın (10 Bar) üzerindedir. Derin tank veya kuyu dibi uygulamalarında tank cidar kalınlığının ve taban flanşlarının bu basınca göre (ASME Boiler and Pressure Vessel Code) boyutlandırılması zorunludur."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
