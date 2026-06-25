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
 * ID: PRO_152
 * Name: Plastik Enjeksiyon Kapama Kuvveti (Clamping Force) ve Soğuma Süresi
 */

export const InputSchema_PRO_152 = z.object({
  projected_area: z.number(),
  cavity_pressure: z.number(),
  wall_thickness: z.number(),
  melt_temp: z.number(),
  mold_temp: z.number(),
  ejection_temp: z.number(),
  thermal_diffusivity: z.number(),
  machine_clamp_limit: z.number(),
});

export type Input_PRO_152 = z.infer<typeof InputSchema_PRO_152>;

export interface Output_PRO_152 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_152(input: Input_PRO_152): Output_PRO_152 {
  const validData = InputSchema_PRO_152.parse(input);
  const { projected_area, cavity_pressure, wall_thickness, melt_temp, mold_temp, ejection_temp, thermal_diffusivity, machine_clamp_limit } = validData as any;
  
  const Clamping_Force_N = (projected_area / 10000) * (cavity_pressure * 100000);
  const Clamping_Force_Ton = Clamping_Force_N / 9810;
  const Required_Machine_Ton = Clamping_Force_Ton * 1.20;
  const Cooling_Time_sec = (Math.pow(wall_thickness, 2) / (Math.PI * Math.PI * thermal_diffusivity)) * LOG((4 / Math.PI) * ((melt_temp - mold_temp) / (ejection_temp - mold_temp)));
  const Capacity_Utilization_Pct = (Required_Machine_Ton / machine_clamp_limit) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Required_Machine_Ton > machine_clamp_limit) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ISO 20430 Enjeksiyon Makineleri",
        message: "Çapak (Flash) Riski: Gerekli kapama kuvveti (Güvenlik payı dahil), makinenizin kapasitesini aşmaktadır. Enjeksiyon esnasında kalıp aralanacak ve yüksek miktarda çapak oluşacaktır. Daha düşük viskoziteli bir malzeme seçin veya basıncı düşürün."
      });
    }
  
  return {
    result: Capacity_Utilization_Pct,
    smartWarnings
  };
}
