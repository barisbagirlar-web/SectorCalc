/**
 * Shared locale message verification — build gate + audits.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  collectMissingTranslationKeys,
  type MissingTranslationKey,
} from "@/lib/infrastructure/i18n/merge-locale-messages";
import { ROOT_LOCALE, SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

export type LocaleMessageIssueReason = "missing" | "empty";

export type LocaleMessageIssue = {
  readonly path: string;
  readonly locale: string;
  readonly reason: LocaleMessageIssueReason;
};

export function flattenMessageStrings(
  value: unknown,
  prefix = "",
): Readonly<Record<string, string>> {
  if (typeof value === "string") {
    return prefix ? { [prefix]: value } : {};
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const result: Record<string, string> = {};
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key;
    Object.assign(result, flattenMessageStrings(nested, path));
  }
  return result;
}

export function loadLocaleMessagesFromDir(
  messagesDir: string,
  locale: string,
): Record<string, unknown> {
  const filePath = join(messagesDir, `${locale}.json`);
  return JSON.parse(readFileSync(filePath, "utf8")) as Record<string, unknown>;
}

export function collectEmptyTranslationIssues(
  enMessages: Record<string, unknown>,
  localeMessages: Record<string, unknown>,
  locale: string,
): readonly LocaleMessageIssue[] {
  const enFlat = flattenMessageStrings(enMessages);
  const localeFlat = flattenMessageStrings(localeMessages);

  return Object.entries(enFlat)
    .filter(([, enText]) => enText.trim().length > 0)
    .filter(([path]) => {
      const value = localeFlat[path];
      return value === undefined || value.trim().length === 0;
    })
    .map(([path]) => ({ path, locale, reason: "empty" as const }));
}

export function collectLocaleMessageIssues(messagesDir: string): readonly LocaleMessageIssue[] {
  const enMessages = loadLocaleMessagesFromDir(messagesDir, ROOT_LOCALE);
  const issues: LocaleMessageIssue[] = [];

  for (const locale of SUPPORTED_LOCALES) {
    if (locale === ROOT_LOCALE) {
      continue;
    }

    const localeMessages = loadLocaleMessagesFromDir(messagesDir, locale);
    const missingKeys = collectMissingTranslationKeys(enMessages, localeMessages, locale);

    issues.push(
      ...missingKeys.map((item: MissingTranslationKey) => ({
        path: item.path,
        locale: item.locale,
        reason: "missing" as const,
      })),
      ...collectEmptyTranslationIssues(enMessages, localeMessages, locale),
    );
  }

  return issues;
}

export function collectBlockingLocaleMessageIssues(
  messagesDir: string,
): readonly LocaleMessageIssue[] {
  return collectLocaleMessageIssues(messagesDir);
}

export function formatLocaleMessageIssues(issues: readonly LocaleMessageIssue[]): string {
  if (issues.length === 0) {
    return "";
  }

  const byLocale = new Map<string, LocaleMessageIssue[]>();
  for (const issue of issues) {
    const bucket = byLocale.get(issue.locale) ?? [];
    bucket.push(issue);
    byLocale.set(issue.locale, bucket);
  }

  const lines: string[] = [];
  for (const [locale, localeIssues] of byLocale) {
    lines.push(`${locale}: ${localeIssues.length} issue(s)`);
    for (const issue of localeIssues.slice(0, 25)) {
      lines.push(`  - [${issue.reason}] ${issue.path}`);
    }
    if (localeIssues.length > 25) {
      lines.push(`  - … +${localeIssues.length - 25} more`);
    }
  }

  return lines.join("\n");
}

export function getSupportedNonRootLocales(): readonly SupportedLocale[] {
  return SUPPORTED_LOCALES.filter((locale) => locale !== ROOT_LOCALE);
}
