import type { ToolSlug } from "@/data/tools";

export interface ToolFinderProblem {
  id: string;
  label: string;
  description: string;
  toolSlugs: ToolSlug[];
}

export const TOOL_FINDER_PROBLEMS: ToolFinderProblem[] = [
  {
    id: "estimate-cost",
    label: "Estimate cost",
    description: "Quick project, job and service cost estimates",
    toolSlugs: [
      "project-cost-estimator",
      "cleaning-cost-estimator",
      "food-cost-calculator",
      "machine-hour-estimator",
    ],
  },
  {
    id: "protect-margin",
    label: "Protect margin",
    description: "Minimum safe price and margin protection",
    toolSlugs: [
      "cnc-minimum-safe-quote-analyzer",
      "change-order-impact-analyzer",
      "office-cleaning-bid-optimizer",
      "menu-profit-leak-detector",
    ],
  },
  {
    id: "price-a-job",
    label: "Price a job",
    description: "Bids, quotes and change-order pricing",
    toolSlugs: [
      "project-cost-estimator",
      "change-order-impact-analyzer",
      "office-cleaning-bid-optimizer",
      "cnc-minimum-safe-quote-analyzer",
    ],
  },
  {
    id: "analyze-returns",
    label: "Analyze returns",
    description: "Return-rate and catalog profit erosion",
    toolSlugs: [
      "product-margin-calculator",
      "return-rate-profit-erosion-tool",
    ],
  },
  {
    id: "detect-profit-leaks",
    label: "Detect profit leaks",
    description: "Menu and margin leak detection",
    toolSlugs: [
      "food-cost-calculator",
      "menu-profit-leak-detector",
      "product-margin-calculator",
    ],
  },
  {
    id: "calculate-machine-cost",
    label: "Calculate machine cost",
    description: "Machine-hour and CNC shop-floor costing",
    toolSlugs: [
      "machine-hour-estimator",
      "cnc-minimum-safe-quote-analyzer",
    ],
  },
];
