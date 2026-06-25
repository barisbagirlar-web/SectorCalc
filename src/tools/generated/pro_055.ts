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
 * ID: PRO_055
 * Name: Dinamik Kanban Kartı ve WIP Tampon Boyutlandırma
 */

export const InputSchema_PRO_055 = z.object({
  daily_demand: z.number(),
  wait_time: z.number(),
  process_time: z.number(),
  transport_time: z.number(),
  container_cap: z.number(),
  safety_factor: z.number(),
});

export type Input_PRO_055 = z.infer<typeof InputSchema_PRO_055>;

export interface Output_PRO_055 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_055(input: Input_PRO_055): Output_PRO_055 {
  const validData = InputSchema_PRO_055.parse(input);
  const { daily_demand, wait_time, process_time, transport_time, container_cap, safety_factor } = validData as any;
  
  const Lead_Time_Total = wait_time + process_time + transport_time;
  const Raw_Kanban_Count = (daily_demand * Lead_Time_Total * (1 + safety_factor)) / container_cap;
  const Kanban_Cards = CEILING(Raw_Kanban_Count);
  const Max_WIP_Units = Kanban_Cards * container_cap;
  const WIP_Days_Coverage = Max_WIP_Units / daily_demand;
  const Theoretical_Min_WIP = daily_demand * process_time;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (safety_factor > 0.3) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "TPS / Toyota Üretim Sistemi",
        message: "Sistem İhlali: Güvenlik faktörü (Tampon) 0.3'ün (%30) üzerinde seçilmiş. Bu durum 'Çekme (Pull)' sistemini bir 'İtme (Push)' ve yığın üretim sistemine dönüştürür. Hataları örtbas etmek yerine kök nedenleri çözerek faktörü %10'lara indirin."
      });
    }
  
  return {
    result: Theoretical_Min_WIP,
    smartWarnings
  };
}
