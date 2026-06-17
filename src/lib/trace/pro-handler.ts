import "server-only";

import { handleCustomerAiRequest } from "@/lib/ai-gateway/customer-ai-router";
import type { CustomerAiSafeResponse } from "@/lib/ai-gateway/customer-ai-types";
import {
  checkPremiumAssistantCredit,
  consumePremiumAssistantCredit,
} from "@/lib/trace/check-credits";
import { resolveTraceErrorMessage } from "@/lib/trace/trace-server-i18n";
import { findBestTools } from "@/lib/trace/tool-recommendation";
import type { AssistantSuggestion } from "@/lib/assistant/types";
import type { TraceProRequest, TraceProResponse } from "@/lib/trace/types";

function buildSuggestions(
  gateway: CustomerAiSafeResponse,
  fallback: readonly AssistantSuggestion[],
): AssistantSuggestion[] {
  if (gateway.suggestedToolSlug && gateway.suggestedToolPath) {
    const primary: AssistantSuggestion = {
      slug: gateway.suggestedToolSlug,
      label: gateway.suggestedToolSlug,
      href: gateway.suggestedToolPath,
    };
    const rest = fallback.filter((entry) => entry.slug !== primary.slug);
    return [primary, ...rest].slice(0, 3);
  }

  return [...fallback].slice(0, 3);
}

export async function handleProTraceRequest(
  request: TraceProRequest,
): Promise<TraceProResponse | { ok: false; error: string; status: number }> {
  const credit = await checkPremiumAssistantCredit(request.userId, request.isPremium);
  if (!credit.ok) {
    const message =
      credit.reason === "no_credits"
        ? resolveTraceErrorMessage(request.locale, "noCredits")
        : resolveTraceErrorMessage(request.locale, "premiumOnly");

    return { ok: false, error: message, status: credit.reason === "no_credits" ? 402 : 403 };
  }

  const gateway = await handleCustomerAiRequest({
    locale: request.locale,
    message: request.message.trim().slice(0, 2000),
    currentPath: request.currentPath,
    currentToolSlug: request.currentToolSlug,
    formInputs: request.formInputs,
    calculationResult: request.calculationResult,
    messages: request.messages,
    isPremium: true,
  });

  const fallbackTools = await findBestTools(request.message, request.locale);
  const creditConsumed = await consumePremiumAssistantCredit(request.userId);

  return {
    ok: true,
    reply: gateway.answer,
    suggestions: buildSuggestions(gateway, fallbackTools),
    modelTier: "pro",
    modelUsed: gateway.modelUsed,
    premiumSuggestion: gateway.premiumSuggestion,
    creditConsumed,
  };
}
