import { LEAD_INDUSTRY_OPTIONS } from "@/data/lead-options";

export interface SelectOption {
  value: string;
  label: string;
}

export const BETA_COMPANY_SIZE_OPTIONS: SelectOption[] = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "500+", label: "500+ employees" },
];

export const BETA_LOSS_RANGE_OPTIONS: SelectOption[] = [
  { value: "under-1k", label: "Under $1,000 / month" },
  { value: "1k-5k", label: "$1,000 – $5,000 / month" },
  { value: "5k-20k", label: "$5,000 – $20,000 / month" },
  { value: "20k-50k", label: "$20,000 – $50,000 / month" },
  { value: "50k+", label: "$50,000+ / month" },
  { value: "unknown", label: "Not sure yet" },
];

export const BETA_INDUSTRY_OPTIONS = LEAD_INDUSTRY_OPTIONS;

export const FEEDBACK_USEFULNESS_OPTIONS: SelectOption[] = [
  { value: "not_useful", label: "Not useful" },
  { value: "somewhat", label: "Somewhat useful" },
  { value: "useful", label: "Useful" },
  { value: "very_useful", label: "Very useful" },
];

export const FEEDBACK_FORMULA_FIT_OPTIONS: SelectOption[] = [
  { value: "poor", label: "Poor fit" },
  { value: "low", label: "Low fit" },
  { value: "medium", label: "Reasonable fit" },
  { value: "high", label: "Strong fit" },
  { value: "strong", label: "Very strong fit" },
];
