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
 * ID: PRO_064
 * Name: Talaşlı İmalat Stratejisi ve Optimum Kesme Hızı
 */

export const InputSchema_PRO_064 = z.object({
  current_vc: z.number(),
  taylor_c: z.number(),
  taylor_n: z.number(),
  tool_change_time: z.number(),
  insert_cost: z.number(),
  edges: z.number(),
  machine_rate: z.number(),
});

export type Input_PRO_064 = z.infer<typeof InputSchema_PRO_064>;

export interface Output_PRO_064 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_064(input: Input_PRO_064): Output_PRO_064 {
  const validData = InputSchema_PRO_064.parse(input);
  const { current_vc, taylor_c, taylor_n, tool_change_time, insert_cost, edges, machine_rate } = validData as any;
  
  const Cost_Per_Edge = insert_cost / edges;
  const Machine_Rate_Min = machine_rate / 60;
  const T_opt_MinCost = ((1 / taylor_n) - 1) * (tool_change_time + (Cost_Per_Edge / Machine_Rate_Min));
  const Vc_opt_MinCost = taylor_c / Math.pow(T_opt_MinCost, taylor_n);
  const T_opt_MaxProd = ((1 / taylor_n) - 1) * tool_change_time;
  const Vc_opt_MaxProd = taylor_c / Math.pow(T_opt_MaxProd, taylor_n);
  const Current_Tool_Life = Math.pow(taylor_c / current_vc, 1 / taylor_n);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (current_vc > Vc_opt_MaxProd) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Sandvik İşleme Ekonomisi",
        message: "Ekonomik Kayıp: Mevcut kesme hızınız, maksimum üretim (Max Productivity) hızından bile yüksektir. Takımlar çok hızlı yandığı için, takım değiştirme duruşları kazandığınız zamanı fazlasıyla yutmaktadır. Hızı düşürün."
      });
    }
  
  return {
    result: Current_Tool_Life,
    smartWarnings
  };
}
