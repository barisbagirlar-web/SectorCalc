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
 * ID: PRO_130
 * Name: Öğrenme Eğrisi (Wright Modeli) Maliyet ve Fiyatlama Etkisi
 */

export const InputSchema_PRO_130 = z.object({
  time_unit_1: z.number(),
  learning_rate_pct: z.number(),
  target_unit_N: z.number(),
  total_batch_size: z.number(),
  labor_rate_hr: z.number(),
});

export type Input_PRO_130 = z.infer<typeof InputSchema_PRO_130>;

export interface Output_PRO_130 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_130(input: Input_PRO_130): Output_PRO_130 {
  const validData = InputSchema_PRO_130.parse(input);
  const { time_unit_1, learning_rate_pct, target_unit_N, total_batch_size, labor_rate_hr } = validData as any;
  
  const b_index = Math.log10(learning_rate_pct / 100) / Math.log10(2);
  const Time_For_Nth_Unit = time_unit_1 * Math.pow(target_unit_N, b_index);
  const Cumulative_Time_Batch = time_unit_1 * (Math.pow(total_batch_size, b_index + 1)) / (b_index + 1);
  const Cumulative_Avg_Time = Cumulative_Time_Batch / total_batch_size;
  const Cost_For_Nth_Unit = Time_For_Nth_Unit * labor_rate_hr;
  const Total_Labor_Cost_Batch = Cumulative_Time_Batch * labor_rate_hr;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (learning_rate_pct > 95) {
      smartWarnings.push({
        severity: "INFO",
        source: "Öğrenme Eğrisi Dinamikleri",
        message: "Bilgi: Öğrenme oranınız %95'in üzerindedir. Süreç yüksek oranda makine-ağırlıklı (Machine-paced) olduğu için işçi tecrübesi üretim süresini çok az düşürmektedir. Maliyet düşüşü asgari düzeyde kalacaktır."
      });
    }

    if (target_unit_N > total_batch_size) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Fiyatlandırma Mantığı",
        message: "Mantıksal Uyarı: Hesaplamak istediğiniz N. ünite, toplam sipariş partisinin dışındadır. Tahminleme yapmıyorsanız parametreleri kontrol edin."
      });
    }
  
  return {
    result: Total_Labor_Cost_Batch,
    smartWarnings
  };
}
