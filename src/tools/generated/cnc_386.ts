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
 * ID: CNC_386
 * Name: Takım Çekme (Pull-Out) Kuvveti ve Emniyeti
 */

export const InputSchema_CNC_386 = z.object({
  eksenel_kesme_kuvveti: z.number(),
  tutucu_torku: z.number(),
  takim_capi: z.number(),
  helis_acisi: z.number(),
});

export type Input_CNC_386 = z.infer<typeof InputSchema_CNC_386>;

export interface Output_CNC_386 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CNC_386(input: Input_CNC_386): Output_CNC_386 {
  const validData = InputSchema_CNC_386.parse(input);
  const { eksenel_kesme_kuvveti, tutucu_torku, takim_capi, helis_acisi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (helis_acisi > 45 && (eksenel_kesme_kuvveti * (takim_capi/2000)) > (tutucu_torku * 0.4)) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Takım Güvenliği (Milling Dynamics)",
        message: "Kritik Hurda Riski: Yüksek helis açılı (>45°) takım ve yüksek eksenel kuvvet birleşimi, tutucunun kavrama torkunu yenerek takımı pensetten (Örn: ER Collet) dışarı çekecektir (Pull-Out). Takım parçaya saplanarak tezgâhı veya iş parçasını parçalar. Weldon şaftlı tutucu (Side Lock) veya shrink-fit kullanın."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
