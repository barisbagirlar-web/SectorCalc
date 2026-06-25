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
 * ID: PRO_038
 * Name: Fabrika Yerleşim Mesafe ve Tıkanıklık Maliyeti
 */

export const InputSchema_PRO_038 = z.object({
  total_flow_volume: z.number(),
  avg_distance_m: z.number(),
  unit_move_cost: z.number(),
  cross_flow_volume: z.number(),
  aisle_capacity: z.number(),
});

export type Input_PRO_038 = z.infer<typeof InputSchema_PRO_038>;

export interface Output_PRO_038 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_038(input: Input_PRO_038): Output_PRO_038 {
  const validData = InputSchema_PRO_038.parse(input);
  const { total_flow_volume, avg_distance_m, unit_move_cost, cross_flow_volume, aisle_capacity } = validData as any;
  
  const Base_Handling_Cost = total_flow_volume * avg_distance_m * unit_move_cost;
  const Congestion_Factor = 1 + (cross_flow_volume / Math.max(1, (aisle_capacity - cross_flow_volume)));
  const Total_Material_Handling_Cost = Base_Handling_Cost * Congestion_Factor;
  const Congestion_Penalty_Cost = Total_Material_Handling_Cost - Base_Handling_Cost;
  const Aisle_Utilization = (cross_flow_volume / aisle_capacity) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Congestion_Factor > 1.5) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Tesis Yerleşim Optimizasyonu",
        message: "Uyarı: Kesişen forklift/AGV trafik rotaları nedeniyle koridorda oluşan tıkanıklık (Congestion), standart taşıma maliyetlerinizi %50'den fazla artırıyor. Hücresel üretim (Cellular Layout) sistemine geçerek çapraz akışları izole edin."
      });
    }
  
  return {
    result: Aisle_Utilization,
    smartWarnings
  };
}
