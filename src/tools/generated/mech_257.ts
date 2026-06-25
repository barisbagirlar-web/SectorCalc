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
 * ID: MECH_257
 * Name: Hidrolik Silindir İtme/Çekme Kuvveti
 */

export const InputSchema_MECH_257 = z.object({
  piston_cap: z.number(),
  mil_cap: z.number(),
  basinc: z.number(),
});

export type Input_MECH_257 = z.infer<typeof InputSchema_MECH_257>;

export interface Output_MECH_257 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_257(input: Input_MECH_257): Output_MECH_257 {
  const validData = InputSchema_MECH_257.parse(input);
  const { piston_cap, mil_cap, basinc } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((mil_cap / piston_cap) < 0.4) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Akışkan Gücü (Fluid Power)",
        message: "Uyarı: Mil çapı piston çapına göre çok incedir. Çekme (Pull) kuvveti yüksek çıksa da, tam açık (Full Stroke) pozisyonunda itme yaparken milde 'Euler Burkulması (Buckling)' riski çok yüksektir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
