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
 * ID: FIN_021
 * Name: Yatırım Getirisi (ROI)
 */

export const InputSchema_FIN_021 = z.object({
  net_kar: z.number(),
  maliyet: z.number(),
});

export type Input_FIN_021 = z.infer<typeof InputSchema_FIN_021>;

export interface Output_FIN_021 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_021(input: Input_FIN_021): Output_FIN_021 {
  const validData = InputSchema_FIN_021.parse(input);
  const { net_kar, maliyet } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((net_kar / maliyet) * 100 > 500) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Finansal Analiz",
        message: "Uyarı: ROI %500'ün üzerinde. Bu tür olağanüstü getiriler genellikle çok yüksek riskli girişim sermayesi (VC) projelerinde veya kripto piyasalarında görülür; girdi maliyetlerinin eksiksiz yazıldığından emin olun."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
