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
 * ID: CIV_211
 * Name: Taşıyıcı Duvar
 */

export const InputSchema_CIV_211 = z.object({
  yuk: z.number(),
  duvar_alani: z.number(),
});

export type Input_CIV_211 = z.infer<typeof InputSchema_CIV_211>;

export interface Output_CIV_211 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CIV_211(input: Input_CIV_211): Output_CIV_211 {
  const validData = InputSchema_CIV_211.parse(input);
  const { yuk, duvar_alani } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((yuk / duvar_alani) > 2500000) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Eurocode 6 / TBDY Yığma Yapılar",
        message: "Kritik Uyarı: Duvar kesitindeki eksenel basınç gerilmesi yığma tuğla/harç kompozit limitlerini (2.5 MPa) aşmıştır. Duvarda ezilme ve düşey çatlaklarla göçme riski yüksektir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
