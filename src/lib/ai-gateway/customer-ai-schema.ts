import { z } from "zod";

export const CustomerAiResponseSchema = z.object({
  intent: z.enum([
    "tool_finder",
    "parameter_extraction",
    "input_help",
    "result_explanation",
    "premium_suggestion",
    "general_tool_question",
    "unsupported",
  ]),
  answer: z.string().min(3).max(1200),
  suggestedToolSlug: z.string().optional(),
  extractedInputs: z.record(z.string(), z.unknown()).optional(),
  missingInputs: z.array(z.string()).optional(),
  premiumSuggestion: z.string().max(600).optional(),
  confidence: z.number().min(0).max(1),
  requiresBackendValidation: z.boolean(),
});

export type CustomerAiModelResponse = z.infer<typeof CustomerAiResponseSchema>;
