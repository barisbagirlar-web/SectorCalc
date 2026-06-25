import { TeklifTutarlilikVeGizliSizintiAnalysisCalculator7InputSchema, type TeklifTutarlilikVeGizliSizintiAnalysisCalculator7Input } from "./teklif-tutarlilik-ve-gizli-sizinti-analysis-calculator-7-validation";

export const calculateTeklifTutarlilikVeGizliSizintiAnalysisCalculator7Contract: any = {
  id: "teklif-tutarlilik-ve-gizli-sizinti-analysis-calculator-7",
  version: "1.0.0",
  category: "cost",
  inputSchema: TeklifTutarlilikVeGizliSizintiAnalysisCalculator7InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        totalQuotes,
        wonQuotes,
        quotedPart,
        marketPart,
        quotedLabor,
        flatRate,
        annualVol
      } = input;

      // Validate inputs to prevent division by zero or negative values
      const safeTotalQuotes = Math.max(totalQuotes || 0, 1);
      const safeWonQuotes = Math.max(wonQuotes || 0, 0);
      const safeQuotedPart = Math.max(quotedPart || 0, 0);
      const safeMarketPart = Math.max(marketPart || 0, 0.001); // Prevent division by zero
      const safeQuotedLabor = Math.max(quotedLabor || 0, 0);
      const safeFlatRate = Math.max(flatRate || 0, 0.001); // Prevent division by zero
      const safeAnnualVol = Math.max(annualVol || 0, 0);

      // Formula: PartDeviation = (quoted_part - market_part) / market_part
      const partDeviation = (safeQuotedPart - safeMarketPart) / safeMarketPart * 100;

      // Formula: LaborDeviation = (quoted_labor - flat_rate) / flat_rate
      const laborDeviation = (safeQuotedLabor - safeFlatRate) / safeFlatRate * 100;

      // Formula: MarginLeak_Job = ((market_part - quoted_part) + ((flat_rate - quoted_labor) * 50))
      // Assumption: Labor rate is $50/hour (standard industry estimate for hidden labor costs)
      const marginLeakJob = ((safeMarketPart - safeQuotedPart) + ((safeFlatRate - safeQuotedLabor) * 50));

      // Formula: AnnualLeakage = MarginLeak_Job * annual_vol
      const annualLeakage = marginLeakJob * safeAnnualVol;

      // Formula: WinRate = (won_quotes / total_quotes) * 100
      const winRate = (safeWonQuotes / safeTotalQuotes) * 100;

      return {
        partDeviation: Math.round(partDeviation * 100) / 100,
        laborDeviation: Math.round(laborDeviation * 100) / 100,
        marginLeakJob: Math.round(marginLeakJob * 100) / 100,
        annualLeakage: Math.round(annualLeakage * 100) / 100,
        winRate: Math.round(winRate * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};