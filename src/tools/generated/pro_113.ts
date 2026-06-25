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
 * ID: PRO_113
 * Name: Lazer Kesim Odak (Spot) Çapı ve Enerji Yoğunluğu
 */

export const InputSchema_PRO_113 = z.object({
  laser_power: z.number(),
  wavelength: z.number(),
  beam_quality_m2: z.number(),
  focal_length: z.number(),
  input_beam_dia: z.number(),
  feed_rate: z.number(),
});

export type Input_PRO_113 = z.infer<typeof InputSchema_PRO_113>;

export interface Output_PRO_113 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_113(input: Input_PRO_113): Output_PRO_113 {
  const validData = InputSchema_PRO_113.parse(input);
  const { laser_power, wavelength, beam_quality_m2, focal_length, input_beam_dia, feed_rate } = validData as any;
  
  const Spot_Diameter_um = (4 * wavelength * focal_length * beam_quality_m2) / (Math.PI * input_beam_dia);
  const Spot_Area_cm2 = (Math.PI / 4) * Math.pow(Spot_Diameter_um / 10000, 2);
  const Power_Density_MW_cm2 = (laser_power / 1000000) / Spot_Area_cm2;
  const Specific_Energy_J_mm = laser_power / (feed_rate * 1000 / 60);
  const Rayleigh_Length_mm = (Math.PI * Math.pow(Spot_Diameter_um / 1000, 2)) / (4 * (wavelength / 1000) * beam_quality_m2);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Power_Density_MW_cm2 < 1.0) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Endüstriyel Lazer Fiziği",
        message: "Kesim Hatası İhbarı: Odak noktasındaki güç yoğunluğu (Power Density) 1 MW/cm²'nin altındadır. Çelik kesiminde ana malzemeyi buharlaştırmak (Keyhole/Kerf) yerine sadece eritecek ve parçanın altında devasa cüruf (Dross) sarkıtları oluşacaktır. Odağı küçültün."
      });
    }
  
  return {
    result: Rayleigh_Length_mm,
    smartWarnings
  };
}
