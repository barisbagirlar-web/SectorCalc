import { IsgGurultuOshaVeTitresimIso5349MaruziyetFinansiCalculator105InputSchema, type IsgGurultuOshaVeTitresimIso5349MaruziyetFinansiCalculator105Input } from "./osh-noise-vibration-exposure-finance-calculator-105-validation";

export const calculateIsgGurultuOshaVeTitresimIso5349MaruziyetFinansiCalculator105Contract: any = {
  id: "osh-noise-vibration-exposure-finance-calculator-105",
  version: "1.0.0",
  category: "cost",
  inputSchema: IsgGurultuOshaVeTitresimIso5349MaruziyetFinansiCalculator105InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        noiseLevelDba,
        exposureHrs,
        vibAcceleration,
        workersExposed,
        ppeCost,
        medicalScreening,
        fatigueDefectRate,
        annualVolume,
        costPerDefect
      } = input;

      // Formula: Noise_Dose_Pct = 100 * (exposure_hrs / (8 / POWER(2, (noise_level_dba - 90) / 5)))
      const noiseDosePct = 100 * (exposureHrs / (8 / Math.pow(2, (noiseLevelDba - 90) / 5)));

      // Formula: TWA_Noise = 16.61 * LOG10(Noise_Dose_Pct / 100) + 90
      const tWANoise = 16.61 * Math.log10(noiseDosePct / 100) + 90;

      // Formula: A_hv_8 = vib_acceleration * SQRT(exposure_hrs / 8)
      const aHv8 = vibAcceleration * Math.sqrt(exposureHrs / 8);

      // Formula: Compliance_Cost_Noise = IF(TWA_Noise >= 85, workers_exposed * (ppe_cost + medical_screening), 0)
      const complianceCostNoise = tWANoise >= 85 ? workersExposed * (ppeCost + medicalScreening) : 0;

      // Formula: Compliance_Cost_Vib = IF(A_hv_8 >= 2.5, workers_exposed * (ppe_cost + medical_screening), 0)
      const complianceCostVib = aHv8 >= 2.5 ? workersExposed * (ppeCost + medicalScreening) : 0;

      // Formula: Fatigue_Quality_Loss = (fatigue_defect_rate / 100) * annual_volume * cost_per_defect
      const fatigueQualityLoss = (fatigueDefectRate / 100) * annualVolume * costPerDefect;

      // Formula: Total_Exposure_Risk_Cost = Compliance_Cost_Noise + Compliance_Cost_Vib + Fatigue_Quality_Loss
      const totalExposureRiskCost = complianceCostNoise + complianceCostVib + fatigueQualityLoss;

      return {
        noiseDosePct: Math.round(noiseDosePct * 100) / 100,
        tWANoise: Math.round(tWANoise * 100) / 100,
        aHv8: Math.round(aHv8 * 100) / 100,
        complianceCostNoise: Math.round(complianceCostNoise * 100) / 100,
        complianceCostVib: Math.round(complianceCostVib * 100) / 100,
        fatigueQualityLoss: Math.round(fatigueQualityLoss * 100) / 100,
        totalExposureRiskCost: Math.round(totalExposureRiskCost * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};