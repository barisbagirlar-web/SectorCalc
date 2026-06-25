import { BilesikFaizEnflasyonVeReelGetiriSurekliBilesikCalculator49InputSchema, type BilesikFaizEnflasyonVeReelGetiriSurekliBilesikCalculator49Input } from "./bilesik-faiz-enflasyon-ve-reel-getiri-surekli-bilesik-calculator-49-validation";

export const calculateBilesikFaizEnflasyonVeReelGetiriSurekliBilesikCalculator49Contract: any = {
  id: "bilesik-faiz-enflasyon-ve-reel-getiri-surekli-bilesik-calculator-49",
  version: "1.0.0",
  category: "cost",
  inputSchema: BilesikFaizEnflasyonVeReelGetiriSurekliBilesikCalculator49InputSchema,
  
  execute: async (input: any) => {
    try {
      const pv = input.pv as number;
      const pmt = input.pmt as number;
      const annualRate = input.annualRate as number;
      const compoundingFreq = input.compoundingFreq as string;
      const inflationRate = input.inflationRate as number;
      const taxRate = input.taxRate as number;

      const rDec = annualRate / 100;
      const inflationDec = inflationRate / 100;
      const taxDec = taxRate / 100;
      const durationYrs = 1; // Default 1 year for continuous compounding calculation context

      // Determine m_comp based on compounding frequency
      let mComp: number;
      if (compoundingFreq === "Aylık") {
        mComp = 12;
      } else if (compoundingFreq === "Yıllık") {
        mComp = 1;
      } else {
        mComp = 0; // Continuous compounding
      }

      let fVPrincipal: number;
      let fVContributions: number;

      // FV of Principal
      if (mComp === 0) {
        // Continuous compounding
        fVPrincipal = pv * Math.exp(rDec * durationYrs);
      } else {
        fVPrincipal = pv * Math.pow(1 + (rDec / mComp), mComp * durationYrs);
      }

      // FV of Contributions
      if (mComp === 0) {
        // Continuous compounding
        fVContributions = pmt * 12 * ((Math.exp(rDec * durationYrs) - 1) / rDec);
      } else {
        fVContributions = pmt * ((Math.pow(1 + (rDec / 12), 12 * durationYrs) - 1) / (rDec / 12));
      }

      const totalFV = fVPrincipal + fVContributions;
      const totalInvested = pv + (pmt * 12 * durationYrs);
      const grossInterest = totalFV - totalInvested;
      const netInterestAfterTax = grossInterest * (1 - taxDec);
      const netFV = totalInvested + netInterestAfterTax;
      const realReturnRate = (((1 + rDec) / (1 + inflationDec)) - 1) * 100;
      const purchasingPowerFV = netFV / Math.pow(1 + inflationDec, durationYrs);

      return {
        mComp,
        rDec,
        fVPrincipal: Math.round(fVPrincipal * 100) / 100,
        fVContributions: Math.round(fVContributions * 100) / 100,
        totalFV: Math.round(totalFV * 100) / 100,
        totalInvested: Math.round(totalInvested * 100) / 100,
        grossInterest: Math.round(grossInterest * 100) / 100,
        netInterestAfterTax: Math.round(netInterestAfterTax * 100) / 100,
        netFV: Math.round(netFV * 100) / 100,
        realReturnRate: Math.round(realReturnRate * 100) / 100,
        purchasingPowerFV: Math.round(purchasingPowerFV * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};