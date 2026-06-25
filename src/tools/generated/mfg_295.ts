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
 * ID: MFG_295
 * Name: Kaynak Çarpılması (Transvers Büzülme)
 */

export const InputSchema_MFG_295 = z.object({
  isi_girdisi: z.number(),
  sac_kalinligi: z.number(),
  kaynak_sayisi: z.number(),
});

export type Input_MFG_295 = z.infer<typeof InputSchema_MFG_295>;

export interface Output_MFG_295 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_295(input: Input_MFG_295): Output_MFG_295 {
  const validData = InputSchema_MFG_295.parse(input);
  const { isi_girdisi, sac_kalinligi, kaynak_sayisi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (isi_girdisi > 2.5 && sac_kalinligi < 5) {
      smartWarnings.push({
        severity: "WARNING",
        source: "AWS D1.1 Deformasyon Kontrolü",
        message: "Uyarı: İnce saca çok yüksek ısı girdisi uygulanıyor. Kaynak dikişi soğurken malzemenin nötr ekseninde şiddetli açısal distorsiyon (Angular Distortion / Çarpılma) yaratacaktır. Parçayı fikstürle sabitleyin veya ters büküm (Pre-bending) verin."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
