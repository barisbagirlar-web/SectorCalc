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
 * ID: PRO_123
 * Name: ISO 50001 Enerji Referans Çizgisi (EnB) Modeli
 */

export const InputSchema_PRO_123 = z.object({
  r_squared: z.number(),
  p_value: z.number(),
  actual_energy: z.number(),
  modeled_energy: z.number(),
  reduction_target: z.number(),
  energy_tariff: z.number(),
});

export type Input_PRO_123 = z.infer<typeof InputSchema_PRO_123>;

export interface Output_PRO_123 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_123(input: Input_PRO_123): Output_PRO_123 {
  const validData = InputSchema_PRO_123.parse(input);
  const { r_squared, p_value, actual_energy, modeled_energy, reduction_target, energy_tariff } = validData as any;
  
  const EnPI_Ratio = actual_energy / modeled_energy;
  const CUSUM_Residual = modeled_energy - actual_energy;
  const Financial_Savings = CUSUM_Residual * energy_tariff;
  const Target_Consumption = modeled_energy * (1 - (reduction_target / 100));
  const Target_Gap = actual_energy - Target_Consumption;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (EnPI_Ratio > 1.0) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ISO 50001 EnPI Kontrolü",
        message: "Performans Sapması: Gerçekleşen tüketim, üretim hacmi ve hava sıcaklığı (HDD/CDD) ile normalize edilmiş model değerini aşmaktadır. Enerji performansınız (EnPI) kötüleşmiştir; hatta kaçak veya ekipman arızası arayın."
      });
    }
  
  return {
    result: Target_Gap,
    smartWarnings
  };
}
