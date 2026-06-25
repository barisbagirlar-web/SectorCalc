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
 * ID: MFG_397
 * Name: Plastik Enjeksiyon Eriyik Yastığı (Melt Cushion)
 */

export const InputSchema_MFG_397 = z.object({
  vida_cap: z.number(),
  maks_strok: z.number(),
  enjeksiyon_pozisyonu: z.number(),
});

export type Input_MFG_397 = z.infer<typeof InputSchema_MFG_397>;

export interface Output_MFG_397 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_397(input: Input_MFG_397): Output_MFG_397 {
  const validData = InputSchema_MFG_397.parse(input);
  const { vida_cap, maks_strok, enjeksiyon_pozisyonu } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (enjeksiyon_pozisyonu < 2) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Enjeksiyon Proses Denetimi",
        message: "Kritik Kalite Reddi: Eriyik yastığı (Cushion) 2 mm'nin altına inmiştir. Vida silindir kafasına vurma riski taşır ve 'Tutma Basıncı (Holding Pressure)' kalıptaki plastiğe iletilemez. Parçalarda çökme (Sink Marks) ve eksik basma (Short Shot) KESİNDİR. Dozaj miktarını artırın."
      });
    }

    if (enjeksiyon_pozisyonu > (vida_cap * 0.2)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Polimer Fiziği",
        message: "Uyarı: Yastık mesafesi vida çapının %20'sinden fazladır. Namlu (Barrel) önünde gereğinden fazla plastik bekleyecek ve uzun süre ısıya maruz kalarak bozunacaktır (Degradation). Bu durum malzemede sararma veya kırılganlık yapar."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
