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
 * ID: PRO_068
 * Name: Kaynak İşlem Ekonomisi ve Ark Verimi
 */

export const InputSchema_PRO_068 = z.object({
  travel_speed: z.number(),
  weld_length: z.number(),
  arc_on_factor: z.number(),
  labor_rate: z.number(),
  power_kw: z.number(),
  elec_rate: z.number(),
  gas_flow: z.number(),
  gas_price: z.number(),
  filler_required_kg: z.number(),
  filler_price: z.number(),
});

export type Input_PRO_068 = z.infer<typeof InputSchema_PRO_068>;

export interface Output_PRO_068 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_068(input: Input_PRO_068): Output_PRO_068 {
  const validData = InputSchema_PRO_068.parse(input);
  const { travel_speed, weld_length, arc_on_factor, labor_rate, power_kw, elec_rate, gas_flow, gas_price, filler_required_kg, filler_price } = validData as any;
  
  const Arc_Time_Min = (weld_length * 100) / travel_speed;
  const Total_Labor_Time_Min = Arc_Time_Min / (arc_on_factor / 100);
  const Labor_Cost = (Total_Labor_Time_Min / 60) * labor_rate;
  const Energy_Cost = power_kw * (Arc_Time_Min / 60) * elec_rate;
  const Gas_Cost = gas_flow * Arc_Time_Min * gas_price;
  const Material_Cost = filler_required_kg * filler_price;
  const Total_Weld_Cost = Labor_Cost + Energy_Cost + Gas_Cost + Material_Cost;
  const Cost_Per_Meter = Total_Weld_Cost / weld_length;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (arc_on_factor < 20) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Endüstriyel Verimlilik Analizi",
        message: "Kayıp Zaman İhbarı: Ark yanma oranınız %20'nin altında. Kaynakçı mesaisinin %80'ini parça hizalama, taşlama veya beklemeyle geçiriyor. En pahalı kaleminiz olan işçilik boşa gidiyor, bağlama fikstürlerini (Jig) iyileştirin."
      });
    }
  
  return {
    result: Cost_Per_Meter,
    smartWarnings
  };
}
