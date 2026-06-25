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
 * ID: PRO_029
 * Name: Devamsızlık (Absenteeism) Sızıntı ve Dolgu Maliyeti
 */

export const InputSchema_PRO_029 = z.object({
  absent_hrs: z.number(),
  reg_rate: z.number(),
  burden_pct: z.number(),
  ot_fill_pct: z.number(),
  ot_multiplier: z.number(),
  temp_fill_pct: z.number(),
  temp_rate: z.number(),
  output_per_hr: z.number(),
  contrib_margin: z.number(),
});

export type Input_PRO_029 = z.infer<typeof InputSchema_PRO_029>;

export interface Output_PRO_029 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_029(input: Input_PRO_029): Output_PRO_029 {
  const validData = InputSchema_PRO_029.parse(input);
  const { absent_hrs, reg_rate, burden_pct, ot_fill_pct, ot_multiplier, temp_fill_pct, temp_rate, output_per_hr, contrib_margin } = validData as any;
  
  const Unfilled_Pct = 100 - (ot_fill_pct + temp_fill_pct);
  const Direct_Absent_Cost = absent_hrs * reg_rate * (1 + (burden_pct/100));
  const OT_Premium_Cost = absent_hrs * (ot_fill_pct/100) * (reg_rate * ot_multiplier * (1 + (burden_pct/100)) - reg_rate);
  const Temp_Labor_Cost = absent_hrs * (temp_fill_pct/100) * temp_rate;
  const Production_Loss = absent_hrs * (Unfilled_Pct/100) * output_per_hr * contrib_margin;
  const Total_Absent_Cost = Direct_Absent_Cost + OT_Premium_Cost + Temp_Labor_Cost + Production_Loss;
  const Cost_Per_Absent_Hour = Total_Absent_Cost / absent_hrs;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Production_Loss > (OT_Premium_Cost + Temp_Labor_Cost)) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Operasyonel Finans",
        message: "Kritik Kayıp: Devamsızlık nedeniyle doldurulamayan saatlerin yarattığı fırsat maliyeti (Üretim Kaybı), fazla mesai ödemekten daha pahalıya patlıyor. Yönetim kararı olarak devamsız personelin yerini %100 fazla mesai ile doldurmak finansal olarak daha kârlıdır."
      });
    }
  
  return {
    result: Cost_Per_Absent_Hour,
    smartWarnings
  };
}
