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
 * ID: PRO_160
 * Name: OEE vs TEEP (Total Effective Equipment Perf.) Gizli Kapasite Analizi
 */

export const InputSchema_PRO_160 = z.object({
  total_calendar_time: z.number(),
  unscheduled_time: z.number(),
  planned_maintenance: z.number(),
  unplanned_downtime: z.number(),
  ideal_cycle_time: z.number(),
  total_units_produced: z.number(),
  good_units: z.number(),
  capex_per_new_machine: z.number(),
});

export type Input_PRO_160 = z.infer<typeof InputSchema_PRO_160>;

export interface Output_PRO_160 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_160(input: Input_PRO_160): Output_PRO_160 {
  const validData = InputSchema_PRO_160.parse(input);
  const { total_calendar_time, unscheduled_time, planned_maintenance, unplanned_downtime, ideal_cycle_time, total_units_produced, good_units, capex_per_new_machine } = validData as any;
  
  const Loading_Time = total_calendar_time - unscheduled_time - planned_maintenance;
  const Operating_Time = Loading_Time - unplanned_downtime;
  const Availability_Pct = (Operating_Time / Loading_Time) * 100;
  const Performance_Pct = ((ideal_cycle_time * total_units_produced) / Operating_Time) * 100;
  const Quality_Pct = (good_units / total_units_produced) * 100;
  const OEE_Pct = (Availability_Pct / 100) * (Performance_Pct / 100) * (Quality_Pct / 100) * 100;
  const Utilization_Factor = Loading_Time / total_calendar_time;
  const TEEP_Pct = OEE_Pct * Utilization_Factor;
  const Hidden_Capacity_Hours = total_calendar_time * (1 - (TEEP_Pct / 100));
  const Equivalent_Hidden_Machines = Hidden_Capacity_Hours / total_calendar_time;
  const Avoidable_CAPEX = Equivalent_Hidden_Machines * capex_per_new_machine;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (false) {
      smartWarnings.push({
        severity: "WARNING",
        source: "TPM / Kapasite Yönetimi",
        message: "Kör Nokta Uyarısı (Schedule Loss): OEE değeriniz mükemmel (%85+) görünse de, vardiya planlaması eksikliği nedeniyle makine takvim zamanının yarısında (Hafta sonu/gece) kapalı yatmaktadır. TEEP değeriniz çok düşük. Yeni makine yatırımı (CAPEX) yapmak yerine mevcut makineye 3. vardiyayı ekleyin."
      });
    }
  
  return {
    result: Avoidable_CAPEX,
    smartWarnings
  };
}
