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
 * ID: PRO_005
 * Name: Arıza Süresi (Downtime) Derin Maliyet Analizi
 */

export const InputSchema_PRO_005 = z.object({
  mttr_resp: z.number(),
  mttr_diag: z.number(),
  mttr_rep: z.number(),
  direct_workers: z.number(),
  indirect_workers: z.number(),
  labor_rate: z.number(),
  line_cap: z.number(),
  unit_margin: z.number(),
  idle_power: z.number(),
  elec_rate: z.number(),
  rampup_time: z.number(),
  rampup_scrap: z.number(),
  unit_cogs: z.number(),
  waiting_trucks: z.number(),
  demurrage: z.number(),
  sla_prob: z.number(),
  sla_penalty: z.number(),
});

export type Input_PRO_005 = z.infer<typeof InputSchema_PRO_005>;

export interface Output_PRO_005 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_005(input: Input_PRO_005): Output_PRO_005 {
  const validData = InputSchema_PRO_005.parse(input);
  const { mttr_resp, mttr_diag, mttr_rep, direct_workers, indirect_workers, labor_rate, line_cap, unit_margin, idle_power, elec_rate, rampup_time, rampup_scrap, unit_cogs, waiting_trucks, demurrage, sla_prob, sla_penalty } = validData as any;
  
  const DowntimeHrs = (mttr_resp + mttr_diag + mttr_rep) / 60;
  const RampUpHrs = rampup_time / 60;
  const LaborLoss = (DowntimeHrs + RampUpHrs) * labor_rate * (direct_workers + indirect_workers);
  const ProdLoss_Fixed = DowntimeHrs * line_cap * unit_margin;
  const ProdLoss_RampUp = RampUpHrs * line_cap * unit_margin * (rampup_scrap / 100);
  const QualityLoss_RampUp = RampUpHrs * line_cap * (rampup_scrap / 100) * unit_cogs;
  const EnergyWaste = DowntimeHrs * idle_power * elec_rate;
  const SupplyChainImpact = (DowntimeHrs * waiting_trucks * demurrage) + ((sla_prob / 100) * sla_penalty);
  const TotalCost = LaborLoss + ProdLoss_Fixed + ProdLoss_RampUp + QualityLoss_RampUp + EnergyWaste + SupplyChainImpact;
  const CostPerMinute = TotalCost / ((DowntimeHrs * 60) + rampup_time);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (QualityLoss_RampUp > ProdLoss_Fixed) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Fire Analizi",
        message: "Uyarı: Makine yeniden başlatılırken oluşan firelerin maliyeti, duruş esnasındaki fırsat kaybını aşıyor. Ramp-up kalibrasyon sürecini iyileştirin."
      });
    }
  
  return {
    result: CostPerMinute,
    smartWarnings
  };
}
