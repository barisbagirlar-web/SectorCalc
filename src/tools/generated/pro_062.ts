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
 * ID: PRO_062
 * Name: Dişli ve Kayış-Kasnak Güç Aktarım Dinamikleri
 */

export const InputSchema_PRO_062 = z.object({
  power_kw: z.number(),
  rpm_drive: z.number(),
  module_mm: z.number(),
  teeth_drive: z.number(),
  face_width: z.number(),
  lewis_y: z.number(),
  allowable_stress: z.number(),
  friction_mu: z.number(),
  wrap_angle_deg: z.number(),
});

export type Input_PRO_062 = z.infer<typeof InputSchema_PRO_062>;

export interface Output_PRO_062 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_062(input: Input_PRO_062): Output_PRO_062 {
  const validData = InputSchema_PRO_062.parse(input);
  const { power_kw, rpm_drive, module_mm, teeth_drive, face_width, lewis_y, allowable_stress, friction_mu, wrap_angle_deg } = validData as any;
  
  const PCD_mm = module_mm * teeth_drive;
  const Pitch_Velocity_m_s = (Math.PI * PCD_mm * rpm_drive) / 60000;
  const Transmitted_Load_N = (power_kw * 1000) / Pitch_Velocity_m_s;
  const Kv_Dynamic = 6 / (6 + Pitch_Velocity_m_s);
  const Bending_Stress_MPa = Transmitted_Load_N / (face_width * module_mm * lewis_y * Kv_Dynamic);
  const Safety_Factor_Gear = allowable_stress / Bending_Stress_MPa;
  const Wrap_Rad = (wrap_angle_deg * Math.PI) / 180;
  const Belt_Tension_Ratio = Math.exp(friction_mu * Wrap_Rad);
  const Tension_Tight_N = Transmitted_Load_N * (Belt_Tension_Ratio / (Belt_Tension_Ratio - 1));
  const Tension_Slack_N = Transmitted_Load_N / (Belt_Tension_Ratio - 1);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Safety_Factor_Gear < 1.5) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "AGMA Dişli Standartları",
        message: "Kritik Kırılma Riski: Diş dibi eğilme gerilmesi için güvenlik faktörü (SF) 1.5'in altındadır. Ani kalkışlarda veya şok yüklerinde diş dibinden yorulma kırılması (Fatigue Failure) yaşanacaktır. Modülü veya diş genişliğini artırın."
      });
    }
  
  return {
    result: Tension_Slack_N,
    smartWarnings
  };
}
