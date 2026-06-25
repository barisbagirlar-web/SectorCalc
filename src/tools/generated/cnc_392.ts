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
 * ID: CNC_392
 * Name: Kılavuz Çekme (Tapping) Torku ve Kesme Kuvveti
 */

export const InputSchema_CNC_392 = z.object({
  vida_cap: z.number(),
  hatve: z.number(),
  ozgul_kesme_direnci: z.number(),
  tutucu_kapasite: z.number(),
});

export type Input_CNC_392 = z.infer<typeof InputSchema_CNC_392>;

export interface Output_CNC_392 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CNC_392(input: Input_CNC_392): Output_CNC_392 {
  const validData = InputSchema_CNC_392.parse(input);
  const { vida_cap, hatve, ozgul_kesme_direnci, tutucu_kapasite } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (((ozgul_kesme_direnci * (hatve * hatve) * vida_cap) / 4000) > tutucu_kapasite) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "VDI 3321 / Sandvik Tapping",
        message: "Kritik Takım Kırılma Riski: İşlenecek malzemenin yarattığı kesme torku, kılavuz tutucunun (veya pensetin) sıkma kapasitesini aşıyor. Kılavuz parça içinde patinaj yapacak (Slipping), eksenel senkronizasyon bozulacak ve takım KESİNLİKLE kırılacaktır. Senkronize tutucuya geçin veya matkap çapını büyütün."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
