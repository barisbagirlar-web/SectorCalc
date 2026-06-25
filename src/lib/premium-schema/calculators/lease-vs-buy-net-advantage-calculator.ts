import { KiralamaVsSatinAlmaNetAvantajiNalCalculator124InputSchema, type KiralamaVsSatinAlmaNetAvantajiNalCalculator124Input } from "./kiralama-vs-satin-alma-net-avantaji-nal-calculator-124-validation";

export const calculateKiralamaVsSatinAlmaNetAvantajiNalCalculator124Contract: any = {
  id: "kiralama-vs-satin-alma-net-avantaji-nal-calculator-124",
  version: "1.0.0",
  category: "cost",
  inputSchema: KiralamaVsSatinAlmaNetAvantajiNalCalculator124InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        purchasePrice,
        loanInterestRate,
        assetLife,
        salvageValue,
        taxRate,
        annualLeasePayment,
        maintenanceSaved
      } = input;

      // Validate inputs
      if (loanInterestRate === 0 || assetLife === 0) {
        throw new Error("Loan interest rate and asset life must be greater than 0");
      }

      // Convert percentages to decimals for calculations
      const loanRateDecimal = loanInterestRate / 100;
      const taxRateDecimal = taxRate / 100;

      // Step 1: Calculate After-Tax Debt Rate
      const afterTaxDebtRate = loanRateDecimal * (1 - taxRateDecimal);

      // Step 2: Calculate Annual Depreciation (Straight line method)
      const depreciationAnnual = (purchasePrice - salvageValue) / assetLife;

      // Step 3: Calculate PV of Tax Shield from Depreciation
      let pVTaxShieldDepr = 0;
      const taxShieldPerYear = depreciationAnnual * taxRateDecimal;
      
      for (let t = 1; t <= assetLife; t++) {
        pVTaxShieldDepr += taxShieldPerYear / Math.pow(1 + afterTaxDebtRate, t);
      }

      // Step 4: Calculate PV of Salvage Value
      const salvageAfterTax = salvageValue * (1 - taxRateDecimal);
      const pVSalvage = salvageAfterTax / Math.pow(1 + afterTaxDebtRate, assetLife);

      // Step 5: Calculate Effective Lease Payment
      const effectiveLeasePayment = annualLeasePayment - maintenanceSaved;

      // Step 6: Calculate PV of Lease Payments
      let pVLease = 0;
      const leaseAfterTaxPerYear = effectiveLeasePayment * (1 - taxRateDecimal);
      
      for (let t = 1; t <= assetLife; t++) {
        pVLease += leaseAfterTaxPerYear / Math.pow(1 + afterTaxDebtRate, t);
      }

      // Step 7: Calculate PV of Buying
      const pVBuy = purchasePrice - pVTaxShieldDepr - pVSalvage;

      // Step 8: Calculate Net Advantage of Leasing (NAL)
      const netAdvantageLeasingNAL = pVBuy - pVLease;

      return {
        afterTaxDebtRate: Math.round(afterTaxDebtRate * 10000) / 10000,
        depreciationAnnual: Math.round(depreciationAnnual * 100) / 100,
        pVTaxShieldDepr: Math.round(pVTaxShieldDepr * 100) / 100,
        pVSalvage: Math.round(pVSalvage * 100) / 100,
        effectiveLeasePayment: Math.round(effectiveLeasePayment * 100) / 100,
        pVLease: Math.round(pVLease * 100) / 100,
        pVBuy: Math.round(pVBuy * 100) / 100,
        netAdvantageLeasingNAL: Math.round(netAdvantageLeasingNAL * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};