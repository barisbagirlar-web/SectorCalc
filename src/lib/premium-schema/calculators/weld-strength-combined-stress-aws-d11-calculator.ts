import { KaynakMukavemetiVeBirlesikGerilmeAwsD11Calculator67InputSchema, type KaynakMukavemetiVeBirlesikGerilmeAwsD11Calculator67Input } from "./kaynak-mukavemeti-ve-birlesik-gerilme-aws-d11-calculator-67-validation";

export const calculateKaynakMukavemetiVeBirlesikGerilmeAwsD11Calculator67Contract: any = {
  id: "kaynak-mukavemeti-ve-birlesik-gerilme-aws-d11-calculator-67",
  version: "1.0.0",
  category: "cost",
  inputSchema: KaynakMukavemetiVeBirlesikGerilmeAwsD11Calculator67InputSchema,
  
  execute: async (input: any) => {
    try {
      // Destructure inputs with defaults to prevent NaN
      const legSize = input.legSize ?? 10;
      const weldLength = input.weldLength ?? 10;
      const loadShear = input.loadShear ?? 10;
      const momentBend = input.momentBend ?? 10;
      const baseMetalYield = input.baseMetalYield ?? 10;
      const electrodeTensile = input.electrodeTensile ?? 10;
      const safetyFactor = input.safetyFactor ?? 10;

      // Throat (a) = leg_size * 0.7071
      const throatA = legSize * 0.7071;

      // Effective Area = Throat_a * weld_length
      const effectiveArea = throatA * weldLength;

      // Tau_Shear = load_shear / Effective_Area
      const tauShear = effectiveArea !== 0 ? loadShear / effectiveArea : 0;

      // I_Weld = (Throat_a * weld_length^3) / 12
      const iWeld = (throatA * Math.pow(weldLength, 3)) / 12;

      // Sigma_Bending = (moment_bend * (weld_length / 2)) / I_Weld
      const sigmaBending = iWeld !== 0 ? (momentBend * (weldLength / 2)) / iWeld : 0;

      // Sigma_Combined = SQRT(Sigma_Bending^2 + 3 * Tau_Shear^2)
      const sigmaCombined = Math.sqrt(Math.pow(sigmaBending, 2) + 3 * Math.pow(tauShear, 2));

      // Allowable_Stress_AWS = MIN(0.3 * electrode_tensile, 0.4 * base_metal_yield)
      const allowableStressAWS = Math.min(0.3 * electrodeTensile, 0.4 * baseMetalYield);

      // Actual_SF = Allowable_Stress_AWS / Sigma_Combined
      const actualSF = sigmaCombined !== 0 ? allowableStressAWS / sigmaCombined : 0;

      return {
        throatA,
        effectiveArea,
        tauShear,
        iWeld,
        sigmaBending,
        sigmaCombined,
        allowableStressAWS,
        actualSF
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};