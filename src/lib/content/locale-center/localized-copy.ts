import {
  getMessageValue,
  loadLocaleMessages,
  loadLocaleMessagesForRuntime,
} from "@/lib/content/locale-center/locale-dictionary";
import type { LocaleCopyParams, LocaleMessageKey } from "@/lib/content/locale-center/locale-types";
import { ROOT_LOCALE, type SupportedLocale } from "@/lib/content/locale-center/locale-config";

export type LocalizedCopyFn = (key: LocaleMessageKey, params?: LocaleCopyParams) => string;

export type LocalizedCopyOptions = {
  readonly strict?: boolean;
  readonly allowRuntimeFallback?: boolean;
};

function interpolate(template: string, params?: LocaleCopyParams): string {
  if (!params) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, token: string) => {
    const value = params[token];
    return value === undefined ? `{${token}}` : String(value);
  });
}

function resolveRawCopy(
  locale: SupportedLocale,
  key: LocaleMessageKey,
  options: LocalizedCopyOptions,
): string | undefined {
  const tree =
    options.allowRuntimeFallback === false
      ? loadLocaleMessages(locale)
      : loadLocaleMessagesForRuntime(locale);

  const localized = getMessageValue(tree, key);
  if (localized) {
    return localized;
  }

  if (locale !== ROOT_LOCALE && options.strict !== true) {
    const enTree = loadLocaleMessages(ROOT_LOCALE);
    return getMessageValue(enTree, key);
  }

  return undefined;
}

export function createLocalizedCopy(
  locale: SupportedLocale,
  options: LocalizedCopyOptions = {},
): LocalizedCopyFn {
  const strict = options.strict ?? process.env.LOCALE_CENTER_STRICT === "1";

  return function copy(key: LocaleMessageKey, params?: LocaleCopyParams): string {
    const resolved = resolveRawCopy(locale, key, { ...options, strict });

    if (resolved) {
      return interpolate(resolved, params);
    }

    if (strict) {
      throw new Error(`[locale-center] Missing copy key "${key}" for locale "${locale}"`);
    }

    if (process.env.NODE_ENV !== "production") {
      console.warn(`[locale-center] Missing copy key "${key}" for locale "${locale}"`);
    }

    return "";
  };
}

export function assertCopyKeyExists(locale: SupportedLocale, key: LocaleMessageKey): void {
  const value = getMessageValue(loadLocaleMessages(locale), key);
  if (!value) {
    throw new Error(`[locale-center] Required key missing: ${locale}.${key}`);
  }
}
