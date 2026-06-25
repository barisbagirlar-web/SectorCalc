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
 * ID: ENV_243
 * Name: Sera Gazı Emisyonu (Kapsam 1 ve Kapsam 2)
 */

export const InputSchema_ENV_243 = z.object({
  yakit_tuketimi: z.number(),
  elektrik_tuketimi: z.number(),
  grid_emisyon_faktoru: z.number(),
});

export type Input_ENV_243 = z.infer<typeof InputSchema_ENV_243>;

export interface Output_ENV_243 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ENV_243(input: Input_ENV_243): Output_ENV_243 {
  const validData = InputSchema_ENV_243.parse(input);
  const { yakit_tuketimi, elektrik_tuketimi, grid_emisyon_faktoru } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (grid_emisyon_faktoru > 0.6) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ISO 14064 Karbon Ayak İzi Standartları",
        message: "Uyarı: Şirketinizin kurulu olduğu bölgedeki elektrik şebekesi yüksek oranda fosil yakıta (Kömür/Doğalgaz) bağımlıdır. Kapsam 2 emisyonlarınızı düşürmek için I-REC (Yenilenebilir Enerji Sertifikası) alımı veya çatı üzeri GES yatırımı yapılması önerilir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
