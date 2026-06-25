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
 * ID: MECH_355
 * Name: Yay Çeliklerinde Gevşeme (Creep/Relaxation)
 */

export const InputSchema_MECH_355 = z.object({
  calisma_sicakligi: z.number(),
  kurma_gerilmesi: z.number(),
  malzeme: z.enum(["Patentli Müzik Teli (ASTM A228)", "Krom-Vanadyum (ASTM A231)", "Inconel X-750"]),
});

export type Input_MECH_355 = z.infer<typeof InputSchema_MECH_355>;

export interface Output_MECH_355 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_355(input: Input_MECH_355): Output_MECH_355 {
  const validData = InputSchema_MECH_355.parse(input);
  const { calisma_sicakligi, kurma_gerilmesi, malzeme } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (malzeme === 'Krom-Vanadyum (ASTM A231)' && calisma_sicakligi > 220) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Yay Üreticileri Enstitüsü (SMI)",
        message: "Uyarı: Krom-Vanadyum yayları 220°C sınırına yaklaştığında, gerilme gevşemesi %10'un üzerine çıkar. Yay kuvveti zamanla zayıflayacaktır, kuvvet toleransınızı bu kayba göre kompanze edin."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
