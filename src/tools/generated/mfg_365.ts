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
 * ID: MFG_365
 * Name: Enjeksiyon Kalıp Çekme Payı (Shrinkage Tolerancing)
 */

export const InputSchema_MFG_365 = z.object({
  nominal_olcu: z.number(),
  cekm_orani: z.number(),
  parca_toleransi: z.number(),
});

export type Input_MFG_365 = z.infer<typeof InputSchema_MFG_365>;

export interface Output_MFG_365 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_365(input: Input_MFG_365): Output_MFG_365 {
  const validData = InputSchema_MFG_365.parse(input);
  const { nominal_olcu, cekm_orani, parca_toleransi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((nominal_olcu * (cekm_orani / 100)) > (parca_toleransi * 3)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Kalıp Tasarım Doğrulaması",
        message: "Uyarı: Polimerin doğal büzülmesinden kaynaklanan milimetrik değişim, parçanın teknik resim toleransından 3 kat daha büyüktür. Proses (Tutma basıncı, soğutma süresi) stabil kalmazsa parçalar doğrudan ıskartaya (Out of Spec) çıkacaktır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
