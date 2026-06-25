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
 * ID: PRO_031
 * Name: Dikiş/Montaj Hattı Dengeleme ve SMV (Standart Dakika Değeri)
 */

export const InputSchema_PRO_031 = z.object({
  task_smv_array: z.number(),
  shift_duration_min: z.number(),
  daily_target_qty: z.number(),
  actual_operators: z.number(),
  labor_rate_hr: z.number(),
});

export type Input_PRO_031 = z.infer<typeof InputSchema_PRO_031>;

export interface Output_PRO_031 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_031(input: Input_PRO_031): Output_PRO_031 {
  const validData = InputSchema_PRO_031.parse(input);
  const { task_smv_array, shift_duration_min, daily_target_qty, actual_operators, labor_rate_hr } = validData as any;
  
  const TaktTime = shift_duration_min / daily_target_qty;
  const Total_SMV = SUM(task_smv_array);
  const Theo_Operators = Total_SMV / TaktTime;
  const Max_Station_Time = Math.max(task_smv_array);
  const Line_Efficiency = (Total_SMV / (actual_operators * Max_Station_Time)) * 100;
  const Balance_Delay = 100 - Line_Efficiency;
  const Labor_Cost_Per_Unit = (actual_operators * (shift_duration_min / 60) * labor_rate_hr) / (shift_duration_min / Max_Station_Time);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Max_Station_Time > TaktTime) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Yalın Üretim Akış Kısıtları",
        message: "Kritik Darboğaz: Hat üzerindeki en uzun istasyon süresi (Darboğaz), müşteri Takt süresini aşmaktadır. Bu istasyon hızlandırılmadan veya bölünmeden günlük üretim hedefine ulaşmak matematiksel olarak İMKANSIZDIR."
      });
    }

    if (Line_Efficiency < 75) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Hat Verimliliği (Line Balancing)",
        message: "Uyarı: Hat dengeleme verimliliğiniz %75'in altındadır. Operatörler arasında ciddi iş yükü eşitsizliği var; bazı operatörler boş beklerken (Balance Delay israfı) diğerleri aşırı çalışıyor. İş elemanlarını yeniden dağıtın."
      });
    }
  
  return {
    result: Labor_Cost_Per_Unit,
    smartWarnings
  };
}
