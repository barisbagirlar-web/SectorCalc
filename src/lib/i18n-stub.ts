import React from "react";
import { resolve, has } from "@/lib/i18n/translation-fallback";

/**
 * Extract namespace string from next-intl style argument.
 * Accepts string "pricing_v2" or object { locale, namespace: "pricing_v2" }.
 */
function extractNamespace(ns: any): string {
  if (!ns) return "";
  if (typeof ns === "string") return ns;
  if (typeof ns === "object" && ns.namespace) return ns.namespace;
  return "";
}

/**
 * Build a t function scoped to the given namespace.
 * Looks up "namespace.key" in the global fallback map.
 */
function buildT(ns: string) {
  function t(key: string, values?: Record<string, any>) {
    const fullKey = ns ? `${ns}.${key}` : key;
    const mapped = resolve(fullKey);
    if (mapped !== fullKey) return mapped; // found in map
    // Not in map — return the partial key to keep visible text readable
    return key;
  }
  t.has = (key: string) => has(ns ? `${ns}.${key}` : key);
  t.raw = (key: string): any => {
    const fullKey = ns ? `${ns}.${key}` : key;
    return resolve(fullKey);
  };
  t.markup = (key: string, ...args: any[]) => t(key);
  t.rich = (key: string, ...args: any[]) => t(key);
  return t;
}

export function useTranslations<T = any>(namespaceOrConfig?: any): any {
  const ns = extractNamespace(namespaceOrConfig);
  return buildT(ns);
}

export function getTranslations<T = any>(namespaceOrConfig?: any): any {
  const ns = extractNamespace(namespaceOrConfig);
  return buildT(ns);
}

export function useLocale() {
  return "en";
}

export function getLocale() {
  return "en";
}

export function getRequestConfig() {
  return {};
}

export function useFormatter() {
  return {
    number: (val: number) => val.toString(),
    dateTime: (val: Date) => val.toString(),
    relativeTime: (val: Date) => val.toString(),
    list: (val: string[]) => val.join(", "),
  };
}

export function setRequestLocale(locale: string) {
  // no-op
}

export function NextIntlClientProvider(props: any) {
  return props.children;
}

export async function getMessages(args?: any) {
  return {};
}
