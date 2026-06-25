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
 * ID: PRO_171
 * Name: CNC Frezelemede Kesme Sıcaklığı ve Isıl Gerilme Analizi
 */

export const InputSchema_PRO_171 = z.object({
  cutting_speed_vc: z.number(),
  feed_per_tooth_fz: z.number(),
  depth_of_cut_ap: z.number(),
  specific_heat_capacity: z.number(),
  material_density: z.number(),
  thermal_conductivity: z.number(),
  tool_softening_temp: z.number(),
  ambient_temp: z.number(),
});

export type Input_PRO_171 = z.infer<typeof InputSchema_PRO_171>;

export interface Output_PRO_171 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_171(input: Input_PRO_171): Output_PRO_171 {
  const validData = InputSchema_PRO_171.parse(input);
  const { cutting_speed_vc, feed_per_tooth_fz, depth_of_cut_ap, specific_heat_capacity, material_density, thermal_conductivity, tool_softening_temp, ambient_temp } = validData as any;
  
  const V_m_s = cutting_speed_vc / 60;
  const Thermal_Diffusivity_alpha = thermal_conductivity / (material_density * specific_heat_capacity);
  const Peclet_Number_Pe = (V_m_s * feed_per_tooth_fz / 1000) / Thermal_Diffusivity_alpha;
  const Theoretical_Max_Temp_Rise = 1.2 * (specific_heat_capacity * 0.001) * Math.pow(Peclet_Number_Pe, 0.5);
  const Cutting_Tip_Temp = ambient_temp + (Theoretical_Max_Temp_Rise * (cutting_speed_vc / 100));
  const Thermal_Stress_MPa = 0.5 * 210000 * 12e-6 * (Cutting_Tip_Temp - ambient_temp);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Cutting_Tip_Temp > tool_softening_temp) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Sandvik Coromant Metalurji Kısıtları",
        message: "Kritik Takım Hasarı: Kesme bölgesinde oluşan anlık sıcaklık, kesici ucun veya kaplamanın (PVD/CVD) yumuşama sınırını aşmaktadır. Takım ucunda ani plastik deformasyon, aşınma ve kesici kenar yuvarlanması yaşanacaktır. Vc veya fz değerini düşürün."
      });
    }
  
  return {
    result: Thermal_Stress_MPa,
    smartWarnings
  };
}
