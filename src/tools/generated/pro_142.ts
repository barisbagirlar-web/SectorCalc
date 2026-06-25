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
 * ID: PRO_142
 * Name: Kaynak Soğuma Süresi (t8/5) ve Martenzit Kırılganlık Sınırı
 */

export const InputSchema_PRO_142 = z.object({
  heat_input: z.number(),
  thickness: z.number(),
  preheat_temp: z.number(),
  joint_factor: z.number(),
  critical_t85_min: z.number(),
});

export type Input_PRO_142 = z.infer<typeof InputSchema_PRO_142>;

export interface Output_PRO_142 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_142(input: Input_PRO_142): Output_PRO_142 {
  const validData = InputSchema_PRO_142.parse(input);
  const { heat_input, thickness, preheat_temp, joint_factor, critical_t85_min } = validData as any;
  
  const Transition_Thickness_d_trans = Math.sqrt((heat_input * 1000 / 2) * (1 / (500 - preheat_temp) + 1 / (800 - preheat_temp)));
  const Cooling_Type = ((thickness > Transition_Thickness_d_trans) ? ('3D_Soğuma') : ('2D_Soğuma'));
  const t85_3D = (heat_input * 1000 * joint_factor / (2 * Math.PI * 0.04)) * (1 / (500 - preheat_temp) - 1 / (800 - preheat_temp));
  const t85_2D = (Math.pow(heat_input * 1000 * joint_factor, 2) / (4 * Math.PI * 0.04 * 0.000012 * Math.pow(thickness, 2))) * (1 / Math.pow(500 - preheat_temp, 2) - 1 / Math.pow(800 - preheat_temp, 2));
  const Actual_t85 = ((Cooling_Type == '3D_Soğuma') ? (t85_3D) : (t85_2D));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Actual_t85 < critical_t85_min) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "EN 1011-2 Kaynak Metalurjisi",
        message: "Kritik Çatlak (Martenzit) Riski: Hesaplanılan soğuma süresi (t8/5) çok kısadır. Kaynak bölgesi 800°C'den 500°C'ye çok hızlı düşmekte ve su verilmiş gibi sert, kırılgan (Martenzitik) bir yapıya dönüşmektedir. Isı girdisini artırın veya ön ısıtma (T0) sıcaklığını yükseltin."
      });
    }
  
  return {
    result: Actual_t85,
    smartWarnings
  };
}
