import { SmedDarbogazKapasiteAcigaCikarmaCapacityReleaseRoiCalculator143InputSchema, type SmedDarbogazKapasiteAcigaCikarmaCapacityReleaseRoiCalculator143Input } from "./smed-darbogaz-kapasite-aciga-cikarma-capacity-release-roi-calculator-143-validation";

export const calculateSmedDarbogazKapasiteAcigaCikarmaCapacityReleaseRoiCalculator143Contract: any = {
  id: "smed-darbogaz-kapasite-aciga-cikarma-capacity-release-roi-calculator-143",
  version: "1.0.0",
  category: "cost",
  inputSchema: SmedDarbogazKapasiteAcigaCikarmaCapacityReleaseRoiCalculator143InputSchema,
  
  execute: async (input: any) => {
    try {
      // Validation
      const validated = SmedDarbogazKapasiteAcigaCikarmaCapacityReleaseRoiCalculator143InputSchema.parse(input);
      
      // Extract inputs
      const currentSetupMin = validated.currentSetupMin;
      const targetSetupMin = validated.targetSetupMin;
      const setupsPerWeek = validated.setupsPerWeek;
      const cycleTimeSec = validated.cycleTimeSec;
      const unitMargin = validated.unitMargin;
      const isBottleneck = validated.isBottleneck;
      
      // Constants
      const WEEKS_PER_YEAR = 52;
      const SECONDS_PER_HOUR = 3600;
      const MINUTES_PER_HOUR = 60;
      const LABOR_COST_PER_HOUR_NON_BOTTLENECK = 50; // Standard assumption for non-bottleneck cost avoidance
      const DEFAULT_SMED_CAPEX = 10000; // Default SMED implementation cost if not provided
      
      // Calculate saved time per setup
      const savedMinsPerSetup = Math.max(0, currentSetupMin - targetSetupMin);
      
      // Calculate saved hours annually
      const savedHoursAnnual = (savedMinsPerSetup * setupsPerWeek * WEEKS_PER_YEAR) / MINUTES_PER_HOUR;
      
      // Calculate extra capacity in units annually
      const extraCapacityUnitsAnnual = savedHoursAnnual * (SECONDS_PER_HOUR / cycleTimeSec);
      
      // Calculate financial gain (only if bottleneck machine)
      const financialGainAnnual = isBottleneck === 1 ? Math.round(extraCapacityUnitsAnnual * unitMargin * 100) / 100 : 0;
      
      // Calculate cost avoidance (only if non-bottleneck machine)
      const costAvoidanceAnnual = isBottleneck === 0 ? Math.round(savedHoursAnnual * LABOR_COST_PER_HOUR_NON_BOTTLENECK * 100) / 100 : 0;
      
      // Calculate total value created
      const totalValueCreated = Math.round((financialGainAnnual + costAvoidanceAnnual) * 100) / 100;
      
      // Calculate SMED ROI (assuming default capex cost for SMED implementation)
      const smedCapex = (validated as any).smedCapex || DEFAULT_SMED_CAPEX;
      const sMEDROI = smedCapex > 0 ? Math.round(((totalValueCreated - smedCapex) / smedCapex) * 100 * 100) / 100 : 0;
      
      // Calculate payback period in months
      const paybackMonths = totalValueCreated > 0 ? Math.round((smedCapex / totalValueCreated) * 12 * 100) / 100 : 0;

      return {
        savedMinsPerSetup: Math.round(savedMinsPerSetup * 100) / 100,
        savedHoursAnnual: Math.round(savedHoursAnnual * 100) / 100,
        extraCapacityUnitsAnnual: Math.round(extraCapacityUnitsAnnual * 100) / 100,
        financialGainAnnual: financialGainAnnual,
        costAvoidanceAnnual: costAvoidanceAnnual,
        totalValueCreated: totalValueCreated,
        sMEDROI: sMEDROI,
        paybackMonths: paybackMonths
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};