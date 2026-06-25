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
 * ID: PRO_025
 * Name: Endüstriyel Çatı Yapısal Yük ve Maliyet Hesaplayıcı
 */

export const InputSchema_PRO_025 = z.object({
  bldg_length: z.number(),
  bldg_width: z.number(),
  roof_pitch_deg: z.number(),
  overhang: z.number(),
  ground_snow_load: z.number(),
  exposure_factor: z.number(),
  thermal_factor: z.number(),
  material_cost_m2: z.number(),
  waste_pct: z.number(),
});

export type Input_PRO_025 = z.infer<typeof InputSchema_PRO_025>;

export interface Output_PRO_025 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_025(input: Input_PRO_025): Output_PRO_025 {
  const validData = InputSchema_PRO_025.parse(input);
  const { bldg_length, bldg_width, roof_pitch_deg, overhang, ground_snow_load, exposure_factor, thermal_factor, material_cost_m2, waste_pct } = validData as any;
  
  const Pitch_Rad = (roof_pitch_deg * Math.PI) / 180;
  const Slant_Width = (bldg_width / 2) / COS(Pitch_Rad);
  const Gable_Area = 2 * Slant_Width * bldg_length;
  const Perimeter = (2 * bldg_length) + (2 * bldg_width);
  const Overhang_Area = Perimeter * overhang;
  const Total_Roof_Area = Gable_Area + Overhang_Area;
  const Material_Area = Total_Roof_Area * (1 + (waste_pct / 100));
  const Total_Material_Cost = Material_Area * material_cost_m2;
  const Roof_Snow_Load = ground_snow_load * exposure_factor * thermal_factor;
  const Total_Snow_Weight_kN = (bldg_length * bldg_width) * Roof_Snow_Load;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Total_Snow_Weight_kN > (bldg_length * bldg_width * 2)) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ASCE 7 Yapısal Yük Standartları",
        message: "Kritik Statik Risk: Çatı üzerinde birikecek tasarım kar yükü (Roof Snow Load) çok şiddetlidir. Eğer çatı konstrüksiyonu (Aşık/Makas aralıkları) buna göre tasarlanmadıysa lokal çökmeler KESİNLİKLE yaşanacaktır. Aşık profillerini (Z/C Purlins) güçlendirin."
      });
    }
  
  return {
    result: Total_Snow_Weight_kN,
    smartWarnings
  };
}
