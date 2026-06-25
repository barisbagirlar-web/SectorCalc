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
 * ID: PRO_172
 * Name: Hidrolik Akümülatör Azot Ön Dolum ve Enerji Kapasitesi
 */

export const InputSchema_PRO_172 = z.object({
  max_sys_pressure: z.number(),
  min_sys_pressure: z.number(),
  gas_precharge_p0: z.number(),
  required_stored_vol: z.number(),
  polytropic_exponent: z.number(),
});

export type Input_PRO_172 = z.infer<typeof InputSchema_PRO_172>;

export interface Output_PRO_172 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_172(input: Input_PRO_172): Output_PRO_172 {
  const validData = InputSchema_PRO_172.parse(input);
  const { max_sys_pressure, min_sys_pressure, gas_precharge_p0, required_stored_vol, polytropic_exponent } = validData as any;
  
  const P0_abs = gas_precharge_p0 + 1.013;
  const P1_abs = min_sys_pressure + 1.013;
  const P2_abs = max_sys_pressure + 1.013;
  const Accumulator_Size_V0 = required_stored_vol / ((Math.pow(P0_abs / P1_abs, 1 / polytropic_exponent)) - (Math.pow(P0_abs / P2_abs, 1 / polytropic_exponent)));
  const V1_Gas_Vol = Accumulator_Size_V0 * Math.pow(P0_abs / P1_abs, 1 / polytropic_exponent);
  const V2_Gas_Vol = Accumulator_Size_V0 * Math.pow(P0_abs / P2_abs, 1 / polytropic_exponent);
  const Kinetic_Energy_Stored_J = ((P1_abs * V1_Gas_Vol * 100) / (polytropic_exponent - 1)) * (1 - Math.pow(P2_abs / P1_abs, (polytropic_exponent - 1) / polytropic_exponent));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (gas_precharge_p0 > (min_sys_pressure * 0.90)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ISO 4413 Hidrolik Akışkan Gücü",
        message: "Emniyet İhlal Uyarısı: Azot ön dolum basıncı, minimum sistem basıncının %90'ından fazladır. Basınç dalgalanmalarında akümülatör blader/piston mekanizması metal gövdeye çarparak mekanik hasar görecektir; ideal oran P0 = 0.9 × P1 sınırıdır."
      });
    }
  
  return {
    result: Kinetic_Energy_Stored_J,
    smartWarnings
  };
}
