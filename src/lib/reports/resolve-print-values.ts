/**
 * Resolve primary result value from a GeneratedToolResult with fallback.
 *
 * Generated calculators sometimes return the primary value under a different
 * key than schema.outputs.primary (e.g. returns "totalWasteCost" while schema
 * declares primary="result").  This resolver handles the mismatch.
 */
import type { GeneratedToolResult, GeneratedToolInput } from "@/lib/generated-tools/types";
import type { SupportedLocale } from "@/lib/i18n/locale-config";
import { resolveGeneratedI18nText } from "@/lib/generated-tools/resolve-i18n-text";
import { normalizeLocale } from "@/lib/format/localization";

const SKIP_KEYS = new Set([
  "breakdown",
  "hiddenLossDrivers",
  "suggestedActions",
  "dataConfidenceAdjusted",
  "premiumRequired",
  "premiumFeatures",
  "metadata",
  "trustTrace",
]);

export function resolvePrimaryPrintValue(
  result: GeneratedToolResult,
  primaryOutputKey: string,
): number | null {
  // 1. Exact primary key match
  const exact = result[primaryOutputKey];
  if (typeof exact === "number" && Number.isFinite(exact)) {
    return exact;
  }

  // 2. Fallback — find the first numeric value that looks like a result
  //    (skip known metadata/special keys)
  for (const [key, value] of Object.entries(result)) {
    if (SKIP_KEYS.has(key)) continue;
    if (key.startsWith("_")) continue;
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }

  return null;
}

type MethodologyTemplateParams = {
  inputCount: number;
  formulaCount: number;
  inputNames: string;
};

const METHODOLOGY_TEMPLATES: Record<string, (p: MethodologyTemplateParams) => string> = {
  en: (p) =>
    `Model uses ${p.inputCount} input parameter${p.inputCount !== 1 ? "s" : ""} across ${p.formulaCount} formula${p.formulaCount !== 1 ? "s" : ""}. Key inputs: ${p.inputNames}. All formulas are deterministic and unit-consistent. Verify assumptions against your actual operating conditions before making business decisions.`,
  tr: (p) =>
    `Model, ${p.formulaCount} formül üzerinden ${p.inputCount} giriş parametresi kullanır. Ana girdiler: ${p.inputNames}. Tüm formüller deterministik ve birim tutarlıdır. İş kararları almadan önce varsayımları gerçek çalışma koşullarınıza göre doğrulayın.`,
  de: (p) =>
    `Das Modell verwendet ${p.inputCount} Eingabeparameter über ${p.formulaCount} Formeln. Wichtige Eingaben: ${p.inputNames}. Alle Formeln sind deterministisch und einheitenkonsistent. Überprüfen Sie Annahmen vor Geschäftsentscheidungen anhand Ihrer tatsächlichen Betriebsbedingungen.`,
  fr: (p) =>
    `Le modèle utilise ${p.inputCount} paramètre${p.inputCount !== 1 ? "s" : ""} d'entrée sur ${p.formulaCount} formule${p.formulaCount !== 1 ? "s" : ""}. Entrées clés : ${p.inputNames}. Toutes les formules sont déterministes et cohérentes en unités. Vérifiez les hypothèses par rapport à vos conditions d'exploitation réelles avant de prendre des décisions commerciales.`,
  es: (p) =>
    `El modelo utiliza ${p.inputCount} parámetro${p.inputCount !== 1 ? "s" : ""} de entrada en ${p.formulaCount} fórmula${p.formulaCount !== 1 ? "s" : ""}. Entradas clave: ${p.inputNames}. Todas las fórmulas son deterministas y coherentes en unidades. Verifique los supuestos con sus condiciones operativas reales antes de tomar decisiones comerciales.`,
  ar: (p) => {
    const e2a = (n: number) => n.toString().replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);
    const inputCountAr = e2a(p.inputCount);
    const formulaCountAr = e2a(p.formulaCount);
    return `يستخدم النموذج ${inputCountAr} معلمة إدخال عبر ${formulaCountAr} صيغة. المدخلات الرئيسية: ${p.inputNames}. جميع الصيغ حتمية ومتسقة الوحدات. تحقق من الافتراضات مقابل ظروف التشغيل الفعلية قبل اتخاذ القرارات التجارية.`;
  },
};

/**
 * Build a locale-aware methodology description from schema data.
 * Every language has its own translated template. Input labels are
 * resolved through the i18n chain (schema → glossary → EN fallback).
 */
export function buildMethodologyDescription(
  schemaInputs: readonly GeneratedToolInput[],
  schemaFormulas: Readonly<Record<string, string>>,
  locale: string,
): string {
  const inputCount = schemaInputs.length;
  const formulaCount = Object.keys(schemaFormulas).length;
  const normalizedLocale = normalizeLocale(locale);

  const inputNames = schemaInputs
    .slice(0, 3)
    .map((i) => resolveGeneratedI18nText(i.label_i18n, locale, i.label))
    .join(", ");

  const template = METHODOLOGY_TEMPLATES[normalizedLocale] ?? METHODOLOGY_TEMPLATES.en;
  return template({ inputCount, formulaCount, inputNames });
}

/**
 * Collect tool-specific reference standards from schema validation rules.
 * Returns language-neutral ISO/IEC/DIN codes.
 */
export function findReferenceStandards(
  validationRules: readonly string[],
): string[] {
  const standards: string[] = [];
  for (const rule of validationRules) {
    const match = rule.match(/(ISO\s+\d+[-\d]*|IEC\s+\d+|DIN\s+\d+)/i);
    if (match) {
      standards.push(match[1].toUpperCase());
    }
  }
  return [...new Set(standards)];
}

/**
 * Resolve a breakdown label with locale awareness.
 * Priority: breakdown_i18n[locale][key] → breakdown_i18n[en][key] → breakdown[key] → key
 */
export function resolveBreakdownLabel(
  key: string,
  breakdown: Readonly<Record<string, string>>,
  breakdownI18n: Partial<Record<SupportedLocale, Readonly<Record<string, string>>>> | undefined,
  locale: string,
): string {
  if (breakdownI18n) {
    const loc = normalizeLocale(locale);
    const localeLabels = breakdownI18n[loc];
    if (localeLabels && key in localeLabels) {
      return localeLabels[key];
    }
    // Fallback to English i18n if current locale not found
    const enLabels = breakdownI18n.en;
    if (enLabels && key in enLabels) {
      return enLabels[key];
    }
  }
  return breakdown[key] ?? key;
}
