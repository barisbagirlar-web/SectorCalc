export type CustomerAiIntent =
  | "tool_finder"
  | "parameter_extraction"
  | "input_help"
  | "result_explanation"
  | "premium_suggestion"
  | "general_tool_question"
  | "unsupported";

export type CustomerAiRequest = {
  locale: string;
  message: string;
  currentPath?: string;
  currentToolSlug?: string;
  calculationResult?: Record<string, unknown>;
  formInputs?: Record<string, unknown>;
};

export type CustomerAiSafeResponse = {
  intent: CustomerAiIntent;
  answer: string;
  suggestedToolSlug?: string;
  suggestedToolPath?: string;
  extractedInputs?: Record<string, unknown>;
  missingInputs?: string[];
  premiumSuggestion?: string;
  safetyStatus: "approved" | "fallback";
};

export type CustomerAiGatewayResult = CustomerAiSafeResponse & {
  modelTier?: "flash" | "pro";
  modelUsed?: string;
};
