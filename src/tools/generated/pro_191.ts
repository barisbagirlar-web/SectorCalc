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
 * ID: PRO_191
 * Name: Sandvik Uyumlu Maksimum Talaş Kalınlığı (hex) ve Kienzle Kuvvet Dengesi
 */

export const InputSchema_PRO_191 = z.object({
  tool_diameter_dc: z.number(),
  radial_cut_ae: z.number(),
  feed_per_tooth_fz: z.number(),
  kc11_base_force: z.number(),
  mc_chip_exponent: z.number(),
  axial_cut_ap: z.number(),
  spindle_rpm: z.number(),
  flutes_z: z.number(),
});

export type Input_PRO_191 = z.infer<typeof InputSchema_PRO_191>;

export interface Output_PRO_191 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_191(input: Input_PRO_191): Output_PRO_191 {
  const validData = InputSchema_PRO_191.parse(input);
  const { tool_diameter_dc, radial_cut_ae, feed_per_tooth_fz, kc11_base_force, mc_chip_exponent, axial_cut_ap, spindle_rpm, flutes_z } = validData as any;
  
  const Engagement_Ratio = radial_cut_ae / tool_diameter_dc;
  const Max_Chip_Thickness_hex = fz_per_tooth * Math.sqrt(radial_cut_ae / tool_diameter_dc);
  const Kienzle_Kc = kc11_base_force / Math.pow(Max_Chip_Thickness_hex, mc_chip_exponent);
  const Tangential_Force_Fc_N = Kienzle_Kc * axial_cut_ap * feed_per_tooth_fz;
  const Torque_Mc_Nm = (Tangential_Force_Fc_N * tool_diameter_dc) / 2000;
  const Power_Pc_kW = (Tangential_Force_Fc_N * (Math.PI * tool_diameter_dc * spindle_rpm / 60000)) / 1000;
  const Table_Feed_Vf = feed_per_tooth_fz * flutes_z * spindle_rpm;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Max_Chip_Thickness_hex < 0.02) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Sandvik Coromant Talaş Akademisi",
        message: "Kritik Sürtünme Riski: Hesaplanan maksimum talaş kalınlığı (hex) 0.02 mm altındadır. Takım malzemeyi kesmemekte, ezerek sürtünmektedir. Kesici kenarda aşırı ısı birikmesi, iş sertleşmesi ve anlık uç kırılması (Chipping) yaşanacaktır. Diş başına ilerlemeyi (fz) artırın."
      });
    }
  
  return {
    result: Table_Feed_Vf,
    smartWarnings
  };
}
