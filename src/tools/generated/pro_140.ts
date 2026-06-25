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
 * ID: PRO_140
 * Name: Kumaş Pastal (Marker) Verimi ve Fire Maliyet Optimizasyonu
 */

export const InputSchema_PRO_140 = z.object({
  fabric_usable_width: z.number(),
  marker_length: z.number(),
  pattern_net_area: z.number(),
  fabric_layers: z.number(),
  fabric_price_meter: z.number(),
  end_waste_margin: z.number(),
  annual_cuts: z.number(),
});

export type Input_PRO_140 = z.infer<typeof InputSchema_PRO_140>;

export interface Output_PRO_140 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_140(input: Input_PRO_140): Output_PRO_140 {
  const validData = InputSchema_PRO_140.parse(input);
  const { fabric_usable_width, marker_length, pattern_net_area, fabric_layers, fabric_price_meter, end_waste_margin, annual_cuts } = validData as any;
  
  const Gross_Marker_Area_cm2 = (marker_length * 100) * fabric_usable_width;
  const Marker_Efficiency_Pct = (pattern_net_area / Gross_Marker_Area_cm2) * 100;
  const Fabric_Used_Per_Layer_m = marker_length + (2 * end_waste_margin / 100);
  const Total_Fabric_Per_Cut_m = Fabric_Used_Per_Layer_m * fabric_layers;
  const Cost_Per_Cut = Total_Fabric_Per_Cut_m * fabric_price_meter;
  const Waste_Area_Per_Layer_cm2 = Gross_Marker_Area_cm2 - pattern_net_area;
  const Wasted_Value_Per_Cut = (Waste_Area_Per_Layer_cm2 / Gross_Marker_Area_cm2) * Cost_Per_Cut;
  const Annual_Wasted_Value = Wasted_Value_Per_Cut * annual_cuts;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Marker_Efficiency_Pct < 80) {
      smartWarnings.push({
        severity: "WARNING",
        source: "CAD/CAM Yerleşim Standartları",
        message: "Pastal Verim İhbarı: Yerleşim (Nesting) verimliliğiniz %80'in altındadır. Kumaşın %20'sinden fazlası fire (Cabbage) olarak çöpe gitmektedir. CAD programındaki oto-yerleştirme süresini uzatın veya kalıp rotasyon kurallarını (Grain line) esnetin."
      });
    }
  
  return {
    result: Annual_Wasted_Value,
    smartWarnings
  };
}
