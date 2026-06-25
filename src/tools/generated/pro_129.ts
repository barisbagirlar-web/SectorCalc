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
 * ID: PRO_129
 * Name: Standart Zaman Etüdü ve Örneklem Geçerlilik Analizi
 */

export const InputSchema_PRO_129 = z.object({
  observed_times: z.number(),
  performance_rating: z.number(),
  allowance_pfd: z.number(),
  z_score: z.number(),
  accuracy_margin: z.number(),
});

export type Input_PRO_129 = z.infer<typeof InputSchema_PRO_129>;

export interface Output_PRO_129 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_129(input: Input_PRO_129): Output_PRO_129 {
  const validData = InputSchema_PRO_129.parse(input);
  const { observed_times, performance_rating, allowance_pfd, z_score, accuracy_margin } = validData as any;
  
  const N_observations = 1;
  const Mean_Observed_Time = SUM(observed_times) / N_observations;
  const StdDev = Math.sqrt(SUM(Math.pow(observed_times_i - Mean_Observed_Time, 2)) / (N_observations - 1));
  const Required_Sample_Size = Math.pow((z_score * StdDev) / (accuracy_margin * Mean_Observed_Time), 2);
  const Normal_Time = Mean_Observed_Time * performance_rating;
  const Standard_Time = Normal_Time * (1 + (allowance_pfd / 100));
  const Pieces_Per_Hour = 60 / Standard_Time;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (N_observations < Required_Sample_Size) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Zaman Etüdü İstatistiği",
        message: "Yetersiz Örneklem: Alınan ölçüm sayısı, istenen % güven seviyesi ve doğruluk payını karşılamak için istatistiksel olarak yetersizdir. Süreçteki varyasyon çok yüksek; hesaba güvenmeyip etüde devam edin (En az Required_Sample_Size kadar ölçüm alın)."
      });
    }
  
  return {
    result: Pieces_Per_Hour,
    smartWarnings
  };
}
