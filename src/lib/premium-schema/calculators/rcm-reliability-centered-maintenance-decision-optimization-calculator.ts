import { RcmGuvenilirlikOdakliBakimDecisionOptimizasyonuCalculator83InputSchema, type RcmGuvenilirlikOdakliBakimDecisionOptimizasyonuCalculator83Input } from "./rcm-guvenilirlik-odakli-bakim-decision-optimizasyonu-calculator-83-validation";

export const calculateRcmGuvenilirlikOdakliBakimDecisionOptimizasyonuCalculator83Contract: any = {
  id: "rcm-guvenilirlik-odakli-bakim-decision-optimizasyonu-calculator-83",
  version: "1.0.0",
  category: "cost",
  inputSchema: RcmGuvenilirlikOdakliBakimDecisionOptimizasyonuCalculator83InputSchema,
  
  execute: async (input: any) => {
    try {
      const typedInput = input as RcmGuvenilirlikOdakliBakimDecisionOptimizasyonuCalculator83Input;
      
      const failureRateYr = Number(typedInput.failureRateYr);
      const costPerFailure = Number(typedInput.costPerFailure);
      const pmIntervalMo = Number(typedInput.pmIntervalMo);
      const costPerPm = Number(typedInput.costPerPm);
      const cbmSensorCapex = Number(typedInput.cbmSensorCapex);
      const costPerCbmIntervention = Number(typedInput.costPerCbmIntervention);
      const cbmDetectionRate = Number(typedInput.cbmDetectionRate);
      
      if (pmIntervalMo <= 0) {
        throw new Error("PM interval must be greater than 0 months");
      }
      
      const detectionRateDecimal = cbmDetectionRate / 100;
      const pmFailureReductionFactor = 0.30;
      
      const rTFAnnualCost = failureRateYr * costPerFailure;
      
      const pmCyclesPerYear = 12 / pmIntervalMo;
      const pmAnnualScheduledCost = pmCyclesPerYear * costPerPm;
      const pmAnnualFailureCost = failureRateYr * pmFailureReductionFactor * costPerFailure;
      const pMAnnualCost = pmAnnualScheduledCost + pmAnnualFailureCost;
      
      const cbmDepreciationYears = 5;
      const cBMAnnualDepreciation = cbmSensorCapex / cbmDepreciationYears;
      
      const detectedFailures = failureRateYr * detectionRateDecimal;
      const cBMInterventionCost = detectedFailures * costPerCbmIntervention;
      
      const missedFailures = failureRateYr * (1 - detectionRateDecimal);
      const cBMMissedFailureCost = missedFailures * costPerFailure;
      
      const cBMTotalAnnualCost = cBMAnnualDepreciation + cBMInterventionCost + cBMMissedFailureCost;
      
      const optimalFinancialStrategyCost = Math.min(rTFAnnualCost, pMAnnualCost, cBMTotalAnnualCost);

      return {
        rTFAnnualCost: Math.round(rTFAnnualCost * 100) / 100,
        pMAnnualCost: Math.round(pMAnnualCost * 100) / 100,
        cBMAnnualDepreciation: Math.round(cBMAnnualDepreciation * 100) / 100,
        cBMInterventionCost: Math.round(cBMInterventionCost * 100) / 100,
        cBMMissedFailureCost: Math.round(cBMMissedFailureCost * 100) / 100,
        cBMTotalAnnualCost: Math.round(cBMTotalAnnualCost * 100) / 100,
        optimalFinancialStrategyCost: Math.round(optimalFinancialStrategyCost * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};