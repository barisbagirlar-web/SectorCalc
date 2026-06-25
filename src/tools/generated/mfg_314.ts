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
 * ID: MFG_314
 * Name: Plastik Enjeksiyon Kapama Kuvveti (Clamping Force)
 */

export const InputSchema_MFG_314 = z.object({
  kavite_alani: z.number(),
  kavite_basinci: z.number(),
  tezgah_tonaji: z.number(),
});

export type Input_MFG_314 = z.infer<typeof InputSchema_MFG_314>;

export interface Output_MFG_314 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_314(input: Input_MFG_314): Output_MFG_314 {
  const validData = InputSchema_MFG_314.parse(input);
  const { kavite_alani, kavite_basinci, tezgah_tonaji } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (((kavite_alani * kavite_basinci) / 1000) > (tezgah_tonaji * 0.85)) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Plastik Enjeksiyon Dinamikleri",
        message: "Kritik İmalat Riski: Gerekli kapama kuvveti, makine tonajının %85'ini (Güvenlik marjı) aşıyor. Enjeksiyon (Holding) aşamasında kalıp aralanacak, parçada ağır çapak (Flash) oluşacak ve kalıp ayırma yüzeyleri ezilecektir. Daha büyük tonajlı tezgâha geçin."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
