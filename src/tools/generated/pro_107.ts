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
 * ID: PRO_107
 * Name: İSG Gürültü (OSHA) ve Titreşim (ISO 5349) Maruziyet Finansı
 */

export const InputSchema_PRO_107 = z.object({
  noise_level_dba: z.number(),
  exposure_hrs: z.number(),
  vib_acceleration: z.number(),
  workers_exposed: z.number(),
  ppe_cost: z.number(),
  medical_screening: z.number(),
  fatigue_defect_rate: z.number(),
  annual_volume: z.number(),
  cost_per_defect: z.number(),
});

export type Input_PRO_107 = z.infer<typeof InputSchema_PRO_107>;

export interface Output_PRO_107 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_107(input: Input_PRO_107): Output_PRO_107 {
  const validData = InputSchema_PRO_107.parse(input);
  const { noise_level_dba, exposure_hrs, vib_acceleration, workers_exposed, ppe_cost, medical_screening, fatigue_defect_rate, annual_volume, cost_per_defect } = validData as any;
  
  const Noise_Dose_Pct = 100 * (exposure_hrs / (8 / Math.pow(2, (noise_level_dba - 90) / 5)));
  const TWA_Noise = 16.61 * Math.log10(Noise_Dose_Pct / 100) + 90;
  const A_hv_8 = vib_acceleration * Math.sqrt(exposure_hrs / 8);
  const Compliance_Cost_Noise = ((TWA_Noise >= 85) ? (workers_exposed * (ppe_cost + medical_screening)) : (0));
  const Compliance_Cost_Vib = ((A_hv_8 >= 2.5) ? (workers_exposed * (ppe_cost + medical_screening)) : (0));
  const Fatigue_Quality_Loss = (fatigue_defect_rate / 100) * annual_volume * cost_per_defect;
  const Total_Exposure_Risk_Cost = Compliance_Cost_Noise + Compliance_Cost_Vib + Fatigue_Quality_Loss;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (TWA_Noise >= 85) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "OSHA 1910.95 İşitme Koruması",
        message: "Yasal İhlal Riski: Gürültü maruziyeti (TWA) 85 dBA Aksiyon Seviyesini aşmıştır. İşverenin işitme koruma programı başlatması, gürültü haritası çıkarması ve odyometrik testleri yapması YASAL ZORUNLULUKTUR."
      });
    }

    if (A_hv_8 >= 5.0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ISO 5349-1 El-Kol Titreşimi",
        message: "Akut Beyaz Parmak Riski: Titreşim ivmesi sınır değeri (5.0 m/s²) aşmıştır. Operatörde kalıcı sinir ve damar hasarı (Vibration White Finger) oluşacaktır. Titreşim sönümleyici eldivenler yetersizdir; takımın mekaniği değiştirilmeli veya rotasyon uygulanmalıdır."
      });
    }
  
  return {
    result: Total_Exposure_Risk_Cost,
    smartWarnings
  };
}
