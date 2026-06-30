import "server-only";
import { getAiToolIndexRecord } from "@/lib/features/ai/tool-search-index";
import type { CustomerAiModelResponse } from "./customer-ai-schema";
import type { CustomerAiRequest, CustomerAiSafeResponse } from "./customer-ai-types";

const FORBIDDEN_PUBLIC_TERMS = [
  "FormulaContract",
  "Mind 1",
  "Mind 2",
  "API key",
  "secret",
  "internal",
  "METHODOLOGY IN PREPARATION",
];

function containsForbiddenTerm(text: string) {
  return FORBIDDEN_PUBLIC_TERMS.some((term) =>
    text.toLowerCase().includes(term.toLowerCase()),
  );
}

function toLocalizedPath(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return url.startsWith("/") ? url : `/${url}`;
  }
}

function resolveActiveToolSuggestion(
  locale: string,
  slug: string | undefined,
): Pick<CustomerAiSafeResponse, "suggestedToolSlug" | "suggestedToolPath"> {
  if (!slug) {
    return {};
  }

  const tool = getAiToolIndexRecord(slug);
  if (!tool || tool.routeStatus !== "active-route") {
    return {};
  }

  const suggestedToolPath = toLocalizedPath(
    tool.localeUrls[locale] || tool.localeUrls.en || tool.canonicalUrl,
  );

  return {
    suggestedToolSlug: tool.slug,
    suggestedToolPath,
  };
}

export function validateCustomerAiResponse(
  request: CustomerAiRequest,
  response: CustomerAiModelResponse,
): CustomerAiSafeResponse {
  const combinedText = [
    response.answer,
    response.premiumSuggestion ?? "",
    response.suggestedToolSlug ?? "",
  ].join("\n");

  if (containsForbiddenTerm(combinedText)) {
    return {
      intent: "unsupported",
      answer:
        request.locale === "tr"
          ? "A safe answer could not be generated for this topic. Please check the inputs and try again."
          : "A safe answer could not be generated. Please check the inputs and try again.",
      safetyStatus: "fallback",
    };
  }

  if (response.intent === "result_explanation" && !request.calculationResult) {
    return {
      intent: "unsupported",
      answer:
        request.locale === "tr"
          ? "Please complete the calculation first, then I can explain the result."
          : "Please complete the calculation first, then I can explain the result.",
      safetyStatus: "fallback",
    };
  }

  const toolSuggestion = resolveActiveToolSuggestion(
    request.locale,
    response.suggestedToolSlug,
  );

  return {
    intent: response.intent,
    answer: response.answer,
    ...toolSuggestion,
    extractedInputs: response.extractedInputs,
    missingInputs: response.missingInputs,
    premiumSuggestion: response.premiumSuggestion,
    safetyStatus: "approved",
  };
}
