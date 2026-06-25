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
 * ID: PRO_074
 * Name: Konteyner Yük (Bin Packing) ve Navlun Optimizasyonu
 */

export const InputSchema_PRO_074 = z.object({
  container_l: z.number(),
  container_w: z.number(),
  container_h: z.number(),
  max_payload: z.number(),
  pallet_l: z.number(),
  pallet_w: z.number(),
  pallet_h: z.number(),
  pallet_weight: z.number(),
  max_stack_layers: z.number(),
  freight_cost: z.number(),
});

export type Input_PRO_074 = z.infer<typeof InputSchema_PRO_074>;

export interface Output_PRO_074 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_074(input: Input_PRO_074): Output_PRO_074 {
  const validData = InputSchema_PRO_074.parse(input);
  const { container_l, container_w, container_h, max_payload, pallet_l, pallet_w, pallet_h, pallet_weight, max_stack_layers, freight_cost } = validData as any;
  
  const Floor_Pallets_Orient1 = FLOOR(container_l / pallet_l) * FLOOR(container_w / pallet_w);
  const Floor_Pallets_Orient2 = FLOOR(container_l / pallet_w) * FLOOR(container_w / pallet_l);
  const Max_Floor_Pallets = Math.max(Floor_Pallets_Orient1, Floor_Pallets_Orient2);
  const Height_Layers = Math.min(max_stack_layers, FLOOR(container_h / pallet_h));
  const Total_Pallets_Vol_Constraint = Max_Floor_Pallets * Height_Layers;
  const Total_Pallets_Weight_Constraint = FLOOR(max_payload / pallet_weight);
  const Actual_Loaded_Pallets = Math.min(Total_Pallets_Vol_Constraint, Total_Pallets_Weight_Constraint);
  const Container_Vol_m3 = container_l * container_w * container_h;
  const Loaded_Vol_m3 = Actual_Loaded_Pallets * (pallet_l * pallet_w * pallet_h);
  const Volume_Utilization = (Loaded_Vol_m3 / Container_Vol_m3) * 100;
  const Loaded_Weight = Actual_Loaded_Pallets * pallet_weight;
  const Weight_Utilization = (Loaded_Weight / max_payload) * 100;
  const Cost_Per_Pallet = freight_cost / Actual_Loaded_Pallets;
  const Wasted_Freight_Value = freight_cost * (1 - (Math.max(Volume_Utilization, Weight_Utilization) / 100));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Total_Pallets_Weight_Constraint < Total_Pallets_Vol_Constraint) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Taşımacılık Fiziği",
        message: "Yükleme Kısıtı İhbarı: Yükleme planınız Hacimden (Volume) önce Ağırlık (Payload) sınırına takılmaktadır (Ağır Yük). Konteynerin içinde ciddi bir boşluk (Air gap) kalacaktır, navlun maliyeti ürün başına çok yüksek çıkar."
      });
    }
  
  return {
    result: Wasted_Freight_Value,
    smartWarnings
  };
}
