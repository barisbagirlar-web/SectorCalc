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
 * ID: MFG_292
 * Name: Broşlama (Broaching) Kesme Kuvveti
 */

export const InputSchema_MFG_292 = z.object({
  dis_basina_talaş: z.number(),
  ayni_anda_kesen_dis: z.number(),
  kesme_genisligi: z.number(),
  ozgul_kesme_direnci: z.number(),
});

export type Input_MFG_292 = z.infer<typeof InputSchema_MFG_292>;

export interface Output_MFG_292 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_292(input: Input_MFG_292): Output_MFG_292 {
  const validData = InputSchema_MFG_292.parse(input);
  const { dis_basina_talaş, ayni_anda_kesen_dis, kesme_genisligi, ozgul_kesme_direnci } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((dis_basina_talaş * ayni_anda_kesen_dis * kesme_genisligi * ozgul_kesme_direnci) > 100000) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Makine Tasarım Limitleri",
        message: "Uyarı: Broşlama çekme/itme kuvveti 100 kN (10 Ton) sınırını aşmaktadır. Broş tezgâhının (Ram) maksimum tonaj kapasitesini ve fikstür (bağlama) mukavemetini kontrol edin."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
