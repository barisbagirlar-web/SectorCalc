/** CNC Quote Risk Report - premium decision report showcase (illustrative). */

export const SAMPLE_REPORT_TITLE = "CNC Quote Risk Report";

export const SAMPLE_REPORT_VERDICT = "DO NOT ACCEPT UNDER $1,840";

export const SAMPLE_REPORT_MARGIN_RISK = "HIGH";

export const SAMPLE_REPORT_MAIN_LEAK = "Setup time + tooling buffer";

export const SAMPLE_REPORT_SUGGESTED_ACTION =
 "Reprice or reduce scope before sending the quote.";

export const SAMPLE_REPORT_EXECUTIVE_VERDICT = `The quoted job at $1,520 falls below the minimum safe price floor of $1,840. Margin risk is HIGH - setup time and tooling buffer consume disproportionate share of direct cost on this one-off run. Do not accept the work at the current quote without repricing or reducing scope.`;

export const SAMPLE_REPORT_INPUT_SUMMARY = [
 { label: "Quoted price", value: "$1,520" },
 { label: "Quantity", value: "8 parts" },
 { label: "Setup time", value: "2.5 hours" },
 { label: "Cycle time per part", value: "18 minutes" },
 { label: "Machine rate", value: "$95/hour" },
 { label: "Material cost", value: "$186" },
 { label: "Tooling / consumables", value: "$74" },
 { label: "Target margin", value: "28%" },
] as const;

export const SAMPLE_REPORT_MINIMUM_SAFE_PRICE = {
 amount: "$1,840",
 perUnit: "$230/part",
 note: "Floor price at 28% target margin after setup, tooling buffer and scrap allowance.",
};

export const SAMPLE_REPORT_MARGIN_LEAKS = [
 {
 driver: "Setup time concentration",
 impact: "Setup represents 38% of direct machine cost on an 8-part batch.",
 severity: "high" as const,
 },
 {
 driver: "Tooling buffer underpriced",
 impact: "Tool changes and first-piece prove-out not fully reflected in quote.",
 severity: "high" as const,
 },
 {
 driver: "Scrap allowance",
 impact: "5% scrap on tight-tolerance work adds $12 material exposure.",
 severity: "medium" as const,
 },
 {
 driver: "Rush scheduling pressure",
 impact: "Expedited slot may require overtime rate not in base quote.",
 severity: "medium" as const,
 },
] as const;

export const SAMPLE_REPORT_SCENARIOS = [
 {
 label: "Current quote (at risk)",
 quote: "$1,520",
 margin: "12%",
 verdict: "DO NOT ACCEPT",
 tone: "danger" as const,
 },
 {
 label: "Minimum safe price",
 quote: "$1,840",
 margin: "28%",
 verdict: "REPRICE TO THIS FLOOR",
 tone: "warning" as const,
 },
 {
 label: "Strong margin scenario",
 quote: "$2,040",
 margin: "38%",
 verdict: "SAFE TO QUOTE",
 tone: "success" as const,
 },
] as const;

export const SAMPLE_REPORT_DISCLAIMER =
 "This sample report is illustrative and based on hypothetical CNC job inputs. It demonstrates premium verdict structure - not a live calculation from your data. SectorCalc outputs are decision-support simulations, not financial, legal or engineering advice. Verify all numbers before commercial commitments.";

export const SAMPLE_REPORT_INCLUDES = [
 "Executive verdict with accept / reprice / reject signal",
 "Structured input summary",
 "Minimum safe price floor",
 "Margin leak diagnosis with cost drivers",
 "Scenario comparison at multiple margin targets",
 "Suggested action for operators and estimators",
 "PDF-ready export for internal review",
] as const;
