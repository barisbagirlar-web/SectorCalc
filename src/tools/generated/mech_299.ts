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
 * ID: MECH_299
 * Name: Kompresör Özgül Enerji Tüketimi (SEC)
 */

export const InputSchema_MECH_299 = z.object({
  motor_gucu: z.number(),
  serbest_hava_verimi: z.number(),
  calisma_basinci: z.number(),
});

export type Input_MECH_299 = z.infer<typeof InputSchema_MECH_299>;

export interface Output_MECH_299 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_299(input: Input_MECH_299): Output_MECH_299 {
  const validData = InputSchema_MECH_299.parse(input);
  const { motor_gucu, serbest_hava_verimi, calisma_basinci } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((motor_gucu / serbest_hava_verimi) > 8 && calisma_basinci <= 8) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ISO 50001 / CAGI Kompresör Verimliliği",
        message: "Uyarı: 8 Bar'lık standart bir sistem için özgül enerji tüketiminiz 8 kW/(m3/dk) sınırını aşıyor. Kompresörünüzde vida (Screw) aşınması, iç kaçak veya emiş filtresi tıkanıklığı var; aşırı enerji yakıyorsunuz."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
