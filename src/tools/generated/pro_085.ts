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
 * ID: PRO_085
 * Name: RCM (Güvenilirlik Odaklı Bakım) Karar Optimizasyonu
 */

export const InputSchema_PRO_085 = z.object({
  failure_rate_yr: z.number(),
  cost_per_failure: z.number(),
  pm_interval_mo: z.number(),
  cost_per_pm: z.number(),
  cbm_sensor_capex: z.number(),
  cost_per_cbm_intervention: z.number(),
  cbm_detection_rate: z.number(),
  safety_critical: z.enum(["Evet", "Hayır"]),
});

export type Input_PRO_085 = z.infer<typeof InputSchema_PRO_085>;

export interface Output_PRO_085 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_085(input: Input_PRO_085): Output_PRO_085 {
  const validData = InputSchema_PRO_085.parse(input);
  const { failure_rate_yr, cost_per_failure, pm_interval_mo, cost_per_pm, cbm_sensor_capex, cost_per_cbm_intervention, cbm_detection_rate, safety_critical } = validData as any;
  
  const RTF_Annual_Cost = failure_rate_yr * cost_per_failure;
  const PM_Annual_Cost = (12 / pm_interval_mo) * cost_per_pm + (failure_rate_yr * 0.30 * cost_per_failure);
  const CBM_Annual_Depreciation = cbm_sensor_capex / 5;
  const CBM_Intervention_Cost = failure_rate_yr * (cbm_detection_rate / 100) * cost_per_cbm_intervention;
  const CBM_Missed_Failure_Cost = failure_rate_yr * (1 - (cbm_detection_rate / 100)) * cost_per_failure;
  const CBM_Total_Annual_Cost = CBM_Annual_Depreciation + CBM_Intervention_Cost + CBM_Missed_Failure_Cost;
  const Optimal_Financial_Strategy_Cost = Math.min(RTF_Annual_Cost, PM_Annual_Cost, CBM_Total_Annual_Cost);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (safety_critical === 'Evet') {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "SAE JA1011 RCM Standardı",
        message: "Zorunlu Strateji Değişimi: Ekipman İSG veya Çevre açısından kritik olarak işaretlenmiştir. RTF (Kırılana Kadar Çalıştır) stratejisi finansal olarak en ucuz çıksa dahi YASAL OLARAK KULLANILAMAZ. Önleyici (PM) veya Kestirimci (CBM) strateji zorunludur."
      });
    }
  
  return {
    result: Optimal_Financial_Strategy_Cost,
    smartWarnings
  };
}
