export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const HOME_FAQ: FaqItem[] = [
  {
    id: "free-vs-premium",
    question: "What is the difference between free and premium tools?",
    answer:
      "Free tools provide quick estimates for everyday business decisions. Premium sector tools add scenario analysis, risk assessment, and exportable decision reports designed for high-stakes pricing and operational choices.",
  },
  {
    id: "reports",
    question: "What is a decision report?",
    answer:
      "A decision report turns calculator outputs into structured findings, scenario comparisons, risk levels, and actionable recommendations — ready to share with clients or internal stakeholders.",
  },
  {
    id: "industries",
    question: "Which industries does SectorCalc support?",
    answer:
      "We launch with Construction, Cleaning, Restaurant, E-commerce, and CNC & Manufacturing — with more sector packs planned based on operator demand.",
  },
  {
    id: "consultants",
    question: "Can consultants use SectorCalc with clients?",
    answer:
      "Yes. Our consultant program (coming soon) will support branded reports, client workspaces, and repeatable analysis workflows for advisory practices.",
  },
];
