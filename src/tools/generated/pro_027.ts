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
 * ID: PRO_027
 * Name: SMED Matrisi ve EOQ Envanter Optimizasyonu
 */

export const InputSchema_PRO_027 = z.object({
  internal_setup_min: z.number(),
  external_setup_min: z.number(),
  conversion_rate: z.number(),
  changeovers_yr: z.number(),
  machine_rate: z.number(),
  annual_demand: z.number(),
  holding_cost_unit: z.number(),
});

export type Input_PRO_027 = z.infer<typeof InputSchema_PRO_027>;

export interface Output_PRO_027 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_027(input: Input_PRO_027): Output_PRO_027 {
  const validData = InputSchema_PRO_027.parse(input);
  const { internal_setup_min, external_setup_min, conversion_rate, changeovers_yr, machine_rate, annual_demand, holding_cost_unit } = validData as any;
  
  const Target_Internal = internal_setup_min * (1 - (conversion_rate / 100));
  const Target_External = external_setup_min + (internal_setup_min * (conversion_rate / 100));
  const Time_Saved_Min = internal_setup_min - Target_Internal;
  const Current_Setup_Cost = (internal_setup_min / 60) * machine_rate;
  const New_Setup_Cost = (Target_Internal / 60) * machine_rate;
  const Annual_Setup_Savings = (Current_Setup_Cost - New_Setup_Cost) * changeovers_yr;
  const Current_EOQ = Math.sqrt((2 * annual_demand * Current_Setup_Cost) / holding_cost_unit);
  const New_EOQ = Math.sqrt((2 * annual_demand * New_Setup_Cost) / holding_cost_unit);
  const Inventory_Reduction_Value = ((Current_EOQ - New_EOQ) / 2) * holding_cost_unit;
  const Total_Financial_Benefit = Annual_Setup_Savings + Inventory_Reduction_Value;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Current_EOQ > (annual_demand / 12)) {
      smartWarnings.push({
        severity: "INFO",
        source: "Yalın Akış",
        message: "Bilgi: Yüksek kurulum maliyetleri nedeniyle mevcut parti büyüklüğünüz (EOQ) bir aylık talepten fazlasına denk geliyor (Yığın Üretim). SMED projesi sonrası düşen New_EOQ ile parçaları çok daha küçük partilerle (One-piece flow'a yakın) üreterek stoklarınızı nakde çevirebilirsiniz."
      });
    }
  
  return {
    result: Total_Financial_Benefit,
    smartWarnings
  };
}
