/* eslint-disable */
// @ts-nocheck

import {
  LOCALE_DEFINITIONS,
  LOCALE_DEFINITION_LIST,
  ROOT_LOCALE,
  SUPPORTED_LOCALES as I18N_SUPPORTED_LOCALES,
  getLocaleDefinition,
  getLocaleTextDirection,
  isSupportedLocale,
  type SupportedLocale,
} from "@/lib/i18n/locale-config";
import type { SupportedRegion, TextDirection } from "@/lib/locale-center/locale-types";

export {
  LOCALE_DEFINITIONS,
  LOCALE_DEFINITION_LIST,
  ROOT_LOCALE,
  getLocaleDefinition,
  getLocaleTextDirection,
  isSupportedLocale,
  type SupportedLocale,
};

export const SUPPORTED_LOCALES = I18N_SUPPORTED_LOCALES;

/** Default operating region per UI locale (P30). */
export const LOCALE_DEFAULT_REGION: Record<SupportedLocale, SupportedRegion> = {
  en: "GLOBAL",
} as Record<SupportedLocale, AppRegion>;

export function getLocaleDefaultRegion(locale: SupportedLocale): SupportedRegion {
  return LOCALE_DEFAULT_REGION[locale];
}

export function getLocaleNumberTag(locale: SupportedLocale): string {
  return LOCALE_DEFINITIONS[locale].numberLocale;
}

export function getLocaleDateTag(locale: SupportedLocale): string {
  return LOCALE_DEFINITIONS[locale].dateLocale;
}

export function getLocaleDirection(locale: SupportedLocale): TextDirection {
  return LOCALE_DEFINITIONS[locale].textDirection;
}
