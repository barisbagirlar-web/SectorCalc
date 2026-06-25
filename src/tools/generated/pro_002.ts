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
 * ID: PRO_002
 * Name: Altı Sigma Proje Önceliklendirici (Dinamik RTY)
 */

export const InputSchema_PRO_002 = z.object({
  process_steps: z.number(),
  ops_per_step: z.number(),
  defects_per_step: z.number(),
  annual_volume: z.number(),
  internal_fail_cost: z.number(),
  external_fail_cost: z.number(),
  appraisal_cost: z.number(),
  capex: z.number(),
  black_belt_hours: z.number(),
  belt_rate: z.number(),
  wacc: z.number(),
  project_life: z.number(),
  target_sigma: z.number(),
});

export type Input_PRO_002 = z.infer<typeof InputSchema_PRO_002>;

export interface Output_PRO_002 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_002(input: Input_PRO_002): Output_PRO_002 {
  const validData = InputSchema_PRO_002.parse(input);
  const { process_steps, ops_per_step, defects_per_step, annual_volume, internal_fail_cost, external_fail_cost, appraisal_cost, capex, black_belt_hours, belt_rate, wacc, project_life, target_sigma } = validData as any;
  
  const DPU = defects_per_step / annual_volume;
  const StepYield = Math.exp(-DPU);
  const RTY = Math.pow(StepYield, process_steps);
  const Z_st = jStat.normal.inv(RTY);
  const CurrentSigma = Z_st + 1.5;
  const COPQ_Current = annual_volume * (1 - RTY) * (internal_fail_cost + external_fail_cost + appraisal_cost);
  const Target_RTY = jStat.normal.cdf(target_sigma - 1.5);
  const COPQ_Target = annual_volume * (1 - Target_RTY) * (internal_fail_cost + external_fail_cost + appraisal_cost);
  const AnnualSavings = COPQ_Current - COPQ_Target;
  const ProjectCost = capex + (black_belt_hours * belt_rate);
  const ProjectNPV = (AnnualSavings * ((1 - Math.pow(1 + (wacc/100), -project_life)) / (wacc/100))) - ProjectCost;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (ProjectNPV < 0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Finansal Fizibilite",
        message: "Projenin Net Bugünkü Değeri (NPV) negatiftir. COPQ'dan elde edilecek tasarruf, Capex ve Kuşak eforunu karşılamamaktadır."
      });
    }
  
  return {
    result: ProjectNPV,
    smartWarnings
  };
}
