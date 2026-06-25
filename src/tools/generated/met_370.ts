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
 * ID: MET_370
 * Name: CMM Prob Ucu Kompanzasyon Hatası
 */

export const InputSchema_MET_370 = z.object({
  prob_radyusu: z.number(),
  temas_acisi: z.number(),
  tolerans_bandi: z.number(),
});

export type Input_MET_370 = z.infer<typeof InputSchema_MET_370>;

export interface Output_MET_370 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MET_370(input: Input_MET_370): Output_MET_370 {
  const validData = InputSchema_MET_370.parse(input);
  const { prob_radyusu, temas_acisi, tolerans_bandi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((prob_radyusu * (1 - COS(temas_acisi * 3.14159 / 180))) > (tolerans_bandi * 0.1)) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ISO 10360 CMM Ölçüm Belirsizliği",
        message: "Kritik Kalite Reddi: Eğimli yüzeyde küresel probun merkez ile temas noktası arasındaki kayma hatası (Cosine Error), parça tolerans bandının %10'unu aşıyor. CMM yazılımı bu vektör sapmasını doğru kompanze edemezse parça sağlam olsa bile ıskartaya (False Reject) çıkacaktır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
