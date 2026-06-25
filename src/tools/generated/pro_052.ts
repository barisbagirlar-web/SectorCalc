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
 * ID: PRO_052
 * Name: IEC 60890 Elektrik Pano İklimlendirme Kapasitesi
 */

export const InputSchema_PRO_052 = z.object({
  width: z.number(),
  height: z.number(),
  depth: z.number(),
  internal_power: z.number(),
  t_out: z.number(),
  t_in: z.number(),
  mounting_type: z.enum(["Tek Serbest", "Duvara Bitişik", "Sırt Sırta"]),
  material_k: z.number(),
});

export type Input_PRO_052 = z.infer<typeof InputSchema_PRO_052>;

export interface Output_PRO_052 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_052(input: Input_PRO_052): Output_PRO_052 {
  const validData = InputSchema_PRO_052.parse(input);
  const { width, height, depth, internal_power, t_out, t_in, mounting_type, material_k } = validData as any;
  
  const A_surface = 2 * (width * height + width * depth + height * depth);
  const Mounting_Factor = ((mounting_type == 'Tek Serbest') ? (1.0) : (((mounting_type  === 'Duvara Bitişik') ? (0.85) : (0.70))));
  const A_effective = A_surface * Mounting_Factor;
  const Delta_T = t_in - t_out;
  const Q_conduction = material_k * A_effective * Delta_T;
  const Q_cooling_req = internal_power - Q_conduction;
  const Cooler_Capacity_W = Math.max(0, Q_cooling_req * 1.20);
  const Cooler_Capacity_BTU = Cooler_Capacity_W * 3.412;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Q_cooling_req > 0) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Pano İklimlendirme Standartları",
        message: "Donanım Uyarısı: Pano yüzey alanı ısıyı doğal konveksiyonla atmaya yetmemektedir. Panodaki VFD (Sürücü) ve PLC ekipmanlarının yanmaması için hesaplanan kapasitede aktif bir fan/filtre veya pano kliması kurulması zorunludur."
      });
    }
  
  return {
    result: Cooler_Capacity_BTU,
    smartWarnings
  };
}
