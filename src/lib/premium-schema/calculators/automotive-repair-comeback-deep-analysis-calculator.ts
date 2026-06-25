import { OtomotivTamirGeriDonusComebackDerinAnalysisCalculator6InputSchema, type OtomotivTamirGeriDonusComebackDerinAnalysisCalculator6Input } from "./otomotiv-tamir-geri-donus-comeback-derin-analysis-calculator-6-validation";

export const calculateOtomotivTamirGeriDonusComebackDerinAnalysisCalculator6Contract: any = {
  id: "otomotiv-tamir-geri-donus-comeback-derin-analysis-calculator-6",
  version: "1.0.0",
  category: "cost",
  inputSchema: OtomotivTamirGeriDonusComebackDerinAnalysisCalculator6InputSchema,
  
  execute: async (input: any) => {
    try {
      const totalRo = input.totalRo;
      const comebackRo = input.comebackRo;
      const avgDiagTime = input.avgDiagTime;
      const avgRepairTime = input.avgRepairTime;
      const laborRate = input.laborRate;
      const bayOppCost = input.bayOppCost;
      const wastedParts = input.wastedParts;
      const warrantyClaim = input.warrantyClaim;
      const churnProb = input.churnProb;
      const customerLtv = input.customerLtv;

      // Formula: ComebackRate = (comeback_ro / total_ro) * 100
      const comebackRate = totalRo > 0 ? (comebackRo / totalRo) * 100 : 0;

      // Formula: LaborCost = comeback_ro * (avg_diag_time + avg_repair_time) * labor_rate
      const laborCost = comebackRo * (avgDiagTime + avgRepairTime) * laborRate;

      // Formula: PartsCost = comeback_ro * wasted_parts
      const partsCost = comebackRo * wastedParts;

      // Formula: OpportunityCost = comeback_ro * (avg_diag_time + avg_repair_time) * bay_opp_cost
      const opportunityCost = comebackRo * (avgDiagTime + avgRepairTime) * bayOppCost;

      // Formula: LTVLoss = comeback_ro * (churn_prob / 100) * customer_ltv
      const lTVLoss = comebackRo * (churnProb / 100) * customerLtv;

      // Formula: WarrantyCost = comeback_ro * warranty_claim
      const warrantyCost = comebackRo * warrantyClaim;

      // Formula: TotalCost = LaborCost + PartsCost + OpportunityCost + LTVLoss + WarrantyCost
      const totalCost = laborCost + partsCost + opportunityCost + lTVLoss + warrantyCost;

      return {
        comebackRate: Math.round(comebackRate * 100) / 100,
        laborCost: Math.round(laborCost * 100) / 100,
        partsCost: Math.round(partsCost * 100) / 100,
        opportunityCost: Math.round(opportunityCost * 100) / 100,
        lTVLoss: Math.round(lTVLoss * 100) / 100,
        warrantyCost: Math.round(warrantyCost * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};