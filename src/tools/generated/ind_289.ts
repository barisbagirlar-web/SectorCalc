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
 * ID: IND_289
 * Name: Mil Salgısı (Runout / TIR) Toleransı
 */

export const InputSchema_IND_289 = z.object({
  max_okunan: z.number(),
  min_okunan: z.number(),
  devir: z.number(),
});

export type Input_IND_289 = z.infer<typeof InputSchema_IND_289>;

export interface Output_IND_289 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_IND_289(input: Input_IND_289): Output_IND_289 {
  const validData = InputSchema_IND_289.parse(input);
  const { max_okunan, min_okunan, devir } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((max_okunan - min_okunan) > 0.05 && devir > 1500) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "API 610 Pompa ve Kompresör Standartları",
        message: "Kritik Titreşim Riski: Yüksek devirli şaftta Toplam Gösterge Salgısı (TIR) 0.05 mm'yi (50 mikron) aşmıştır. Bu balanssızlık mekanik salmastrayı (Mechanical Seal) parçalayacak ve rulman yataklarını kısa sürede bozacaktır. Mil düzeltilmeli veya değiştirilmelidir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
