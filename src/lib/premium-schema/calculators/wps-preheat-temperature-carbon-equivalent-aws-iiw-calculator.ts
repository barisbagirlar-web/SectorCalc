import { WpsOnIsitmaSicakligiVeKarbonEsdegeriAwsiiwCalculator89InputSchema, type WpsOnIsitmaSicakligiVeKarbonEsdegeriAwsiiwCalculator89Input } from "./wps-on-isitma-sicakligi-ve-karbon-esdegeri-awsiiw-calculator-89-validation";

export const calculateWpsOnIsitmaSicakligiVeKarbonEsdegeriAwsiiwCalculator89Contract: any = {
  id: "wps-on-isitma-sicakligi-ve-karbon-esdegeri-awsiiw-calculator-89",
  version: "1.0.0",
  category: "cost",
  inputSchema: WpsOnIsitmaSicakligiVeKarbonEsdegeriAwsiiwCalculator89InputSchema,
  
  execute: async (input: any): Promise<{
    cEIIW: number;
    preheatCE: number;
    preheatThickness: number;
    requiredPreheat: number;
  }> => {
    try {
      const {
        cPct = 0,
        mnPct = 0,
        crPct = 0,
        moPct = 0,
        vPct = 0,
        niPct = 0,
        cuPct = 0,
        thickness = 0,
        hydrogenLevel = 0
      } = input;

      // Formula: CE_IIW = c_pct + (mn_pct / 6) + ((cr_pct + mo_pct + v_pct) / 5) + ((ni_pct + cu_pct) / 15)
      const cEIIW = cPct + (mnPct / 6) + ((crPct + moPct + vPct) / 5) + ((niPct + cuPct) / 15);

      // Formula: Preheat_CE = IF(CE_IIW < 0.45, 0, IF(CE_IIW < 0.60, 100 + (CE_IIW - 0.45) * 1000, 200 + (CE_IIW - 0.60) * 500))
      let preheatCE: number;
      if (cEIIW < 0.45) {
        preheatCE = 0;
      } else if (cEIIW < 0.60) {
        preheatCE = 100 + (cEIIW - 0.45) * 1000;
      } else {
        preheatCE = 200 + (cEIIW - 0.60) * 500;
      }

      // Formula: Preheat_Thickness = IF(thickness < 20, 0, IF(thickness < 40, 50, IF(thickness < 60, 100, 150)))
      let preheatThickness: number;
      if (thickness < 20) {
        preheatThickness = 0;
      } else if (thickness < 40) {
        preheatThickness = 50;
      } else if (thickness < 60) {
        preheatThickness = 100;
      } else {
        preheatThickness = 150;
      }

      // Formula: Required_Preheat = MAX(Preheat_CE, Preheat_Thickness) + hydrogen_level
      const requiredPreheat = Math.max(preheatCE, preheatThickness) + hydrogenLevel;

      return {
        cEIIW: Math.round(cEIIW * 10000) / 10000,
        preheatCE: Math.round(preheatCE * 100) / 100,
        preheatThickness: Math.round(preheatThickness * 100) / 100,
        requiredPreheat: Math.round(requiredPreheat * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};