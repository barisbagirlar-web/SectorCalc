import type { ResultTone, ToolResult } from "@/data/tool-schema";

export interface ProductMarginCalculatorInput {
 sellingPrice: number;
 productCost: number;
 shippingCost: number;
 platformFeeRate: number;
 paymentFeeRate: number;
 returnRate: number;
}

export type ProductMarginCalculatorField = keyof ProductMarginCalculatorInput;

export type ProductMarginCalculatorErrors = Partial<
 Record<ProductMarginCalculatorField, string>
>;

/** Margin %: >= 25 success, >= 15 warning, below danger (negative always danger) */
function marginTone(margin: number, grossProfit: number): ResultTone {
 if (grossProfit < 0) return "danger";
 if (margin >= 25) return "success";
 if (margin >= 15) return "warning";
 return "danger";
}

/** Return rate above 15% = warning, above 25% = danger */
function returnRateTone(returnRate: number): ResultTone {
 if (returnRate > 25) return "danger";
 if (returnRate > 15) return "warning";
 return "neutral";
}

export function validateProductMarginCalculator(
 input: ProductMarginCalculatorInput
): ProductMarginCalculatorErrors {
 const errors: ProductMarginCalculatorErrors = {};

 const nonNegative: ProductMarginCalculatorField[] = [
 "sellingPrice",
 "productCost",
 "shippingCost",
 ];

 for (const field of nonNegative) {
 const value = input[field];
 if (Number.isNaN(value) || value < 0) {
 errors[field] = "Enter a valid amount of zero or greater.";
 }
 }

 const rateFields: ProductMarginCalculatorField[] = [
 "platformFeeRate",
 "paymentFeeRate",
 "returnRate",
 ];

 for (const field of rateFields) {
 const value = input[field];
 if (Number.isNaN(value) || value < 0 || value > 100) {
 errors[field] = "Percentage must be between 0% and 100%.";
 }
 }

 return errors;
}

export function hasProductMarginValidationErrors(
 errors: ProductMarginCalculatorErrors
): boolean {
 return Object.keys(errors).length > 0;
}

export interface ProductMarginCalculatorOutput {
 platformFee: number;
 paymentFee: number;
 returnImpact: number;
 totalCost: number;
 grossProfit: number;
 margin: number;
}

export function calculateProductMarginCalculator(
 input: ProductMarginCalculatorInput
): ProductMarginCalculatorOutput | null {
 const errors = validateProductMarginCalculator(input);
 if (hasProductMarginValidationErrors(errors)) return null;

 const platformFee = input.sellingPrice * (input.platformFeeRate / 100);
 const paymentFee = input.sellingPrice * (input.paymentFeeRate / 100);
 const returnImpact = input.sellingPrice * (input.returnRate / 100);
 const totalCost =
 input.productCost +
 input.shippingCost +
 platformFee +
 paymentFee +
 returnImpact;
 const grossProfit = input.sellingPrice - totalCost;
 const margin =
 input.sellingPrice > 0 ? (grossProfit / input.sellingPrice) * 100 : 0;

 return {
 platformFee,
 paymentFee,
 returnImpact,
 totalCost,
 grossProfit,
 margin,
 };
}

export function mapProductMarginResults(
 output: ProductMarginCalculatorOutput,
 input: ProductMarginCalculatorInput
): ToolResult[] {
 return [
 {
 id: "margin",
 label: "Estimated product margin %",
 value: output.margin,
 unit: "%",
 tone: marginTone(output.margin, output.grossProfit),
 },
 {
 id: "grossProfit",
 label: "Gross profit per order",
 value: output.grossProfit,
 currency: true,
 tone: marginTone(output.margin, output.grossProfit),
 },
 {
 id: "totalCost",
 label: "Total cost per order",
 value: output.totalCost,
 currency: true,
 tone: "neutral",
 },
 {
 id: "returnImpact",
 label: "Return impact",
 value: output.returnImpact,
 currency: true,
 tone: returnRateTone(input.returnRate),
 },
 ];
}
