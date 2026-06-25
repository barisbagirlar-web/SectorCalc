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
 * ID: PRO_118
 * Name: Şanzıman (Redüktör) Termal Kapasite Denge Analizi (AGMA)
 */

export const InputSchema_PRO_118 = z.object({
  input_power: z.number(),
  gear_efficiency: z.number(),
  surface_area: z.number(),
  ambient_temp: z.number(),
  max_oil_temp: z.number(),
  heat_transfer_coeff: z.number(),
});

export type Input_PRO_118 = z.infer<typeof InputSchema_PRO_118>;

export interface Output_PRO_118 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_118(input: Input_PRO_118): Output_PRO_118 {
  const validData = InputSchema_PRO_118.parse(input);
  const { input_power, gear_efficiency, surface_area, ambient_temp, max_oil_temp, heat_transfer_coeff } = validData as any;
  
  const Heat_Generated_kW = input_power * (1 - (gear_efficiency / 100));
  const Heat_Generated_W = Heat_Generated_kW * 1000;
  const Max_Heat_Dissipated_W = heat_transfer_coeff * surface_area * (max_oil_temp - ambient_temp);
  const Thermal_Balance_W = Max_Heat_Dissipated_W - Heat_Generated_W;
  const Expected_Oil_Temp = ambient_temp + (Heat_Generated_W / (heat_transfer_coeff * surface_area));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Expected_Oil_Temp > max_oil_temp) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "AGMA Termal Kriterleri",
        message: "Termal Kaçak (Sarma) Riski: Şanzıman yüzey alanı üzerinden atılan ısı, sürtünmeden doğan ısıyı karşılayamıyor. Redüktör yağ sıcaklığı limitleri aşacak, yağ filmi yırtılacak ve dişliler kaynaklanarak (Galling) kilitlenecektir. Harici bir eşanjör (Yağ Soğutucu) eklenmesi şarttır."
      });
    }
  
  return {
    result: Expected_Oil_Temp,
    smartWarnings
  };
}
