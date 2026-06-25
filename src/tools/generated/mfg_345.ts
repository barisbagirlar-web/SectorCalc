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
 * ID: MFG_345
 * Name: Sac Şekillendirme Kalıp Radyüs ve Boşluğu
 */

export const InputSchema_MFG_345 = z.object({
  sac_kalinligi: z.number(),
  kalip_radyusu: z.number(),
});

export type Input_MFG_345 = z.infer<typeof InputSchema_MFG_345>;

export interface Output_MFG_345 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_345(input: Input_MFG_345): Output_MFG_345 {
  const validData = InputSchema_MFG_345.parse(input);
  const { sac_kalinligi, kalip_radyusu } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (kalip_radyusu < (sac_kalinligi * 2)) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "DIN 6935 Sac Metal Normları",
        message: "Kritik Kalıp Tasarım Hatası: Matris radyüsü sac kalınlığının 2 katından küçüktür. Sac şekillenirken aşırı gerilecek, matris köşesinde sıkışarak yırtılacak veya yüzeyde derin çekme çizgileri (Scratches) oluşacaktır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
