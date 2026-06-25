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
 * ID: FIN_016
 * Name: Temettü Vergisi
 */

export const InputSchema_FIN_016 = z.object({
  temettu: z.number(),
  stopaj: z.number(),
});

export type Input_FIN_016 = z.infer<typeof InputSchema_FIN_016>;

export interface Output_FIN_016 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_016(input: Input_FIN_016): Output_FIN_016 {
  const validData = InputSchema_FIN_016.parse(input);
  const { temettu, stopaj } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (stopaj > 20) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Vergi Mevzuatı",
        message: "Uyarı: Türkiye'de (BİST) standart temettü stopajı %10'dur. %20 ve üzeri stopajlar genellikle yurtdışı hisse senedi (Örn: ABD) temettüleri için geçerlidir ve çifte vergilendirme (W-8BEN formu) durumunu incelemeyi gerektirir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
