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
 * ID: PRO_188
 * Name: Yalın Üretim Hücresel Düzen (One-Piece Flow) ve Operatör Verimi
 */

export const InputSchema_PRO_188 = z.object({
  manual_time_sec: z.number(),
  walking_time_sec: z.number(),
  takt_time_sec: z.number(),
  operators_count: z.number(),
});

export type Input_PRO_188 = z.infer<typeof InputSchema_PRO_188>;

export interface Output_PRO_188 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_188(input: Input_PRO_188): Output_PRO_188 {
  const validData = InputSchema_PRO_188.parse(input);
  const { manual_time_sec, walking_time_sec, takt_time_sec, operators_count } = validData as any;
  
  const Total_Cell_Cycle_Time = manual_time_sec + walking_time_sec;
  const Theoretical_Operators_Req = Total_Cell_Cycle_Time / takt_time_sec;
  const Cell_Balancing_Efficiency = (manual_time_sec / (operators_count * takt_time_sec)) * 100;
  const Labor_Waste_Hours_Daily = ((operators_count * takt_time_sec) - manual_time_sec) * 480 / 3600;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Total_Cell_Cycle_Time > (takt_time_sec * operators_count)) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Toyota Üretim Sistemi (TPS)",
        message: "Kapasite Yetersizliği: Hücrenin toplam çevrim süresi, mevcut işgücü kapasitesiyle Takt süresini karşılayamamaktadır. One-piece flow akışı kilitlenecektir; ya parça transfer otomasyonu (Chaku-Chaku) kurun ya da hücreye 1 operatör daha ekleyin."
      });
    }
  
  return {
    result: Labor_Waste_Hours_Daily,
    smartWarnings
  };
}
