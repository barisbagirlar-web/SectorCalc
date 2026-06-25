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
 * ID: PRO_075
 * Name: Kumaş Kesim (Pastal) Optimizasyonu ve Fire Maliyeti
 */

export const InputSchema_PRO_075 = z.object({
  fabric_width: z.number(),
  marker_length: z.number(),
  pattern_area_total: z.number(),
  fabric_price_m: z.number(),
  layers: z.number(),
  end_waste_cm: z.number(),
  annual_cuts: z.number(),
});

export type Input_PRO_075 = z.infer<typeof InputSchema_PRO_075>;

export interface Output_PRO_075 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_075(input: Input_PRO_075): Output_PRO_075 {
  const validData = InputSchema_PRO_075.parse(input);
  const { fabric_width, marker_length, pattern_area_total, fabric_price_m, layers, end_waste_cm, annual_cuts } = validData as any;
  
  const Gross_Marker_Area_cm2 = (marker_length * 100) * fabric_width;
  const Marker_Efficiency_Pct = (pattern_area_total / Gross_Marker_Area_cm2) * 100;
  const Fabric_Used_Per_Cut_m = (marker_length + (2 * end_waste_cm / 100)) * layers;
  const Total_Cost_Per_Cut = Fabric_Used_Per_Cut_m * fabric_price_m;
  const Waste_Area_Per_Layer = Gross_Marker_Area_cm2 - pattern_area_total;
  const Wasted_Value_Per_Cut = (Waste_Area_Per_Layer / Gross_Marker_Area_cm2) * Total_Cost_Per_Cut;
  const Annual_Wasted_Value = Wasted_Value_Per_Cut * annual_cuts;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Marker_Efficiency_Pct < 80) {
      smartWarnings.push({
        severity: "WARNING",
        source: "CAD/CAM Yerleşim Standartları",
        message: "Verim İhbarı: Pastal yerleşim (Marker) verimliliğiniz %80'in altındadır. Ciddi miktarda kumaş fireye (Cabbage) gitmektedir. Otomatik kalıp yerleştirme (Auto-Nesting) yazılımlarının işlem süresini artırarak yerleşimi sıkılaştırın."
      });
    }
  
  return {
    result: Annual_Wasted_Value,
    smartWarnings
  };
}
