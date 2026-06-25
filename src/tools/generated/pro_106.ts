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
 * ID: PRO_106
 * Name: Global Navlun (Incoterms) ve Hacimsel Ağırlık Maliyeti
 */

export const InputSchema_PRO_106 = z.object({
  gross_weight_kg: z.number(),
  length_cm: z.number(),
  width_cm: z.number(),
  height_cm: z.number(),
  transport_mode: z.enum(["Hava_Kargo", "Karayolu", "Deniz_LCL"]),
  freight_rate: z.number(),
  baf_pct: z.number(),
  thc_fee: z.number(),
  customs_value: z.number(),
  duty_pct: z.number(),
  insurance_pct: z.number(),
});

export type Input_PRO_106 = z.infer<typeof InputSchema_PRO_106>;

export interface Output_PRO_106 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_106(input: Input_PRO_106): Output_PRO_106 {
  const validData = InputSchema_PRO_106.parse(input);
  const { gross_weight_kg, length_cm, width_cm, height_cm, transport_mode, freight_rate, baf_pct, thc_fee, customs_value, duty_pct, insurance_pct } = validData as any;
  
  const Volume_cm3 = length_cm * width_cm * height_cm;
    const Volume_CBM = Volume_cm3 / 1000000;
    const VolWeight_Air_kg = Volume_cm3 / 6000;
    const VolWeight_Road_kg = Volume_cm3 / 3000;
    const VolWeight_Sea_CBM = Volume_CBM;
    const Chargeable_Weight = (transport_mode == 'Hava_Kargo') ? Math.max(gross_weight_kg, VolWeight_Air_kg) : (transport_mode == 'Karayolu' ? Math.max(gross_weight_kg, VolWeight_Road_kg) : Math.max(Volume_CBM, gross_weight_kg / 1000));
    const Base_Freight = Chargeable_Weight * freight_rate;
    const BAF_Surcharge = Base_Freight * (baf_pct / 100);
    const CIF_Value = customs_value + Base_Freight + BAF_Surcharge + thc_fee;
    const Insurance_Cost = CIF_Value * (insurance_pct / 100);
    const Customs_Duty = CIF_Value * (duty_pct / 100);
    const Total_Landed_Cost = CIF_Value + Insurance_Cost + Customs_Duty;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (false) {
      smartWarnings.push({
        severity: "WARNING",
        source: "IATA Kargo Standartları",
        message: "Hacimsel Zarar: Kargolanacak ürünün hacmi (Volume), gerçek ağırlığına kıyasla aşırı büyüktür. Havayolu firması 'Hacimsel Ağırlık (Chargeable Weight)' üzerinden fatura keseceği için hava kargosu astronomik maliyet yaratacaktır. Paketlemeyi küçültün (Flat-pack) veya Deniz yoluna geçin."
      });
    }
  
  return {
    result: Total_Landed_Cost,
    smartWarnings
  };
}
