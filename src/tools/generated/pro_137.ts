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
 * ID: PRO_137
 * Name: HACCP Sapma Matrisi ve Kritik Karantina Maliyeti
 */

export const InputSchema_PRO_137 = z.object({
  quarantine_vol_kg: z.number(),
  holding_days: z.number(),
  storage_cost_per_kg_day: z.number(),
  lab_test_qty: z.number(),
  lab_test_cost: z.number(),
  raw_material_cost: z.number(),
  rework_vol_kg: z.number(),
  rework_cost_kg: z.number(),
  disposal_vol_kg: z.number(),
  disposal_cost_kg: z.number(),
  regulatory_fine: z.number(),
  severity_1_10: z.number(),
  occurrence_1_10: z.number(),
  detection_1_10: z.number(),
});

export type Input_PRO_137 = z.infer<typeof InputSchema_PRO_137>;

export interface Output_PRO_137 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_137(input: Input_PRO_137): Output_PRO_137 {
  const validData = InputSchema_PRO_137.parse(input);
  const { quarantine_vol_kg, holding_days, storage_cost_per_kg_day, lab_test_qty, lab_test_cost, raw_material_cost, rework_vol_kg, rework_cost_kg, disposal_vol_kg, disposal_cost_kg, regulatory_fine, severity_1_10, occurrence_1_10, detection_1_10 } = validData as any;
  
  const Risk_Priority_Number_RPN = severity_1_10 * occurrence_1_10 * detection_1_10;
  const Cost_Quarantine = quarantine_vol_kg * holding_days * storage_cost_per_kg_day;
  const Cost_Testing = lab_test_qty * lab_test_cost;
  const Cost_Rework = rework_vol_kg * rework_cost_kg;
  const Cost_Disposal_Operation = disposal_vol_kg * disposal_cost_kg;
  const Lost_Material_Value = disposal_vol_kg * raw_material_cost;
  const Total_Deviation_Cost = Cost_Quarantine + Cost_Testing + Cost_Rework + Cost_Disposal_Operation + Lost_Material_Value;
  const Expected_Fine_Risk = ((severity_1_10 >= 8) ? (regulatory_fine) : (0));
  const Grand_Total_Risk_Cost = Total_Deviation_Cost + Expected_Fine_Risk;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (false) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "HACCP & ISO 22000 Gıda Güvenliği",
        message: "Kritik Sapma (CCP İhlali): RPN 100'ü aşmış veya Şiddet skoru ölümcül seviyededir. Ürün HALK SAĞLIĞI RİSKİ taşımaktadır. Olasılık veya test maliyetlerine bakılmaksızın tüm partinin ACİLEN imha/karantina altında tutulması YASAL ZORUNLULUKTUR."
      });
    }
  
  return {
    result: Grand_Total_Risk_Cost,
    smartWarnings
  };
}
