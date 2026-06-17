import "server-only";

import enMessages from "../../../messages/en.json";
import trMessages from "../../../messages/tr.json";
import deMessages from "../../../messages/de.json";
import frMessages from "../../../messages/fr.json";
import esMessages from "../../../messages/es.json";
import arMessages from "../../../messages/ar.json";
import { resolveTraceLocale } from "@/lib/trace/locale-hints";
import type { SupportedLocale } from "@/lib/i18n/locale-config";

type TraceErrorKey = "authRequired" | "connection" | "noCredits" | "premiumOnly";

type TraceErrors = Record<TraceErrorKey, string>;

const TRACE_ERRORS: Record<SupportedLocale, TraceErrors> = {
  en: (enMessages as { trace: { errors: TraceErrors } }).trace.errors,
  tr: (trMessages as { trace: { errors: TraceErrors } }).trace.errors,
  de: (deMessages as { trace: { errors: TraceErrors } }).trace.errors,
  fr: (frMessages as { trace: { errors: TraceErrors } }).trace.errors,
  es: (esMessages as { trace: { errors: TraceErrors } }).trace.errors,
  ar: (arMessages as { trace: { errors: TraceErrors } }).trace.errors,
};

export function resolveTraceErrorMessage(locale: string, key: TraceErrorKey): string {
  const safeLocale = resolveTraceLocale(locale);
  return TRACE_ERRORS[safeLocale][key] ?? TRACE_ERRORS.en[key];
}
