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
 * ID: PRO_105
 * Name: Nakit Dönüşüm Süresi (CCC) ve Fonlama Maliyeti
 */

export const InputSchema_PRO_105 = z.object({
  avg_ar: z.number(),
  avg_ap: z.number(),
  avg_inv: z.number(),
  cogs: z.number(),
  annual_revenue: z.number(),
  wacc_daily: z.number(),
  cash_reserve: z.number(),
});

export type Input_PRO_105 = z.infer<typeof InputSchema_PRO_105>;

export interface Output_PRO_105 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_105(input: Input_PRO_105): Output_PRO_105 {
  const validData = InputSchema_PRO_105.parse(input);
  const { avg_ar, avg_ap, avg_inv, cogs, annual_revenue, wacc_daily, cash_reserve } = validData as any;
  
  const DSO_Days_Sales_Outstanding = (avg_ar / annual_revenue) * 365;
  const DIO_Days_Inventory_Outstanding = (avg_inv / cogs) * 365;
  const DPO_Days_Payable_Outstanding = (avg_ap / cogs) * 365;
  const CCC_Cash_Conversion_Cycle = DSO_Days_Sales_Outstanding + DIO_Days_Inventory_Outstanding - DPO_Days_Payable_Outstanding;
  const Daily_Sales_Rate = annual_revenue / 365;
  const Cash_Gap_Value = CCC_Cash_Conversion_Cycle * Daily_Sales_Rate;
  const Financing_Cost_Needed = Math.max(0, Cash_Gap_Value - cash_reserve) * (wacc_daily / 100) * CCC_Cash_Conversion_Cycle;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (CCC_Cash_Conversion_Cycle < 0) {
      smartWarnings.push({
        severity: "INFO",
        source: "İşletme Sermayesi Analizi",
        message: "Finansal Güç: Nakit Dönüşüm Süreniz (CCC) negatiftir. Tedarikçilerinize ödeme yapmadan önce müşterilerinizden tahsilat yapıyor ve stoklarınızı satıyorsunuz. Şirket büyümesini dış borçlanma olmadan (Self-funding) kendi işletme sermayesiyle finanse edebiliyor."
      });
    }

    if (false) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Nakit Akış Riski",
        message: "Likitide Krizi: Tahsilatlarınız (DSO) 90 günü aşarken tedarikçilere (DPO) 30 günden önce ödeme yapıyorsunuz. Devasa bir nakit açığı fonlaması (Financing Cost) bilançoyu aşındırmaktadır. Faktoring veya tedarikçi finansmanı (Supply Chain Finance) kullanın."
      });
    }
  
  return {
    result: Financing_Cost_Needed,
    smartWarnings
  };
}
