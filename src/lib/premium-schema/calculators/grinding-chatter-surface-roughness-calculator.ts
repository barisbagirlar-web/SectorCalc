import { TalaslamaTitresimChatterVeYuzeyPuruzluluguCalculator15InputSchema, type TalaslamaTitresimChatterVeYuzeyPuruzluluguCalculator15Input } from "./talaslama-titresim-chatter-ve-yuzey-puruzlulugu-calculator-15-validation";

export const calculateTalaslamaTitresimChatterVeYuzeyPuruzluluguCalculator15Contract: any = {
  id: "talaslama-titresim-chatter-ve-yuzey-puruzlulugu-calculator-15",
  version: "1.0.0",
  category: "cost",
  inputSchema: TalaslamaTitresimChatterVeYuzeyPuruzluluguCalculator15InputSchema,
  
  execute: async (input: any) => {
    try {
      const vc = input.vc; // m/dk
      const dTool = input.dTool; // mm
      const fz = input.fz; // mm/diş
      const z = input.z; // adet
      const rEpsilon = input.rEpsilon; // mm
      const ap = input.ap; // mm
      const chatterFactor = input.chatterFactor; // katsayı
      const raLimit = input.raLimit; // μm

      // RPM = (vc * 1000) / (PI * d_tool)
      const rpm = (vc * 1000) / (Math.PI * dTool);

      // FeedRate = fz * z * RPM
      const feedRate = fz * z * rpm;

      // Rz_theo = (fz^2 / (8 * r_epsilon)) * 1000  (convert to μm)
      const rzTheo = (Math.pow(fz, 2) / (8 * rEpsilon)) * 1000;

      // Rz_actual = Rz_theo * chatter_factor
      const rzActual = rzTheo * chatterFactor;

      // Ra_approx = Rz_actual / 4
      const raApprox = rzActual / 4;

      // L_D_Ratio = ap / d_tool
      const lDRatio = ap / dTool;

      return {
        rPM: Math.round(rpm * 100) / 100,
        feedRate: Math.round(feedRate * 100) / 100,
        rzTheo: Math.round(rzTheo * 100) / 100,
        rzActual: Math.round(rzActual * 100) / 100,
        raApprox: Math.round(raApprox * 100) / 100,
        lDRatio: Math.round(lDRatio * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};