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
 * ID: PRO_072
 * Name: Kompresör Hava Kaçağı Enerji İsrafı (Sonik Akış - ISO 4414)
 */

export const InputSchema_PRO_072 = z.object({
  leak_diameter: z.number(),
  leak_count: z.number(),
  gauge_pressure: z.number(),
  ambient_temp: z.number(),
  specific_power: z.number(),
  op_hours: z.number(),
  elec_rate: z.number(),
  cd_factor: z.number(),
});

export type Input_PRO_072 = z.infer<typeof InputSchema_PRO_072>;

export interface Output_PRO_072 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_072(input: Input_PRO_072): Output_PRO_072 {
  const validData = InputSchema_PRO_072.parse(input);
  const { leak_diameter, leak_count, gauge_pressure, ambient_temp, specific_power, op_hours, elec_rate, cd_factor } = validData as any;
  
  const T_abs_K = ambient_temp + 273.15;
  const Air_Density = (101325) / (287 * T_abs_K);
  const Leak_Flow_L_s_per_hole = cd_factor * (Math.PI / 4) * Math.pow(leak_diameter / 1000, 2) * Math.sqrt(2 * gauge_pressure * 100000 / Air_Density) * 1000;
  const Total_Leak_Flow_m3_min = (Leak_Flow_L_s_per_hole * 60 / 1000) * leak_count;
  const Leak_Power_kW = Total_Leak_Flow_m3_min * specific_power;
  const Annual_Energy_Waste_kWh = Leak_Power_kW * op_hours;
  const Annual_Waste_Cost_USD = Annual_Energy_Waste_kWh * elec_rate;
  const CO2_Emissions_Ton = (Annual_Energy_Waste_kWh * 0.45) / 1000;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (gauge_pressure >= 6) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Akışkanlar Dinamiği",
        message: "Boğulmuş Akış (Choked Flow) İhbarı: Hat basıncı kritik sınırı aşmıştır. Havanın sızıntı noktasından çıkış hızı SES HIZINA ulaşır (Mach 1). Bu noktadan sonra kayıplar maksimum seviyededir; kompresörünüz havayı dışarı atmak için boşa çalışmaktadır."
      });
    }
  
  return {
    result: CO2_Emissions_Ton,
    smartWarnings
  };
}
