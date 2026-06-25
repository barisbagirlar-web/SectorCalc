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
 * ID: PRO_104
 * Name: Yalın Üretim MUDA (Yedi İsraf) Maliyet Hacim Algoritması
 */

export const InputSchema_PRO_104 = z.object({
  overproduction_units: z.number(),
  waiting_hours: z.number(),
  transport_distance_m: z.number(),
  transport_cost_m: z.number(),
  overprocessing_hours: z.number(),
  excess_inventory_value: z.number(),
  holding_rate: z.number(),
  motion_hours: z.number(),
  defect_units: z.number(),
  rework_cost_per_unit: z.number(),
  unit_margin: z.number(),
  labor_rate: z.number(),
  machine_rate: z.number(),
});

export type Input_PRO_104 = z.infer<typeof InputSchema_PRO_104>;

export interface Output_PRO_104 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_104(input: Input_PRO_104): Output_PRO_104 {
  const validData = InputSchema_PRO_104.parse(input);
  const { overproduction_units, waiting_hours, transport_distance_m, transport_cost_m, overprocessing_hours, excess_inventory_value, holding_rate, motion_hours, defect_units, rework_cost_per_unit, unit_margin, labor_rate, machine_rate } = validData as any;
  
  const Cost_Overproduction = overproduction_units * (rework_cost_per_unit + unit_margin);
  const Cost_Waiting = waiting_hours * (labor_rate + machine_rate);
  const Cost_Transport = transport_distance_m * transport_cost_m;
  const Cost_Overprocessing = overprocessing_hours * (labor_rate + machine_rate);
  const Cost_Inventory = excess_inventory_value * (holding_rate / 100);
  const Cost_Motion = motion_hours * labor_rate;
  const Cost_Defects = defect_units * (rework_cost_per_unit + unit_margin);
  const Total_Muda_Cost = Cost_Overproduction + Cost_Waiting + Cost_Transport + Cost_Overprocessing + Cost_Inventory + Cost_Motion + Cost_Defects;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Cost_Overproduction > (Total_Muda_Cost * 0.3)) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "TPS / Taiichi Ohno",
        message: "Ana Kök Neden: 'Aşırı Üretim' israfı toplam israfınızın %30'undan fazlasını yutmaktadır. Toyota Sistemine göre bu 'İsrafların Anasıdır'; çünkü fazla üretmek envanteri şişirir, gereksiz taşımayı tetikler ve hataları gizler. Kanban (Çekme) sistemine geçin."
      });
    }
  
  return {
    result: Total_Muda_Cost,
    smartWarnings
  };
}
