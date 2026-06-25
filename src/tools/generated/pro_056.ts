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
 * ID: PRO_056
 * Name: Little Yasası (WIP, TH, CT) ve Darboğaz Analizi
 */

export const InputSchema_PRO_056 = z.object({
  known_variable: z.enum(["WIP (Süreç İçi Stok)", "Throughput (Üretim Hızı)", "Cycle Time (Çevrim Süresi)"]),
  wip: z.number(),
  throughput: z.number(),
  cycle_time: z.number(),
  bottleneck_th: z.number(),
});

export type Input_PRO_056 = z.infer<typeof InputSchema_PRO_056>;

export interface Output_PRO_056 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_056(input: Input_PRO_056): Output_PRO_056 {
  const validData = InputSchema_PRO_056.parse(input);
  const { known_variable, wip, throughput, cycle_time, bottleneck_th } = validData as any;
  
  const Calc_WIP = ((known_variable == 'WIP (Süreç İçi Stok)') ? (throughput * cycle_time) : (wip));
  const Calc_TH = ((known_variable == 'Throughput (Üretim Hızı)') ? (wip / cycle_time) : (throughput));
  const Calc_CT = ((known_variable == 'Cycle Time (Çevrim Süresi)') ? (wip / throughput) : (cycle_time));
  const System_Efficiency = (Calc_TH / bottleneck_th) * 100;
  const Best_Case_CT_Theoretical = 1 / bottleneck_th;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Calc_TH > bottleneck_th) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Kısıtlar Teorisi (TOC)",
        message: "Fiziksel Red: Hesaplanılan veya girilen Üretim Hızı (TH), sistemin fiziksel darboğazından yüksektir. Fabrika Fiziğine (Factory Physics) göre hiçbir sistem darboğazından daha hızlı üretim yapamaz. Girdi verileri hatalıdır."
      });
    }
  
  return {
    result: Best_Case_CT_Theoretical,
    smartWarnings
  };
}
