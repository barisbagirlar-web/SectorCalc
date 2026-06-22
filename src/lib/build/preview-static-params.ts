import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";

export type StaticParamRecord = Record<string, string>;

export type PreviewStaticParamFamily =
  | "free-tools"
  | "premium-tools"
  | "premium-tools-category"
  | "free-tools-category"
  | "premium-schema"
  | "premium-schema-print"
  | "generated-tools"
  | "seo"
  | "industries"
  | "audit"
  | "case-studies"
  | "guides"
  | "generic";

/** Revenue-gate control slug — must remain buildable in preview. */
export const PROBLEM_SLUG = "abonelik-yazilim-cloud-yillik-maliyet-hesabi";

const DEFAULT_KEEP_LOCALES = SUPPORTED_LOCALES;

const FAMILY_KEEP_SLUGS: Record<PreviewStaticParamFamily, readonly string[]> = {
  "free-tools": [
    "machine-time-calculator",
    "project-cost-calculator",
    "cleaning-cost-calculator",
  ],
  "premium-tools": [
    PROBLEM_SLUG,
    "3d-print-job-margin-tool",
    "3d-print-cost-check",
  ],
  "premium-tools-category": [
    "lean-production",
    "cnc-manufacturing",
    "construction",
    "logistics-transport",
  ],
  "free-tools-category": [
    "imalat-uretim",
    "insaat-yapi",
    "lojistik-tedarik-zinciri",
    "maliyet-butceleme",
  ],
  "premium-schema": [
    "cnc-oee-loss",
    "logistics-route-loss",
    "energy-peak-cost",
    "7-israf-muda-avcisi-parasal-karsilik-calculator",
  ],
  "premium-schema-print": [
    "cnc-oee-loss",
    "logistics-route-loss",
    "energy-peak-cost",
    "7-israf-muda-avcisi-parasal-karsilik-calculator",
  ],
  "generated-tools": [
    "cnc-oee-loss",
    "cloud-api-cost-overrun",
    "7-israf-muda-avcisi-parasal-karsilik-calculator",
    "abonelik-yazilim-cloud-yillik-maliyet-hesabi",
  ],
  seo: [
    "3d-print-job-margin-tool",
    "agriculture-calculators",
    "annual-leave-severance-notice-calculator",
  ],
  industries: [
    "cnc-manufacturing",
    "construction",
    "cleaning",
    "logistics-transport",
  ],
  audit: ["cnc", "construction", "facility_mgmt", "logistics"],
  "case-studies": [
    "representative-cnc-job-shop",
    "representative-cleaning-contract",
  ],
  guides: [
    "how-to-calculate-manufacturing-cost",
    "what-is-oee-and-how-to-calculate-it",
    "how-to-calculate-scrap-rate",
  ],
  generic: [],
};

export function shouldUsePreviewStaticParams(): boolean {
  // Force-full overrides everything — use only when full SSG is reliably safe.
  if (process.env.SECTORCALC_FORCE_FULL_STATIC === "1") {
    return false;
  }

  // Explicit opt-in (local test, preview deploy, etc.)
  if (process.env.SECTORCALC_FAST_PREVIEW_STATIC === "1") {
    return true;
  }

  // Firebase Hosting: Firebase runs `next build` in-process
  // and never sets SECTORCALC_FAST_PREVIEW_STATIC. Full 22k+ page SSG OOMs or
  // times out in Firebase's environment. Default to preview mode for Firebase.
  // The firebase CLI always has a FIREBASE_CONFIG or GCLOUD_PROJECT set.
  if (process.env.GCLOUD_PROJECT?.startsWith("sectorcalc") || process.env.FIREBASE_CONFIG) {
    return true;
  }

  // Explicit — preview-safe by default. Only SECTORCALC_FORCE_FULL_STATIC bypasses.
  return true;
}

function paramKey<T extends StaticParamRecord>(param: T): string {
  return JSON.stringify(
    Object.keys(param)
      .sort()
      .map((key) => [key, param[key]]),
  );
}

function resolveSlugValue<T extends StaticParamRecord>(
  param: T,
  slugKey: keyof T | undefined,
): string | undefined {
  if (!slugKey) {
    return undefined;
  }
  const value = param[slugKey];
  return typeof value === "string" ? value : undefined;
}

function resolveLocaleValue<T extends StaticParamRecord>(
  param: T,
  localeKey: keyof T | undefined,
): string | undefined {
  if (!localeKey) {
    return undefined;
  }
  const value = param[localeKey];
  return typeof value === "string" ? value : undefined;
}

function matchesKeepSlugs<T extends StaticParamRecord>(
  param: T,
  slugKey: keyof T | undefined,
  keepSlugs: readonly string[],
): boolean {
  if (keepSlugs.length === 0 || !slugKey) {
    return false;
  }
  const slug = resolveSlugValue(param, slugKey);
  return slug !== undefined && keepSlugs.includes(slug);
}

function matchesKeepLocales<T extends StaticParamRecord>(
  param: T,
  localeKey: keyof T | undefined,
  keepLocales: readonly string[],
): boolean {
  if (!localeKey) {
    return true;
  }
  const locale = resolveLocaleValue(param, localeKey);
  return locale !== undefined && keepLocales.includes(locale);
}

export function limitStaticParamsForPreview<T extends StaticParamRecord>(
  params: T[],
  options: {
    family: PreviewStaticParamFamily;
    slugKey?: keyof T;
    localeKey?: keyof T;
    keepLocales?: string[];
    keepSlugs?: string[];
    max?: number;
  },
): T[] {
  if (!shouldUsePreviewStaticParams() || params.length === 0) {
    return params;
  }

  const keepLocales = options.keepLocales ?? [...DEFAULT_KEEP_LOCALES];
  const keepSlugs = [
    ...new Set([
      ...(options.keepSlugs ?? FAMILY_KEEP_SLUGS[options.family]),
      ...(options.family === "premium-tools" ? [PROBLEM_SLUG] : []),
    ]),
  ];
  const max = options.max ?? Math.max(keepSlugs.length, 6);

  const seen = new Set<string>();
  const result: T[] = [];

  const push = (param: T) => {
    const key = paramKey(param);
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    result.push(param);
  };

  for (const param of params) {
    if (!matchesKeepLocales(param, options.localeKey, keepLocales)) {
      continue;
    }
    if (matchesKeepSlugs(param, options.slugKey, keepSlugs)) {
      push(param);
    }
  }

  for (const param of params) {
    if (result.length >= max) {
      break;
    }
    if (!matchesKeepLocales(param, options.localeKey, keepLocales)) {
      continue;
    }
    push(param);
  }

  if (result.length === 0) {
    return params.slice(0, Math.min(max, params.length));
  }

  return result.slice(0, max);
}
