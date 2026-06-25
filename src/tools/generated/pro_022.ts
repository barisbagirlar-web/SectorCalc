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
 * ID: PRO_022
 * Name: Talaşlı İmalat Gerçek Birim Maliyet (TCO)
 */

export const InputSchema_PRO_022 = z.object({
  mat_vol_m3: z.number(),
  mat_density: z.number(),
  mat_price_kg: z.number(),
  machine_rate_hr: z.number(),
  cycle_time_min: z.number(),
  tool_cost: z.number(),
  cutting_edges: z.number(),
  tool_life_min: z.number(),
  scrap_rate: z.number(),
  overhead_rate: z.number(),
});

export type Input_PRO_022 = z.infer<typeof InputSchema_PRO_022>;

export interface Output_PRO_022 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_022(input: Input_PRO_022): Output_PRO_022 {
  const validData = InputSchema_PRO_022.parse(input);
  const { mat_vol_m3, mat_density, mat_price_kg, machine_rate_hr, cycle_time_min, tool_cost, cutting_edges, tool_life_min, scrap_rate, overhead_rate } = validData as any;
  
  const MatCost_Base = mat_vol_m3 * mat_density * mat_price_kg;
  const MachiningCost = (cycle_time_min / 60) * machine_rate_hr;
  const ToolingCost_PerPart = (cycle_time_min / tool_life_min) * (tool_cost / cutting_edges);
  const BaseCost_PerPart = MatCost_Base + MachiningCost + ToolingCost_PerPart;
  const OverheadCost = BaseCost_PerPart * (overhead_rate / 100);
  const ScrapPenalty = (BaseCost_PerPart + OverheadCost) * (scrap_rate / 100);
  const Total_Unit_Cost = BaseCost_PerPart + OverheadCost + ScrapPenalty;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (ToolingCost_PerPart > MachiningCost) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Sandvik Coromant İşleme Ekonomisi",
        message: "Ekonomik İhbar: Parça başına takım maliyetiniz, işleme (makine saati) maliyetinizi geçiyor. Kesme hızınız (Vc) gereğinden çok yüksek ve takımları yakıyorsunuz. Vc'yi düşürüp takım ömrünü maksimize edin."
      });
    }
  
  return {
    result: Total_Unit_Cost,
    smartWarnings
  };
}
