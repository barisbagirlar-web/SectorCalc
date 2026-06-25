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
 * ID: PRO_128
 * Name: Montaj Hattı Dengeleme (Ranked Positional Weight - RPW)
 */

export const InputSchema_PRO_128 = z.object({
  task_times: z.number(),
  precedence_matrix: z.number(),
  takt_time: z.number(),
  actual_stations: z.number(),
});

export type Input_PRO_128 = z.infer<typeof InputSchema_PRO_128>;

export interface Output_PRO_128 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_128(input: Input_PRO_128): Output_PRO_128 {
  const validData = InputSchema_PRO_128.parse(input);
  const { task_times, precedence_matrix, takt_time, actual_stations } = validData as any;
  
  const RPW_i = task_times_i + precedence_matrix_i;
  const Total_Work_Content = SUM(task_times);
  const Min_Theoretical_Stations = CEILING(Total_Work_Content / takt_time);
  const Max_Station_Time_Allowed = Math.max(task_times);
  const Line_Efficiency_Pct = (Total_Work_Content / (actual_stations * takt_time)) * 100;
  const Balance_Delay_Pct = 100 - Line_Efficiency_Pct;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Line_Efficiency_Pct < 85) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Yalın Üretim Akış Analizi",
        message: "Hat Dengesizliği: Hat verimi %85'in altındadır. Operatörler arasında iş yükü eşitsizliği var ve vardiya süresinin ciddi bir kısmı 'Balance Delay' (Bekleme İsrafı) olarak boşa gitmektedir. RPW puanlarına göre görevleri istasyonlara yeniden dağıtın."
      });
    }
  
  return {
    result: Balance_Delay_Pct,
    smartWarnings
  };
}
