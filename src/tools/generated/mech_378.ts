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
 * ID: MECH_378
 * Name: Pres Geçme (Shrink Fit) Kayma/Ayrılma Torku
 */

export const InputSchema_MECH_378 = z.object({
  temas_basinci: z.number(),
  mil_capi: z.number(),
  gecme_uzunlugu: z.number(),
  surtunme: z.number(),
});

export type Input_MECH_378 = z.infer<typeof InputSchema_MECH_378>;

export interface Output_MECH_378 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_378(input: Input_MECH_378): Output_MECH_378 {
  const validData = InputSchema_MECH_378.parse(input);
  const { temas_basinci, mil_capi, gecme_uzunlugu, surtunme } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (true) {
      smartWarnings.push({
        severity: "INFO",
        source: "DIN 7190 Sürtünme Bağlantıları",
        message: "Bilgi: Bu formül, bağlantının sıyırmadan taşıyabileceği MAKSİMUM torku verir. Sistemde ani kalkış (Şok yükleri) veya tersine dönüşler (Reversing Loads) varsa, mikro kaymaları (Micro-slip) önlemek için Emniyet Katsayısını (Sf) minimum 1.5 - 2.0 aralığında almalısınız."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
