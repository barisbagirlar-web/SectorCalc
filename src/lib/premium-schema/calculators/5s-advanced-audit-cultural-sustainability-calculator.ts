import { ProTool5sIleriDenetimVeKulturelSurdurulebilirlikEndeksiCalculator88InputSchema, type ProTool5sIleriDenetimVeKulturelSurdurulebilirlikEndeksiCalculator88Input } from "./5s-ileri-denetim-ve-kulturel-surdurulebilirlik-endeksi-calculator-88-validation";

export const calculateProTool5sIleriDenetimVeKulturelSurdurulebilirlikEndeksiCalculator88Contract: any = {
  id: "5s-ileri-denetim-ve-kulturel-surdurulebilirlik-endeksi-calculator-88",
  version: "1.0.0",
  category: "cost",
  inputSchema: ProTool5sIleriDenetimVeKulturelSurdurulebilirlikEndeksiCalculator88InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        seiriSort,
        seitonSet,
        seisoShine,
        seiketsuStandardize,
        shitsukeSustain,
        prevTotalScore
      } = input;

      // Total Current Score: sum of all 5S components
      const totalCurrentScore = seiriSort + seitonSet + seisoShine + seiketsuStandardize + shitsukeSustain;

      // Compliance Rate: percentage of maximum possible score (25)
      const complianceRatePct = (totalCurrentScore / 25) * 100;

      // Decay Rate: percentage change from previous period
      const decayRatePct = prevTotalScore > 0 
        ? ((prevTotalScore - totalCurrentScore) / prevTotalScore) * 100 
        : 0;

      // Weakest Link: minimum score among all 5S components
      const weakestLinkScore = Math.min(
        seiriSort,
        seitonSet,
        seisoShine,
        seiketsuStandardize,
        shitsukeSustain
      );

      // Radar Area: using formula for area of irregular pentagon
      // Area = 0.5 * sin(72°) * (sum of adjacent products)
      const angleRad = (72 * Math.PI) / 180;
      const sinAngle = Math.sin(angleRad);
      
      const radarArea = 0.5 * sinAngle * (
        (seiriSort * seitonSet) +
        (seitonSet * seisoShine) +
        (seisoShine * seiketsuStandardize) +
        (seiketsuStandardize * shitsukeSustain) +
        (shitsukeSustain * seiriSort)
      );

      return {
        totalCurrentScore: Math.round(totalCurrentScore * 100) / 100,
        complianceRatePct: Math.round(complianceRatePct * 100) / 100,
        decayRatePct: Math.round(decayRatePct * 100) / 100,
        weakestLinkScore: Math.round(weakestLinkScore * 100) / 100,
        radarArea: Math.round(radarArea * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};