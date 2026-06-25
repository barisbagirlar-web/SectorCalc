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
 * ID: PRO_154
 * Name: Sac Şekillendirme: Derin Çekme (Deep Drawing) Kuvveti ve LDR
 */

export const InputSchema_PRO_154 = z.object({
  blank_dia: z.number(),
  punch_dia: z.number(),
  sheet_thickness: z.number(),
  uts: z.number(),
  friction_coeff: z.number(),
  clearance: z.number(),
});

export type Input_PRO_154 = z.infer<typeof InputSchema_PRO_154>;

export interface Output_PRO_154 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_154(input: Input_PRO_154): Output_PRO_154 {
  const validData = InputSchema_PRO_154.parse(input);
  const { blank_dia, punch_dia, sheet_thickness, uts, friction_coeff, clearance } = validData as any;
  
  const Drawing_Ratio_LDR = blank_dia / punch_dia;
  const Thickness_Ratio_Pct = (sheet_thickness / blank_dia) * 100;
  const Blank_Holding_Force_N = (Math.PI / 4) * (Math.pow(blank_dia, 2) - Math.pow(punch_dia, 2)) * (0.015 * uts);
  const Drawing_Force_Max_N = Math.PI * punch_dia * sheet_thickness * uts * ((blank_dia / punch_dia) - 0.7);
  const Total_Press_Force_Ton = (Drawing_Force_Max_N + Blank_Holding_Force_N) / 9810;
  const Clearance_Ratio = clearance / sheet_thickness;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Drawing_Ratio_LDR > 2.0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "VDI 3362 Sac Metal Standartları",
        message: "Yırtılma (Tearing) Garantisi: Sınır Çekme Oranı (LDR) 2.0'yi aşmaktadır. Malzeme tek seferde bu kadar derin çekilemez, zımba köşesinden (Punch radius) anında yırtılacaktır. İşlemi birden fazla kademeye (Re-drawing) bölün."
      });
    }

    if (Clearance_Ratio < 1.1) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Kalıp Tasarım Geometrisi",
        message: "Ütüleme Riski: Zımba ile matris arasındaki boşluk (Clearance), sac kalınlığının sadece %10'u kadar fazladır. Çekme esnasında sacın kalınlaşan ağız kısmı kalıba sıkışacak ve 'Ütüleme (Ironing)' etkisine girerek presi zorlayacaktır."
      });
    }
  
  return {
    result: Clearance_Ratio,
    smartWarnings
  };
}
