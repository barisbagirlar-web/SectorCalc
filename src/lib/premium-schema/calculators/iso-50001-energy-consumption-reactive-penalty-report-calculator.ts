import { Iso50001EnerjiTuketimVeReaktifCezaRaporuCalculator31InputSchema, type Iso50001EnerjiTuketimVeReaktifCezaRaporuCalculator31Input } from "./iso-50001-enerji-tuketim-ve-reaktif-ceza-raporu-calculator-31-validation";

export const calculateIso50001EnerjiTuketimVeReaktifCezaRaporuCalculator31Contract: any = {
  id: "iso-50001-enerji-tuketim-ve-reaktif-ceza-raporu-calculator-31",
  version: "1.0.0",
  category: "cost",
  inputSchema: Iso50001EnerjiTuketimVeReaktifCezaRaporuCalculator31InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        activeKwh,
        reactiveIndKvarh,
        reactiveCapKvarh,
        peakDemandKw,
        activeRate,
        reactiveRate,
        demandRate,
        penaltyLimitInd,
        penaltyLimitCap
      } = input as Iso50001EnerjiTuketimVeReaktifCezaRaporuCalculator31Input;

      // Prevent division by zero
      const safeActiveKwh = activeKwh || 0;

      // Inductive and Capacitive Ratios (in %)
      const inductiveRatio = safeActiveKwh > 0 ? (reactiveIndKvarh / safeActiveKwh) * 100 : 0;
      const capacitiveRatio = safeActiveKwh > 0 ? (reactiveCapKvarh / safeActiveKwh) * 100 : 0;

      // Inductive Penalty: only if inductive ratio exceeds limit
      const inductivePenalty = inductiveRatio > penaltyLimitInd ? reactiveIndKvarh * reactiveRate : 0;

      // Capacitive Penalty: only if capacitive ratio exceeds limit
      const capacitivePenalty = capacitiveRatio > penaltyLimitCap ? reactiveCapKvarh * reactiveRate : 0;

      // Active Energy Cost
      const activeCost = activeKwh * activeRate;

      // Demand Cost
      const demandCost = peakDemandKw * demandRate;

      // Total Bill
      const totalBill = activeCost + inductivePenalty + capacitivePenalty + demandCost;

      // Power Factor calculation (displacement PF using inductive reactive energy)
      const denominator = Math.sqrt(Math.pow(safeActiveKwh, 2) + Math.pow(reactiveIndKvarh, 2));
      const powerFactor = denominator > 0 ? safeActiveKwh / denominator : 1;

      return {
        inductiveRatio: Math.round(inductiveRatio * 100) / 100,
        capacitiveRatio: Math.round(capacitiveRatio * 100) / 100,
        inductivePenalty: Math.round(inductivePenalty * 100) / 100,
        capacitivePenalty: Math.round(capacitivePenalty * 100) / 100,
        activeCost: Math.round(activeCost * 100) / 100,
        demandCost: Math.round(demandCost * 100) / 100,
        totalBill: Math.round(totalBill * 100) / 100,
        powerFactor: Math.round(powerFactor * 10000) / 10000
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};