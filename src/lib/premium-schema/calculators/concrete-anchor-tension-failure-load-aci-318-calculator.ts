import { BetonAnkrajAnchorCekmeKopmaYukuAci318AppendixDCalculator145InputSchema, type BetonAnkrajAnchorCekmeKopmaYukuAci318AppendixDCalculator145Input } from "./beton-ankraj-anchor-cekme-kopma-yuku-aci-318-appendix-d-calculator-145-validation";

export const calculateBetonAnkrajAnchorCekmeKopmaYukuAci318AppendixDCalculator145Contract: any = {
  id: "beton-ankraj-anchor-cekme-kopma-yuku-aci-318-appendix-d-calculator-145",
  version: "1.0.0",
  category: "cost",
  inputSchema: BetonAnkrajAnchorCekmeKopmaYukuAci318AppendixDCalculator145InputSchema,
  
  execute: async (input: any) => {
    try {
    // Formula: k_factor = IF(concrete_condition == 'Çatlaksız (Uncracked)', 10.0, 7.0)
    // Formula: N_b_Basic_Cone_kN = (k_factor * SQRT(concrete_fc) * POWER(embed_depth_hef, 1.5)) / 1000
    // Formula: A_Nc_Projected_Area = POWER(3 * embed_depth_hef, 2)
    // Formula: Edge_Factor_psi_ed_N = IF(edge_distance < (1.5 * embed_depth_hef), 0.7 + 0.3 * (edge_distance / (1.5 * embed_depth_hef)), 1.0)
    // Formula: N_cb_Concrete_Breakout_kN = N_b_Basic_Cone_kN * Edge_Factor_psi_ed_N
    // Formula: A_se_Steel_Area = (PI / 4) * POWER(anchor_dia_d * 0.8, 2)
    // Formula: N_sa_Steel_Yield_kN = (A_se_Steel_Area * steel_uts) / 1000
    // Formula: Governing_Capacity_kN = MIN(N_cb_Concrete_Breakout_kN, N_sa_Steel_Yield_kN)
    // Formula: Safety_Factor_Actual = Governing_Capacity_kN / applied_tension

      const concreteFc = input.concreteFc;
      const embedDepthHef = input.embedDepthHef;
      const anchorDiaD = input.anchorDiaD;
      const steelUts = input.steelUts;
      const edgeDistance = input.edgeDistance;
      const concreteCondition = input.concreteCondition;

      // k factor based on concrete condition (assumed: 1 = uncracked, 0 = cracked)
      const kFactor = concreteCondition === 1 ? 10.0 : 7.0;

      // N_b Basic Cone in kN
      const nBBasicConeKN = (kFactor * Math.sqrt(concreteFc) * Math.pow(embedDepthHef, 1.5)) / 1000;

      // A_Nc Projected Area in mm²
      const aNcProjectedArea = Math.pow(3 * embedDepthHef, 2);

      // Edge Factor psi_ed_N
      const edgeFactorPsiEdN = edgeDistance < (1.5 * embedDepthHef) 
        ? 0.7 + 0.3 * (edgeDistance / (1.5 * embedDepthHef)) 
        : 1.0;

      // Concrete breakout capacity in kN
      const nCbConcreteBreakoutKN = nBBasicConeKN * edgeFactorPsiEdN;

      // Effective steel area in mm²
      const aSeSteelArea = (Math.PI / 4) * Math.pow(anchorDiaD * 0.8, 2);

      // Steel yield capacity in kN
      const nSaSteelYieldKN = (aSeSteelArea * steelUts) / 1000;

      // Governing capacity in kN
      const governingCapacityKN = Math.min(nCbConcreteBreakoutKN, nSaSteelYieldKN);

      // Safety factor (assuming applied_tension is provided, default to 1 if not present)
      const appliedTension = input.appliedTension ?? 1;
      const safetyFactorActual = governingCapacityKN / appliedTension;

      return {
        kFactor,
        nBBasicConeKN,
        aNcProjectedArea,
        edgeFactorPsiEdN,
        nCbConcreteBreakoutKN,
        aSeSteelArea,
        nSaSteelYieldKN,
        governingCapacityKN,
        safetyFactorActual
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};