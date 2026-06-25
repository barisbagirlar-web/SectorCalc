import { IleriMalzemeDegisimHafifletmeMaliyetfaydaAnalysisCalculator99InputSchema, type IleriMalzemeDegisimHafifletmeMaliyetfaydaAnalysisCalculator99Input } from "./ileri-malzeme-degisim-hafifletme-maliyetfayda-analysis-calculator-99-validation";

export const calculateIleriMalzemeDegisimHafifletmeMaliyetfaydaAnalysisCalculator99Contract: any = {
  id: "ileri-malzeme-degisim-hafifletme-maliyetfayda-analysis-calculator-99",
  version: "1.0.0",
  category: "cost",
  inputSchema: IleriMalzemeDegisimHafifletmeMaliyetfaydaAnalysisCalculator99InputSchema,
  
  execute: async (input: any) => {
    try {
      // Parse inputs
      const currentPrice = Number(input.currentPrice);
      const altPrice = Number(input.altPrice);
      const currentWeight = Number(input.currentWeight);
      const altWeight = Number(input.altWeight);
      const processingDelta = Number(input.processingDelta);
      const fuelFactor = Number(input.fuelFactor);
      const lifeDistance = Number(input.lifeDistance);
      const fuelPrice = Number(input.fuelPrice);
      const annualVolume = Number(input.annualVolume);
      const toolingCapex = Number(input.toolingCapex);
      const qualificationCost = Number(input.qualificationCost);

      // Validate inputs
      if (isNaN(currentPrice) || isNaN(altPrice) || isNaN(currentWeight) || 
          isNaN(altWeight) || isNaN(processingDelta) || isNaN(fuelFactor) || 
          isNaN(lifeDistance) || isNaN(fuelPrice) || isNaN(annualVolume) || 
          isNaN(toolingCapex) || isNaN(qualificationCost)) {
        throw new Error("Invalid input: All fields must be valid numbers");
      }

      // Input validation for business logic
      if (currentPrice < 0 || altPrice < 0 || currentWeight < 0 || altWeight < 0 ||
          fuelFactor < 0 || lifeDistance < 0 || fuelPrice < 0 || annualVolume < 0 ||
          toolingCapex < 0 || qualificationCost < 0) {
        throw new Error("Invalid input: Values cannot be negative");
      }

      // Formula: Weight_Savings_kg = current_weight - alt_weight
      const weightSavingsKg = currentWeight - altWeight;

      // Formula: Material_Cost_Delta = (alt_price * alt_weight) - (current_price * current_weight)
      const altMaterialCost = altPrice * altWeight;
      const currentMaterialCost = currentPrice * currentWeight;
      const materialCostDelta = altMaterialCost - currentMaterialCost;

      // Formula: Lifetime_Fuel_Savings_Per_Part = (Weight_Savings_kg / 1000) * fuel_factor * (life_distance / 100) * fuel_price
      // Standard engineering formula for fuel savings from weight reduction
      // weight savings in tons (kg/1000) * fuel consumption factor (L/100km/ton) * distance in 100km * fuel price per liter
      const weightSavingsTons = weightSavingsKg / 1000;
      const distanceHundredKm = lifeDistance / 100;
      const lifetimeFuelSavingsPerPart = weightSavingsTons * fuelFactor * distanceHundredKm * fuelPrice;

      // Formula: Net_Benefit_Per_Part = Lifetime_Fuel_Savings_Per_Part - Material_Cost_Delta - processing_delta
      const netBenefitPerPart = lifetimeFuelSavingsPerPart - materialCostDelta - processingDelta;

      // Formula: Annual_Net_Benefit = Net_Benefit_Per_Part * annual_volume
      const annualNetBenefit = netBenefitPerPart * annualVolume;

      // Formula: Total_Investment = tooling_capex + qualification_cost
      const totalInvestment = toolingCapex + qualificationCost;

      // Formula: Payback_Years = Total_Investment / Annual_Net_Benefit
      let paybackYears = 0;
      if (annualNetBenefit > 0) {
        paybackYears = totalInvestment / annualNetBenefit;
      } else if (totalInvestment === 0 && annualNetBenefit >= 0) {
        paybackYears = 0;
      } else {
        // Negative or zero annual net benefit means payback is not achievable
        paybackYears = Infinity;
      }

      // Formula: ROI_Pct = (Annual_Net_Benefit / Total_Investment) * 100
      let rOIPct = 0;
      if (totalInvestment > 0) {
        rOIPct = (annualNetBenefit / totalInvestment) * 100;
      } else if (totalInvestment === 0 && annualNetBenefit > 0) {
        rOIPct = Infinity;
      } else if (totalInvestment === 0 && annualNetBenefit === 0) {
        rOIPct = 0;
      } else {
        rOIPct = -Infinity;
      }

      return {
        weightSavingsKg: Math.round(weightSavingsKg * 100) / 100,
        materialCostDelta: Math.round(materialCostDelta * 100) / 100,
        lifetimeFuelSavingsPerPart: Math.round(lifetimeFuelSavingsPerPart * 100) / 100,
        netBenefitPerPart: Math.round(netBenefitPerPart * 100) / 100,
        annualNetBenefit: Math.round(annualNetBenefit * 100) / 100,
        totalInvestment: Math.round(totalInvestment * 100) / 100,
        paybackYears: paybackYears === Infinity ? 0 : Math.round(paybackYears * 100) / 100,
        rOIPct: (rOIPct === Infinity || rOIPct === -Infinity) ? 0 : Math.round(rOIPct * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};