import { IcVerimOraniIrrVeModifiyeIrrMirrCalculator122InputSchema, type IcVerimOraniIrrVeModifiyeIrrMirrCalculator122Input } from "./ic-verim-orani-irr-ve-modifiye-irr-mirr-calculator-122-validation";

export const calculateIcVerimOraniIrrVeModifiyeIrrMirrCalculator122Contract: any = {
  id: "ic-verim-orani-irr-ve-modifiye-irr-mirr-calculator-122",
  version: "1.0.0",
  category: "cost",
  inputSchema: IcVerimOraniIrrVeModifiyeIrrMirrCalculator122InputSchema,
  
  execute: async (input: any) => {
    try {
      const initialInvestment = Math.abs(input.initialInvestment);
      const cashFlows = Array.isArray(input.cashFlows) ? input.cashFlows : [input.cashFlows];
      const financeRate = input.financeRate / 100;
      const reinvestRate = input.reinvestRate / 100;
      const wacc = input.wacc / 100;
      
      const nYears = cashFlows.length;
      
      // NPV Calculation
      let npv = -initialInvestment;
      for (let t = 0; t < nYears; t++) {
        npv += cashFlows[t] / Math.pow(1 + wacc, t + 1);
      }
      
      // IRR Calculation using Newton-Raphson method
      const calculateNPV = (rate: number): number => {
        let npvValue = -initialInvestment;
        for (let t = 0; t < nYears; t++) {
          npvValue += cashFlows[t] / Math.pow(1 + rate, t + 1);
        }
        return npvValue;
      };
      
      const calculateNPVDerivative = (rate: number): number => {
        let derivative = 0;
        for (let t = 0; t < nYears; t++) {
          derivative -= (t + 1) * cashFlows[t] / Math.pow(1 + rate, t + 2);
        }
        return derivative;
      };
      
      let irr = 0.1;
      const maxIterations = 1000;
      const tolerance = 1e-10;
      
      for (let i = 0; i < maxIterations; i++) {
        const npvValue = calculateNPV(irr);
        if (Math.abs(npvValue) < tolerance) break;
        
        const derivative = calculateNPVDerivative(irr);
        if (Math.abs(derivative) < 1e-15) break;
        
        irr = irr - npvValue / derivative;
        
        if (irr < -0.99) irr = -0.99;
        if (irr > 100) irr = 100;
      }
      
      // PV of Negative Cash Flows
      let pvNegativeCF = initialInvestment;
      for (let t = 0; t < nYears; t++) {
        if (cashFlows[t] < 0) {
          pvNegativeCF += Math.abs(cashFlows[t]) / Math.pow(1 + financeRate, t + 1);
        }
      }
      
      // FV of Positive Cash Flows
      let fvPositiveCF = 0;
      for (let t = 0; t < nYears; t++) {
        if (cashFlows[t] > 0) {
          fvPositiveCF += cashFlows[t] * Math.pow(1 + reinvestRate, nYears - t - 1);
        }
      }
      
      // MIRR Calculation
      let mirr = 0;
      if (pvNegativeCF > 0 && nYears > 0) {
        mirr = Math.pow(fvPositiveCF / pvNegativeCF, 1 / nYears) - 1;
      }
      
      return {
        nYears,
        nPV: npv,
        iRR: irr,
        pVNegativeCF: pvNegativeCF,
        fVPositiveCF: fvPositiveCF,
        mIRR: mirr
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};