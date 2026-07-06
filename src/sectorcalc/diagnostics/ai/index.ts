// Legacy types and providers
export type { AiDiagnosticInput, AiDiagnosticOutput, AiReportSection } from "./diagnostic-ai-types";
export { validateAiOutput } from "./diagnostic-ai-guardrails";
export { callAiDiagnosticProvider } from "./openai-diagnostics-provider";

// New engineering reasoning types and services
export type {
  AiEngineeringDraft,
  EngineeringDraftInput,
  EngineeringDraftResult,
  ObservationEntry,
  RootCauseHypothesis,
  NcrDraft,
  CapaDraft,
} from "./diagnostic-ai-types";
export { AiEngineeringDraftSchema } from "./diagnostic-ai-schema";
export type { ValidatedAiEngineeringDraft } from "./diagnostic-ai-schema";
export { validateEngineeringDraft } from "./diagnostic-ai-guardrails";
export { callEngineeringReasoningProvider } from "./openai-engineering-provider";
export { buildEngineeringAiDraft } from "./diagnostic-ai-service";
export { buildFallbackDraft } from "./diagnostic-ai-fallback";
