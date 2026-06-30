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

export type PremiumMarginOracleOutput = {
  readonly baseCost: number;
  readonly p90Cost: number;
  readonly minimumSafePrice: number;
};

export type HvacProjectMarginGuardOracleInput = {
  readonly equipmentCost: number;
  readonly ductworkCost: number;
  readonly laborHours: number;
  readonly laborRate: number;
  readonly commissioningCost: number;
  readonly callbackRiskPercent: number;
  readonly targetMargin: number;
};

export type PanelShopMarginVerdictOracleInput = {
  readonly materialCost: number;
  readonly laborHours: number;
  readonly laborRate: number;
  readonly testingHours: number;
  readonly inspectionRiskPercent: number;
  readonly targetMargin: number;
};

export type LandscapingContractProfitOracleInput = {
  readonly crewHoursPerVisit: number;
  readonly laborRate: number;
  readonly fuelCostPerVisit: number;
  readonly supplyCostPerMonth: number;
  readonly visitsPerMonth: number;
  readonly equipmentWearCost: number;
  readonly targetMargin: number;
};

export type AutoShopMarginLeakOracleInput = {
  readonly quotedPrice?: number;
  readonly diagnosticHours: number;
  readonly repairHours: number;
  readonly laborRate: number;
  readonly partsCost: number;
  readonly comebackRiskPercent: number;
  readonly partsMarkupPercent: number;
  readonly targetMargin?: number;
};

export type SignageBidSafePriceOracleInput = {
  readonly materialCost: number;
  readonly inkCost: number;
  readonly designHours: number;
  readonly laborRate: number;
  readonly installHours: number;
  readonly reprintRiskPercent: number;
  readonly targetMargin: number;
};

export type MillworkBidRiskOracleInput = {
  readonly sheetMaterialCost: number;
  readonly laborHours: number;
  readonly laborRate: number;
  readonly finishingCost: number;
  readonly installHours: number;
  readonly wasteRatePercent: number;
  readonly targetMargin: number;
};

export type RoofingContractMarginGuardOracleInput = {
  readonly materialCost: number;
  readonly laborHours: number;
  readonly laborRate: number;
  readonly tearOffCost: number;
  readonly dumpFees: number;
  readonly weatherDelayRiskPercent: number;
  readonly targetMargin: number;
};

export type PaintingJobProfitVerdictOracleInput = {
  readonly paintCost: number;
  readonly prepHours: number;
  readonly laborRate: number;
  readonly scaffoldCost: number;
  readonly touchUpRiskPercent: number;
  readonly areaSize: number;
  readonly targetMargin: number;
};

export type SheetMetalQuoteRiskOracleInput = {
  readonly programmingTime: number;
  readonly setupTime: number;
  readonly cutTime: number;
  readonly bendCount: number;
  readonly laborRate: number;
  readonly materialCost: number;
  readonly scrapRatePercent: number;
  readonly finishingCost: number;
  readonly targetMargin: number;
};

export type ThreeDPrintCostOracleInput = {
  readonly materialCost: number;
  readonly printHours: number;
  readonly machineRate: number;
  readonly postProcessHours: number;
  readonly laborRate: number;
};

export type ThreeDPrintCostOracleOutput = {
  readonly estimatedCost: number;
  readonly machineTimeCost: number;
};
