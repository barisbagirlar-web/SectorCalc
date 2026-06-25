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
 * ID: PRO_122
 * Name: Isı Eşanjörü Kirlenme (Fouling) ve Pompa Ceza Maliyeti
 */

export const InputSchema_PRO_122 = z.object({
  u_clean: z.number(),
  u_dirty: z.number(),
  area: z.number(),
  lmtd: z.number(),
  flow_rate: z.number(),
  dp_clean: z.number(),
  dp_dirty: z.number(),
  cleaning_cost: z.number(),
  pump_eff: z.number(),
  boiler_eff: z.number(),
  fuel_cost: z.number(),
  elec_rate: z.number(),
  op_hours: z.number(),
});

export type Input_PRO_122 = z.infer<typeof InputSchema_PRO_122>;

export interface Output_PRO_122 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_122(input: Input_PRO_122): Output_PRO_122 {
  const validData = InputSchema_PRO_122.parse(input);
  const { u_clean, u_dirty, area, lmtd, flow_rate, dp_clean, dp_dirty, cleaning_cost, pump_eff, boiler_eff, fuel_cost, elec_rate, op_hours } = validData as any;
  
  const R_fouling = (1 / u_dirty) - (1 / u_clean);
  const HeatLoss_kW = (area * (u_clean - u_dirty) * lmtd) / 1000;
  const AnnualEnergyPenalty_GJ = (HeatLoss_kW * op_hours * 3600) / 1000000;
  const Cost_ThermalEnergy = (AnnualEnergyPenalty_GJ * fuel_cost) / (boiler_eff / 100);
  const PumpPenalty_kW = ((dp_dirty - dp_clean) * 100000 * flow_rate) / ((pump_eff / 100) * 1000);
  const AnnualPumpCost = PumpPenalty_kW * op_hours * elec_rate;
  const TotalFoulingCost = Cost_ThermalEnergy + AnnualPumpCost;
  const CleaningROI = TotalFoulingCost / cleaning_cost;
  const OptimalCleaningInterval_Days = Math.sqrt(2 * cleaning_cost / (TotalFoulingCost / 365));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (CleaningROI < 1.0) {
      smartWarnings.push({
        severity: "INFO",
        source: "Bakım Ekonomisi",
        message: "Bilgi: Kirlenmenin yarattığı yıllık enerji (Isı + Pompa) kaybı, CIP temizlik maliyetinden daha düşüktür. Ekipman henüz ekonomik temizlik (Break-even) sınırına ulaşmamıştır."
      });
    }
  
  return {
    result: OptimalCleaningInterval_Days,
    smartWarnings
  };
}
