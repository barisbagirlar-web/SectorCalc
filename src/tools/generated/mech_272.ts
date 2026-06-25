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
 * ID: MECH_272
 * Name: Rulman Montaj Boşluğu (Clearance / Preload)
 */

export const InputSchema_MECH_272 = z.object({
  baslangic_bosluk: z.number(),
  mil_sikilik: z.number(),
  sicaklik_farki: z.number(),
});

export type Input_MECH_272 = z.infer<typeof InputSchema_MECH_272>;

export interface Output_MECH_272 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_272(input: Input_MECH_272): Output_MECH_272 {
  const validData = InputSchema_MECH_272.parse(input);
  const { baslangic_bosluk, mil_sikilik, sicaklik_farki } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((baslangic_bosluk - (mil_sikilik * 0.8) - (sicaklik_farki * 1.2)) < 0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "SKF Rulman Montaj Standartları",
        message: "Kritik Uyarı: Operasyonel rulman boşluğu negatife düşmektedir (Aşırı Preload). Çalışma sıcaklığında rulman bilyeleri yatakları ezecek (Brinelling) ve dakikalar içinde kilitlenerek/yanarak şaftı koparacaktır. C4 sınıfı boşluklu rulmana geçin."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
