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
 * ID: PRO_059
 * Name: M/M/c Kuyruk Teorisi ve Sunucu Optimizasyonu
 */

export const InputSchema_PRO_059 = z.object({
  arrival_rate: z.number(),
  service_rate: z.number(),
  servers: z.number(),
  wait_cost_hr: z.number(),
  server_cost_hr: z.number(),
});

export type Input_PRO_059 = z.infer<typeof InputSchema_PRO_059>;

export interface Output_PRO_059 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_059(input: Input_PRO_059): Output_PRO_059 {
  const validData = InputSchema_PRO_059.parse(input);
  const { arrival_rate, service_rate, servers, wait_cost_hr, server_cost_hr } = validData as any;
  
  const Rho_Utilization = arrival_rate / (servers * service_rate);
  const P0_Prob_Empty = 1 - Rho_Utilization;
  const Lq_Queue_Length = Math.pow(Rho_Utilization, 2) / (1 - Rho_Utilization);
  const Ls_System_Length = Rho_Utilization / (1 - Rho_Utilization);
  const Wq_Wait_Time_Hrs = Lq_Queue_Length / arrival_rate;
  const Ws_System_Time_Hrs = Ls_System_Length / arrival_rate;
  const Total_Wait_Cost = Lq_Queue_Length * wait_cost_hr;
  const Total_Server_Cost = servers * server_cost_hr;
  const Total_System_Cost = Total_Wait_Cost + Total_Server_Cost;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Rho_Utilization > 0.90) {
      smartWarnings.push({
        severity: "WARNING",
        source: "M/M/1 Kararlılık Sınırı",
        message: "Operasyonel Uyarı: Sistem kullanım oranı (Utilization) %90'ın üzerindedir. Kuyruk uzunluğu (Lq) eksponansiyel olarak artış trendine girmiştir; en ufak bir hizmet gecikmesi kaosa neden olacaktır."
      });
    }
  
  return {
    result: Total_System_Cost,
    smartWarnings
  };
}
