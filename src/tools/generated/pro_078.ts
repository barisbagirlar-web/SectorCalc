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
 * ID: PRO_078
 * Name: Lojistik Rota Sapması (Drift) ve Yakıt İsrafı
 */

export const InputSchema_PRO_078 = z.object({
  planned_dist: z.number(),
  actual_dist: z.number(),
  avg_speed: z.number(),
  fuel_consumption: z.number(),
  fuel_price: z.number(),
  idle_time_mins: z.number(),
  idle_fuel_rate: z.number(),
  driver_wage: z.number(),
  missed_drops: z.number(),
  cost_per_missed_drop: z.number(),
});

export type Input_PRO_078 = z.infer<typeof InputSchema_PRO_078>;

export interface Output_PRO_078 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_078(input: Input_PRO_078): Output_PRO_078 {
  const validData = InputSchema_PRO_078.parse(input);
  const { planned_dist, actual_dist, avg_speed, fuel_consumption, fuel_price, idle_time_mins, idle_fuel_rate, driver_wage, missed_drops, cost_per_missed_drop } = validData as any;
  
  const Route_Drift_km = Math.max(0, actual_dist - planned_dist);
  const Fuel_Waste_Liters = (Route_Drift_km / 100) * fuel_consumption;
  const Fuel_Waste_Cost = Fuel_Waste_Liters * fuel_price;
  const Time_Waste_Hrs = Route_Drift_km / avg_speed;
  const Driver_Waste_Cost = Time_Waste_Hrs * driver_wage;
  const Idle_Fuel_Cost = (idle_time_mins / 60) * idle_fuel_rate * fuel_price;
  const Missed_Drop_Cost = missed_drops * cost_per_missed_drop;
  const Total_Route_Loss = Fuel_Waste_Cost + Driver_Waste_Cost + Idle_Fuel_Cost + Missed_Drop_Cost;
  const Route_Adherence_Pct = (planned_dist / actual_dist) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Route_Drift_km > (planned_dist * 0.10)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Telematik Sistem Analizi",
        message: "Operasyonel İhbar: Rota sapması %10'un üzerindedir. Sürücüler yetkisiz duraklamalar yapıyor, trafik/yol çalışması analizleri TMS (Transport Management System) yazılımına doğru aktarılmıyor."
      });
    }
  
  return {
    result: Route_Adherence_Pct,
    smartWarnings
  };
}
