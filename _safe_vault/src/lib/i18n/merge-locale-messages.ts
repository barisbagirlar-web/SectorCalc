/**
 * Deep-merge locale messages with English fallback and missing-key discovery.
 */

export type MissingTranslationKey = {
  readonly path: string;
  readonly locale: string;
};

export function mergeLocaleMessages(
  fallback: Record<string, unknown>,
  primary: Record<string, unknown>,
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...fallback };

  for (const [key, value] of Object.entries(primary)) {
    const fallbackValue = merged[key];

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      fallbackValue &&
      typeof fallbackValue === "object" &&
      !Array.isArray(fallbackValue)
    ) {
      merged[key] = mergeLocaleMessages(
        fallbackValue as Record<string, unknown>,
        value as Record<string, unknown>,
      );
      continue;
    }

    merged[key] = value;
  }

  return merged;
}

export function collectMissingTranslationKeys(
  fallback: Record<string, unknown>,
  primary: Record<string, unknown>,
  locale: string,
  prefix = "",
): MissingTranslationKey[] {
  const missing: MissingTranslationKey[] = [];

  for (const [key, fallbackValue] of Object.entries(fallback)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const primaryValue = primary[key];

    if (primaryValue === undefined) {
      if (typeof fallbackValue === "string") {
        missing.push({ path, locale });
        continue;
      }

      if (fallbackValue && typeof fallbackValue === "object" && !Array.isArray(fallbackValue)) {
        missing.push(
          ...collectMissingTranslationKeys(
            fallbackValue as Record<string, unknown>,
            {},
            locale,
            path,
          ),
        );
      }
      continue;
    }

    if (
      fallbackValue &&
      typeof fallbackValue === "object" &&
      !Array.isArray(fallbackValue) &&
      primaryValue &&
      typeof primaryValue === "object" &&
      !Array.isArray(primaryValue)
    ) {
      missing.push(
        ...collectMissingTranslationKeys(
          fallbackValue as Record<string, unknown>,
          primaryValue as Record<string, unknown>,
          locale,
          path,
        ),
      );
    }
  }

  return missing;
}

export function formatMissingTranslationReport(
  missingKeys: readonly MissingTranslationKey[],
): string {
  if (missingKeys.length === 0) {
    return "";
  }

  const byLocale = new Map<string, string[]>();
  for (const item of missingKeys) {
    const bucket = byLocale.get(item.locale) ?? [];
    bucket.push(item.path);
    byLocale.set(item.locale, bucket);
  }

  const lines: string[] = [];
  for (const [locale, paths] of byLocale) {
    lines.push(`${locale}: ${paths.length} key(s) using English fallback`);
    for (const path of paths.slice(0, 25)) {
      lines.push(`  - ${path}`);
    }
    if (paths.length > 25) {
      lines.push(`  - … +${paths.length - 25} more`);
    }
  }

  return lines.join("\n");
}
