import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isSupportedLocale,
  type SupportedLocale,
} from "@/lib/i18n/locale-config";

export type ApiPublicMessageKey =
  | "rateLimitError"
  | "rateLimitMessage"
  | "invalidBodyError"
  | "invalidBodyMessage"
  | "toolNotFoundError"
  | "toolNotFoundMessage"
  | "schemaNotFoundError"
  | "schemaNotFoundMessage"
  | "invalidInputError"
  | "unknownInputFieldMessage"
  | "engineNotFoundError"
  | "engineNotFoundMessage"
  | "invalidResultError"
  | "invalidResultMessage"
  | "engineFailedError"
  | "engineFailedMessage"
  | "internalError"
  | "botNotFoundTitle"
  | "botNotFoundBody"
  | "botCanonicalPage"
  | "botMachineApi"
  | "botInputSchema"
  | "botExpectedTypes"
  | "botOpenApi"
  | "botUsageNote"
  | "botDefaultDescription"
  | "constraintMin"
  | "constraintMax"
  | "constraintOptions"
  | "constraintDefault"
  | "constraintContext";

type MessageCatalog = Readonly<Record<ApiPublicMessageKey, Readonly<Record<SupportedLocale, string>>>>;

function assertCompleteCatalog(catalog: MessageCatalog): MessageCatalog {
  for (const key of Object.keys(catalog) as ApiPublicMessageKey[]) {
    for (const locale of SUPPORTED_LOCALES) {
      const value = catalog[key][locale];
      if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error(`api-public-messages: missing "${key}" for locale "${locale}"`);
      }
    }
  }
  return catalog;
}

export const API_PUBLIC_MESSAGES = assertCompleteCatalog({
  rateLimitError: {
    en: "Rate limit exceeded",
  },
  rateLimitMessage: {
    en: "Too many calculation requests. Please retry shortly.",
  },
  invalidBodyError: {
    en: "Invalid request body",
  },
  invalidBodyMessage: {
    en: 'Request body must include an "inputs" object.',
  },
  toolNotFoundError: {
    en: "Tool not found",
  },
  toolNotFoundMessage: {
    en: 'No calculator found for slug "{slug}".',
  },
  schemaNotFoundError: {
    en: "Validation schema not found",
  },
  schemaNotFoundMessage: {
    en: 'Validation schema for "{slug}" could not be loaded.',
  },
  invalidInputError: {
    en: "Invalid input parameters (AI Hallucination detected)",
  },
  unknownInputFieldMessage: {
    en: 'Unknown input field "{field}" for tool "{slug}".',
  },
  engineNotFoundError: {
    en: "Calculator engine not found",
  },
  engineNotFoundMessage: {
    en: 'Calculator engine for "{slug}" was not found.',
  },
  invalidResultError: {
    en: "Calculation produced invalid result (NaN/Infinity)",
  },
  invalidResultMessage: {
    en: "Please verify your input values and try again.",
  },
  engineFailedError: {
    en: "Engine execution failed",
  },
  engineFailedMessage: {
    en: 'Calculator "{slug}" could not run. Verify slug and input format.',
  },
  internalError: {
    en: "Internal Server Error",
  },
  botNotFoundTitle: {
    en: "Tool not found",
  },
  botNotFoundBody: {
    en: "No calculator found for slug `{slug}`.",
  },
  botCanonicalPage: {
    en: "Canonical page",
  },
  botMachineApi: {
    en: "Machine API (POST)",
  },
  botInputSchema: {
    en: "Input schema",
  },
  botExpectedTypes: {
    en: "Expected input types",
  },
  botOpenApi: {
    en: "OpenAPI contract",
  },
  botUsageNote: {
    en: "SectorCalc provides sector-specific calculators and decision-support outputs. Results are technical simulations — not financial, legal, medical, or engineering advice. Verify before business decisions.",
  },
  botDefaultDescription: {
    en: "Sector-specific calculator",
  },
  constraintMin: {
    en: "min",
  },
  constraintMax: {
    en: "max",
  },
  constraintOptions: {
    en: "options",
  },
  constraintDefault: {
    en: "default",
  },
  constraintContext: {
    en: "Context",
  },
});

export function formatApiPublicMessage(
  locale: SupportedLocale,
  key: ApiPublicMessageKey,
  params?: Readonly<Record<string, string>>,
): string {
  const template = API_PUBLIC_MESSAGES[key][locale];
  if (!params) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (_, token: string) => params[token] ?? `{${token}}`);
}

export function tApiPublic(locale: SupportedLocale, key: ApiPublicMessageKey): string {
  return API_PUBLIC_MESSAGES[key][locale];
}

export function normalizeApiPublicLocale(value: string | null | undefined): SupportedLocale {
  const base = value?.split("-")[0]?.trim().toLowerCase();
  if (base && isSupportedLocale(base)) {
    return base;
  }
  return DEFAULT_LOCALE;
}

export function resolveApiPublicLocale(options: {
  readonly queryLocale?: string | null;
  readonly bodyLocale?: unknown;
  readonly acceptLanguage?: string | null;
}): SupportedLocale {
  if (typeof options.bodyLocale === "string" && isSupportedLocale(options.bodyLocale)) {
    return options.bodyLocale;
  }

  if (options.queryLocale) {
    const base = options.queryLocale.split("-")[0]?.trim().toLowerCase();
    if (base && isSupportedLocale(base)) {
      return base;
    }
  }

  if (options.acceptLanguage) {
    const tags = options.acceptLanguage
      .split(",")
      .map((part) => part.split(";")[0]?.trim().toLowerCase())
      .filter(Boolean);

    for (const tag of tags) {
      const base = tag.split("-")[0] ?? tag;
      if (isSupportedLocale(base)) {
        return base;
      }
    }
  }

  return DEFAULT_LOCALE;
}
