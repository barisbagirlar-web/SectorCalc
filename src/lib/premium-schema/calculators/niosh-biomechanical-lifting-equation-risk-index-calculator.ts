import { NioshBiyomekanikKaldirmaDenklemiVeRiskIndeksiCalculator81InputSchema, type NioshBiyomekanikKaldirmaDenklemiVeRiskIndeksiCalculator81Input } from "./niosh-biyomekanik-kaldirma-denklemi-ve-risk-indeksi-calculator-81-validation";

export const calculateNioshBiyomekanikKaldirmaDenklemiVeRiskIndeksiCalculator81Contract: any = {
  id: "niosh-biyomekanik-kaldirma-denklemi-ve-risk-indeksi-calculator-81",
  version: "1.0.0",
  category: "cost",
  inputSchema: NioshBiyomekanikKaldirmaDenklemiVeRiskIndeksiCalculator81InputSchema,
  
  execute: async (input: any) => {
    try {
      const validatedInput = NioshBiyomekanikKaldirmaDenklemiVeRiskIndeksiCalculator81InputSchema.parse(input) as NioshBiyomekanikKaldirmaDenklemiVeRiskIndeksiCalculator81Input;

      const loadWeightL = validatedInput.loadWeightL;
      const horizontalDistH = validatedInput.horizontalDistH;
      const verticalHeightV = validatedInput.verticalHeightV;
      const verticalTravelD = validatedInput.verticalTravelD;
      const asymmetryAngleA = validatedInput.asymmetryAngleA;
      const frequencyF = validatedInput.frequencyF;
      const couplingC = validatedInput.couplingC;
      const frequencyMultiplierFm = validatedInput.frequencyMultiplierFm;

      // Constants and calculations
      const lCConstant = 23;
      
      // HM Multiplier: 25 / H (H must be > 0, capped at H >= 63 cm per NIOSH 1991 standard)
      const effectiveH = Math.max(horizontalDistH, 25); // H minimum is 25cm for realistic safe range
      const hMMultiplier = 25 / effectiveH;
      
      // VM Multiplier: 1 - (0.003 * |V - 75|)
      const vMMultiplier = 1 - (0.003 * Math.abs(verticalHeightV - 75));
      const clampedVM = Math.max(0, Math.min(1, vMMultiplier)); // VM is between 0 and 1
      
      // DM Multiplier: 0.82 + (4.5 / D)
      const effectiveD = Math.max(verticalTravelD, 25); // D minimum 25cm for realistic range
      const dMMultiplier = 0.82 + (4.5 / effectiveD);
      const clampedDM = Math.max(0, Math.min(1, dMMultiplier)); // DM is between 0 and 1
      
      // AM Multiplier: 1 - (0.0032 * A)
      // Asymmetry angle capped at 135 degrees per standard
      const effectiveA = Math.min(asymmetryAngleA, 135);
      const aMMultiplier = 1 - (0.0032 * effectiveA);
      const clampedAM = Math.max(0, Math.min(1, aMMultiplier)); // AM is between 0 and 1
      
      // Frequency Multiplier (FM) is already provided as input frequencyMultiplierFm
      const fm = frequencyMultiplierFm;
      
      // Coupling multiplier
      const coupling = couplingC;
      
      // Recommended Weight Limit (RWL)
      const recommendedWeightLimitRWL = lCConstant * hMMultiplier * clampedVM * clampedDM * clampedAM * fm * coupling;
      
      // Lifting Index (LI)
      const liftingIndexLI = recommendedWeightLimitRWL > 0 ? loadWeightL / recommendedWeightLimitRWL : 0;

      return {
        lCConstant,
        hMMultiplier,
        vMMultiplier: clampedVM,
        dMMultiplier: clampedDM,
        aMMultiplier: clampedAM,
        recommendedWeightLimitRWL,
        liftingIndexLI
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};