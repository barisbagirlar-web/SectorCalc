import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

export type { SupportedLocale };

export const SUPPORTED_LOCALES = ["en"] as const satisfies readonly SupportedLocale[];

export const SUPPORTED_REGIONS = [
  "GLOBAL",
  "TR",
  "US",
  "GB",
  "DE",
  "FR",
  "ES",
  "AE",
  "SA",
  "QA",
  "KW",
  "CA",
  "AU",
  "CH",
  "JP",
] as const;

export type SupportedRegion = (typeof SUPPORTED_REGIONS)[number];

export type TextDirection = "ltr" | "rtl";

export type MeasurementSystem = "metric" | "imperial" | "mixed";

export type PublicCopySurface = (typeof PUBLIC_COPY_SURFACE_IDS)[number];

export const PUBLIC_COPY_SURFACE_IDS = [
  "header",
  "footer",
  "homepage",
  "free-tools",
  "premium-tools",
  "industries",
  "industry-detail",
  "tool-detail",
  "calculator-form",
  "calculator-result",
  "guided-graphics",
  "calculator-library",
  "pricing",
  "auth",
  "legal",
] as const;

export type LocaleMessageKey = string;

export type LocaleCopyParams = Record<string, string | number>;
