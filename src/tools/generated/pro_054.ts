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
 * ID: PRO_054
 * Name: EPQ (Ekonomik Üretim Miktarı) ve Max. Envanter
 */

export const InputSchema_PRO_054 = z.object({
  annual_demand: z.number(),
  daily_production: z.number(),
  daily_demand: z.number(),
  setup_cost: z.number(),
  holding_cost: z.number(),
});

export type Input_PRO_054 = z.infer<typeof InputSchema_PRO_054>;

export interface Output_PRO_054 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_054(input: Input_PRO_054): Output_PRO_054 {
  const validData = InputSchema_PRO_054.parse(input);
  const { annual_demand, daily_production, daily_demand, setup_cost, holding_cost } = validData as any;
  
  const EPQ = Math.sqrt((2 * annual_demand * setup_cost) / (holding_cost * (1 - (daily_demand / daily_production))));
  const Max_Inventory = EPQ * (1 - (daily_demand / daily_production));
  const Avg_Inventory = Max_Inventory / 2;
  const Production_Run_Time_Days = EPQ / daily_production;
  const Cycle_Time_Days = EPQ / daily_demand;
  const Annual_Setups = annual_demand / EPQ;
  const Annual_Setup_Cost = Annual_Setups * setup_cost;
  const Annual_Holding_Cost = Avg_Inventory * holding_cost;
  const Total_Inventory_Cost = Annual_Setup_Cost + Annual_Holding_Cost;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Production_Run_Time_Days > (Cycle_Time_Days * 0.8)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Makine Kapasite Planlama",
        message: "Uyarı: Üretim serisi süresi, çevrim süresinin %80'ini aşıyor. Makine neredeyse tamamen bu ürüne bağlanmış durumda. Diğer ürünler için kapasite darboğazı (Bottleneck) yaşanma riski çok yüksektir."
      });
    }
  
  return {
    result: Total_Inventory_Cost,
    smartWarnings
  };
}
