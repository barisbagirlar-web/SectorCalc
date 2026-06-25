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
 * ID: ENG_306
 * Name: Afinite Yasası (Pompa/Fan Güç Tasarrufu)
 */

export const InputSchema_ENG_306 = z.object({
  mevcut_devir: z.number(),
  hedef_devir: z.number(),
  mevcut_guc: z.number(),
});

export type Input_ENG_306 = z.infer<typeof InputSchema_ENG_306>;

export interface Output_ENG_306 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ENG_306(input: Input_ENG_306): Output_ENG_306 {
  const validData = InputSchema_ENG_306.parse(input);
  const { mevcut_devir, hedef_devir, mevcut_guc } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (hedef_devir < (mevcut_devir * 0.3)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Santrifüj Pompa Dinamikleri",
        message: "Uyarı: Devir %30'un altına düşürüldü. Pompa veya fanın statik basma yüksekliğini (Static Head) yenebilmesi için minimum bir devre ihtiyacı vardır. Bu hızda akışkan boruda durabilir veya motor kendi soğutma fanını çeviremediği için termik açabilir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
