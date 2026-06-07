import type { ResultTone, ToolResult } from "@/data/tool-schema";

export interface ProjectCostEstimatorInput {
 materialCost: number;
 laborHours: number;
 laborHourlyRate: number;
 equipmentCost: number;
 overheadRate: number;
 contingencyRate: number;
}

export type ProjectCostEstimatorField = keyof ProjectCostEstimatorInput;

export type ProjectCostEstimatorErrors = Partial<
 Record<ProjectCostEstimatorField, string>
>;

/** Labor share of base cost above 65% = warning, above 80% = danger */
function laborShareTone(laborCost: number, baseCost: number): ResultTone {
 if (baseCost <= 0) return "neutral";
 const share = laborCost / baseCost;
 if (share > 0.8) return "danger";
 if (share > 0.65) return "warning";
 return "success";
}

/** Combined overhead + contingency rate above 25% = warning, above 40% = danger */
function bufferRateTone(overheadRate: number, contingencyRate: number): ResultTone {
 const combined = overheadRate + contingencyRate;
 if (combined > 40) return "danger";
 if (combined > 25) return "warning";
 return "success";
}

export function validateProjectCostEstimator(
 input: ProjectCostEstimatorInput
): ProjectCostEstimatorErrors {
 const errors: ProjectCostEstimatorErrors = {};

 const nonNegative: ProjectCostEstimatorField[] = [
 "materialCost",
 "laborHours",
 "laborHourlyRate",
 "equipmentCost",
 ];

 for (const field of nonNegative) {
 const value = input[field];
 if (Number.isNaN(value) || value < 0) {
 errors[field] = "Enter a valid amount of zero or greater.";
 }
 }

 if (
 Number.isNaN(input.overheadRate) ||
 input.overheadRate < 0 ||
 input.overheadRate > 100
 ) {
 errors.overheadRate = "Overhead must be between 0% and 100%.";
 }

 if (
 Number.isNaN(input.contingencyRate) ||
 input.contingencyRate < 0 ||
 input.contingencyRate > 100
 ) {
 errors.contingencyRate = "Contingency must be between 0% and 100%.";
 }

 return errors;
}

export function hasProjectCostValidationErrors(
 errors: ProjectCostEstimatorErrors
): boolean {
 return Object.keys(errors).length > 0;
}

export interface ProjectCostEstimatorOutput {
 laborCost: number;
 baseCost: number;
 overheadCost: number;
 contingencyCost: number;
 estimatedProjectCost: number;
}

export function calculateProjectCostEstimator(
 input: ProjectCostEstimatorInput
): ProjectCostEstimatorOutput | null {
 const errors = validateProjectCostEstimator(input);
 if (hasProjectCostValidationErrors(errors)) return null;

 const laborCost = input.laborHours * input.laborHourlyRate;
 const baseCost = input.materialCost + laborCost + input.equipmentCost;
 const overheadCost = baseCost * (input.overheadRate / 100);
 const contingencyCost = (baseCost + overheadCost) * (input.contingencyRate / 100);
 const estimatedProjectCost = baseCost + overheadCost + contingencyCost;

 return {
 laborCost,
 baseCost,
 overheadCost,
 contingencyCost,
 estimatedProjectCost,
 };
}

export function mapProjectCostResults(
 output: ProjectCostEstimatorOutput,
 input: ProjectCostEstimatorInput
): ToolResult[] {
 return [
 {
 id: "estimatedProjectCost",
 label: "Estimated project cost",
 value: output.estimatedProjectCost,
 currency: true,
 tone: "neutral",
 },
 {
 id: "laborCost",
 label: "Labor cost",
 value: output.laborCost,
 currency: true,
 tone: laborShareTone(output.laborCost, output.baseCost),
 },
 {
 id: "overheadCost",
 label: "Overhead cost",
 value: output.overheadCost,
 currency: true,
 tone: input.overheadRate > 20 ? "warning" : "neutral",
 },
 {
 id: "contingencyCost",
 label: "Contingency amount",
 value: output.contingencyCost,
 currency: true,
 tone: bufferRateTone(input.overheadRate, input.contingencyRate),
 },
 ];
}
