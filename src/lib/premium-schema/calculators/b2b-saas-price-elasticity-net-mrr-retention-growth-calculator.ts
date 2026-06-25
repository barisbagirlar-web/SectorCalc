import { B2bSaasFiyatEsnekligiNetMrrRetentionVeBuyumeHiziCalculator154InputSchema, type B2bSaasFiyatEsnekligiNetMrrRetentionVeBuyumeHiziCalculator154Input } from "./b2b-saas-fiyat-esnekligi-net-mrr-retention-ve-buyume-hizi-calculator-154-validation";

export const calculateB2bSaasFiyatEsnekligiNetMrrRetentionVeBuyumeHiziCalculator154Contract: any = {
  id: "b2b-saas-fiyat-esnekligi-net-mrr-retention-ve-buyume-hizi-calculator-154",
  version: "1.0.0",
  category: "cost",
  inputSchema: B2bSaasFiyatEsnekligiNetMrrRetentionVeBuyumeHiziCalculator154InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        startingMrr,
        newMrr,
        expansionMrr,
        churnMrr,
        contractionMrr,
        priceIncreasePct,
        priceElasticity
      } = input;

      // Validate inputs are numbers and non-negative where appropriate
      const startingMrrNum = Number(startingMrr) || 0;
      const newMrrNum = Number(newMrr) || 0;
      const expansionMrrNum = Number(expansionMrr) || 0;
      const churnMrrNum = Number(churnMrr) || 0;
      const contractionMrrNum = Number(contractionMrr) || 0;
      const priceIncreasePctNum = Number(priceIncreasePct) || 0;
      const priceElasticityNum = Number(priceElasticity) || 0;

      // Formula: Gross_MRR_Churn_Rate = ((churn_mrr + contraction_mrr) / starting_mrr) * 100
      const grossMRRChurnRate = startingMrrNum > 0 
        ? ((churnMrrNum + contractionMrrNum) / startingMrrNum) * 100 
        : 0;

      // Formula: Net_MRR_Churn_Rate = ((churn_mrr + contraction_mrr - expansion_mrr) / starting_mrr) * 100
      const netMRRChurnRate = startingMrrNum > 0 
        ? ((churnMrrNum + contractionMrrNum - expansionMrrNum) / startingMrrNum) * 100 
        : 0;

      // Formula: Net_MRR_Retention_NDR = 100 - Net_MRR_Churn_Rate
      const netMRRRetentionNDR = 100 - netMRRChurnRate;

      // Formula: Ending_MRR = starting_mrr + new_mrr + expansion_mrr - churn_mrr - contraction_mrr
      const endingMRR = startingMrrNum + newMrrNum + expansionMrrNum - churnMrrNum - contractionMrrNum;

      // Formula: Churn_Impact_Due_To_Price = (price_increase_pct / 100) * ABS(price_elasticity)
      const churnImpactDueToPrice = (priceIncreasePctNum / 100) * Math.abs(priceElasticityNum);

      // Formula: Projected_MRR_After_Price_Hike = Ending_MRR * (1 + (price_increase_pct / 100)) * (1 - Churn_Impact_Due_To_Price)
      const projectedMRRAfterPriceHike = endingMRR * (1 + (priceIncreasePctNum / 100)) * (1 - churnImpactDueToPrice);

      // Formula: Price_Hike_Net_Benefit = Projected_MRR_After_Price_Hike - Ending_MRR
      const priceHikeNetBenefit = projectedMRRAfterPriceHike - endingMRR;

      return {
        grossMRRChurnRate: Math.round(grossMRRChurnRate * 100) / 100,
        netMRRChurnRate: Math.round(netMRRChurnRate * 100) / 100,
        netMRRRetentionNDR: Math.round(netMRRRetentionNDR * 100) / 100,
        endingMRR: Math.round(endingMRR * 100) / 100,
        churnImpactDueToPrice: Math.round(churnImpactDueToPrice * 100) / 100,
        projectedMRRAfterPriceHike: Math.round(projectedMRRAfterPriceHike * 100) / 100,
        priceHikeNetBenefit: Math.round(priceHikeNetBenefit * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};