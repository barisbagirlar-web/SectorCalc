import { FazlaMesaiOvertimeVsYeniIseAlimBreakevenFinansiCalculator107InputSchema, type FazlaMesaiOvertimeVsYeniIseAlimBreakevenFinansiCalculator107Input } from "./fazla-mesai-overtime-vs-yeni-ise-alim-breakeven-finansi-calculator-107-validation";

export const calculateFazlaMesaiOvertimeVsYeniIseAlimBreakevenFinansiCalculator107Contract: any = {
  id: "fazla-mesai-overtime-vs-yeni-ise-alim-breakeven-finansi-calculator-107",
  version: "1.0.0",
  category: "cost",
  inputSchema: FazlaMesaiOvertimeVsYeniIseAlimBreakevenFinansiCalculator107InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        normalHourlyRate,
        otMultiplier,
        burdenRate,
        recruitmentCost,
        trainingWeeks,
        trainingProductivity,
        expectedMonthlyOt,
        fatigueDefectRate,
        costPerDefect,
        productionVolumePerHr
      } = input;

      // OT Cost Per Hour: normal rate * overtime multiplier * (1 + burden rate percentage)
      const oTCostPerHr = normalHourlyRate * otMultiplier * (1 + (burdenRate / 100));

      // Annual Direct OT Cost: monthly OT hours * 12 months * OT cost per hour
      const annualDirectOTCost = expectedMonthlyOt * 12 * oTCostPerHr;

      // Annual Fatigue Quality Loss: monthly OT hours * 12 * production volume per hour * (defect rate / 100) * cost per defect
      const annualFatigueQualityLoss = expectedMonthlyOt * 12 * productionVolumePerHr * (fatigueDefectRate / 100) * costPerDefect;

      // Total Annual OT Risk Cost: direct OT cost + quality loss from fatigue
      const totalAnnualOTRiskCost = annualDirectOTCost + annualFatigueQualityLoss;

      // New Hire Annual Base Cost: 52 weeks * 40 hours/week * normal hourly rate * (1 + burden rate percentage)
      const newHireAnnualBaseCost = 52 * 40 * normalHourlyRate * (1 + (burdenRate / 100));

      // RampUp Loss: training weeks * 40 hours/week * normal hourly rate * (1 - training productivity / 100)
      const rampUpLoss = trainingWeeks * 40 * normalHourlyRate * (1 - (trainingProductivity / 100));

      // Total First Year Hire Cost: base cost + recruitment cost + ramp-up loss
      const totalFirstYearHireCost = newHireAnnualBaseCost + recruitmentCost + rampUpLoss;

      // Breakeven OT Hours Annual: Total first year hire cost / (OT cost per hour + (production volume per hour * (defect rate / 100) * cost per defect))
      const denominator = oTCostPerHr + (productionVolumePerHr * (fatigueDefectRate / 100) * costPerDefect);
      const breakevenOTHoursAnnual = denominator !== 0 ? totalFirstYearHireCost / denominator : Infinity;

      return {
        oTCostPerHr: Math.round(oTCostPerHr * 100) / 100,
        annualDirectOTCost: Math.round(annualDirectOTCost * 100) / 100,
        annualFatigueQualityLoss: Math.round(annualFatigueQualityLoss * 100) / 100,
        totalAnnualOTRiskCost: Math.round(totalAnnualOTRiskCost * 100) / 100,
        newHireAnnualBaseCost: Math.round(newHireAnnualBaseCost * 100) / 100,
        rampUpLoss: Math.round(rampUpLoss * 100) / 100,
        totalFirstYearHireCost: Math.round(totalFirstYearHireCost * 100) / 100,
        breakevenOTHoursAnnual: Math.round(breakevenOTHoursAnnual * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};