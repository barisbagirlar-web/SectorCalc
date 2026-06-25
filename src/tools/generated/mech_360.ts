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
 * ID: MECH_360
 * Name: Pres Uyumlu Montaj İtme/Çekme Kuvveti
 */

export const InputSchema_MECH_360 = z.object({
  temas_basinci: z.number(),
  nominal_cap: z.number(),
  gecme_uzunlugu: z.number(),
  surtunme: z.number(),
});

export type Input_MECH_360 = z.infer<typeof InputSchema_MECH_360>;

export interface Output_MECH_360 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_360(input: Input_MECH_360): Output_MECH_360 {
  const validData = InputSchema_MECH_360.parse(input);
  const { temas_basinci, nominal_cap, gecme_uzunlugu, surtunme } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (surtunme > 0.15) {
      smartWarnings.push({
        severity: "WARNING",
        source: "DIN 7190 Pres Geçme Tesisatı",
        message: "Uyarı: Kuru ve yağsız yüzeylerde sürtünme katsayısı yüksek alınmıştır. Hidrolik presle montaj yapılırken milde veya göbekte 'Galling (Soğuk Kaynama / Yırtılma)' riski çok yüksektir. Montaj kuvveti katlanarak artar, montaj pastası (Örn: MoS2) kullanın."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
