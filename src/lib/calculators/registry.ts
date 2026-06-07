import type { CalculatorId, ToolResult } from "@/data/tool-schema";
import type { ToolInput } from "@/data/tool-schema";
import {
 calculateMachineHourEstimator,
 validateMachineHourEstimator,
 mapMachineHourResults,
 hasValidationErrors,
 type MachineHourEstimatorInput,
} from "@/lib/calculators/machine-hour-estimator";
import {
 calculateCncQuoteAnalyzer,
 validateCncQuoteAnalyzer,
 mapCncQuoteResults,
 hasCncValidationErrors,
 type CncQuoteAnalyzerInput,
} from "@/lib/calculators/cnc-minimum-safe-quote-analyzer";
import {
 calculateChangeOrderAnalyzer,
 validateChangeOrderAnalyzer,
 mapChangeOrderResults,
 hasChangeOrderValidationErrors,
 type ChangeOrderAnalyzerInput,
} from "@/lib/calculators/change-order-impact-analyzer";
import {
 calculateCleaningBidOptimizer,
 validateCleaningBidOptimizer,
 mapCleaningBidResults,
 hasCleaningBidValidationErrors,
 type CleaningBidOptimizerInput,
} from "@/lib/calculators/office-cleaning-bid-optimizer";
import {
 calculateMenuProfitLeak,
 validateMenuProfitLeak,
 mapMenuProfitLeakResults,
 hasMenuProfitLeakValidationErrors,
 type MenuProfitLeakInput,
} from "@/lib/calculators/menu-profit-leak-detector";
import {
 calculateReturnRateErosion,
 validateReturnRateErosion,
 mapReturnRateErosionResults,
 hasReturnRateErosionValidationErrors,
 type ReturnRateErosionInput,
} from "@/lib/calculators/return-rate-profit-erosion-tool";
import type { PremiumCalculatorPayload } from "@/lib/calculators/premium-types";
import {
 calculateProjectCostEstimator,
 validateProjectCostEstimator,
 mapProjectCostResults,
 hasProjectCostValidationErrors,
 type ProjectCostEstimatorInput,
} from "@/lib/calculators/project-cost-estimator";
import {
 calculateCleaningCostEstimator,
 validateCleaningCostEstimator,
 mapCleaningCostResults,
 hasCleaningCostValidationErrors,
 type CleaningCostEstimatorInput,
} from "@/lib/calculators/cleaning-cost-estimator";
import {
 calculateFoodCostCalculator,
 validateFoodCostCalculator,
 mapFoodCostResults,
 hasFoodCostValidationErrors,
 type FoodCostCalculatorInput,
} from "@/lib/calculators/food-cost-calculator";
import {
 calculateProductMarginCalculator,
 validateProductMarginCalculator,
 mapProductMarginResults,
 hasProductMarginValidationErrors,
 type ProductMarginCalculatorInput,
} from "@/lib/calculators/product-margin-calculator";

export type CalculatorInputValues = Record<string, number | string>;

export interface CalculatorRunResult {
 results: ToolResult[];
 errors: Record<string, string>;
 premium?: PremiumCalculatorPayload;
}

export function getDefaultInputValues(
 inputs: ToolInput[]
): CalculatorInputValues {
 return inputs.reduce<CalculatorInputValues>((acc, input) => {
 acc[input.id] = input.defaultValue;
 return acc;
 }, {});
}

function toMachineHourInput(
 values: CalculatorInputValues
): MachineHourEstimatorInput {
 return {
 monthlyMachineCost: Number(values.monthlyMachineCost),
 monthlyMaintenanceCost: Number(values.monthlyMaintenanceCost),
 monthlyEnergyCost: Number(values.monthlyEnergyCost),
 monthlyLaborCost: Number(values.monthlyLaborCost),
 monthlyOverheadCost: Number(values.monthlyOverheadCost),
 availableHours: Number(values.availableHours),
 utilizationRate: Number(values.utilizationRate),
 };
}

function toCncQuoteInput(values: CalculatorInputValues): CncQuoteAnalyzerInput {
 return {
 quantity: Number(values.quantity),
 materialCostPerPart: Number(values.materialCostPerPart),
 setupMinutes: Number(values.setupMinutes),
 cycleMinutesPerPart: Number(values.cycleMinutesPerPart),
 machineHourlyCost: Number(values.machineHourlyCost),
 operatorHourlyCost: Number(values.operatorHourlyCost),
 toolingCost: Number(values.toolingCost),
 scrapRate: Number(values.scrapRate),
 overheadCost: Number(values.overheadCost),
 targetMargin: Number(values.targetMargin),
 };
}

function toProjectCostInput(
 values: CalculatorInputValues
): ProjectCostEstimatorInput {
 return {
 materialCost: Number(values.materialCost),
 laborHours: Number(values.laborHours),
 laborHourlyRate: Number(values.laborHourlyRate),
 equipmentCost: Number(values.equipmentCost),
 overheadRate: Number(values.overheadRate),
 contingencyRate: Number(values.contingencyRate),
 };
}

function toCleaningCostInput(
 values: CalculatorInputValues
): CleaningCostEstimatorInput {
 return {
 area: Number(values.area),
 estimatedHours: Number(values.estimatedHours),
 crewSize: Number(values.crewSize),
 laborHourlyCost: Number(values.laborHourlyCost),
 suppliesCost: Number(values.suppliesCost),
 travelCost: Number(values.travelCost),
 };
}

function toFoodCostInput(values: CalculatorInputValues): FoodCostCalculatorInput {
 return {
 ingredientCost: Number(values.ingredientCost),
 portions: Number(values.portions),
 sellingPrice: Number(values.sellingPrice),
 wasteRate: Number(values.wasteRate),
 extraCostPerPortion: Number(values.extraCostPerPortion),
 };
}

function toProductMarginInput(
 values: CalculatorInputValues
): ProductMarginCalculatorInput {
 return {
 sellingPrice: Number(values.sellingPrice),
 productCost: Number(values.productCost),
 shippingCost: Number(values.shippingCost),
 platformFeeRate: Number(values.platformFeeRate),
 paymentFeeRate: Number(values.paymentFeeRate),
 returnRate: Number(values.returnRate),
 };
}

function toChangeOrderInput(
 values: CalculatorInputValues
): ChangeOrderAnalyzerInput {
 return {
 originalContractValue: Number(values.originalContractValue),
 originalEstimatedCost: Number(values.originalEstimatedCost),
 extraLaborHours: Number(values.extraLaborHours),
 laborHourlyRate: Number(values.laborHourlyRate),
 extraMaterialCost: Number(values.extraMaterialCost),
 extraEquipmentCost: Number(values.extraEquipmentCost),
 delayDays: Number(values.delayDays),
 dailyOverheadCost: Number(values.dailyOverheadCost),
 targetChangeMargin: Number(values.targetChangeMargin),
 customerOfferedPrice: Number(values.customerOfferedPrice),
 };
}

function toCleaningBidInput(
 values: CalculatorInputValues
): CleaningBidOptimizerInput {
 return {
 area: Number(values.area),
 frequencyPerMonth: Number(values.frequencyPerMonth),
 hoursPerVisit: Number(values.hoursPerVisit),
 crewSize: Number(values.crewSize),
 laborHourlyCost: Number(values.laborHourlyCost),
 suppliesCostPerVisit: Number(values.suppliesCostPerVisit),
 travelCostPerVisit: Number(values.travelCostPerVisit),
 monthlyOverhead: Number(values.monthlyOverhead),
 targetMargin: Number(values.targetMargin),
 customerBudget: Number(values.customerBudget),
 };
}

function toMenuProfitLeakInput(
 values: CalculatorInputValues
): MenuProfitLeakInput {
 return {
 sellingPrice: Number(values.sellingPrice),
 ingredientCost: Number(values.ingredientCost),
 wasteRate: Number(values.wasteRate),
 packagingCost: Number(values.packagingCost),
 laborCostPerItem: Number(values.laborCostPerItem),
 deliveryCommissionRate: Number(values.deliveryCommissionRate),
 targetMargin: Number(values.targetMargin),
 monthlyUnitsSold: Number(values.monthlyUnitsSold),
 };
}

function toReturnRateErosionInput(
 values: CalculatorInputValues
): ReturnRateErosionInput {
 return {
 sellingPrice: Number(values.sellingPrice),
 productCost: Number(values.productCost),
 shippingCost: Number(values.shippingCost),
 platformFeeRate: Number(values.platformFeeRate),
 paymentFeeRate: Number(values.paymentFeeRate),
 returnRate: Number(values.returnRate),
 returnHandlingCost: Number(values.returnHandlingCost),
 adCostPerOrder: Number(values.adCostPerOrder),
 targetMargin: Number(values.targetMargin),
 };
}

export function validateCalculatorInput(
 calculatorId: CalculatorId,
 values: CalculatorInputValues
): Record<string, string> {
 switch (calculatorId) {
 case "machine-hour-estimator":
 return validateMachineHourEstimator(toMachineHourInput(values)) as Record<
 string,
 string
 >;
 case "cnc-minimum-safe-quote-analyzer":
 return validateCncQuoteAnalyzer(toCncQuoteInput(values)) as Record<
 string,
 string
 >;
 case "project-cost-estimator":
 return validateProjectCostEstimator(toProjectCostInput(values)) as Record<
 string,
 string
 >;
 case "cleaning-cost-estimator":
 return validateCleaningCostEstimator(toCleaningCostInput(values)) as Record<
 string,
 string
 >;
 case "food-cost-calculator":
 return validateFoodCostCalculator(toFoodCostInput(values)) as Record<
 string,
 string
 >;
 case "product-margin-calculator":
 return validateProductMarginCalculator(
 toProductMarginInput(values)
 ) as Record<string, string>;
 case "change-order-impact-analyzer":
 return validateChangeOrderAnalyzer(toChangeOrderInput(values)) as Record<
 string,
 string
 >;
 case "office-cleaning-bid-optimizer":
 return validateCleaningBidOptimizer(toCleaningBidInput(values)) as Record<
 string,
 string
 >;
 case "menu-profit-leak-detector":
 return validateMenuProfitLeak(toMenuProfitLeakInput(values)) as Record<
 string,
 string
 >;
 case "return-rate-profit-erosion-tool":
 return validateReturnRateErosion(
 toReturnRateErosionInput(values)
 ) as Record<string, string>;
 default:
 return {};
 }
}

export function runCalculator(
 calculatorId: CalculatorId,
 values: CalculatorInputValues
): CalculatorRunResult | null {
 switch (calculatorId) {
 case "machine-hour-estimator": {
 const input = toMachineHourInput(values);
 const errors = validateMachineHourEstimator(input);
 if (hasValidationErrors(errors)) {
 return { results: [], errors: errors as Record<string, string> };
 }
 const output = calculateMachineHourEstimator(input);
 if (!output) {
 return { results: [], errors: errors as Record<string, string> };
 }
 return { results: mapMachineHourResults(output), errors: {} };
 }
 case "cnc-minimum-safe-quote-analyzer": {
 const input = toCncQuoteInput(values);
 const errors = validateCncQuoteAnalyzer(input);
 if (hasCncValidationErrors(errors)) {
 return { results: [], errors: errors as Record<string, string> };
 }
 const output = calculateCncQuoteAnalyzer(input);
 if (!output) {
 return { results: [], errors: errors as Record<string, string> };
 }
 return {
 results: mapCncQuoteResults(output),
 errors: {},
 premium: output.premium,
 };
 }
 case "project-cost-estimator": {
 const input = toProjectCostInput(values);
 const errors = validateProjectCostEstimator(input);
 if (hasProjectCostValidationErrors(errors)) {
 return { results: [], errors: errors as Record<string, string> };
 }
 const output = calculateProjectCostEstimator(input);
 if (!output) {
 return { results: [], errors: errors as Record<string, string> };
 }
 return {
 results: mapProjectCostResults(output, input),
 errors: {},
 };
 }
 case "cleaning-cost-estimator": {
 const input = toCleaningCostInput(values);
 const errors = validateCleaningCostEstimator(input);
 if (hasCleaningCostValidationErrors(errors)) {
 return { results: [], errors: errors as Record<string, string> };
 }
 const output = calculateCleaningCostEstimator(input);
 if (!output) {
 return { results: [], errors: errors as Record<string, string> };
 }
 return { results: mapCleaningCostResults(output), errors: {} };
 }
 case "food-cost-calculator": {
 const input = toFoodCostInput(values);
 const errors = validateFoodCostCalculator(input);
 if (hasFoodCostValidationErrors(errors)) {
 return { results: [], errors: errors as Record<string, string> };
 }
 const output = calculateFoodCostCalculator(input);
 if (!output) {
 return { results: [], errors: errors as Record<string, string> };
 }
 return { results: mapFoodCostResults(output), errors: {} };
 }
 case "product-margin-calculator": {
 const input = toProductMarginInput(values);
 const errors = validateProductMarginCalculator(input);
 if (hasProductMarginValidationErrors(errors)) {
 return { results: [], errors: errors as Record<string, string> };
 }
 const output = calculateProductMarginCalculator(input);
 if (!output) {
 return { results: [], errors: errors as Record<string, string> };
 }
 return {
 results: mapProductMarginResults(output, input),
 errors: {},
 };
 }
 case "change-order-impact-analyzer": {
 const input = toChangeOrderInput(values);
 const errors = validateChangeOrderAnalyzer(input);
 if (hasChangeOrderValidationErrors(errors)) {
 return { results: [], errors: errors as Record<string, string> };
 }
 const output = calculateChangeOrderAnalyzer(input);
 if (!output) {
 return { results: [], errors: errors as Record<string, string> };
 }
 return {
 results: mapChangeOrderResults(output),
 errors: {},
 premium: output.premium,
 };
 }
 case "office-cleaning-bid-optimizer": {
 const input = toCleaningBidInput(values);
 const errors = validateCleaningBidOptimizer(input);
 if (hasCleaningBidValidationErrors(errors)) {
 return { results: [], errors: errors as Record<string, string> };
 }
 const output = calculateCleaningBidOptimizer(input);
 if (!output) {
 return { results: [], errors: errors as Record<string, string> };
 }
 return {
 results: mapCleaningBidResults(output),
 errors: {},
 premium: output.premium,
 };
 }
 case "menu-profit-leak-detector": {
 const input = toMenuProfitLeakInput(values);
 const errors = validateMenuProfitLeak(input);
 if (hasMenuProfitLeakValidationErrors(errors)) {
 return { results: [], errors: errors as Record<string, string> };
 }
 const output = calculateMenuProfitLeak(input);
 if (!output) {
 return { results: [], errors: errors as Record<string, string> };
 }
 return {
 results: mapMenuProfitLeakResults(output),
 errors: {},
 premium: output.premium,
 };
 }
 case "return-rate-profit-erosion-tool": {
 const input = toReturnRateErosionInput(values);
 const errors = validateReturnRateErosion(input);
 if (hasReturnRateErosionValidationErrors(errors)) {
 return { results: [], errors: errors as Record<string, string> };
 }
 const output = calculateReturnRateErosion(input);
 if (!output) {
 return { results: [], errors: errors as Record<string, string> };
 }
 return {
 results: mapReturnRateErosionResults(output),
 errors: {},
 premium: output.premium,
 };
 }
 default:
 return null;
 }
}
