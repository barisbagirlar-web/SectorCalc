import { HaccpSapmaMatrisiVeKritikKarantinaMaliyetiCalculator135InputSchema, type HaccpSapmaMatrisiVeKritikKarantinaMaliyetiCalculator135Input } from "./haccp-sapma-matrisi-ve-kritik-karantina-maliyeti-calculator-135-validation";

export const calculateHaccpSapmaMatrisiVeKritikKarantinaMaliyetiCalculator135Contract: any = {
  id: "haccp-sapma-matrisi-ve-kritik-karantina-maliyeti-calculator-135",
  version: "1.0.0",
  category: "cost",
  inputSchema: HaccpSapmaMatrisiVeKritikKarantinaMaliyetiCalculator135InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        quarantineVolKg,
        holdingDays,
        storageCostPerKgDay,
        labTestQty,
        labTestCost,
        rawMaterialCost,
        reworkVolKg,
        reworkCostKg,
        disposalVolKg,
        disposalCostKg,
        regulatoryFine,
        severity110,
        occurrence110,
        detection110
      } = input;

      // Validate all numeric inputs
      const qVol = Number(quarantineVolKg) || 0;
      const hDays = Number(holdingDays) || 0;
      const storageCost = Number(storageCostPerKgDay) || 0;
      const labQty = Number(labTestQty) || 0;
      const labCost = Number(labTestCost) || 0;
      const rawCost = Number(rawMaterialCost) || 0;
      const rVol = Number(reworkVolKg) || 0;
      const rCost = Number(reworkCostKg) || 0;
      const dVol = Number(disposalVolKg) || 0;
      const dCost = Number(disposalCostKg) || 0;
      const fine = Number(regulatoryFine) || 0;
      const severity = Math.min(Math.max(Number(severity110) || 1, 1), 10);
      const occurrence = Math.min(Math.max(Number(occurrence110) || 1, 1), 10);
      const detection = Math.min(Math.max(Number(detection110) || 1, 1), 10);

      // Formula: Risk_Priority_Number_RPN = severity * occurrence * detection
      const riskPriorityNumberRPN = Math.round(severity * occurrence * detection);

      // Formula: Cost_Quarantine = quarantine_vol_kg * holding_days * storage_cost_per_kg_day
      const costQuarantine = Math.round(qVol * hDays * storageCost * 100) / 100;

      // Formula: Cost_Testing = lab_test_qty * lab_test_cost
      const costTesting = Math.round(labQty * labCost * 100) / 100;

      // Formula: Cost_Rework = rework_vol_kg * rework_cost_kg
      const costRework = Math.round(rVol * rCost * 100) / 100;

      // Formula: Cost_Disposal_Operation = disposal_vol_kg * disposal_cost_kg
      const costDisposalOperation = Math.round(dVol * dCost * 100) / 100;

      // Formula: Lost_Material_Value = disposal_vol_kg * raw_material_cost
      const lostMaterialValue = Math.round(dVol * rawCost * 100) / 100;

      // Formula: Total_Deviation_Cost = Cost_Quarantine + Cost_Testing + Cost_Rework + Cost_Disposal_Operation + Lost_Material_Value
      const totalDeviationCost = Math.round(
        (costQuarantine + costTesting + costRework + costDisposalOperation + lostMaterialValue) * 100
      ) / 100;

      // Formula: Expected_Fine_Risk = IF(severity >= 8, regulatory_fine, 0)
      const expectedFineRisk = severity >= 8 ? Math.round(fine * 100) / 100 : 0;

      // Formula: Grand_Total_Risk_Cost = Total_Deviation_Cost + Expected_Fine_Risk
      const grandTotalRiskCost = Math.round((totalDeviationCost + expectedFineRisk) * 100) / 100;

      return {
        riskPriorityNumberRPN,
        costQuarantine,
        costTesting,
        costRework,
        costDisposalOperation,
        lostMaterialValue,
        totalDeviationCost,
        expectedFineRisk,
        grandTotalRiskCost
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};