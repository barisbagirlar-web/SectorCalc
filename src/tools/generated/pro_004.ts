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
 * ID: PRO_004
 * Name: Endüstriyel Amortisman ve Yenileme (Reel EUAC)
 */

export const InputSchema_PRO_004 = z.object({
  acq_cost: z.number(),
  salvage: z.number(),
  life: z.number(),
  tax_rate: z.number(),
  nominal_wacc: z.number(),
  inflation: z.number(),
  base_maint: z.number(),
  maint_gradient: z.number(),
  base_energy: z.number(),
  deg_rate: z.number(),
  elec_price: z.number(),
});

export type Input_PRO_004 = z.infer<typeof InputSchema_PRO_004>;

export interface Output_PRO_004 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_004(input: Input_PRO_004): Output_PRO_004 {
  const validData = InputSchema_PRO_004.parse(input);
  const { acq_cost, salvage, life, tax_rate, nominal_wacc, inflation, base_maint, maint_gradient, base_energy, deg_rate, elec_price } = validData as any;
  
  const RealWACC = ((1 + (nominal_wacc/100)) / (1 + (inflation/100))) - 1;
  const Depr_Annual = (acq_cost - salvage) / life;
  const TaxShield_PV = Array.from({length: life}, (_, i) => { const t = i + 1; return  (Depr_Annual * (tax_rate/100)) / Math.pow(1 + (nominal_wacc/100), t) ; }).reduce((a,b)=>a+b, 0);
  const Maint_t = base_maint + ((t - 1) * maint_gradient);
  const Energy_t = base_energy * elec_price * Math.pow(1 + (deg_rate/100), t);
  const OpEx_PV_Real = Array.from({length: life}, (_, i) => { const t = i + 1; return  ((Maint_t + Energy_t) * (1 - (tax_rate/100))) / Math.pow(1 + RealWACC, t) ; }).reduce((a,b)=>a+b, 0);
  const Salvage_PV = salvage / Math.pow(1 + (nominal_wacc/100), life);
  const Net_NPV = acq_cost - TaxShield_PV + OpEx_PV_Real - Salvage_PV;
  const Real_EUAC = Net_NPV * (RealWACC * Math.pow(1 + RealWACC, life)) / (Math.pow(1 + RealWACC, life) - 1);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (maint_gradient > (base_maint * 0.2)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Bakım Gradyanı",
        message: "Uyarı: Makinenin bakım artış eğrisi çok dik. Ekonomik ömür, faydalı ömürden çok daha erken dolacaktır."
      });
    }
  
  return {
    result: Real_EUAC,
    smartWarnings
  };
}
