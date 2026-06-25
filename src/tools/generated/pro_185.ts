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
 * ID: PRO_185
 * Name: Plastik Enjeksiyon Yolluk Kesme Hızı (Shear Rate) ve Basınç Düşümü
 */

export const InputSchema_PRO_185 = z.object({
  runner_diameter_mm: z.number(),
  flow_rate_cm3_s: z.number(),
  melt_viscosity_pas: z.number(),
  runner_length_mm: z.number(),
});

export type Input_PRO_185 = z.infer<typeof InputSchema_PRO_185>;

export interface Output_PRO_185 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_185(input: Input_PRO_185): Output_PRO_185 {
  const validData = InputSchema_PRO_185.parse(input);
  const { runner_diameter_mm, flow_rate_cm3_s, melt_viscosity_pas, runner_length_mm } = validData as any;
  
  const R_m = (runner_diameter_mm / 2) / 1000;
  const Q_m3_s = flow_rate_cm3_s / 1000000;
  const Shear_Rate_1_s = (4 * Q_m3_s) / (Math.PI * Math.pow(R_m, 3));
  const L_m = runner_length_mm / 1000;
  const Pressure_Drop_Pa = (8 * melt_viscosity_pas * L_m * Q_m3_s) / (Math.PI * Math.pow(R_m, 4));
  const Pressure_Drop_Bar = Pressure_Drop_Pa / 100000;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Shear_Rate_1_s > 10000) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Moldflow Polimer Reolojisi Standartları",
        message: "Polimer Degradasyonu Riski: Kesme hızı (Shear Rate) 10.000 1/s kritik eşiğini aşmıştır. Aşırı sürtünme gerilmesi polimer zincirlerini kıracak (Isısal bozunma), parçada renk değişimi, kırılganlık ve mukavemet kaybı yaratacaktır. Yolluk çapını büyütün."
      });
    }
  
  return {
    result: Pressure_Drop_Bar,
    smartWarnings
  };
}
