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
 * ID: MECH_401
 * Name: Cıvata Yorulma Ömrü Güvenlik Faktörü (Soderberg)
 */

export const InputSchema_MECH_401 = z.object({
  ortalama_gerilme: z.number(),
  alternatif_gerilme: z.number(),
  akma_dayanimi: z.number(),
  yorulma_siniri: z.number(),
});

export type Input_MECH_401 = z.infer<typeof InputSchema_MECH_401>;

export interface Output_MECH_401 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_401(input: Input_MECH_401): Output_MECH_401 {
  const validData = InputSchema_MECH_401.parse(input);
  const { ortalama_gerilme, alternatif_gerilme, akma_dayanimi, yorulma_siniri } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (1 / ((alternatif_gerilme / yorulma_siniri) + (ortalama_gerilme / akma_dayanimi)) < 1.2) {
      smartWarnings.push({
        severity: "WARNING",
        source: "VDI 2230 Cıvatalı Bağlantılar",
        message: "Uyarı: Soderberg kriterine göre dinamik güvenlik katsayısı 1.2'nin altındadır. Cıvata diş diplerindeki mikroskobik gerilme yığılmaları (Stress Concentration), yorulma ömrünü beklenenden çok daha hızlı tüketerek cıvatanın aniden kesilmesine (Fatigue Failure) neden olacaktır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
