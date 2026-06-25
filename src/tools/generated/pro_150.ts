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
 * ID: PRO_150
 * Name: HVAC Karışım Havası, Duyulur ve Gizli (Latent) Soğutma Yükü
 */

export const InputSchema_PRO_150 = z.object({
  outdoor_flow_cfm: z.number(),
  outdoor_t_db: z.number(),
  outdoor_w: z.number(),
  return_flow_cfm: z.number(),
  return_t_db: z.number(),
  return_w: z.number(),
  supply_t_db: z.number(),
  supply_w: z.number(),
});

export type Input_PRO_150 = z.infer<typeof InputSchema_PRO_150>;

export interface Output_PRO_150 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_150(input: Input_PRO_150): Output_PRO_150 {
  const validData = InputSchema_PRO_150.parse(input);
  const { outdoor_flow_cfm, outdoor_t_db, outdoor_w, return_flow_cfm, return_t_db, return_w, supply_t_db, supply_w } = validData as any;
  
  const Total_Flow_CFM = outdoor_flow_cfm + return_flow_cfm;
  const Mix_T_db = ((outdoor_flow_cfm * outdoor_t_db) + (return_flow_cfm * return_t_db)) / Total_Flow_CFM;
  const Mix_W_grains = ((outdoor_flow_cfm * outdoor_w) + (return_flow_cfm * return_w)) / Total_Flow_CFM;
  const Sensible_Cooling_BTUh = 1.08 * Total_Flow_CFM * (Mix_T_db - supply_t_db);
  const Latent_Cooling_BTUh = 0.68 * Total_Flow_CFM * (Mix_W_grains - supply_w);
  const Total_Cooling_Load_BTUh = Sensible_Cooling_BTUh + Latent_Cooling_BTUh;
  const Total_Cooling_Tons = Total_Cooling_Load_BTUh / 12000;
  const Sensible_Heat_Ratio_SHR = Sensible_Cooling_BTUh / Total_Cooling_Load_BTUh;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Sensible_Heat_Ratio_SHR < 0.65) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ASHRAE Psikrometrik Standartlar",
        message: "Yoğuşma (Nem) İhbarı: Duyulur Isı Oranı (SHR) çok düşüktür (%65'in altı). Soğutma bataryası enerjisinin büyük kısmını havadaki suyu yoğuşturmak (Latent/Gizli ısı) için harcamaktadır. Standart klimalar (DX) bu yükü çekemez; özel nem alıcı sistemler (Desiccant) veya derin soğutma+tekrar ısıtma (Reheat) prosesi şarttır."
      });
    }
  
  return {
    result: Sensible_Heat_Ratio_SHR,
    smartWarnings
  };
}
