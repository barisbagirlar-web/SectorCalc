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
 * ID: MFG_399
 * Name: Döküm Besleyici Modülü (Chvorinov Kuralı)
 */

export const InputSchema_MFG_399 = z.object({
  parca_hacmi: z.number(),
  parca_yuzeyi: z.number(),
  besleyici_hacmi: z.number(),
  besleyici_yuzeyi: z.number(),
});

export type Input_MFG_399 = z.infer<typeof InputSchema_MFG_399>;

export interface Output_MFG_399 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_399(input: Input_MFG_399): Output_MFG_399 {
  const validData = InputSchema_MFG_399.parse(input);
  const { parca_hacmi, parca_yuzeyi, besleyici_hacmi, besleyici_yuzeyi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((besleyici_hacmi / besleyici_yuzeyi) <= (1.2 * (parca_hacmi / parca_yuzeyi))) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Döküm Katılaşma Teorisi (VDG)",
        message: "Kritik Kalıp Reddi: Besleyici (Riser) modülü, parça modülünün %20 (1.2 katı) fazlası DEĞİLDİR. Besleyici, parçadan DÜŞÜK veya EŞİT sürede donacaktır. Çekme boşlukları (Shrinkage Cavity) besleyici yerine doğrudan döküm parçasının içine yerleşerek parçayı hurda yapacaktır. Besleyiciyi kalınlaştırın."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
