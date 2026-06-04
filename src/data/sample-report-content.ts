export interface SampleReportKpi {
  id: string;
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning" | "danger";
}

export const SAMPLE_REPORT_KPIS: SampleReportKpi[] = [
  {
    id: "min-quote",
    label: "Minimum safe quote",
    value: "$4,280",
    tone: "success",
  },
  {
    id: "risk",
    label: "Risk level",
    value: "Moderate risk",
    tone: "warning",
  },
  {
    id: "margin",
    label: "Target margin",
    value: "28%",
    tone: "neutral",
  },
  {
    id: "setup-share",
    label: "Setup cost share",
    value: "31%",
    tone: "warning",
  },
];

export const SAMPLE_REPORT_EXECUTIVE_SUMMARY =
  "For a batch of 10 CNC parts at 28% target margin, the minimum safe quote is $4,280 ($428 per unit). Direct cost before margin is $3,347 with $933 gross profit at the target margin. The job is structurally acceptable if setup time and scrap assumptions hold.";

export const SAMPLE_REPORT_KEY_FINDINGS = [
  "Productive machine time totals 4.5 hours (setup 1.5 h + cycle 3.0 h).",
  "Setup cost represents 31% of direct cost — small batches amplify setup exposure.",
  "Scrap at 5% adds an estimated $9 material impact on this job.",
  "Break-even quote (no margin) is $3,347; target margin requires $4,280.",
];

export const SAMPLE_REPORT_SCENARIOS = [
  {
    label: "Low margin scenario",
    margin: "18%",
    quote: "$4,082",
    unit: "$408",
    profit: "$735",
  },
  {
    label: "Base scenario",
    margin: "28%",
    quote: "$4,280",
    unit: "$428",
    profit: "$933",
  },
  {
    label: "Strong margin scenario",
    margin: "38%",
    quote: "$4,528",
    unit: "$453",
    profit: "$1,181",
  },
];

export const SAMPLE_REPORT_RISK =
  "Moderate risk — review setup cost, scrap allowance and margin before sending the quote.";

export const SAMPLE_REPORT_RECOMMENDATION =
  "The job may be acceptable, but the quote should include a margin buffer for setup and scrap variation. Confirm material price stability and first-piece approval time before commitment.";

export const SAMPLE_REPORT_ASSUMPTIONS =
  "This sample is illustrative and based on hypothetical CNC job inputs. It does not replace professional cost accounting, contractual review or shop-floor validation. Paid export and saved calculations are not yet available in the MVP.";

export const SAMPLE_REPORT_INCLUDES = [
  "Executive summary tailored to your inputs",
  "Key findings with cost drivers and thresholds",
  "Scenario analysis (low, base, strong margin or return assumptions)",
  "Structured risk level and verdict",
  "Actionable recommendation for operators and advisors",
  "Assumptions and limitations for client-ready context",
  "Export package (PDF, Excel, Word) — coming soon",
];
