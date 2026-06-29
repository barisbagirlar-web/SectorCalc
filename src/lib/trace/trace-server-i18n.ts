import "server-only";

import enMessages from "../../../messages/en.json";
import { resolveTraceLocale } from "@/lib/trace/locale-hints";
import type { SupportedLocale } from "@/lib/i18n/locale-config";

type TraceErrorKey = "authRequired" | "connection" | "noCredits" | "premiumOnly";

type TraceErrors = Record<TraceErrorKey, string>;

const TRACE_ERRORS: Record<SupportedLocale, TraceErrors> = {
  en: (enMessages as { trace: { errors: TraceErrors } }).trace.errors,
};

export function resolveTraceErrorMessage(locale: string, key: TraceErrorKey): string {
  const safeLocale = resolveTraceLocale(locale);
  return TRACE_ERRORS[safeLocale][key] ?? TRACE_ERRORS.en[key];
}
