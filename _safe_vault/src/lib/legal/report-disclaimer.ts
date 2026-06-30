/**
 * Report disclaimer and usage agreement — decision-support language only.
 */

export type ReportDisclaimerBlock = {
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly professionalReviewNote: string;
};

export const REPORT_DISCLAIMER: ReportDisclaimerBlock = {
  title: "Decision-support disclaimer",
  paragraphs: [
    "This output is a technical decision-support simulation based on user-provided inputs and documented assumptions.",
    "It is not legal, financial, tax, or engineering advice.",
    "Verify all inputs, formulas, and results before operational, bid, or contract use.",
    "Calculation trace is deterministic for the stated contract path; inputs remain user-provided.",
    "SectorCalc does not replace licensed professional review where regulations require it.",
  ],
  professionalReviewNote:
    "Final legal wording may require professional legal review before enterprise deployment.",
};

export function buildReportDisclaimerText(locale?: string): string {
  void locale;
  return [REPORT_DISCLAIMER.title, ...REPORT_DISCLAIMER.paragraphs, REPORT_DISCLAIMER.professionalReviewNote].join(
    "\n\n",
  );
}
