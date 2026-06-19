#!/usr/bin/env npx tsx
/**
 * CI gate — generated schema form fields must not leak English on non-EN locales.
 * Uses the same resolver as production forms (schema-first → bundle → glossary).
 */
import fs from "node:fs";
import path from "node:path";
import { PROJECT_ROOT } from "./deepseek/load-env";
import { resolveGeneratedFieldDisplay } from "../src/lib/i18n/generated-field-display";
import { SUPPORTED_LOCALES, type SupportedLocale } from "../src/lib/i18n/locale-config";

const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const BASELINE_PATH = path.join(PROJECT_ROOT, "scripts/data/schema-field-i18n-baseline.json");
const TARGET_LOCALES = SUPPORTED_LOCALES.filter((locale) => locale !== "en");
const MAX_SAMPLES = 20;
const STRICT = process.argv.includes("--strict") || process.env.AUDIT_SCHEMA_FIELD_I18N_STRICT === "1";
const WRITE_BASELINE = process.argv.includes("--write-baseline");
const REGRESSION = process.argv.includes("--regression") || process.env.AUDIT_SCHEMA_FIELD_I18N_REGRESSION === "1";

const ENGLISH_MARKERS = [
  /\bthe\b/i,
  /\bthis\b/i,
  /\bthat\b/i,
  /\bwith\b/i,
  /\bfrom\b/i,
  /\bwhen\b/i,
  /\byour\b/i,
  /\benter\b/i,
  /\bnumber of\b/i,
  /\bused for\b/i,
  /\binput for\b/i,
];

const LOCALE_MARKERS: Record<SupportedLocale, RegExp[]> = {
  en: [],
  tr: [/[çğıöşüÇĞİÖŞÜ]/, /\b(için|veya|girin|değer|hesap)\b/i],
  de: [/[äöüßÄÖÜ]/, /\b(und|oder|für|eingeben|der|die)\b/i],
  fr: [/[àâçéèêëîïôùûü]/i, /\b(pour|ou|saisir|valeur)\b/i],
  es: [/[áéíóúñü¿¡]/i, /\b(para|introduzca|valor)\b/i],
  ar: [/[\u0600-\u06FF]/],
};

type SchemaInput = {
  id: string;
  label?: string;
  label_i18n?: Partial<Record<SupportedLocale, string>>;
  businessContext?: string;
  businessContext_i18n?: Partial<Record<SupportedLocale, string>>;
};

type Leak = {
  slug: string;
  fieldId: string;
  locale: SupportedLocale;
  part: "label" | "placeholder" | "helper";
  sample: string;
  reason: "en-identical" | "english-leak" | "hybrid";
};

function looksEnglish(text: string): boolean {
  return ENGLISH_MARKERS.some((pattern) => pattern.test(text));
}

function hasLocaleMarkers(text: string, locale: SupportedLocale): boolean {
  return LOCALE_MARKERS[locale].some((pattern) => pattern.test(text));
}

function auditField(
  slug: string,
  input: SchemaInput,
  locale: SupportedLocale,
  enDisplay: ReturnType<typeof resolveGeneratedFieldDisplay>,
): Leak[] {
  const display = resolveGeneratedFieldDisplay(slug, input, locale);
  const leaks: Leak[] = [];

  for (const part of ["label", "placeholder", "helper"] as const) {
    const value = display[part]?.trim();
    if (!value) {
      continue;
    }

    const enValue = enDisplay[part]?.trim() ?? "";
    if (value === enValue && enValue.length > 3) {
      leaks.push({ slug, fieldId: input.id, locale, part, sample: value.slice(0, 100), reason: "en-identical" });
      continue;
    }

    if (looksEnglish(value) && !hasLocaleMarkers(value, locale)) {
      leaks.push({ slug, fieldId: input.id, locale, part, sample: value.slice(0, 100), reason: "english-leak" });
      continue;
    }

    if (hasLocaleMarkers(value, locale) && looksEnglish(value)) {
      leaks.push({ slug, fieldId: input.id, locale, part, sample: value.slice(0, 100), reason: "hybrid" });
    }
  }

  return leaks;
}

function main(): void {
  if (!fs.existsSync(SCHEMAS_DIR)) {
    console.error("audit-schema-field-i18n: generated/schemas missing");
    process.exit(1);
  }

  const files = fs.readdirSync(SCHEMAS_DIR).filter((name) => name.endsWith("-schema.json"));
  const allLeaks: Leak[] = [];

  for (const fileName of files) {
    const slug = fileName.replace(/-schema\.json$/, "");
    const raw = JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, fileName), "utf8")) as {
      inputs?: SchemaInput[];
    };

    for (const input of raw.inputs ?? []) {
      const enDisplay = resolveGeneratedFieldDisplay(slug, input, "en");
      for (const locale of TARGET_LOCALES) {
        allLeaks.push(...auditField(slug, input, locale, enDisplay));
      }
    }
  }

  const byLocale = new Map<SupportedLocale, Leak[]>();
  for (const leak of allLeaks) {
    const bucket = byLocale.get(leak.locale) ?? [];
    bucket.push(leak);
    byLocale.set(leak.locale, bucket);
  }

  console.log("audit-schema-field-i18n");
  console.log(`schemas=${files.length} issues=${allLeaks.length}`);

  for (const locale of TARGET_LOCALES) {
    const leaks = byLocale.get(locale) ?? [];
    const identical = leaks.filter((item) => item.reason === "en-identical").length;
    const english = leaks.filter((item) => item.reason === "english-leak").length;
    const hybrid = leaks.filter((item) => item.reason === "hybrid").length;
    console.log(`${locale}: en-identical=${identical} english-leak=${english} hybrid=${hybrid}`);
    for (const item of leaks.slice(0, 5)) {
      console.log(`  ${item.reason} ${item.slug}.${item.fieldId}.${item.part}: ${item.sample}`);
    }
  }

  const summary = {
    total: allLeaks.length,
    byLocale: Object.fromEntries(
      TARGET_LOCALES.map((locale) => {
        const leaks = byLocale.get(locale) ?? [];
        return [
          locale,
          {
            total: leaks.length,
            enIdentical: leaks.filter((item) => item.reason === "en-identical").length,
            englishLeak: leaks.filter((item) => item.reason === "english-leak").length,
            hybrid: leaks.filter((item) => item.reason === "hybrid").length,
          },
        ];
      }),
    ),
    updatedAt: new Date().toISOString(),
  };

  if (WRITE_BASELINE) {
    fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
    console.log(`\nWrote baseline → ${BASELINE_PATH}`);
    process.exit(0);
  }

  if (REGRESSION && fs.existsSync(BASELINE_PATH)) {
    const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8")) as { total: number };
    if (allLeaks.length > baseline.total) {
      console.error(
        `\naudit-schema-field-i18n: REGRESSION FAIL (${allLeaks.length} > baseline ${baseline.total})`,
      );
      process.exit(1);
    }
    console.log(`\naudit-schema-field-i18n: REGRESSION PASS (${allLeaks.length} <= baseline ${baseline.total})`);
    process.exit(0);
  }

  if (allLeaks.length > 0 && STRICT) {
    console.error(`\naudit-schema-field-i18n: FAIL (${allLeaks.length} issue(s))`);
    if (allLeaks.length > MAX_SAMPLES) {
      console.error(`… +${allLeaks.length - MAX_SAMPLES} more (use --regression or --write-baseline)`);
    }
    process.exit(1);
  }

  if (allLeaks.length > 0) {
    console.warn(`\naudit-schema-field-i18n: WARN (${allLeaks.length} issue(s), strict/regression off)`);
    return;
  }

  console.log("\naudit-schema-field-i18n: PASS");
}

main();
