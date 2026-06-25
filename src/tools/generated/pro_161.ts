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
 * ID: PRO_161
 * Name: Plastik Enjeksiyon Kalıp İçi Gaz Sıkışması ve Havandırma (Venting) Hesabı
 */

export const InputSchema_PRO_161 = z.object({
  cavity_volume_cm3: z.number(),
  injection_time_sec: z.number(),
  melt_temp_k: z.number(),
  vent_depth_um: z.number(),
  vent_width_mm: z.number(),
  polymer_type: z.enum(["PP/PE (Max 20um)", "ABS/PS (Max 40um)", "PC/PA (Max 50um)"]),
  max_back_pressure: z.number(),
});

export type Input_PRO_161 = z.infer<typeof InputSchema_PRO_161>;

export interface Output_PRO_161 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_161(input: Input_PRO_161): Output_PRO_161 {
  const validData = InputSchema_PRO_161.parse(input);
  const { cavity_volume_cm3, injection_time_sec, melt_temp_k, vent_depth_um, vent_width_mm, polymer_type, max_back_pressure } = validData as any;
  
  const Air_Flow_Rate_cm3_s = cavity_volume_cm3 / injection_time_sec;
  const Vent_Area_mm2 = (vent_depth_um / 1000) * vent_width_mm;
  const Gas_Velocity_m_s = (Air_Flow_Rate_cm3_s * 100) / (Vent_Area_mm2 * 1000);
  const Gas_Density = 1.29 * (melt_temp_k / 273.15);
  const Dynamic_Pressure_Drop_Bar = (0.5 * Gas_Density * Math.pow(Gas_Velocity_m_s, 2)) / 100000;
  const Vent_Limit_Um = ((polymer_type == 'PP/PE (Max 20um)') ? (20) : (((polymer_type  === 'ABS/PS (Max 40um)') ? (40) : (50))));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (vent_depth_um > Vent_Limit_Um) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "SPI Kalıp Tasarım Kılavuzu",
        message: "Çapak (Flash) Riski: Seçilen havalandırma kanalı derinliği polimerin viskozite sınırını aşmaktadır. Eriyik plastik gaz kanallarına sızacak ve parçada kalıcı temizleme maliyeti yaratacak çapak hatasına yol açacaktır."
      });
    }

    if (Dynamic_Pressure_Drop_Bar > max_back_pressure) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Kalıp İçi Gaz Dinamiği",
        message: "Dizel Etkisi (Burn Mark) Uyarısı: Yetersiz havalandırma kesiti nedeniyle kalıp içi hava sıkışmakta ve karşı basınç oluşturmaktadır. Sıkışan gaz adiyabatik olarak ısınarak plastikte yanma izlerine (Dieseling effect) ve eksik doluma (Short shot) neden olacaktır."
      });
    }
  
  return {
    result: Vent_Limit_Um,
    smartWarnings
  };
}
