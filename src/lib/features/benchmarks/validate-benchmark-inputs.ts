import type {
  BetaPartnerFieldErrors,
  BetaPartnerInput,
  ReportFeedbackFieldErrors,
  ReportFeedbackInput,
  ReportFeedbackRating,
} from "@/lib/features/benchmarks/benchmark-types";
import {
  FEEDBACK_COMMENT_MAX_LENGTH,
  NOTES_MAX_LENGTH,
} from "@/lib/features/benchmarks/benchmark-types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_RATINGS: ReportFeedbackRating[] = [1, 2, 3, 4, 5];

export function validateBetaPartnerInput(input: BetaPartnerInput): BetaPartnerFieldErrors {
  const errors: BetaPartnerFieldErrors = {};

  const email = input.email.trim();
  if (!email || !EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  const companyName = input.companyName.trim();
  const contactName = input.contactName.trim();
  if (companyName.length < 2 && contactName.length < 2) {
    errors.companyName = "Company name or contact name is required.";
    errors.contactName = "Company name or contact name is required.";
  }

  if (!input.industry.trim()) {
    errors.industry = "Select an industry.";
  }

  if (!input.mainLossArea.trim()) {
    errors.mainLossArea = "Describe your main loss area.";
  }

  if (!input.country.trim()) {
    errors.country = "Country is required.";
  }

  if (!input.companySize.trim()) {
    errors.companySize = "Select company size.";
  }

  if (!input.role.trim()) {
    errors.role = "Role is required.";
  }

  if (!input.currentMethod.trim()) {
    errors.currentMethod = "Describe how you track loss today.";
  }

  if (!input.monthlyEstimatedLossRange.trim()) {
    errors.monthlyEstimatedLossRange = "Select an estimated loss range.";
  }

  const notes = input.notes.trim();
  if (notes.length > NOTES_MAX_LENGTH) {
    errors.notes = `Notes must be ${NOTES_MAX_LENGTH} characters or fewer.`;
  }

  return errors;
}

export function validateReportFeedbackInput(
  input: ReportFeedbackInput
): ReportFeedbackFieldErrors {
  const errors: ReportFeedbackFieldErrors = {};

  if (!input.schemaSlug.trim()) {
    errors.schemaSlug = "Schema slug is required.";
  }

  if (!input.sectorSlug.trim()) {
    errors.sectorSlug = "Sector slug is required.";
  }

  if (!VALID_RATINGS.includes(input.rating)) {
    errors.rating = "Rating must be between 1 and 5.";
  }

  if (!input.usefulness.trim()) {
    errors.usefulness = "Select usefulness.";
  }

  if (!input.formulaFit.trim()) {
    errors.formulaFit = "Select formula fit.";
  }

  const comment = input.comment.trim();
  if (comment.length > FEEDBACK_COMMENT_MAX_LENGTH) {
    errors.comment = `Comment must be ${FEEDBACK_COMMENT_MAX_LENGTH} characters or fewer.`;
  }

  return errors;
}

export function isValidReportFeedbackRating(value: number): value is ReportFeedbackRating {
  return VALID_RATINGS.includes(value as ReportFeedbackRating);
}
