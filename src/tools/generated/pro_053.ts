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
 * ID: PRO_053
 * Name: Güneş Tüpü (Daylight Tube) Aydınlatma ve TCO
 */

export const InputSchema_PRO_053 = z.object({
  room_area: z.number(),
  target_lux: z.number(),
  tube_output_lm: z.number(),
  tunnel_len: z.number(),
  roof_pitch: z.number(),
  current_lighting_kw: z.number(),
  daylight_hours: z.number(),
  elec_rate: z.number(),
  installed_cost_per_tube: z.number(),
});

export type Input_PRO_053 = z.infer<typeof InputSchema_PRO_053>;

export interface Output_PRO_053 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_053(input: Input_PRO_053): Output_PRO_053 {
  const validData = InputSchema_PRO_053.parse(input);
  const { room_area, target_lux, tube_output_lm, tunnel_len, roof_pitch, current_lighting_kw, daylight_hours, elec_rate, installed_cost_per_tube } = validData as any;
  
  const Pitch_Rad = (roof_pitch * Math.PI) / 180;
  const Tunnel_Efficiency = Math.pow(0.99, tunnel_len * 10);
  const Actual_Lumen_Per_Tube = tube_output_lm * COS(Pitch_Rad) * Tunnel_Efficiency;
  const Required_Total_Lumen = room_area * target_lux;
  const Required_Tubes = CEILING(Required_Total_Lumen / Actual_Lumen_Per_Tube);
  const Annual_Savings_kWh = current_lighting_kw * daylight_hours * 365;
  const Annual_Savings_USD = Annual_Savings_kWh * elec_rate;
  const Total_Investment = Required_Tubes * installed_cost_per_tube;
  const Payback_Years = Total_Investment / Annual_Savings_USD;
  const CO2_Reduction_Ton = (Annual_Savings_kWh * 0.5) / 1000;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Payback_Years > 15) {
      smartWarnings.push({
        severity: "INFO",
        source: "Yeşil Bina / LEED Yatırımları",
        message: "Finansal Bilgi: Amortisman süresi 15 yılı aşmaktadır. Projenin finansal getirisi düşüktür ancak LEED/BREEAM sertifikasyonu veya çalışan ergonomisi hedefleniyorsa TCO dışı (Soft) faydalarla değerlendirilmelidir."
      });
    }
  
  return {
    result: CO2_Reduction_Ton,
    smartWarnings
  };
}
