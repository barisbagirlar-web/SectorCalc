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
 * ID: MECH_331
 * Name: Zincir Tahrik Hız Dalgalanması (Poligon Etkisi)
 */

export const InputSchema_MECH_331 = z.object({
  dis_sayisi: z.number(),
  devir: z.number(),
});

export type Input_MECH_331 = z.infer<typeof InputSchema_MECH_331>;

export interface Output_MECH_331 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_331(input: Input_MECH_331): Output_MECH_331 {
  const validData = InputSchema_MECH_331.parse(input);
  const { dis_sayisi, devir } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (dis_sayisi <= 17 && devir > 300) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ANSI / Renold Zincir Tasarım Standartları",
        message: "Uyarı: Diş sayısı 17'den az ve çalışma devri nispeten yüksektir. Zincir, dairesel bir yörünge yerine çokgen (Poligon) bir yörünge çizecektir. Bu 'Chordal Action' nedeniyle çıkış hızında şiddetli dalgalanma (%4+), darbe, yorulma ve aşırı gürültü meydana gelir. Z = 19 veya 21 dişe geçin."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
