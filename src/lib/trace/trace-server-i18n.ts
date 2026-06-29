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

const ENGLISH_ERRORS: TraceErrors = {
  authRequired: "Authentication required.",
  connection: "Connection error.",
  noCredits: "Insufficient credits.",
  premiumOnly: "This is a premium feature.",
};

const TRACE_ERRORS: Record<SupportedLocale, TraceErrors> = {
  en: (enMessages as any)?.trace?.errors ?? ENGLISH_ERRORS,
  tr: (trMessages as any)?.trace?.errors ?? ENGLISH_ERRORS,
  de: (deMessages as any)?.trace?.errors ?? ENGLISH_ERRORS,
  fr: (frMessages as any)?.trace?.errors ?? ENGLISH_ERRORS,
  es: (esMessages as any)?.trace?.errors ?? ENGLISH_ERRORS,
  ar: (arMessages as any)?.trace?.errors ?? ENGLISH_ERRORS,
};

export function resolveTraceErrorMessage(locale: string, key: TraceErrorKey): string {
  const safeLocale = resolveTraceLocale(locale);
  return TRACE_ERRORS[safeLocale][key] ?? TRACE_ERRORS.en[key];
}
