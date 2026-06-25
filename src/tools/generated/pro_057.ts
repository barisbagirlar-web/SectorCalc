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
 * ID: PRO_057
 * Name: Milk Run Araç Rotalama (VRP) Lojistik Optimizasyonu
 */

export const InputSchema_PRO_057 = z.object({
  current_dist: z.number(),
  optimized_dist: z.number(),
  avg_speed: z.number(),
  fuel_consumption: z.number(),
  fuel_price: z.number(),
  driver_rate: z.number(),
  stops_count: z.number(),
  stop_time_min: z.number(),
});

export type Input_PRO_057 = z.infer<typeof InputSchema_PRO_057>;

export interface Output_PRO_057 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_057(input: Input_PRO_057): Output_PRO_057 {
  const validData = InputSchema_PRO_057.parse(input);
  const { current_dist, optimized_dist, avg_speed, fuel_consumption, fuel_price, driver_rate, stops_count, stop_time_min } = validData as any;
  
  const Time_Current = (current_dist / avg_speed) + ((stops_count * stop_time_min) / 60);
  const Time_Optimized = (optimized_dist / avg_speed) + ((stops_count * stop_time_min) / 60);
  const FuelCost_Current = current_dist * (fuel_consumption / 100) * fuel_price;
  const FuelCost_Optimized = optimized_dist * (fuel_consumption / 100) * fuel_price;
  const DriverCost_Current = Time_Current * driver_rate;
  const DriverCost_Optimized = Time_Optimized * driver_rate;
  const TotalCost_Current = FuelCost_Current + DriverCost_Current;
  const TotalCost_Optimized = FuelCost_Optimized + DriverCost_Optimized;
  const Net_Savings_Per_Run = TotalCost_Current - TotalCost_Optimized;
  const Savings_Pct = (Net_Savings_Per_Run / TotalCost_Current) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Savings_Pct < 5) {
      smartWarnings.push({
        severity: "INFO",
        source: "Araç Rotalama Sezgiselleri",
        message: "Bilgi: Yeni rota planı %5'ten daha az tasarruf sağlıyor. Yeni rotanın getireceği operasyonel değişim karmaşası (Sürücü alışkanlıkları vb.), elde edilecek ufak finansal tasarrufa değmeyebilir."
      });
    }
  
  return {
    result: Savings_Pct,
    smartWarnings
  };
}
