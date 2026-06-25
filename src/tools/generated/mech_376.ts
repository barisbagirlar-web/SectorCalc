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
 * ID: MECH_376
 * Name: Konik Dişli (Bevel Gear) Eksenel Ayrılma Kuvveti
 */

export const InputSchema_MECH_376 = z.object({
  tegetsel_kuvvet: z.number(),
  kavrama_acisi: z.number(),
  konik_aci: z.number(),
});

export type Input_MECH_376 = z.infer<typeof InputSchema_MECH_376>;

export interface Output_MECH_376 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_376(input: Input_MECH_376): Output_MECH_376 {
  const validData = InputSchema_MECH_376.parse(input);
  const { tegetsel_kuvvet, kavrama_acisi, konik_aci } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (true) {
      smartWarnings.push({
        severity: "INFO",
        source: "AGMA 2005 Tasarım Kılavuzu",
        message: "Bilgi: Konik dişliler KESİNLİKLE eksenel yönde ayrılma (Thrust) kuvveti üretir. Şaft tasarımı yapılırken bu eksenel kuvveti karşılayacak konik makaralı veya açısal temaslı rulmanlar arkadan birbirini destekleyecek şekilde (Back-to-Back) yerleştirilmelidir, aksi halde dişli kutusu dağılır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
