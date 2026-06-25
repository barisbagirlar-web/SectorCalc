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
 * ID: MNT_307
 * Name: MTBF (Ortalama Arızalar Arası Süre)
 */

export const InputSchema_MNT_307 = z.object({
  toplam_calisma_suresi: z.number(),
  ariza_sayisi: z.number(),
});

export type Input_MNT_307 = z.infer<typeof InputSchema_MNT_307>;

export interface Output_MNT_307 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MNT_307(input: Input_MNT_307): Output_MNT_307 {
  const validData = InputSchema_MNT_307.parse(input);
  const { toplam_calisma_suresi, ariza_sayisi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((toplam_calisma_suresi / ariza_sayisi) < 48) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "TPM (Toplam Verimli Bakım)",
        message: "Kritik Bakım Uyarısı: MTBF süresi 48 saatin altındadır. Ekipman 2 günde bir arızalanmaktadır. Kök neden analizi (5 Neden / Ishikawa) yapılmalı ve makine duruma göre revizyona (Overhaul) alınmalıdır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
