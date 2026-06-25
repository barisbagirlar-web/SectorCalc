import { IstatistikselProsesKontrolSpcSinyalLatencyMaliyetiCalculator93InputSchema, type IstatistikselProsesKontrolSpcSinyalLatencyMaliyetiCalculator93Input } from "./istatistiksel-proses-kontrol-spc-sinyal-latency-maliyeti-calculator-93-validation";

export const calculateIstatistikselProsesKontrolSpcSinyalLatencyMaliyetiCalculator93Contract: any = {
  id: "istatistiksel-proses-kontrol-spc-sinyal-latency-maliyeti-calculator-93",
  version: "1.0.0",
  category: "cost",
  inputSchema: IstatistikselProsesKontrolSpcSinyalLatencyMaliyetiCalculator93InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        alpha,
        beta,
        samplingInt,
        prodRate,
        defectRateOoc,
        defectCost
      } = input;

      // Validate inputs to prevent division by zero or negative values
      const validAlpha = Math.max(0.000001, alpha); // Prevent division by zero
      const validBeta = Math.min(Math.max(0, beta), 0.999999); // Keep beta between 0 and 0.999999
      const validSamplingInt = Math.max(0, samplingInt);
      const validProdRate = Math.max(0, prodRate);
      const validDefectRateOoc = Math.max(0, defectRateOoc);
      const validDefectCost = Math.max(0, defectCost);

      // Formula: ARL_InControl = 1 / alpha
      const aRLInControl = 1 / validAlpha;

      // Formula: ARL_OutOfControl = 1 / (1 - beta)
      const aRLOutOfControl = 1 / (1 - validBeta);

      // Formula: Detection_Delay_Hrs = ARL_OutOfControl * sampling_int
      const detectionDelayHrs = aRLOutOfControl * validSamplingInt;

      // Formula: Defects_Produced_During_Delay = Detection_Delay_Hrs * prod_rate * (defect_rate_ooc / 100)
      const defectsProducedDuringDelay = detectionDelayHrs * validProdRate * (validDefectRateOoc / 100);

      // Formula: Cost_Of_Delay = Defects_Produced_During_Delay * defect_cost
      const costOfDelay = defectsProducedDuringDelay * validDefectCost;

      // Formula: False_Alarm_Freq_Hrs = ARL_InControl * sampling_int
      const falseAlarmFreqHrs = aRLInControl * validSamplingInt;

      return {
        aRLInControl: Math.round(aRLInControl * 100) / 100,
        aRLOutOfControl: Math.round(aRLOutOfControl * 100) / 100,
        detectionDelayHrs: Math.round(detectionDelayHrs * 100) / 100,
        defectsProducedDuringDelay: Math.round(defectsProducedDuringDelay * 100) / 100,
        costOfDelay: Math.round(costOfDelay * 100) / 100,
        falseAlarmFreqHrs: Math.round(falseAlarmFreqHrs * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};