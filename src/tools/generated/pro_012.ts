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
 * ID: PRO_012
 * Name: İleri Seviye Beton Hacmi ve Termal Çatlak Riski
 */

export const InputSchema_PRO_012 = z.object({
  vol_slab: z.number(),
  vol_footing: z.number(),
  vol_column: z.number(),
  rebar_pct: z.number(),
  waste_pct: z.number(),
  ambient_temp: z.number(),
  cement_content: z.number(),
  cement_type: z.number(),
  unit_price: z.number(),
  pump_fee: z.number(),
});

export type Input_PRO_012 = z.infer<typeof InputSchema_PRO_012>;

export interface Output_PRO_012 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_012(input: Input_PRO_012): Output_PRO_012 {
  const validData = InputSchema_PRO_012.parse(input);
  const { vol_slab, vol_footing, vol_column, rebar_pct, waste_pct, ambient_temp, cement_content, cement_type, unit_price, pump_fee } = validData as any;
  
  const GrossGeoVol = vol_slab + vol_footing + vol_column;
  const RebarDisplacement = GrossGeoVol * (rebar_pct / 100);
  const NetConcreteVol = GrossGeoVol - RebarDisplacement;
  const OrderVol = NetConcreteVol * (1 + (waste_pct / 100));
  const TotalMaterialCost = OrderVol * unit_price;
  const TotalCost = TotalMaterialCost + pump_fee;
  const AdiabaticTempRise = (cement_content * 350 * cement_type) / (2400 * 1.05);
  const MaxCoreTemp = ambient_temp + AdiabaticTempRise;
  const TempDifferential = MaxCoreTemp - ambient_temp;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (TempDifferential > 20) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ACI 207 Kütle Betonu Standartları",
        message: "Kritik Çatlak Riski: Çekirdek ile yüzey arasındaki sıcaklık farkı 20°C'yi aşmaktadır. Termal büzülme kaynaklı derin çatlaklar (Thermal Cracking) oluşacaktır. Buzu su kullanın veya cüruflu/uçucu küllü (Düşük hidratasyon ısılı) çimentoya geçin."
      });
    }
  
  return {
    result: TempDifferential,
    smartWarnings
  };
}
