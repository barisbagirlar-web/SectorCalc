import { IleriSeviyeParetoVeKokNedenFinansmaniCalculator84InputSchema, type IleriSeviyeParetoVeKokNedenFinansmaniCalculator84Input } from "./ileri-seviye-pareto-ve-kok-neden-finansmani-calculator-84-validation";

export const calculateIleriSeviyeParetoVeKokNedenFinansmaniCalculator84Contract: any = {
  id: "ileri-seviye-pareto-ve-kok-neden-finansmani-calculator-84",
  version: "1.0.0",
  category: "cost",
  inputSchema: IleriSeviyeParetoVeKokNedenFinansmaniCalculator84InputSchema,
  
  execute: async (input: IleriSeviyeParetoVeKokNedenFinansmaniCalculator84Input) => {
    try {
      // Destructure inputs
      const { defectCodes, defectFrequencies, costPerDefect, analysisMonths } = input;
      
      // Convert inputs to arrays for processing
      const frequencies = Array.isArray(defectFrequencies) ? defectFrequencies : [defectFrequencies];
      const costsPerDefect = Array.isArray(costPerDefect) ? costPerDefect : [costPerDefect];
      
      // Ensure we have equal length arrays by using defectCodes count
      const codeCount = defectCodes || frequencies.length || costsPerDefect.length;
      
      // Pad arrays to match codeCount if needed
      while (frequencies.length < codeCount) frequencies.push(0);
      while (costsPerDefect.length < codeCount) costsPerDefect.push(0);
      
      // Formula 1: Total_Frequency = SUM(defect_frequencies)
      const totalFrequency = frequencies.reduce((sum, freq) => sum + freq, 0);
      
      // Formula 2: Cost_By_Code_i = defect_frequencies_i * cost_per_defect_i
      const costByCodeI = frequencies.map((freq, index) => freq * (costsPerDefect[index] || 0));
      
      // Formula 3: Total_Financial_Loss = SUM(Cost_By_Code)
      const totalFinancialLoss = costByCodeI.reduce((sum, cost) => sum + cost, 0);
      
      // Formula 4: Freq_Pct_i = (defect_frequencies_i / Total_Frequency) * 100
      const freqPctI = frequencies.map(freq => totalFrequency > 0 ? (freq / totalFrequency) * 100 : 0);
      
      // Formula 5: Cost_Pct_i = (Cost_By_Code_i / Total_Financial_Loss) * 100
      const costPctI = costByCodeI.map(cost => totalFinancialLoss > 0 ? (cost / totalFinancialLoss) * 100 : 0);
      
      // Formula 6: Sorted_Cost_Pct = SORT(Cost_Pct_i, DESC)
      const sortedCostPct = [...costPctI].sort((a, b) => b - a);
      
      // Formula 7: Cumulative_Cost_Pct = CUM_SUM(Sorted_Cost_Pct)
      const cumulativeCostPct = sortedCostPct.reduce((acc, val, idx) => {
        if (idx === 0) {
          acc.push(val);
        } else {
          acc.push(acc[idx - 1] + val);
        }
        return acc;
      }, [] as number[]);
      
      // Formula 8: Vital_Few_80_20_Count = COUNT(Cumulative_Cost_Pct <= 80)
      const vitalFew8020Count = cumulativeCostPct.filter(pct => pct <= 80).length;
      
      // Formula 9: Annual_Projected_Loss = Total_Financial_Loss * (12 / analysis_months)
      const annualProjectedLoss = totalFinancialLoss * (12 / (analysisMonths || 12));

      return {
        totalFrequency,
        costByCodeI: costByCodeI.length > 0 ? costByCodeI : 0,
        totalFinancialLoss,
        freqPctI: freqPctI.length > 0 ? freqPctI : 0,
        costPctI: costPctI.length > 0 ? costPctI : 0,
        sortedCostPct: sortedCostPct.length > 0 ? sortedCostPct : 0,
        cumulativeCostPct: cumulativeCostPct.length > 0 ? cumulativeCostPct : 0,
        vitalFew8020Count,
        annualProjectedLoss
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};