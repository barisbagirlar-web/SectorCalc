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
 * ID: MFG_255
 * Name: Sac Açınım Boyu (K-Faktörü)
 */

export const InputSchema_MFG_255 = z.object({
  ic_radyus: z.number(),
  kalinlik: z.number(),
  bukum_acisi: z.number(),
  k_faktoru: z.number(),
});

export type Input_MFG_255 = z.infer<typeof InputSchema_MFG_255>;

export interface Output_MFG_255 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_255(input: Input_MFG_255): Output_MFG_255 {
  const validData = InputSchema_MFG_255.parse(input);
  const { ic_radyus, kalinlik, bukum_acisi, k_faktoru } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (ic_radyus < kalinlik) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Metalurji ve Malzeme Bilimi",
        message: "Kritik Uyarı: İç büküm radyüsü (R) sac kalınlığından (t) küçüktür. Bu durum dış yüzeyde lif kopmalarına (Micro-cracking) ve malzemenin yırtılmasına neden olur. Kalıp zımba radyüsünü büyütün."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
