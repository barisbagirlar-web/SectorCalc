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
 * ID: PRO_121
 * Name: Hidrolik Sistem Enerji Kaybı ve Termal Çöküş Analizi
 */

export const InputSchema_PRO_121 = z.object({
  supply_pressure: z.number(),
  tank_pressure: z.number(),
  pump_flow: z.number(),
  leak_flow: z.number(),
  pipe_dp: z.number(),
  valve_dp: z.number(),
  cooling_cop: z.number(),
  fluid_volume: z.number(),
  fluid_price: z.number(),
  op_hours: z.number(),
  elec_rate: z.number(),
});

export type Input_PRO_121 = z.infer<typeof InputSchema_PRO_121>;

export interface Output_PRO_121 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_121(input: Input_PRO_121): Output_PRO_121 {
  const validData = InputSchema_PRO_121.parse(input);
  const { supply_pressure, tank_pressure, pump_flow, leak_flow, pipe_dp, valve_dp, cooling_cop, fluid_volume, fluid_price, op_hours, elec_rate } = validData as any;
  
  const LeakPower_kW = leak_flow * (supply_pressure - tank_pressure) / 600;
  const FrictionLoss_kW = pipe_dp * pump_flow / 600;
  const ValveLoss_kW = valve_dp * pump_flow / 600;
  const TotalLoss_kW = LeakPower_kW + FrictionLoss_kW + ValveLoss_kW;
  const CoolingEnergy_kW = TotalLoss_kW / cooling_cop;
  const AnnualEnergyCost = (TotalLoss_kW + CoolingEnergy_kW) * op_hours * elec_rate;
  const Power_Input_Est_kW = (supply_pressure * pump_flow) / 600;
  const SystemEfficiency = ((Power_Input_Est_kW - TotalLoss_kW) / Power_Input_Est_kW) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (SystemEfficiency < 60) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ISO 4413 Hidrolik Sistemler",
        message: "Termal Kaçak Riski: Sistem verimi %60'ın altına düşmüştür. Kayıp enerjinin tamamı hidrolik yağı ısıtmaktadır. Yağ sıcaklığı 60°C'yi aşarak oksidasyona uğrayacak ve viskozitesini kaybederek pompayı (Kavitasyon/Aşınma) parçalayacaktır. Acilen soğutucu kapasitesini artırın."
      });
    }
  
  return {
    result: SystemEfficiency,
    smartWarnings
  };
}
