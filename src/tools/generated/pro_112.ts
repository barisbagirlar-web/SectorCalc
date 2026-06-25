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
 * ID: PRO_112
 * Name: Kaynak Isı Girdisi (Heat Input) ve Soğuma Hızı Kontrolü
 */

export const InputSchema_PRO_112 = z.object({
  arc_voltage: z.number(),
  arc_current: z.number(),
  travel_speed: z.number(),
  thermal_efficiency: z.number(),
  plate_thickness: z.number(),
  max_heat_input: z.number(),
});

export type Input_PRO_112 = z.infer<typeof InputSchema_PRO_112>;

export interface Output_PRO_112 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_112(input: Input_PRO_112): Output_PRO_112 {
  const validData = InputSchema_PRO_112.parse(input);
  const { arc_voltage, arc_current, travel_speed, thermal_efficiency, plate_thickness, max_heat_input } = validData as any;
  
  const Heat_Input_kJ_mm = (arc_voltage * arc_current * 60) / (travel_speed * 1000) * thermal_efficiency;
  const Cooling_Time_t8_5 = (Math.pow(plate_thickness, 2) * 45000) / (Heat_Input_kJ_mm * 1000);
  const Compliance_Gap = max_heat_input - Heat_Input_kJ_mm;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Heat_Input_kJ_mm > max_heat_input) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "AWS D1.1 / EN 1011",
        message: "Metalurjik Red: Hesaplanılan ısı girdisi, Kaynak Yöntem Şartnamesi (WPS) sınırını aşmaktadır. Isıdan Etkilenen Bölgede (HAZ) aşırı tane büyümesi (Grain Growth) yaşanacak ve malzemenin tokluğu (Toughness) sıfırlanacaktır. İlerleme hızını artırın veya akımı düşürün."
      });
    }
  
  return {
    result: Compliance_Gap,
    smartWarnings
  };
}
