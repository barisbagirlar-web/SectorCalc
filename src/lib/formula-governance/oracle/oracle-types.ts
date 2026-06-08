/**
 * Oracle baseline types — independent reference models (Phase 4).
 */

export type OracleValidationErrorCode =
  | "INVALID_PRINCIPAL"
  | "INVALID_RATE"
  | "INVALID_TERM"
  | "INVALID_TIME"
  | "INVALID_COMPOUNDS"
  | "INVALID_PRICE"
  | "INVALID_COST"
  | "INVALID_CONTRIBUTION"
  | "INVALID_SALARY"
  | "INVALID_DAYS"
  | "INVALID_QUANTITY"
  | "INVALID_TIME_INPUT"
  | "INVALID_AREA"
  | "INVALID_HOURS"
  | "INVALID_PERCENT"
  | "INVALID_CREW";

export class OracleValidationError extends Error {
  readonly code: OracleValidationErrorCode;

  constructor(code: OracleValidationErrorCode, message: string) {
    super(message);
    this.name = "OracleValidationError";
    this.code = code;
  }
}

export type LoanPaymentOracleInput = {
  readonly principal: number;
  readonly annualRate: number;
  readonly months: number;
};

export type LoanPaymentOracleOutput = {
  readonly monthlyPayment: number;
};

export type MortgagePaymentOracleInput = LoanPaymentOracleInput;

export type MortgagePaymentOracleOutput = {
  readonly monthlyPayment: number;
  readonly totalPaid: number;
  readonly totalInterest: number;
};

export type SimpleInterestOracleInput = {
  readonly principal: number;
  readonly ratePercent: number;
  readonly years: number;
};

export type SimpleInterestOracleOutput = {
  readonly interestAmount: number;
  readonly totalRepayment: number;
};

export type CompoundInterestOracleInput = {
  readonly principal: number;
  readonly annualRate: number;
  readonly years: number;
  readonly compoundsPerYear: number;
};

export type CompoundInterestOracleOutput = {
  readonly futureValue: number;
  readonly interestEarned: number;
};

export type ProfitMarginOracleInput = {
  readonly sellingPrice: number;
  readonly cost: number;
};

export type ProfitMarginOracleOutput = {
  readonly marginPercent: number;
  readonly markupPercent: number;
};

export type ProjectCostOracleInput = {
  readonly materialCost: number;
  readonly laborHours: number;
  readonly laborHourlyRate: number;
  readonly equipmentCost: number;
  readonly overheadRate: number;
  readonly contingencyRate: number;
};

export type ProjectCostOracleOutput = {
  readonly laborCost: number;
  readonly baseCost: number;
  readonly overheadCost: number;
  readonly contingencyCost: number;
  readonly estimatedProjectCost: number;
};

export type CleaningCostOracleInput = {
  readonly area: number;
  readonly estimatedHours: number;
  readonly crewSize: number;
  readonly laborHourlyCost: number;
  readonly suppliesCost: number;
  readonly travelCost: number;
};

export type CleaningCostOracleOutput = {
  readonly laborCost: number;
  readonly totalCost: number;
  readonly costPerSqFt: number;
};

export type FoodCostOracleInput = {
  readonly ingredientCost: number;
  readonly menuPrice: number;
};

export type FoodCostOracleOutput = {
  readonly foodCostPercent: number;
  readonly grossMarginPercent: number;
};

export type ProductMarginOracleInput = {
  readonly sellingPrice: number;
  readonly productCost: number;
  readonly shippingCost: number;
  readonly platformFeeRate: number;
  readonly paymentFeeRate: number;
  readonly returnRate: number;
};

export type ProductMarginOracleOutput = {
  readonly margin: number;
  readonly grossProfit: number;
  readonly totalCost: number;
  readonly returnImpact: number;
};

export type WeldingCostOracleInput = {
  readonly materialCost: number;
  readonly laborHours: number;
  readonly laborRate: number;
  readonly consumablesCost: number;
};

export type WeldingCostOracleOutput = {
  readonly estimatedCost: number;
  readonly laborCost: number;
};

export type ChangeOrderImpactOracleInput = {
  readonly originalContractValue: number;
  readonly originalEstimatedCost: number;
  readonly extraLaborHours: number;
  readonly laborHourlyRate: number;
  readonly extraMaterialCost: number;
  readonly extraEquipmentCost: number;
  readonly delayDays: number;
  readonly dailyOverheadCost: number;
  readonly targetChangeMargin: number;
  readonly customerOfferedPrice: number;
};

export type ChangeOrderImpactOracleOutput = {
  readonly extraLaborCost: number;
  readonly delayCost: number;
  readonly extraDirectCost: number;
  readonly minimumSafeChangePrice: number;
};

export type OfficeCleaningBidOptimizerOracleInput = {
  readonly area: number;
  readonly frequencyPerMonth: number;
  readonly hoursPerVisit: number;
  readonly crewSize: number;
  readonly laborHourlyCost: number;
  readonly suppliesCostPerVisit: number;
  readonly travelCostPerVisit: number;
  readonly monthlyOverhead: number;
  readonly targetMargin: number;
  readonly customerBudget: number;
};

export type OfficeCleaningBidOptimizerOracleOutput = {
  readonly monthlyDirectCost: number;
  readonly minimumSafeMonthlyBid: number;
  readonly marginAtBudget: number;
};

export type MenuProfitLeakDetectorOracleInput = {
  readonly sellingPrice: number;
  readonly ingredientCost: number;
  readonly wasteRate: number;
  readonly packagingCost: number;
  readonly laborCostPerItem: number;
  readonly deliveryCommissionRate: number;
  readonly targetMargin: number;
  readonly monthlyUnitsSold: number;
};

export type MenuProfitLeakDetectorOracleOutput = {
  readonly totalCostPerItem: number;
  readonly actualMargin: number;
  readonly minimumSafePrice: number;
  readonly grossProfitPerItem: number;
};

export type ReturnProfitErosionOracleInput = {
  readonly sellingPrice: number;
  readonly productCost: number;
  readonly shippingCost: number;
  readonly platformFeeRate: number;
  readonly paymentFeeRate: number;
  readonly returnRate: number;
  readonly returnHandlingCost: number;
  readonly adCostPerOrder: number;
  readonly targetMargin: number;
};

export type ReturnProfitErosionOracleOutput = {
  readonly netProfit: number;
  readonly netMargin: number;
  readonly returnImpact: number;
  readonly requiredPriceForTargetMargin: number;
};

export type WeldingBidRiskOracleInput = {
  readonly materialCost: number;
  readonly laborHours: number;
  readonly laborRate: number;
  readonly gasConsumableCost: number;
  readonly fitUpHours: number;
  readonly reworkRiskPercent: number;
  readonly targetMargin: number;
};

export type WeldingBidRiskOracleOutput = {
  readonly baseCost: number;
  readonly p90Cost: number;
  readonly minimumSafePrice: number;
};

export type SampleSizeOracleInput = {
  readonly population: number;
  readonly confidenceZ: number;
  readonly marginErrorPercent: number;
  readonly proportionPercent: number;
};

export type SampleSizeOracleOutput = {
  readonly requiredSample: number;
  readonly infinitePopulationEstimate: number;
};

export type HvacTonnageRuleOracleInput = {
  readonly squareFootage: number;
  readonly tonnage: number;
  readonly laborHours: number;
};

export type HvacTonnageRuleOracleOutput = {
  readonly totalBtu: number;
  readonly totalTons: number;
  readonly recommendedTons: number;
};

export type ElectricalLaborOracleInput = {
  readonly laborHours: number;
  readonly laborRate: number;
  readonly materialCost: number;
};

export type ElectricalLaborOracleOutput = {
  readonly laborCost: number;
  readonly laborMaterialRatio: number;
};

export type LawnCareCostOracleInput = {
  readonly crewHoursPerVisit: number;
  readonly visitsPerMonth: number;
  readonly laborRate: number;
};

export type LawnCareCostOracleOutput = {
  readonly monthlyLoad: number;
  readonly monthlyLaborCost: number;
};

export type RepairTimeVsPriceOracleInput = {
  readonly quotedPrice: number;
  readonly repairHours: number;
  readonly partsCost: number;
  readonly shopRate?: number;
};

export type RepairTimeVsPriceOracleOutput = {
  readonly visibleCost: number;
  readonly burdenedCost: number;
  readonly mitchellTotalHours: number;
};

export type PrintJobCostOracleInput = {
  readonly designHours: number;
  readonly laborRate: number;
  readonly materialCost: number;
};

export type PrintJobCostOracleOutput = {
  readonly designCost: number;
  readonly designMaterialRatio: number;
};

export type PlumbingJobMarginOracleInput = {
  readonly partsCost: number;
  readonly laborHours: number;
  readonly laborRate: number;
  readonly fixtureCount: number;
  readonly materialRunCost: number;
  readonly callbackRiskPercent: number;
  readonly targetMargin: number;
};

export type PlumbingJobMarginOracleOutput = {
  readonly baseCost: number;
  readonly p90Cost: number;
  readonly minimumSafePrice: number;
};

export type CabinetCostOracleInput = {
  readonly laborHours: number;
  readonly installHours: number;
  readonly sheetMaterialCost: number;
};

export type CabinetCostOracleOutput = {
  readonly totalHours: number;
  readonly wasteAdjustedHours: number;
};

export type RoofingSquareCostOracleInput = {
  readonly laborHours: number;
  readonly laborRate: number;
  readonly materialCost: number;
};

export type RoofingSquareCostOracleOutput = {
  readonly laborCost: number;
  readonly nrcaEstimate: number;
  readonly laborMaterialRatio: number;
};

export type LaserCuttingTimeOracleInput = {
  readonly setupMinutes: number;
  readonly cutLengthM: number;
  readonly cutSpeedMMin: number;
  readonly pierceCount: number;
  readonly pierceSeconds: number;
};

export type LaserCuttingTimeOracleOutput = {
  readonly totalMinutes: number;
  readonly cutMinutes: number;
};
