import { PersonelDevirTurnoverMaliyetiVeRampupEtkisiCalculator17InputSchema, type PersonelDevirTurnoverMaliyetiVeRampupEtkisiCalculator17Input } from "./personel-devir-turnover-maliyeti-ve-rampup-etkisi-calculator-17-validation";

export const calculatePersonelDevirTurnoverMaliyetiVeRampupEtkisiCalculator17Contract: any = {
  id: "personel-devir-turnover-maliyeti-ve-rampup-etkisi-calculator-17",
  version: "1.0.0",
  category: "cost",
  inputSchema: PersonelDevirTurnoverMaliyetiVeRampupEtkisiCalculator17InputSchema,
  
  execute: async (input: any) => {
    try {
      const terminations = input.terminations;
      const severanceAvg = input.severanceAvg;
      const vacancyDays = input.vacancyDays;
      const dailyRevenuePerEmp = input.dailyRevenuePerEmp;
      const recruitCost = input.recruitCost;
      const onboardingHrs = input.onboardingHrs;
      const trainerRate = input.trainerRate;
      const rampupDays = input.rampupDays;
      const rampupProductivity = input.rampupProductivity;

      // Formula: SeparationCost = terminations * severance_avg
      const separationCost = terminations * severanceAvg;

      // Formula: VacancyCost = terminations * vacancy_days * daily_revenue_per_emp
      const vacancyCost = terminations * vacancyDays * dailyRevenuePerEmp;

      // Formula: AcquisitionCost = terminations * recruit_cost
      const acquisitionCost = terminations * recruitCost;

      // Formula: TrainingCost = terminations * onboarding_hrs * trainer_rate
      const trainingCost = terminations * onboardingHrs * trainerRate;

      // Formula: ProductivityLoss = terminations * rampup_days * daily_revenue_per_emp * (1 - (rampup_productivity / 100))
      const productivityLoss = terminations * rampupDays * dailyRevenuePerEmp * (1 - (rampupProductivity / 100));

      // Formula: TotalTurnoverCost = SeparationCost + VacancyCost + AcquisitionCost + TrainingCost + ProductivityLoss
      const totalTurnoverCost = separationCost + vacancyCost + acquisitionCost + trainingCost + productivityLoss;

      // Formula: CostPerEmployee = TotalTurnoverCost / terminations
      const costPerEmployee = terminations > 0 ? totalTurnoverCost / terminations : 0;

      return {
        separationCost,
        vacancyCost,
        acquisitionCost,
        trainingCost,
        productivityLoss,
        totalTurnoverCost,
        costPerEmployee
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};