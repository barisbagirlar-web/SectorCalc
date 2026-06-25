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
 * ID: PRO_175
 * Name: LCOE Bazlı Endüstriyel Enerji Depolama (BESS) Maliyet Projeksiyonu
 */

export const InputSchema_PRO_175 = z.object({
  bess_capex: z.number(),
  annual_opex: z.number(),
  battery_capacity_mwh: z.number(),
  dod_pct: z.number(),
  round_trip_eff_pct: z.number(),
  annual_cycles: z.number(),
  charging_cost_mwh: z.number(),
  battery_life_yrs: z.number(),
  wacc: z.number(),
});

export type Input_PRO_175 = z.infer<typeof InputSchema_PRO_175>;

export interface Output_PRO_175 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_175(input: Input_PRO_175): Output_PRO_175 {
  const validData = InputSchema_PRO_175.parse(input);
  const { bess_capex, annual_opex, battery_capacity_mwh, dod_pct, round_trip_eff_pct, annual_cycles, charging_cost_mwh, battery_life_yrs, wacc } = validData as any;
  
  const Annual_Discharged_Energy_MWh = battery_capacity_mwh * (dod_pct / 100) * annual_cycles;
  const Annual_Charged_Energy_MWh = Annual_Discharged_Energy_MWh / (round_trip_eff_pct / 100);
  const Annual_Charging_Cost_Total = Annual_Charged_Energy_MWh * charging_cost_mwh;
  const Total_Annual_Cost_t = annual_opex + Annual_Charging_Cost_Total;
  const Discounted_Costs_Sum = bess_capex + Array.from({length: life}, (_, i) => { const t = i + 1; return Total_Annual_Cost_t / Math.pow(1 + (wacc/100), t); }).reduce((a,b)=>a+b, 0);
  const Discounted_Energy_Sum = Array.from({length: life}, (_, i) => { const t = i + 1; return Annual_Discharged_Energy_MWh / Math.pow(1 + (wacc/100), t); }).reduce((a,b)=>a+b, 0);
  const LCOE_Storage_Per_MWh = Discounted_Costs_Sum / Discounted_Energy_Sum;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (LCOE_Storage_Per_MWh > 150) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Enerji Ekonomisi Enstitüsü",
        message: "Fizibilite Riski: Depolanan enerjinin seviyelendirilmiş maliyeti (LCOE) 150 USD/MWh üzerindedir. Şebeke pik fiyat arbitraj farkı bu maliyetin altında kalıyorsa proje zarar yazacaktır. DoD oranını veya şarj elektrik tarifesini optimize edin."
      });
    }
  
  return {
    result: LCOE_Storage_Per_MWh,
    smartWarnings
  };
}
