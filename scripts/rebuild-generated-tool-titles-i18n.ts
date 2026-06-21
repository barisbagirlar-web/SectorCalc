#!/usr/bin/env npx tsx
/**
 * Rebuild src/data/generated-tool-titles-i18n.generated.json for every schema slug.
 * Ensures en + tr/de/fr/es/ar using glossary translation, then optional DeepSeek polish.
 *
 * Usage:
 *   npx tsx scripts/rebuild-generated-tool-titles-i18n.ts
 *   npx tsx scripts/rebuild-generated-tool-titles-i18n.ts --deepseek
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvLocal } from "./ai/load-env-local.mjs";
import { translateCalculatorPhrase } from "../src/lib/i18n/calculator-phrase-translate";
import {
  resolveSchemaEnglishTitle,
  sortToolTitleLocales,
  titleNeedsLocaleTranslation,
  type ToolTitleLocale,
} from "../src/lib/i18n/tool-title-locale-policy";

const ROOT = process.cwd();
const SCHEMAS_DIR = path.join(ROOT, "generated", "schemas");
const OUT_TITLES = path.join(ROOT, "src/data/generated-tool-titles-i18n.generated.json");
const COPY_MAP_PATH = path.join(ROOT, "scripts/data/generated-schema-copy-i18n.json");

const TARGET_LOCALES = ["tr", "de", "fr", "es", "ar"] as const;
const LOCALE_NAMES: Record<(typeof TARGET_LOCALES)[number], string> = {
  tr: "Turkish",
  de: "German",
  fr: "French",
  es: "Spanish",
  ar: "Arabic",
};

const TITLE_GLOSSARY_OVERLAY: Record<string, Record<string, string>> = {
  tr: {
    Calculator: "Hesaplayıcı",
    Converter: "Dönüştürücü",
    Optimizer: "Optimizasyon Aracı",
    Analyzer: "Analiz Aracı",
    Analyser: "Analiz Aracı",
    Estimator: "Tahmin Aracı",
    Checker: "Kontrol Aracı",
    Verdict: "Karar Aracı",
    Simulator: "Simülasyon Aracı",
    Predictor: "Tahmin Aracı",
    Assessment: "Değerlendirme Aracı",
    Detector: "Tespit Aracı",
    Comparator: "Karşılaştırma Aracı",
    Report: "Rapor Aracı",
    Tracker: "İzleme Aracı",
    Balancer: "Dengeleme Aracı",
    Prioritizer: "Önceliklendirme Aracı",
    Function: "Fonksiyon Hesaplayıcı",
  },
  de: {
    Calculator: "Rechner",
    Converter: "Umrechner",
    Optimizer: "Optimierer",
    Analyzer: "Analysewerkzeug",
    Analyser: "Analysewerkzeug",
    Estimator: "Schätzrechner",
    Checker: "Prüfrechner",
    Verdict: "Bewertungsrechner",
    Simulator: "Simulator",
    Predictor: "Prognoserechner",
    Assessment: "Bewertungsrechner",
    Detector: "Detektor",
    Comparator: "Vergleichsrechner",
    Report: "Berichtsrechner",
    Tracker: "Tracker",
    Balancer: "Balancer",
    Prioritizer: "Priorisierer",
    Function: "Funktionsrechner",
  },
  fr: {
    Calculator: "Calculateur",
    Converter: "Convertisseur",
    Optimizer: "Optimiseur",
    Analyzer: "Analyseur",
    Analyser: "Analyseur",
    Estimator: "Estimateur",
    Checker: "Vérificateur",
    Verdict: "Outil de verdict",
    Simulator: "Simulateur",
    Predictor: "Prédicteur",
    Assessment: "Évaluateur",
    Detector: "Détecteur",
    Comparator: "Comparateur",
    Report: "Rapport",
    Tracker: "Suivi",
    Balancer: "Équilibreur",
    Prioritizer: "Prioriseur",
    Function: "Calculateur de fonction",
  },
  es: {
    Calculator: "Calculadora",
    Converter: "Convertidor",
    Optimizer: "Optimizador",
    Analyzer: "Analizador",
    Analyser: "Analizador",
    Estimator: "Estimador",
    Checker: "Comprobador",
    Verdict: "Veredicto",
    Simulator: "Simulador",
    Predictor: "Predictor",
    Assessment: "Evaluación",
    Detector: "Detector",
    Comparator: "Comparador",
    Report: "Informe",
    Tracker: "Seguimiento",
    Balancer: "Balanceador",
    Prioritizer: "Priorizador",
    Function: "Calculadora de función",
  },
  ar: {
    Calculator: "حاسبة",
    Converter: "محول",
    Optimizer: "أداة تحسين",
    Analyzer: "أداة تحليل",
    Analyser: "أداة تحليل",
    Estimator: "أداة تقدير",
    Checker: "أداة فحص",
    Verdict: "أداة حكم",
    Simulator: "محاكي",
    Predictor: "أداة تنبؤ",
    Assessment: "أداة تقييم",
    Detector: "كاشف",
    Comparator: "أداة مقارنة",
    Report: "تقرير",
    Tracker: "متتبع",
    Balancer: "موازن",
    Prioritizer: "أداة أولوية",
    Function: "حاسبة الدالة",
  },
};

const useDeepSeek = process.argv.includes("--deepseek");

function listSchemaSlugs(): string[] {
  return fs
    .readdirSync(SCHEMAS_DIR)
    .filter((name) => name.endsWith("-schema.json"))
    .map((name) => name.replace(/-schema\.json$/, ""))
    .sort((a, b) => a.localeCompare(b));
}

function loadCopyMap(): {
  toolTitles: Record<string, Partial<Record<ToolTitleLocale, string>>>;
} {
  if (!fs.existsSync(COPY_MAP_PATH)) {
    return { toolTitles: {} };
  }
  const raw = JSON.parse(fs.readFileSync(COPY_MAP_PATH, "utf8")) as {
    toolTitles?: Record<string, Partial<Record<ToolTitleLocale, string>>>;
  };
  return { toolTitles: raw.toolTitles ?? {} };
}

function saveCopyMap(toolTitles: Record<string, Partial<Record<ToolTitleLocale, string>>>): void {
  const existing = fs.existsSync(COPY_MAP_PATH)
    ? (JSON.parse(fs.readFileSync(COPY_MAP_PATH, "utf8")) as Record<string, unknown>)
    : {};
  fs.writeFileSync(
    COPY_MAP_PATH,
    `${JSON.stringify({ ...existing, toolTitles }, null, 2)}\n`,
    "utf8",
  );
}

function overlayTitleGlossary(text: string, locale: string): string {
  const overlay = TITLE_GLOSSARY_OVERLAY[locale];
  if (!overlay) {
    return text;
  }
  let result = text;
  for (const [en, localized] of Object.entries(overlay).sort((a, b) => b[0].length - a[0].length)) {
    result = result.replace(new RegExp(`\\b${en}\\b`, "g"), localized);
  }
  return result.replace(/\s+/g, " ").trim();
}

function translateTitlePhrase(english: string, locale: string): string {
  const glossaryPass = translateCalculatorPhrase(english, locale);
  return overlayTitleGlossary(glossaryPass, locale);
}

function parseDeepSeekJson(raw: string): Record<string, unknown> {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i, "$1").trim();
  try {
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
    }
    throw new Error(`Unparseable DeepSeek JSON (${cleaned.length} chars)`);
  }
}

async function deepSeekTranslateTitles(
  items: ReadonlyArray<{ slug: string; en: string }>,
): Promise<Map<string, Partial<Record<(typeof TARGET_LOCALES)[number], string>>>> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY missing — set in .env.local or run without --deepseek");
  }

  const results = new Map<string, Partial<Record<(typeof TARGET_LOCALES)[number], string>>>();
  const batchSize = 40;

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const payload = Object.fromEntries(batch.map((item, index) => [`k${index}`, item.en]));
    const reverse = Object.fromEntries(batch.map((item, index) => [`k${index}`, item.slug]));

    const localeList = TARGET_LOCALES.map((locale) => `${locale} (${LOCALE_NAMES[locale]})`).join(", ");

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              `Translate industrial calculator product titles to ${localeList}. ` +
              "Return JSON only. Each key maps to {tr,de,fr,es,ar}. " +
              "Use natural locale-specific calculator naming (TR: Hesaplayıcı, DE: Rechner, FR: Calculateur, ES: Calculadora, AR: حاسبة). " +
              "Never leave English words in non-English titles. Preserve acronyms (OEE, APY, CNC, SMED, ISO).",
          },
          { role: "user", content: JSON.stringify(payload) },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`DeepSeek HTTP ${response.status}: ${body.slice(0, 400)}`);
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = json.choices?.[0]?.message?.content ?? "{}";
    const parsed = parseDeepSeekJson(raw);

    for (const [key, value] of Object.entries(parsed)) {
      const slug = reverse[key];
      if (!slug || !value || typeof value !== "object") {
        continue;
      }
      const locales: Partial<Record<(typeof TARGET_LOCALES)[number], string>> = {};
      for (const locale of TARGET_LOCALES) {
        const translated = (value as Record<string, unknown>)[locale];
        if (typeof translated === "string" && translated.trim()) {
          locales[locale] = translated.trim();
        }
      }
      if (Object.keys(locales).length > 0) {
        results.set(slug, locales);
      }
    }

    console.log(`  deepseek batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)}`);
    await new Promise((resolve) => setTimeout(resolve, 350));
  }

  return results;
}

async function main(): Promise<void> {
  loadEnvLocal();
  const slugs = listSchemaSlugs();
  const copyMap = loadCopyMap();
  const output: Record<string, Partial<Record<ToolTitleLocale, string>>> = {};

  for (const slug of slugs) {
    const schemaPath = path.join(SCHEMAS_DIR, `${slug}-schema.json`);
    const raw = JSON.parse(fs.readFileSync(schemaPath, "utf8")) as {
      title?: string;
      toolName?: string;
    };
    const english = resolveSchemaEnglishTitle(slug, raw);
    const entry: Partial<Record<ToolTitleLocale, string>> = {
      en: english,
    };

    for (const locale of TARGET_LOCALES) {
      const existing = copyMap.toolTitles[slug]?.[locale]?.trim();
      if (existing && !titleNeedsLocaleTranslation({ [locale]: existing }, locale, english)) {
        entry[locale] = existing;
        continue;
      }
      entry[locale] = translateTitlePhrase(english, locale);
    }

    output[slug] = entry;
    copyMap.toolTitles[slug] = { ...copyMap.toolTitles[slug], ...entry };
  }

  const deepSeekQueue = slugs
    .map((slug) => ({ slug, en: output[slug]?.en ?? "" }))
    .filter(({ slug, en }) =>
      TARGET_LOCALES.some((locale) => titleNeedsLocaleTranslation(output[slug], locale, en)),
    );

  console.log(
    `rebuild-generated-tool-titles: schemas=${slugs.length} deepseek_queue=${deepSeekQueue.length}`,
  );

  if (useDeepSeek && deepSeekQueue.length > 0) {
    console.log("DeepSeek title polish…");
    const polished = await deepSeekTranslateTitles(deepSeekQueue);
    for (const [slug, locales] of polished) {
      output[slug] = { ...output[slug], ...locales };
      copyMap.toolTitles[slug] = { ...copyMap.toolTitles[slug], ...output[slug] };
    }
  }

  let incomplete = 0;
  for (const slug of slugs) {
    for (const locale of sortToolTitleLocales()) {
      if (titleNeedsLocaleTranslation(output[slug], locale, output[slug]?.en ?? "")) {
        incomplete += 1;
      }
    }
  }

  console.log(`  total schemas: ${slugs.length}`);
  console.log(`  incomplete locale slots: ${incomplete}`);

  // Write output in ALL cases — even if some locale slots are incomplete.
  // During production builds DeepSeek is not available, so glossary+overlay
  // translations + existing copy-map entries are far better than an empty file
  // (which would cause the deployed site to fall back to raw English titles).
  // DeepSeek polishing can be run separately via --deepseek.
  fs.writeFileSync(OUT_TITLES, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  saveCopyMap(copyMap.toolTitles);
  console.log(`  titles → ${OUT_TITLES}`);
  console.log(`  incomplete locale slots: ${incomplete}`);
  if (incomplete > 0) {
    if (!useDeepSeek) {
      console.warn("WARN: DeepSeek not available — some slots use glossary/overlay translations. Run --deepseek for polish.");
    } else {
      console.warn("WARN: DeepSeek did not resolve all slots. Bundle written with best-effort translations.");
    }
  } else {
    console.log("  All locale slots complete. Bundle written safely.");
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
