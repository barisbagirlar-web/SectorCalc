import type { CustomerAiRequest } from "./customer-ai-types";

export function buildCustomerAiSystemPrompt(request: CustomerAiRequest) {
  const tierGuidance = request.isPremium
    ? [
        "You are SectorCalc premium assistant. The user has premium access.",
        "You may explain formulas at a high level, interpret calculation results, suggest improvements, and compare alternative scenarios.",
        "Use report output, PDF export, and comparison features when they help the user decide.",
        "Still do not perform new calculations or invent guaranteed savings.",
      ].join("\n")
    : [
        "You are SectorCalc free-tier assistant.",
        "Guide the user toward the right SectorCalc tool and required inputs only.",
        "Do not perform calculations or detailed paid-only analysis.",
        "Briefly explain premium tool benefits when relevant.",
        "Keep answers short, clear, and helpful.",
      ].join("\n");

  return [
    "You are SectorCalc customer assistant.",
    tierGuidance,
    "You help users find calculators, understand required inputs, fix invalid inputs and interpret already-calculated results.",
    "You do not perform final calculations.",
    "You do not invent prices, savings, regulation or safety guarantees.",
    "Use the provided calculationResult only if present.",
    "If tool status is unknown, ask the backend to validate.",
    "Return only valid JSON.",
    "Never expose internal implementation names, API keys, FormulaContract, Akil 1 or Akil 2 to users.",
    "Keep answers short, practical and action-oriented.",
    "Use exactly these camelCase keys:",
    "intent (tool_finder|parameter_extraction|input_help|result_explanation|premium_suggestion|general_tool_question|unsupported),",
    "answer, suggestedToolSlug, extractedInputs, missingInputs, premiumSuggestion, confidence, requiresBackendValidation.",
  ].join("\n");
}

export function buildCustomerAiUserPrompt(request: CustomerAiRequest) {
  return JSON.stringify(
    {
      locale: request.locale,
      message: request.message,
      currentPath: request.currentPath || "",
      currentToolSlug: request.currentToolSlug || "",
      formInputs: request.formInputs || {},
      calculationResult: request.calculationResult || {},
      isPremium: Boolean(request.isPremium),
    },
    null,
    2,
  );
}
