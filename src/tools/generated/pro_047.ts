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
 * ID: PRO_047
 * Name: F-Gaz Sızıntı Regülasyonu ve Karbon Eşdeğeri (tCO2e)
 */

export const InputSchema_PRO_047 = z.object({
  gwp_value: z.number(),
  charge_kg: z.number(),
  device_count: z.number(),
  leak_rate_pct: z.number(),
  test_cost: z.number(),
  gas_price: z.number(),
});

export type Input_PRO_047 = z.infer<typeof InputSchema_PRO_047>;

export interface Output_PRO_047 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_047(input: Input_PRO_047): Output_PRO_047 {
  const validData = InputSchema_PRO_047.parse(input);
  const { gwp_value, charge_kg, device_count, leak_rate_pct, test_cost, gas_price } = validData as any;
  
  const Total_Charge = charge_kg * device_count;
  const tCO2e_PerDevice = (charge_kg * gwp_value) / 1000;
  const Total_tCO2e = tCO2e_PerDevice * device_count;
  const Test_Frequency_Factor = ((tCO2e_PerDevice >= 500) ? (4) : (IF(tCO2e_PerDevice >= 50, 2, IF(tCO2e_PerDevice >= 5, 1, 0))));
  const Annual_Test_Cost = Test_Frequency_Factor * device_count * test_cost;
  const Annual_Leak_kg = Total_Charge * (leak_rate_pct / 100);
  const Leakage_Cost = Annual_Leak_kg * gas_price;
  const Leaked_Emissions_tCO2e = (Annual_Leak_kg * gwp_value) / 1000;
  const Total_Compliance_Cost = Annual_Test_Cost + Leakage_Cost;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Test_Frequency_Factor === 0) {
      smartWarnings.push({
        severity: "INFO",
        source: "F-Gas Yönetmeliği",
        message: "Bilgi: Cihaz başına düşen CO2 eşdeğeri 5 tonun altındadır. Yasal olarak periyodik sızıntı testi zorunluluğunuz bulunmamaktadır."
      });
    }

    if (Test_Frequency_Factor >= 2) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "F-Gas Yönetmeliği",
        message: "Yasal Uyarı: Sistem başına 50 Ton CO2e sınırı aşılmıştır. Sertifikalı uzmanlarca yasal olarak en az 6 AYDA BİR (eğer 500 tonu aşıyorsa 3 AYDA BİR) sızıntı testi yaptırmak ve kayıt tutmak ZORUNLUDUR."
      });
    }
  
  return {
    result: Total_Compliance_Cost,
    smartWarnings
  };
}
