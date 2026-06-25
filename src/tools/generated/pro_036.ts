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
 * ID: PRO_036
 * Name: İleri Stokastik EOQ ve Güvenlik Stoğu Optimizasyonu
 */

export const InputSchema_PRO_036 = z.object({
  annual_demand: z.number(),
  order_cost: z.number(),
  holding_cost_unit: z.number(),
  lead_time_days: z.number(),
  std_dev_demand_daily: z.number(),
  std_dev_lt_days: z.number(),
  service_level_z: z.number(),
});

export type Input_PRO_036 = z.infer<typeof InputSchema_PRO_036>;

export interface Output_PRO_036 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_036(input: Input_PRO_036): Output_PRO_036 {
  const validData = InputSchema_PRO_036.parse(input);
  const { annual_demand, order_cost, holding_cost_unit, lead_time_days, std_dev_demand_daily, std_dev_lt_days, service_level_z } = validData as any;
  
  const Daily_Demand = annual_demand / 365;
  const Classic_EOQ = Math.sqrt((2 * annual_demand * order_cost) / holding_cost_unit);
  const LeadTime_Demand_Var = (lead_time_days * Math.pow(std_dev_demand_daily, 2)) + (Math.pow(Daily_Demand, 2) * Math.pow(std_dev_lt_days, 2));
  const Safety_Stock = service_level_z * Math.sqrt(LeadTime_Demand_Var);
  const Reorder_Point_ROP = (Daily_Demand * lead_time_days) + Safety_Stock;
  const Avg_Inventory = (Classic_EOQ / 2) + Safety_Stock;
  const Total_Inventory_Cost = (annual_demand / Classic_EOQ) * order_cost + (Avg_Inventory * holding_cost_unit);
  const Inventory_Turnover = annual_demand / Avg_Inventory;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (service_level_z > 3.0) {
      smartWarnings.push({
        severity: "INFO",
        source: "Envanter Politası",
        message: "Bilgi: Z-Skoru 3.0'ın (%99.87 Hizmet Seviyesi) üzerindedir. Stoksuz kalma riskini sıfıra indirmek için katlandığınız güvenlik stoğu taşıma maliyeti (Holding Cost) kârlılığınızı aşındıracaktır. A/B/C analizine göre sadece A sınıfı ürünlerde bu seviyeyi kullanın."
      });
    }
  
  return {
    result: Inventory_Turnover,
    smartWarnings
  };
}
