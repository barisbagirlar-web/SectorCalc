import { BoruHatlarindaSuKocuAkustikSonumlemeVeKelepceStatikYukuCalculator182InputSchema, type BoruHatlarindaSuKocuAkustikSonumlemeVeKelepceStatikYukuCalculator182Input } from "./boru-hatlarinda-su-kocu-akustik-sonumleme-ve-kelepce-statik-yuku-calculator-182-validation";

export const calculateBoruHatlarindaSuKocuAkustikSonumlemeVeKelepceStatikYukuCalculator182Contract: any = {
  id: "boru-hatlarinda-su-kocu-akustik-sonumleme-ve-kelepce-statik-yuku-calculator-182",
  version: "1.0.0",
  category: "cost",
  inputSchema: BoruHatlarindaSuKocuAkustikSonumlemeVeKelepceStatikYukuCalculator182InputSchema,
  
  execute: async (input: any) => {
    try {
      // Destructure inputs
      const {
        joukowskyPressureBar,
        pipeOuterDia,
        pipeWallThickness,
        clampSpacingM,
        pipeYieldStrength
      } = input;

      // Convert Joukowsky pressure from Bar to Pa (1 Bar = 100,000 Pa)
      const pressurePa = joukowskyPressureBar * 100000;

      // P_surge_pa = joukowsky_pressure_bar * 100000
      const pSurgePa = pressurePa;

      // Hoop Stress (MPa) = (P_surge_pa * D) / (2 * t * 1,000,000)
      // D and t are in mm, result in MPa
      const hoopStressMPa = (pressurePa * pipeOuterDia) / (2 * pipeWallThickness * 1000000);

      // Axial Force (N) = P_surge_pa * (π / 4) * (D / 1000)^2
      // D is converted from mm to m
      const pipeRadiusM = pipeOuterDia / 2000;
      const crossSectionalAreaM2 = Math.PI * pipeRadiusM * pipeRadiusM;
      const axialForceN = pressurePa * crossSectionalAreaM2;

      // Clamp Static Load (N) = Axial_Force_N * clamp_spacing_m
      const clampStaticLoadN = axialForceN * clampSpacingM;

      // Safety Factor = pipe_yield_strength / Hoop_Stress_MPa
      const safetyFactorPipe = hoopStressMPa > 0 ? pipeYieldStrength / hoopStressMPa : 0;

      return {
        pSurgePa,
        hoopStressMPa,
        axialForceN,
        clampStaticLoadN,
        safetyFactorPipe
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};