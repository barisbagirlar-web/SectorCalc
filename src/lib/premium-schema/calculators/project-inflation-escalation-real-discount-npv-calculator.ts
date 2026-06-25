import { ProjectEnflasyonEskalasyonuVeGercekIskontoNpvCalculator32InputSchema, type ProjectEnflasyonEskalasyonuVeGercekIskontoNpvCalculator32Input } from "./project-enflasyon-eskalasyonu-ve-gercek-iskonto-npv-calculator-32-validation";

export const calculateProjectEnflasyonEskalasyonuVeGercekIskontoNpvCalculator32Contract: any = {
  id: "project-enflasyon-eskalasyonu-ve-gercek-iskonto-npv-calculator-32",
  version: "1.0.0",
  category: "cost",
  inputSchema: ProjectEnflasyonEskalasyonuVeGercekIskontoNpvCalculator32InputSchema,
  
  execute: async (input: any) => {
    try {
      const baseMatCost = input.baseMatCost;
      const baseLabCost = input.baseLabCost;
      const inflMatPct = input.inflMatPct;
      const inflLabPct = input.inflLabPct;
      const projectDurationYr = input.projectDurationYr;
      const nominalDiscountRate = input.nominalDiscountRate;
      const genInflationRate = input.genInflationRate;
      const riskContingencyPct = input.riskContingencyPct;

      const escalatedMat = baseMatCost * Math.pow(1 + (inflMatPct / 100), projectDurationYr);
      const escalatedLab = baseLabCost * Math.pow(1 + (inflLabPct / 100), projectDurationYr);
      const totalEscalatedBase = escalatedMat + escalatedLab;
      const contingencyValue = totalEscalatedBase * (riskContingencyPct / 100);
      const totalProjectBudget = totalEscalatedBase + contingencyValue;
      const realDiscountRate = ((1 + (nominalDiscountRate / 100)) / (1 + (genInflationRate / 100))) - 1;
      const nPVCostReal = totalProjectBudget / Math.pow(1 + realDiscountRate, projectDurationYr);

      return {
        escalatedMat: Math.round(escalatedMat * 100) / 100,
        escalatedLab: Math.round(escalatedLab * 100) / 100,
        totalEscalatedBase: Math.round(totalEscalatedBase * 100) / 100,
        contingencyValue: Math.round(contingencyValue * 100) / 100,
        totalProjectBudget: Math.round(totalProjectBudget * 100) / 100,
        realDiscountRate: Math.round(realDiscountRate * 10000) / 10000,
        nPVCostReal: Math.round(nPVCostReal * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};