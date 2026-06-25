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
 * ID: PRO_089
 * Name: İleri Zaman Etüdü ve Öğrenme Eğrisi (Learning Curve)
 */

export const InputSchema_PRO_089 = z.object({
  first_unit_time: z.number(),
  learning_rate_pct: z.number(),
  target_unit_n: z.number(),
  labor_rate: z.number(),
});

export type Input_PRO_089 = z.infer<typeof InputSchema_PRO_089>;

export interface Output_PRO_089 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_089(input: Input_PRO_089): Output_PRO_089 {
  const validData = InputSchema_PRO_089.parse(input);
  const { first_unit_time, learning_rate_pct, target_unit_n, labor_rate } = validData as any;
  
  const b_index = LOG(learning_rate_pct / 100) / LOG(2);
  const Time_For_Nth_Unit = first_unit_time * Math.pow(target_unit_n, b_index);
  const Cumulative_Time_N = first_unit_time * (Math.pow(target_unit_n, b_index + 1)) / (b_index + 1);
  const Cumulative_Avg_Time_N = Cumulative_Time_N / target_unit_n;
  const Cost_For_Nth_Unit = (Time_For_Nth_Unit / 60) * labor_rate;
  const Cumulative_Labor_Cost = (Cumulative_Time_N / 60) * labor_rate;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (learning_rate_pct > 95) {
      smartWarnings.push({
        severity: "INFO",
        source: "Öğrenme Eğrisi Dinamikleri",
        message: "Bilgi: Öğrenme oranı %95'in üzerindedir. Operasyon büyük oranda makine ağırlıklı (Machine-Paced) olduğu için işçi tecrübesi üretim hızını çok az etkilemektedir; öğrenme etkisi asgari düzeydedir."
      });
    }
  
  return {
    result: Cumulative_Labor_Cost,
    smartWarnings
  };
}
