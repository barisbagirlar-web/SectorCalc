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
 * ID: MECH_291
 * Name: Yay Yorulması (Goodman Kriteri)
 */

export const InputSchema_MECH_291 = z.object({
  ortalama_gerilme: z.number(),
  alternatif_gerilme: z.number(),
  cekme_dayanimi: z.number(),
  yorulma_siniri: z.number(),
});

export type Input_MECH_291 = z.infer<typeof InputSchema_MECH_291>;

export interface Output_MECH_291 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_291(input: Input_MECH_291): Output_MECH_291 {
  const validData = InputSchema_MECH_291.parse(input);
  const { ortalama_gerilme, alternatif_gerilme, cekme_dayanimi, yorulma_siniri } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((alternatif_gerilme / yorulma_siniri) + (ortalama_gerilme / cekme_dayanimi) >= 1) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Modifiye Goodman Diyagramı",
        message: "Kritik Tasarım Reddi: Kombine gerilme çizgisi Goodman emniyet sınırını aşmıştır. Yay sonsuz ömre sahip değildir; kısa sürede mikro çatlaklar ilerleyecek ve dinamik yük altında (Fatigue Failure) aniden kırılacaktır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
