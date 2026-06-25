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
 * ID: CNC_312
 * Name: Ortalama Talaş Kalınlığı (hm / Chip Thinning)
 */

export const InputSchema_CNC_312 = z.object({
  takim_capi: z.number(),
  radyal_paso: z.number(),
  dis_ilerleme: z.number(),
});

export type Input_CNC_312 = z.infer<typeof InputSchema_CNC_312>;

export interface Output_CNC_312 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CNC_312(input: Input_CNC_312): Output_CNC_312 {
  const validData = InputSchema_CNC_312.parse(input);
  const { takim_capi, radyal_paso, dis_ilerleme } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((radyal_paso / takim_capi) < 0.1) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Talaş İnceltme Kuralı (Radial Chip Thinning)",
        message: "Kritik Kesme Uyarısı: Radyal paso takım çapının %10'undan azdır. Gerçekleşen talaş kalınlığı (hm), programladığınız fz değerinden çok daha incedir. Takım metali kesemeyip ezerek yanacaktır. İlerlemeyi (Feed) formül oranında artırın."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
