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
 * ID: CNC_352
 * Name: Tornalama Ana Kesme Kuvveti (Fc)
 */

export const InputSchema_CNC_352 = z.object({
  kesme_derinligi: z.number(),
  ilerleme: z.number(),
  ozgul_kesme_direnci: z.number(),
  yanas_acisi: z.number(),
});

export type Input_CNC_352 = z.infer<typeof InputSchema_CNC_352>;

export interface Output_CNC_352 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CNC_352(input: Input_CNC_352): Output_CNC_352 {
  const validData = InputSchema_CNC_352.parse(input);
  const { kesme_derinligi, ilerleme, ozgul_kesme_direnci, yanas_acisi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (yanas_acisi < 45) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Sandvik Tornalama Dinamikleri",
        message: "Uyarı: Yanaşma açısı 45 derecenin altındadır. Bu geometri talaşı inceltip ilerlemeyi artırmaya olanak sağlasa da, radyal kesme kuvvetini (Fp) dramatik şekilde yükseltir. Uzun ve ince parçalarda tırlama (Chatter) ve esneme KESİNDİR; punta desteği (Tailstock) şarttır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
