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
 * ID: PRO_098
 * Name: İleri Seviye OEE (TPM) ve 6 Büyük Kayıp Finansal Çevirici
 */

export const InputSchema_PRO_098 = z.object({
  planned_time: z.number(),
  downtime: z.number(),
  setup_time: z.number(),
  ideal_ct: z.number(),
  total_parts: z.number(),
  good_parts: z.number(),
  margin: z.number(),
});

export type Input_PRO_098 = z.infer<typeof InputSchema_PRO_098>;

export interface Output_PRO_098 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_098(input: Input_PRO_098): Output_PRO_098 {
  const validData = InputSchema_PRO_098.parse(input);
  const { planned_time, downtime, setup_time, ideal_ct, total_parts, good_parts, margin } = validData as any;
  
  const Operating_Time = planned_time - downtime - setup_time;
  const Availability_Pct = (Operating_Time / planned_time) * 100;
  const Performance_Pct = ((ideal_ct * total_parts) / Operating_Time) * 100;
  const Quality_Pct = (good_parts / total_parts) * 100;
  const OEE_Pct = (Availability_Pct / 100) * (Performance_Pct / 100) * (Quality_Pct / 100) * 100;
  const Lost_Capacity_Units = (planned_time / ideal_ct) - good_parts;
  const Financial_Loss = Lost_Capacity_Units * margin;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Performance_Pct < 85) {
      smartWarnings.push({
        severity: "WARNING",
        source: "TPM Veri Doğrulama",
        message: "Kör Nokta İhbarı (Phantom Losses): Performans kaybınız çok yüksek. Makine çalışıyor görünse de mikro-duruşlar (Micro-stops) veya düşük devirde çalışma nedeniyle kapasite yutuluyor. ERP/MES sisteminizin sensör verisi toplaması gerekmektedir."
      });
    }
  
  return {
    result: Financial_Loss,
    smartWarnings
  };
}
