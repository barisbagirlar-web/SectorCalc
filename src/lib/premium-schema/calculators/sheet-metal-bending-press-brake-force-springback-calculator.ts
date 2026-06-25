import { SacBukumAbkantKuvvetiVeGeriYaylanmaCalculator112InputSchema, type SacBukumAbkantKuvvetiVeGeriYaylanmaCalculator112Input } from "./sac-bukum-abkant-kuvveti-ve-geri-yaylanma-calculator-112-validation";

export const calculateSacBukumAbkantKuvvetiVeGeriYaylanmaCalculator112Contract: any = {
  id: "sac-bukum-abkant-kuvveti-ve-geri-yaylanma-calculator-112",
  version: "1.0.0",
  category: "cost",
  inputSchema: SacBukumAbkantKuvvetiVeGeriYaylanmaCalculator112InputSchema,
  
  execute: async (input: any) => {
    try {
      const thickness = Number(input.thickness);
      const bendLength = Number(input.bendLength);
      const uts = Number(input.uts);
      const vOpening = Number(input.vOpening);
      const kFactor = Number(input.kFactor);
      const pressCapacity = Number(input.pressCapacity);

      // Formula: Bending_Force_N = (1.33 * uts * bendLength * (thickness^2)) / vOpening
      const bendingForceN = (1.33 * uts * bendLength * Math.pow(thickness, 2)) / vOpening;

      // Formula: Bending_Force_Ton = Bending_Force_N / 9810
      const bendingForceTon = bendingForceN / 9810;

      // Formula: Min_V_Opening_Req = IF(thickness <= 3, 6 * thickness, IF(thickness <= 10, 8 * thickness, 10 * thickness))
      let minVOpeningReq: number;
      if (thickness <= 3) {
        minVOpeningReq = 6 * thickness;
      } else if (thickness <= 10) {
        minVOpeningReq = 8 * thickness;
      } else {
        minVOpeningReq = 10 * thickness;
      }

      // Formula: Springback_Estimate_Deg = (0.5 * thickness) / (vOpening / 2)
      const springbackEstimateDeg = (0.5 * thickness) / (vOpening / 2);

      // Formula: Capacity_Utilization_Pct = (Bending_Force_Ton / pressCapacity) * 100
      const capacityUtilizationPct = (bendingForceTon / pressCapacity) * 100;

      return {
        bendingForceN,
        bendingForceTon,
        minVOpeningReq,
        springbackEstimateDeg,
        capacityUtilizationPct
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};