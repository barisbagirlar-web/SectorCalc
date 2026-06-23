import type { RevenueTool } from "@/lib/tools/revenue-tools";

export type FreeRiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type FreeToolInputValues = Record<string, number | string>;

/** @deprecated Use FreeToolInputValues */
export type FreeToolFormValues = FreeToolInputValues;

export type FreeToolResult = {
 riskLevel: FreeRiskLevel;
 headline: string;
 summary: string;
 missingFactors: string[];
 ctaLabel: string;
 };

function getNumber(values: FreeToolInputValues, key: string): number {
 const raw = values[key];

 if (typeof raw === "number") {
 return Number.isFinite(raw) ? raw : 0;
 }

 if (typeof raw === "string") {
 const parsed = Number(raw.replace(/,/g, '.'));
 return Number.isFinite(parsed) ? parsed : 0;
 }

 return 0;
}

export function calculateFreeToolResult(
 tool: RevenueTool,
 _values: FreeToolInputValues
): FreeToolResult {
 return {
 riskLevel: "LOW",
 headline: "Simulation Complete",
 summary: "This is a clean sandbox check. SectorCalc is ready for the new formula definitions.",
 missingFactors: tool.freeMissingFactors ? [...tool.freeMissingFactors] : [],
 ctaLabel: "Unlock the Full Analyzer",
 };
}

export function areFreeToolInputsValid(
 tool: RevenueTool,
 values: FreeToolInputValues
): boolean {
 for (const input of tool.freeInputs) {
 if (!input.required) {
 continue;
 }
 if (input.type === "select") {
 const raw = values[input.key];
 if (typeof raw !== "string" || raw.trim() === "") {
 return false;
 }
 continue;
 }
 const numeric = getNumber(values, input.key);
 if (numeric < 0) {
 return false;
 }
 }
 return true;
}
