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
 * ID: ENV_251
 * Name: Fabrika Özgül Enerji Tüketimi (SEC)
 */

export const InputSchema_ENV_251 = z.object({
  toplam_enerji_mj: z.number(),
  toplam_mamul_ton: z.number(),
});

export type Input_ENV_251 = z.infer<typeof InputSchema_ENV_251>;

export interface Output_ENV_251 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ENV_251(input: Input_ENV_251): Output_ENV_251 {
  const validData = InputSchema_ENV_251.parse(input);
  const { toplam_enerji_mj, toplam_mamul_ton } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((toplam_enerji_mj / toplam_mamul_ton) > 8000) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ISO 50001 Enerji Yönetim Sistemi",
        message: "Uyarı: Ton başına düşen özgül enerji tüketiminiz (SEC) sektör verimlilik ortalamalarının üzerindedir. Üretim hattında çok yüksek hat duruşları (Muda), ısıl kayıplar veya verimsiz elektrik motorları (IE1/IE2 sınıfı) enerji israfına yol açıyor olabilir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
