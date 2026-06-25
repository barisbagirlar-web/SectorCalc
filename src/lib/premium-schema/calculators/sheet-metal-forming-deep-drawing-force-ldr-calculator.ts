import { SacSekillendirmeDerinCekmeDeepDrawingKuvvetiVeLdrCalculator152InputSchema, type SacSekillendirmeDerinCekmeDeepDrawingKuvvetiVeLdrCalculator152Input } from "./sac-sekillendirme-derin-cekme-deep-drawing-kuvveti-ve-ldr-calculator-152-validation";

export const calculateSacSekillendirmeDerinCekmeDeepDrawingKuvvetiVeLdrCalculator152Contract: any = {
  id: "sac-sekillendirme-derin-cekme-deep-drawing-kuvveti-ve-ldr-calculator-152",
  version: "1.0.0",
  category: "cost",
  inputSchema: SacSekillendirmeDerinCekmeDeepDrawingKuvvetiVeLdrCalculator152InputSchema,
  
  execute: async (input: any) => {
    try {
      const blankDia = Number(input.blankDia);
      const punchDia = Number(input.punchDia);
      const sheetThickness = Number(input.sheetThickness);
      const uts = Number(input.uts);
      const frictionCoeff = Number(input.frictionCoeff);
      const clearance = Number(input.clearance);

      if (blankDia <= 0 || punchDia <= 0 || sheetThickness <= 0 || uts <= 0) {
        throw new Error("All dimensions and material properties must be positive values");
      }

      // Drawing Ratio LDR
      const drawingRatioLDR = blankDia / punchDia;

      // Thickness Ratio Percent
      const thicknessRatioPct = (sheetThickness / blankDia) * 100;

      // Blank Holding Force (N)
      // F_h = (π/4) * (D² - d²) * (0.015 * Rm)
      const blankHoldingForceN = (Math.PI / 4) * (Math.pow(blankDia, 2) - Math.pow(punchDia, 2)) * (0.015 * uts);

      // Drawing Force Max (N)
      // F_d = π * d * t * Rm * ((D/d) - 0.7)
      const drawingForceMaxN = Math.PI * punchDia * sheetThickness * uts * ((blankDia / punchDia) - 0.7);

      // Total Press Force (Ton)
      const totalPressForceTon = (drawingForceMaxN + blankHoldingForceN) / 9810;

      // Clearance Ratio
      const clearanceRatio = clearance / sheetThickness;

      return {
        drawingRatioLDR,
        thicknessRatioPct,
        blankHoldingForceN,
        drawingForceMaxN,
        totalPressForceTon,
        clearanceRatio
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};