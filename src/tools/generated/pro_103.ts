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
 * ID: PRO_103
 * Name: MTBF / MTTR Finansal Etki ve Kestirimci Bakım ROI
 */

export const InputSchema_PRO_103 = z.object({
  failure_count: z.number(),
  op_hours: z.number(),
  total_repair_hrs: z.number(),
  downtime_cost_hr: z.number(),
  avg_parts_cost: z.number(),
  repair_labor_rate: z.number(),
  pm_investment: z.number(),
  failure_reduction_pct: z.number(),
});

export type Input_PRO_103 = z.infer<typeof InputSchema_PRO_103>;

export interface Output_PRO_103 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_103(input: Input_PRO_103): Output_PRO_103 {
  const validData = InputSchema_PRO_103.parse(input);
  const { failure_count, op_hours, total_repair_hrs, downtime_cost_hr, avg_parts_cost, repair_labor_rate, pm_investment, failure_reduction_pct } = validData as any;
  
  const Actual_Operating_Time = op_hours - total_repair_hrs;
  const MTBF = Actual_Operating_Time / failure_count;
  const MTTR = total_repair_hrs / failure_count;
  const Availability_Pct = (MTBF / (MTBF + MTTR)) * 100;
  const Current_Downtime_Cost = total_repair_hrs * downtime_cost_hr;
  const Current_Repair_Cost = (total_repair_hrs * repair_labor_rate) + (failure_count * avg_parts_cost);
  const Total_Current_Failure_Cost = Current_Downtime_Cost + Current_Repair_Cost;
  const New_Failure_Count = failure_count * (1 - (failure_reduction_pct / 100));
  const New_Repair_Hrs = New_Failure_Count * MTTR;
  const New_Failure_Cost = (New_Repair_Hrs * downtime_cost_hr) + (New_Repair_Hrs * repair_labor_rate) + (New_Failure_Count * avg_parts_cost);
  const Annual_Savings = Total_Current_Failure_Cost - New_Failure_Cost;
  const ROI_Pct = ((Annual_Savings - pm_investment) / pm_investment) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (ROI_Pct < 0) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Sermaye Geri Dönüşü",
        message: "Uyarı: Planlanan Kestirimci Bakım (Sensör vb.) yatırımı, kurtardığı duruş ve parça maliyetlerini karşılamıyor. Makinenin kritiklik seviyesi (İSG/Çevre) düşükse, RTF (Kırılana Kadar Çalıştır) stratejisinde kalın."
      });
    }
  
  return {
    result: ROI_Pct,
    smartWarnings
  };
}
