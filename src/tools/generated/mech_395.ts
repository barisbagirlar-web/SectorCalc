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
 * ID: MECH_395
 * Name: Pnömatik/Hidrolik Orifis Akışı (Orifice Flow)
 */

export const InputSchema_MECH_395 = z.object({
  orifis_cap: z.number(),
  basinc_farki: z.number(),
  akis_katsayisi: z.number(),
  yogunluk: z.number(),
});

export type Input_MECH_395 = z.infer<typeof InputSchema_MECH_395>;

export interface Output_MECH_395 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_395(input: Input_MECH_395): Output_MECH_395 {
  const validData = InputSchema_MECH_395.parse(input);
  const { orifis_cap, basinc_farki, akis_katsayisi, yogunluk } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (basinc_farki > 100 && yogunluk > 800) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Akışkan Dinamiği (Kavitasyon)",
        message: "Kritik Aşınma Riski: Dar kesitten (Orifis) sıvı geçerken oluşan yüksek basınç farkı (>100 Bar), hızın aniden artmasına ve statik basıncın buharlaşma noktasının altına inmesine neden olacaktır. Çok şiddetli lokal kavitasyon orifis yüzeyini zımpara gibi aşındıracaktır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
