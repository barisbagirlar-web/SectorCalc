export interface ReportSection {
 id: string;
 title: string;
 description: string;
}

export const SAMPLE_REPORT_SECTIONS: ReportSection[] = [
 {
 id: "executive-summary",
 title: "Executive Summary",
 description:
 "A concise overview of the business decision, key numbers, and recommended course of action.",
 },
 {
 id: "key-findings",
 title: "Key Findings",
 description:
 "Critical insights from your calculator inputs — margin exposure, cost drivers, and threshold breaches.",
 },
 {
 id: "scenario-analysis",
 title: "Scenario Analysis",
 description:
 "Side-by-side comparison of best-case, base-case, and worst-case outcomes for informed trade-offs.",
 },
 {
 id: "risk-level",
 title: "Risk Level",
 description:
 "Structured risk rating with factors that could impact profitability, delivery, or client satisfaction.",
 },
 {
 id: "recommendation",
 title: "Recommendation",
 description:
 "Clear, actionable next steps — adjust pricing, renegotiate terms, or proceed with documented rationale.",
 },
];

export const REPORT_EXPORT_FORMATS = ["PDF", "Excel", "Word"] as const;

export type ReportExportFormat = (typeof REPORT_EXPORT_FORMATS)[number];
