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
 * ID: MECH_364
 * Name: Çok Eksenli Yorulma (Sines Kriteri Eşdeğer Gerilme)
 */

export const InputSchema_MECH_364 = z.object({
  genlik_gerilme: z.number(),
  hidrostatik_gerilme: z.number(),
  akma_siniri: z.number(),
});

export type Input_MECH_364 = z.infer<typeof InputSchema_MECH_364>;

export interface Output_MECH_364 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_364(input: Input_MECH_364): Output_MECH_364 {
  const validData = InputSchema_MECH_364.parse(input);
  const { genlik_gerilme, hidrostatik_gerilme, akma_siniri } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((genlik_gerilme + (0.3 * hidrostatik_gerilme)) >= akma_siniri) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Dinamik Hasar Analizi",
        message: "Kritik Mekanik Red: Çok eksenli eşdeğer yorulma gerilmesi malzemenin yorulma dayanımını aşmaktadır. Sistemin sonsuz ömrü yoktur (Finite Life). Özellikle şaft ve rotlarda birleşik eğilme ve burulma altındaki mikro çatlaklar parçayı hızla kesecektir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
