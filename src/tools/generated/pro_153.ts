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
 * ID: PRO_153
 * Name: Temiz Oda (Cleanroom) ISO Sınıfı Hava Değişimi ve HEPA Ömrü
 */

export const InputSchema_PRO_153 = z.object({
  room_volume: z.number(),
  iso_class: z.number(),
  hepa_flow_rate: z.number(),
  pressure_drop_initial: z.number(),
  pressure_drop_final: z.number(),
  daily_dust_load: z.number(),
  filter_dust_capacity: z.number(),
});

export type Input_PRO_153 = z.infer<typeof InputSchema_PRO_153>;

export interface Output_PRO_153 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_153(input: Input_PRO_153): Output_PRO_153 {
  const validData = InputSchema_PRO_153.parse(input);
  const { room_volume, iso_class, hepa_flow_rate, pressure_drop_initial, pressure_drop_final, daily_dust_load, filter_dust_capacity } = validData as any;
  
  const Required_ACH = ((iso_class <= 5) ? (240) : (IF(iso_class <= 7, 60, 20)));
  const Total_Airflow_m3h = room_volume * Required_ACH;
  const Required_HEPA_Count = CEILING(Total_Airflow_m3h / hepa_flow_rate);
  const Filter_Life_Days = (filter_dust_capacity * Required_HEPA_Count) / daily_dust_load;
  const Filter_Life_Months = Filter_Life_Days / 30;
  const Pressure_Drop_Delta = pressure_drop_final - pressure_drop_initial;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Required_ACH > 600) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ASHRAE Cleanroom Design",
        message: "Türbülans Riski: Hedeflenen ACH değeri fiziksel sınırları zorluyor. Bu hava değişim hızını standart tavan beslemeleriyle sağlamak aşırı türbülansa neden olup partikülleri havalandıracaktır (Laminer akış bozulur). %100 FFU (Fan Filter Unit) tavan kaplaması şarttır."
      });
    }

    if (Filter_Life_Months < 6) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Bakım Maliyeti İhbarı",
        message: "HEPA Ömrü Kritik: Odaya giren taze havadaki partikül yükü çok yüksek; HEPA filtreleriniz 6 aydan kısa sürede körleniyor. Ön filtre (F7/F9) kademelerini iyileştirmezseniz, astronomik sarf malzeme maliyetiyle karşılaşırsınız."
      });
    }
  
  return {
    result: Pressure_Drop_Delta,
    smartWarnings
  };
}
