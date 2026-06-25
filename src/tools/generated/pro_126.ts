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
 * ID: PRO_126
 * Name: Kiralama vs. Satın Alma Net Avantajı (NAL)
 */

export const InputSchema_PRO_126 = z.object({
  purchase_price: z.number(),
  loan_interest_rate: z.number(),
  asset_life: z.number(),
  salvage_value: z.number(),
  tax_rate: z.number(),
  annual_lease_payment: z.number(),
  maintenance_saved: z.number(),
});

export type Input_PRO_126 = z.infer<typeof InputSchema_PRO_126>;

export interface Output_PRO_126 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_126(input: Input_PRO_126): Output_PRO_126 {
  const validData = InputSchema_PRO_126.parse(input);
  const { purchase_price, loan_interest_rate, asset_life, salvage_value, tax_rate, annual_lease_payment, maintenance_saved } = validData as any;
  
  const After_Tax_Debt_Rate = (loan_interest_rate / 100) * (1 - (tax_rate / 100));
  const Depreciation_Annual = (purchase_price - salvage_value) / asset_life;
  const PV_TaxShield_Depr = Array.from({length: life}, (_, i) => { const t = i + 1; return  (Depreciation_Annual * (tax_rate / 100)) / Math.pow(1 + After_Tax_Debt_Rate, t) ; }).reduce((a,b)=>a+b, 0);
  const PV_Salvage = (salvage_value * (1 - (tax_rate / 100))) / Math.pow(1 + After_Tax_Debt_Rate, asset_life);
  const Effective_Lease_Payment = annual_lease_payment - maintenance_saved;
  const PV_Lease = Array.from({length: life}, (_, i) => { const t = i + 1; return  (Effective_Lease_Payment * (1 - (tax_rate / 100))) / Math.pow(1 + After_Tax_Debt_Rate, t) ; }).reduce((a,b)=>a+b, 0);
  const PV_Buy = purchase_price - PV_TaxShield_Depr - PV_Salvage;
  const Net_Advantage_Leasing_NAL = PV_Buy - PV_Lease;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Net_Advantage_Leasing_NAL > 0) {
      smartWarnings.push({
        severity: "INFO",
        source: "Finansal Karar Matrisi",
        message: "Finansal Karar: Kiralamanın Net Avantajı (NAL) pozitiftir. Ekipmanı banka kredisiyle satın almak yerine kiralama (Leasing) yapmak, vergi kalkanı ve bakım tasarrufu dikkate alındığında işletmenin net bugünkü değerine pozitif katkı sağlar."
      });
    }
  
  return {
    result: Net_Advantage_Leasing_NAL,
    smartWarnings
  };
}
