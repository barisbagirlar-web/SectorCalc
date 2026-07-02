import "server-only";
import { resolveTraceLocale } from "@/lib/infrastructure/trace/locale-hints";
import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

type TraceErrorKey = "authRequired" | "connection" | "noCredits" | "premiumOnly";

type TraceErrors = Record<TraceErrorKey, string>;

const ENGLISH_ERRORS: TraceErrors = {
  authRequired: "Authentication required.",
  connection: "Connection error.",
  noCredits: "Insufficient credits.",
  premiumOnly: "This is a premium feature.",
};

const TRACE_ERRORS: Record<SupportedLocale, TraceErrors> = {
  en: ({} as any)?.trace?.errors ?? ENGLISH_ERRORS,
};

export function resolveTraceErrorMessage(locale: string, key: TraceErrorKey): string {
  const safeLocale = resolveTraceLocale(locale);
  return TRACE_ERRORS[safeLocale][key] ?? TRACE_ERRORS.en[key];
}
