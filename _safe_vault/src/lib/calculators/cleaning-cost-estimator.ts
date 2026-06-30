import type { ResultTone, ToolResult } from "@/data/tool-schema";

export interface CleaningCostEstimatorInput {
 area: number;
 estimatedHours: number;
 crewSize: number;
 laborHourlyCost: number;
 suppliesCost: number;
 travelCost: number;
}

export type CleaningCostEstimatorField = keyof CleaningCostEstimatorInput;

export type CleaningCostEstimatorErrors = Partial<
 Record<CleaningCostEstimatorField, string>
>;

/** Cost per sq ft: <= $0.10 success, <= $0.18 warning, above danger */
function costPerSqFtTone(costPerSqFt: number): ResultTone {
 if (costPerSqFt <= 0.1) return "success";
 if (costPerSqFt <= 0.18) return "warning";
 return "danger";
}

export function validateCleaningCostEstimator(
 input: CleaningCostEstimatorInput
): CleaningCostEstimatorErrors {
 const errors: CleaningCostEstimatorErrors = {};

 if (Number.isNaN(input.area) || input.area <= 0) {
 errors.area = "Area must be greater than zero.";
 }

 if (Number.isNaN(input.estimatedHours) || input.estimatedHours <= 0) {
 errors.estimatedHours = "Estimated hours must be greater than zero.";
 }

 if (Number.isNaN(input.crewSize) || input.crewSize < 1) {
 errors.crewSize = "Crew size must be at least 1.";
 }

 const costFields: CleaningCostEstimatorField[] = [
 "laborHourlyCost",
 "suppliesCost",
 "travelCost",
 ];

 for (const field of costFields) {
 const value = input[field];
 if (Number.isNaN(value) || value < 0) {
 errors[field] = "Enter a valid amount of zero or greater.";
 }
 }

 return errors;
}

export function hasCleaningCostValidationErrors(
 errors: CleaningCostEstimatorErrors
): boolean {
 return Object.keys(errors).length > 0;
}

export interface CleaningCostEstimatorOutput {
 laborCost: number;
 totalCost: number;
 costPerSqFt: number;
 costPerCrewHour: number;
}

export function calculateCleaningCostEstimator(
 input: CleaningCostEstimatorInput
): CleaningCostEstimatorOutput | null {
 const errors = validateCleaningCostEstimator(input);
 if (hasCleaningCostValidationErrors(errors)) return null;

 const laborCost = input.estimatedHours * input.crewSize * input.laborHourlyCost;
 const totalCost = laborCost + input.suppliesCost + input.travelCost;
 const costPerSqFt = totalCost / input.area;
 const crewHours = input.estimatedHours * input.crewSize;
 const costPerCrewHour = totalCost / crewHours;

 return {
 laborCost,
 totalCost,
 costPerSqFt,
 costPerCrewHour,
 };
}

export function mapCleaningCostResults(
 output: CleaningCostEstimatorOutput
): ToolResult[] {
 return [
 {
 id: "totalCost",
 label: "Estimated cleaning cost",
 value: output.totalCost,
 currency: true,
 tone: costPerSqFtTone(output.costPerSqFt),
 },
 {
 id: "laborCost",
 label: "Labor cost",
 value: output.laborCost,
 currency: true,
 tone: "neutral",
 },
 {
 id: "costPerSqFt",
 label: "Cost per sq ft",
 value: output.costPerSqFt,
 currency: true,
 tone: costPerSqFtTone(output.costPerSqFt),
 },
 {
 id: "costPerCrewHour",
 label: "Cost per crew hour",
 value: output.costPerCrewHour,
 currency: true,
 tone: "neutral",
 },
 ];
}
