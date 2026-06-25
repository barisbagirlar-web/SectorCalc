import { TocDarbogazKapasiteArtisiRoiAnalysisCalculator24InputSchema } from "./toc-darbogaz-kapasite-artisi-roi-analysis-calculator-24-validation";

export const calculateTocDarbogazKapasiteArtisiRoiAnalysisCalculator24Contract: any = {
  id: "toc-darbogaz-kapasite-artisi-roi-analysis-calculator-24",
  version: "1.0.0",
  category: "cost",
  inputSchema: TocDarbogazKapasiteArtisiRoiAnalysisCalculator24InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        taktTimeMin,
        bottleneckCtMin,
        targetCtMin,
        availableTimeMin,
        unitContribMargin,
        upgradeCapex,
        wacc,
        lifeYears
      } = input;

      // Guard against division by zero
      if (bottleneckCtMin <= 0 || targetCtMin <= 0 || taktTimeMin <= 0) {
        throw new Error("Cycle times and takt time must be greater than zero.");
      }

      // Current annual output based on bottleneck cycle time
      const currentAnnualOutput = availableTimeMin / bottleneckCtMin;

      // Target annual output after investment
      const targetAnnualOutput = availableTimeMin / targetCtMin;

      // Theoretical maximum demand based on customer takt time
      const theoreticalDemandMax = availableTimeMin / taktTimeMin;

      // Realized output is limited by actual demand (theoretical max)
      const realizedOutput = Math.min(targetAnnualOutput, theoreticalDemandMax);

      // Additional units produced after investment
      const additionalUnits = Math.max(0, realizedOutput - currentAnnualOutput);

      // Annual throughput gain in monetary terms
      const annualThroughputGain = additionalUnits * unitContribMargin;

      // NPV calculation: PV of annuity minus initial investment
      const waccDecimal = wacc / 100;
      let projectNPV = 0;

      if (waccDecimal > 0 && lifeYears > 0) {
        const discountFactor = (1 - Math.pow(1 + waccDecimal, -lifeYears)) / waccDecimal;
        projectNPV = (annualThroughputGain * discountFactor) - upgradeCapex;
      } else if (lifeYears > 0) {
        // If WACC is 0%, NPV is simply annual gain * years minus capex
        projectNPV = (annualThroughputGain * lifeYears) - upgradeCapex;
      }

      // Payback period in months (avoid division by zero)
      let paybackMonths = 0;
      if (annualThroughputGain > 0) {
        paybackMonths = (upgradeCapex / annualThroughputGain) * 12;
      } else {
        paybackMonths = Infinity; // Indicates never pays back
      }

      return {
        currentAnnualOutput: Math.round(currentAnnualOutput * 100) / 100,
        targetAnnualOutput: Math.round(targetAnnualOutput * 100) / 100,
        theoreticalDemandMax: Math.round(theoreticalDemandMax * 100) / 100,
        realizedOutput: Math.round(realizedOutput * 100) / 100,
        additionalUnits: Math.round(additionalUnits * 100) / 100,
        annualThroughputGain: Math.round(annualThroughputGain * 100) / 100,
        projectNPV: Math.round(projectNPV * 100) / 100,
        paybackMonths: paybackMonths === Infinity ? Infinity : Math.round(paybackMonths * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};