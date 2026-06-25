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
 * ID: PRO_147
 * Name: Beton Ankraj (Anchor) Çekme Kopma Yükü (ACI 318 Appendix D)
 */

export const InputSchema_PRO_147 = z.object({
  concrete_fc: z.number(),
  embed_depth_hef: z.number(),
  anchor_dia_d: z.number(),
  steel_uts: z.number(),
  edge_distance: z.number(),
  concrete_condition: z.enum(["Çatlaklı (Cracked)", "Çatlaksız (Uncracked)"]),
  applied_tension: z.number(),
});

export type Input_PRO_147 = z.infer<typeof InputSchema_PRO_147>;

export interface Output_PRO_147 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_147(input: Input_PRO_147): Output_PRO_147 {
  const validData = InputSchema_PRO_147.parse(input);
  const { concrete_fc, embed_depth_hef, anchor_dia_d, steel_uts, edge_distance, concrete_condition, applied_tension } = validData as any;
  
  const k_factor = ((concrete_condition == 'Çatlaksız (Uncracked)') ? (10.0) : (7.0));
  const N_b_Basic_Cone_kN = (k_factor * Math.sqrt(concrete_fc) * Math.pow(embed_depth_hef, 1.5)) / 1000;
  const A_Nc_Projected_Area = Math.pow(3 * embed_depth_hef, 2);
  const Edge_Factor_psi_ed_N = ((edge_distance < (1.5 * embed_depth_hef)) ? (0.7 + 0.3 * (edge_distance / (1.5 * embed_depth_hef))) : (1.0));
  const N_cb_Concrete_Breakout_kN = N_b_Basic_Cone_kN * Edge_Factor_psi_ed_N;
  const A_se_Steel_Area = (Math.PI / 4) * Math.pow(anchor_dia_d * 0.8, 2);
  const N_sa_Steel_Yield_kN = (A_se_Steel_Area * steel_uts) / 1000;
  const Governing_Capacity_kN = Math.min(N_cb_Concrete_Breakout_kN, N_sa_Steel_Yield_kN);
  const Safety_Factor_Actual = Governing_Capacity_kN / applied_tension;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Safety_Factor_Actual < 1.5) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Hilti / ACI 318 Kılavuzu",
        message: "Göçme / Kopma Garantisi: Uygulanan yük, ankrajın kapasitesine çok yakın veya üzerindedir. Güvenlik faktörü (SF) yetersiz."
      });
    }

    if (N_cb_Concrete_Breakout_kN < N_sa_Steel_Yield_kN) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Kırılma Modu Analizi",
        message: "Gevrek (Brittle) Kırılma Modu: Ankrajın çelik gövdesi kopmadan önce, 'Beton Koni Kopması (Breakout)' gerçekleşecektir. Bu kırılma tipi anidir ve haber vermez (Sünek değildir). Gömülme derinliğini (hef) artırarak kapasiteyi çelik sınırına taşıyın."
      });
    }
  
  return {
    result: Safety_Factor_Actual,
    smartWarnings
  };
}
