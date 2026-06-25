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
 * ID: MECH_319
 * Name: Helisel Dişli Eksenel Kuvvet (Thrust Load)
 */

export const InputSchema_MECH_319 = z.object({
  tegetsel_kuvvet: z.number(),
  helis_acisi: z.number(),
});

export type Input_MECH_319 = z.infer<typeof InputSchema_MECH_319>;

export interface Output_MECH_319 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_319(input: Input_MECH_319): Output_MECH_319 {
  const validData = InputSchema_MECH_319.parse(input);
  const { tegetsel_kuvvet, helis_acisi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (helis_acisi > 30) {
      smartWarnings.push({
        severity: "WARNING",
        source: "AGMA Redüktör Tasarımı",
        message: "Uyarı: Helis açısı 30 dereceyi aştığı için, milde oluşan eksenel (Thrust) kuvvet çok şiddetlidir. Standart sabit bilyalı rulmanlar bu yükü taşıyamaz; KESİNLİKLE konik makaralı (Tapered Roller) veya eksenel bilyalı rulman yataklaması kullanılmalıdır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
