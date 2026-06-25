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
 * ID: IND_339
 * Name: Kullanılabilirlik (Availability - OEE Metriği)
 */

export const InputSchema_IND_339 = z.object({
  mtbf: z.number(),
  mttr: z.number(),
});

export type Input_IND_339 = z.infer<typeof InputSchema_IND_339>;

export interface Output_IND_339 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_IND_339(input: Input_IND_339): Output_IND_339 {
  const validData = InputSchema_IND_339.parse(input);
  const { mtbf, mttr } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((mtbf / (mtbf + mttr)) * 100 > 99.5 && mttr > 1) {
      smartWarnings.push({
        severity: "INFO",
        source: "TPM / Veri Güvenilirliği",
        message: "Bilgi: Kullanılabilirlik %99.5'in üzerinde. Ancak onarım süreleriniz (MTTR) 1 saatin üzerinde. Bu durum, operatörlerin ayar (Setup), malzeme bekleme veya 5 dakikanın altındaki mikro duruşları (Micro-stops) ERP/MES sistemine girmediklerini, yani verinin manipüle edildiğini ('Yalancı Verimlilik') gösterir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
