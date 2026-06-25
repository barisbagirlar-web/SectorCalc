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
 * ID: PRO_190
 * Name: Organik Rankine Çevrimi (ORC) Atık Isı Geri Kazanımı TCO ve Karbon Kredisi
 */

export const InputSchema_PRO_190 = z.object({
  exhaust_mass_flow: z.number(),
  exhaust_temp_in: z.number(),
  exhaust_temp_out: z.number(),
  orc_efficiency_pct: z.number(),
  op_hours_yr: z.number(),
  elec_rate: z.number(),
  carbon_credit_price: z.number(),
  orc_capex: z.number(),
});

export type Input_PRO_190 = z.infer<typeof InputSchema_PRO_190>;

export interface Output_PRO_190 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_190(input: Input_PRO_190): Output_PRO_190 {
  const validData = InputSchema_PRO_190.parse(input);
  const { exhaust_mass_flow, exhaust_temp_in, exhaust_temp_out, orc_efficiency_pct, op_hours_yr, elec_rate, carbon_credit_price, orc_capex } = validData as any;
  
  const Cp_Gas = 1.05;
  const Available_Heat_kW = exhaust_mass_flow * Cp_Gas * (exhaust_temp_in - exhaust_temp_out);
  const Net_Electricity_Generated_kW = Available_Heat_kW * (orc_efficiency_pct / 100);
  const Annual_Power_Savings_kWh = Net_Electricity_Generated_kW * op_hours_yr;
  const Annual_Power_Revenue_USD = annual_power_savings_kwh * elec_rate;
  const Annual_CO2_Avoided_Tons = (annual_power_savings_kwh * 0.45) / 1000;
  const Annual_Carbon_Revenue = Annual_CO2_Avoided_Tons * carbon_credit_price;
  const Total_Annual_Benefit = Annual_Power_Revenue_USD + Annual_Carbon_Revenue;
  const Payback_Months = (orc_capex / Total_Annual_Benefit) * 12;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (exhaust_temp_out < 120) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Endüstriyel Baca Gazı Çiğ Noktası (Dew Point)",
        message: "Asidik Yoğuşma Riski: Atık gaz çıkış sıcaklığı 120°C'nin altına düşürülmektedir. Gaz içindeki kükürt bileşikleri yoğuşarak sülfürik aside dönüşecek ve baca konstrüksiyonunu hızla çürüterek (Acid corrosion) tesisatı delecektir. Çıkış sıcaklığını yükseltin."
      });
    }
  
  return {
    result: Payback_Months,
    smartWarnings
  };
}
