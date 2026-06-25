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
 * ID: PRO_146
 * Name: IEC 60364 Üç Faz Kablo Kesit ve Gerilim Düşümü (Voltage Drop)
 */

export const InputSchema_PRO_146 = z.object({
  load_kw: z.number(),
  voltage: z.number(),
  power_factor: z.number(),
  cable_length: z.number(),
  cross_section: z.number(),
  cable_material: z.enum(["Bakır (Cu)", "Alüminyum (Al)"]),
  max_vd_pct: z.number(),
});

export type Input_PRO_146 = z.infer<typeof InputSchema_PRO_146>;

export interface Output_PRO_146 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_146(input: Input_PRO_146): Output_PRO_146 {
  const validData = InputSchema_PRO_146.parse(input);
  const { load_kw, voltage, power_factor, cable_length, cross_section, cable_material, max_vd_pct } = validData as any;
  
  const Load_Current_I = (load_kw * 1000) / (Math.sqrt(3) * voltage * power_factor);
  const Resistivity_rho = ((cable_material == 'Bakır (Cu)') ? (0.0175) : (0.0283));
  const Resistance_R = (Resistivity_rho * cable_length) / cross_section;
  const Reactance_X = 0.00008 * cable_length;
  const Sin_Phi = Math.sqrt(1 - Math.pow(power_factor, 2));
  const Voltage_Drop_V = Math.sqrt(3) * Load_Current_I * (Resistance_R * power_factor + Reactance_X * Sin_Phi);
  const Voltage_Drop_Pct = (Voltage_Drop_V / voltage) * 100;
  const Actual_Voltage_At_Load = voltage - Voltage_Drop_V;
  const Power_Loss_Cable_W = 3 * Math.pow(Load_Current_I, 2) * Resistance_R;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Voltage_Drop_Pct > max_vd_pct) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "IEC 60364 Elektrik Tesisatları",
        message: "Yangın / Motor Yanma Riski: Gerilim düşümü yasal sınırı (Genelde aydınlatma %3, motor %5) aşmaktadır. Motor düşük voltajda aşırı akım çekecek (Isınacak) ve kablo izolasyonu eriyerek kısa devre yapacaktır. Kesiti (S) bir üst kademeye büyütün."
      });
    }
  
  return {
    result: Power_Loss_Cable_W,
    smartWarnings
  };
}
