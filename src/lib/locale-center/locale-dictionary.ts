import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  collectMissingTranslationKeys,
  mergeLocaleMessages,
  type MissingTranslationKey,
} from "@/lib/i18n/merge-locale-messages";
import { ROOT_LOCALE, SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/locale-center/locale-config";

type MessageTree = Record<string, unknown>;

const MESSAGE_CACHE = new Map<SupportedLocale, MessageTree>();

function messagesPath(locale: SupportedLocale): string {
  return join(process.cwd(), "messages", `${locale}.json`);
}

export function loadLocaleMessages(locale: SupportedLocale): MessageTree {
  const cached = MESSAGE_CACHE.get(locale);
  if (cached) {
    return cached;
  }

  const raw = JSON.parse(readFileSync(messagesPath(locale), "utf8")) as MessageTree;
  MESSAGE_CACHE.set(locale, raw);
  return raw;
}

export function loadLocaleMessagesForRuntime(locale: SupportedLocale): MessageTree {
  if (locale === ROOT_LOCALE) {
    return loadLocaleMessages(locale);
  }
  const en = loadLocaleMessages(ROOT_LOCALE);
  const primary = loadLocaleMessages(locale);
  return mergeLocaleMessages(en, primary);
}

export function getMessageValue(tree: MessageTree, keyPath: string): string | undefined {
  const segments = keyPath.split(".");
  let cursor: unknown = tree;

  for (const segment of segments) {
    if (!cursor || typeof cursor !== "object" || Array.isArray(cursor)) {
      return undefined;
    }
    cursor = (cursor as Record<string, unknown>)[segment];
  }

  return typeof cursor === "string" ? cursor : undefined;
}

export function collectLocaleKeyParityGaps(): MissingTranslationKey[] {
  const en = loadLocaleMessages(ROOT_LOCALE);
  const gaps: MissingTranslationKey[] = [];

  for (const locale of SUPPORTED_LOCALES) {
    if (locale === ROOT_LOCALE) {
      continue;
    }
    gaps.push(...collectMissingTranslationKeys(en, loadLocaleMessages(locale), locale));
  }

  return gaps;
}

export function clearLocaleDictionaryCache(): void {
  MESSAGE_CACHE.clear();
}
