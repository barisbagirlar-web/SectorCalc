import { TitresimliCivataGevsemesiJunkerTestiVeOnYukKaybiCalculator155InputSchema, type TitresimliCivataGevsemesiJunkerTestiVeOnYukKaybiCalculator155Input } from "./titresimli-civata-gevsemesi-junker-testi-ve-on-yuk-kaybi-calculator-155-validation";

export const calculateTitresimliCivataGevsemesiJunkerTestiVeOnYukKaybiCalculator155Contract: any = {
  id: "titresimli-civata-gevsemesi-junker-testi-ve-on-yuk-kaybi-calculator-155",
  version: "1.0.0",
  category: "cost",
  inputSchema: TitresimliCivataGevsemesiJunkerTestiVeOnYukKaybiCalculator155InputSchema,
  
  execute: async (input: any) => {
    try {
      const boltDia = input.boltDia;
      const initialPreload = input.initialPreload;
      const transverseDisplacement = input.transverseDisplacement;
      const vibrationCycles = input.vibrationCycles;
      const frictionThread = input.frictionThread;
      const frictionHead = input.frictionHead;
      const antiLooseningFactor = input.antiLooseningFactor;

      // Formula: Self_Loosening_Threshold_mm = (friction_thread * bolt_dia) / 2
      const selfLooseningThresholdMm = (frictionThread * boltDia) / 2;

      // Formula: Slip_Condition = IF(transverse_displacement > Self_Loosening_Threshold_mm, 1, 0)
      const slipCondition = transverseDisplacement > selfLooseningThresholdMm ? 1 : 0;

      // Formula: Preload_Loss_Rate_Per_Cycle = (transverse_displacement / bolt_dia) * (1 / (friction_thread + friction_head)) * anti_loosening_factor * 0.001
      const preloadLossRatePerCycle = (transverseDisplacement / boltDia) * (1 / (frictionThread + frictionHead)) * antiLooseningFactor * 0.001;

      // Formula: Total_Preload_Loss_kN = Slip_Condition * initial_preload * (1 - EXP(-Preload_Loss_Rate_Per_Cycle * vibration_cycles))
      const totalPreloadLossKN = slipCondition * initialPreload * (1 - Math.exp(-preloadLossRatePerCycle * vibrationCycles));

      // Formula: Remaining_Preload_kN = initial_preload - Total_Preload_Loss_kN
      const remainingPreloadKN = initialPreload - totalPreloadLossKN;

      // Formula: Remaining_Preload_Pct = (Remaining_Preload_kN / initial_preload) * 100
      const remainingPreloadPct = (remainingPreloadKN / initialPreload) * 100;

      return {
        selfLooseningThresholdMm,
        slipCondition,
        preloadLossRatePerCycle,
        totalPreloadLossKN,
        remainingPreloadKN,
        remainingPreloadPct
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};