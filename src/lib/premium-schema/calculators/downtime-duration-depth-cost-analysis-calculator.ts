import { DowntimeDurationDowntimeDerinCostAnalysisCalculator5InputSchema, type DowntimeDurationDowntimeDerinCostAnalysisCalculator5Input } from "./downtime-duration-downtime-derin-cost-analysis-calculator-5-validation";

export const calculateDowntimeDurationDowntimeDerinCostAnalysisCalculator5Contract: any = {
  id: "downtime-duration-downtime-derin-cost-analysis-calculator-5",
  version: "1.0.0",
  category: "cost",
  inputSchema: DowntimeDurationDowntimeDerinCostAnalysisCalculator5InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        mttrResp,
        mttrDiag,
        mttrRep,
        directWorkers,
        indirectWorkers,
        laborRate,
        lineCap,
        unitMargin,
        idlePower,
        elecRate,
        rampupTime,
        rampupScrap,
        unitCogs,
        waitingTrucks,
        demurrage,
        slaProb,
        slaPenalty
      } = input;

      // Convert minutes to hours
      const downtimeHrs = (mttrResp + mttrDiag + mttrRep) / 60;
      const rampUpHrs = rampupTime / 60;

      // Labor cost calculation
      const laborLoss = (downtimeHrs + rampUpHrs) * laborRate * (directWorkers + indirectWorkers);

      // Production loss calculations
      const prodLossFixed = downtimeHrs * lineCap * unitMargin;
      const prodLossRampUp = rampUpHrs * lineCap * unitMargin * (rampupScrap / 100);

      // Quality loss during ramp-up
      const qualityLossRampUp = rampUpHrs * lineCap * (rampupScrap / 100) * unitCogs;

      // Energy waste during downtime
      const energyWaste = downtimeHrs * idlePower * elecRate;

      // Supply chain impact
      const supplyChainImpact = (downtimeHrs * waitingTrucks * demurrage) + ((slaProb / 100) * slaPenalty);

      // Total cost
      const totalCost = laborLoss + prodLossFixed + prodLossRampUp + qualityLossRampUp + energyWaste + supplyChainImpact;

      // Cost per minute
      const totalMinutes = (downtimeHrs * 60) + rampupTime;
      const costPerMinute = totalMinutes > 0 ? totalCost / totalMinutes : 0;

      return {
        downtimeHrs: Math.round(downtimeHrs * 100) / 100,
        rampUpHrs: Math.round(rampUpHrs * 100) / 100,
        laborLoss: Math.round(laborLoss * 100) / 100,
        prodLossFixed: Math.round(prodLossFixed * 100) / 100,
        prodLossRampUp: Math.round(prodLossRampUp * 100) / 100,
        qualityLossRampUp: Math.round(qualityLossRampUp * 100) / 100,
        energyWaste: Math.round(energyWaste * 100) / 100,
        supplyChainImpact: Math.round(supplyChainImpact * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        costPerMinute: Math.round(costPerMinute * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};