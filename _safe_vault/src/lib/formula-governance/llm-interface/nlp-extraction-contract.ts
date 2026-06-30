/**
 * NLP extraction contract — structured input extraction schema (interface only).
 */

export type ExtractedInputCandidate = {
  readonly variableId: string;
  readonly rawValue: string;
  readonly normalizedValue?: number;
  readonly unit?: string;
  readonly confidence: "low" | "medium" | "high";
};

export type StructuredInputExtraction = {
  readonly intent: string;
  readonly goalHint?: string;
  readonly candidates: readonly ExtractedInputCandidate[];
  readonly unresolvedPhrases: readonly string[];
};

export type MissingInputQuestion = {
  readonly variableId: string;
  readonly question: string;
  readonly dimension: string;
  readonly unit: string;
};
