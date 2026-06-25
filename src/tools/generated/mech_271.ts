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
 * ID: MECH_271
 * Name: Kama Ezilme Gerilmesi
 */

export const InputSchema_MECH_271 = z.object({
  tork: z.number(),
  mil_cap: z.number(),
  kama_uzunluk: z.number(),
  kama_yukseklik: z.number(),
});

export type Input_MECH_271 = z.infer<typeof InputSchema_MECH_271>;

export interface Output_MECH_271 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_271(input: Input_MECH_271): Output_MECH_271 {
  const validData = InputSchema_MECH_271.parse(input);
  const { tork, mil_cap, kama_uzunluk, kama_yukseklik } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((2 * tork) / (mil_cap * kama_uzunluk * (kama_yukseklik / 2)) > 150000000) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "DIN 6885 Kama Standartları",
        message: "Kritik Uyarı: Kamadaki ezilme (Basınç) gerilmesi 150 MPa'yı aşmaktadır. Standart imalat çeliğinden (St37/St52) üretilen bir kama kullanıyorsanız, kama yuvasında plastik deformasyon (ezilme ve boşluk yapma) oluşacak ve güç aktarımı kopacaktır. Kamanın boyunu uzatın."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
