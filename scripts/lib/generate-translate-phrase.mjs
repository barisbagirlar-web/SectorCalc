/**
 * Deterministic EN → locale phrase translation for i18n generation scripts.
 * Priority: exact copy map → field-label map (non-identity) → glossary exact →
 * glossary longest-match (short phrases only; never on sentence helpers).
 */

export const PLACEHOLDER_TEMPLATES = {
  en: (label) => `Enter ${label.toLowerCase()}`,
  tr: (label) => `${label} girin`,
  de: (label) => `${label} eingeben`,
  fr: (label) => `Saisir ${label.toLowerCase()}`,
  es: (label) => `Introduzca ${label.toLowerCase()}`,
  ar: (label) => `أدخل ${label}`,
};

export const HELPER_TEMPLATES = {
  tr: (label) => `${label} için hesaplamada kullanılan değer.`,
  de: (label) => `Eingabewert für ${label} in der Berechnung.`,
  fr: (label) => `Valeur utilisée pour ${label} dans le calcul.`,
  es: (label) => `Valor utilizado para ${label} en el cálculo.`,
  ar: (label) => `القيمة المستخدمة لـ ${label} في الحساب.`,
};

const ENGLISH_MARKERS_STRICT = [
  /\bthe\b/i,
  /\bthis\b/i,
  /\bthat\b/i,
  /\bwith\b/i,
  /\bfrom\b/i,
  /\bwhen\b/i,
  /\byour\b/i,
  /\bwill\b/i,
  /\bare\b/i,
  /\bcalculator\b/i,
  /\binput\b/i,
  /\bused to\b/i,
  /\be\.g\./i,
  /\bexpected\b/i,
  /\bavailable\b/i,
];

const LOCALE_MARKERS = {
  tr: [/[çğıöşüÇĞİÖŞÜ]/, /\b(için|veya|başına|olarak|girin|hedef|proses|maliyet|birim|değer|hesaplamada)\b/i],
  de: [/[äöüßÄÖÜ]/, /\b(und|oder|für|pro|eingeben|der|die|das|berechnung)\b/i],
  fr: [/[àâçéèêëîïôùûü]/i, /\b(pour|ou|de|le|la|saisir|calcul|valeur)\b/i],
  es: [/[áéíóúñü¿¡]/i, /\b(para|o|de|el|la|introduzca|cálculo|valor)\b/i],
  ar: [/[\u0600-\u06FF]/],
};

/** Sentence-like helpers must use full copy map or locale template — never partial glossary. */
export function isSentenceLike(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return false;
  }
  if (trimmed.length >= 55) {
    return true;
  }
  if (/\.\s/.test(trimmed) || /[.!?]$/.test(trimmed)) {
    return true;
  }
  const words = trimmed.split(/\s+/);
  if (words.length >= 8) {
    return true;
  }
  if (
    words.length >= 4 &&
    /\b(the|for|with|that|this|used|from|when|your|are|will|which|plan|calculate|investment)\b/i.test(
      trimmed,
    )
  ) {
    return true;
  }
  return false;
}

function isLikelyHybrid(text, locale) {
  if (!text || locale === "en") {
    return false;
  }
  const markers = LOCALE_MARKERS[locale] ?? [];
  const hasLocale = markers.some((re) => re.test(text));
  if (!hasLocale) {
    return false;
  }
  return ENGLISH_MARKERS_STRICT.some((re) => re.test(text));
}

function humanizeKey(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

const GENERIC_CALCULATOR_HELPER_PATTERNS = [
  {
    re: /^Primary input for (.+?) Calculator\.?$/i,
    templates: {
      tr: () => "Hesaplamada kullanılan birincil girdi değeri.",
      de: () => "Primärer Eingabewert für die Berechnung.",
      fr: () => "Valeur d'entrée principale utilisée pour le calcul.",
      es: () => "Valor de entrada principal utilizado para el cálculo.",
      ar: () => "قيمة الإدخال الأساسية المستخدمة في الحساب.",
    },
  },
  {
    re: /^Secondary input for (.+?) Calculator\.?$/i,
    templates: {
      tr: () => "Hesaplamada kullanılan ikincil girdi değeri.",
      de: () => "Sekundärer Eingabewert für die Berechnung.",
      fr: () => "Valeur d'entrée secondaire utilisée pour le calcul.",
      es: () => "Valor de entrada secundario utilizado para el cálculo.",
      ar: () => "قيمة الإدخال الثانوية المستخدمة في الحساب.",
    },
  },
  {
    re: /^Optional modifier for (.+?) Calculator\.?$/i,
    templates: {
      tr: () => "Hesaplamayı ayarlamak için isteğe bağlı değer.",
      de: () => "Optionaler Modifikator für die Berechnung.",
      fr: () => "Modificateur optionnel pour le calcul.",
      es: () => "Modificador opcional para el cálculo.",
      ar: () => "قيمة تعديل اختيارية للحساب.",
    },
  },
];

const TR_FORBIDDEN_SURFACE = [
  "Length", "Width", "Height", "Depth", "Weight", "Temperature", "Speed", "Pressure", "Energy",
  "Calculator", "Input", "Output", "Primary", "Secondary", "Optional", "Modifier", "Backpacking",
];

function hasForbiddenTrSurface(text) {
  if (!text) {
    return false;
  }
  return TR_FORBIDDEN_SURFACE.some((word) => {
    const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    return re.test(text);
  });
}

function resolveGenericCalculatorHelper(text, locale) {
  const trimmed = text.trim();
  for (const pattern of GENERIC_CALCULATOR_HELPER_PATTERNS) {
    const match = trimmed.match(pattern.re);
    if (!match) {
      continue;
    }
    const template = pattern.templates[locale];
    if (!template) {
      continue;
    }
    return template();
  }
  return null;
}

function glossaryReplacePattern(english) {
  const escaped = english.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (/^[\p{L}\p{N}_'-]+$/u.test(english)) {
    return new RegExp(`\\b${escaped}\\b`, "giu");
  }
  return new RegExp(escaped, "gi");
}

export function createPhraseTranslator({
  phraseGlossary,
  fieldLabelMap,
  extraGlossaryByLocale = {},
}) {
  function sortedGlossaryEntries(locale) {
    const glossary = {
      ...(phraseGlossary[locale] ?? {}),
      ...(extraGlossaryByLocale[locale] ?? {}),
    };
    return Object.entries(glossary).sort((a, b) => b[0].length - a[0].length);
  }

  function isDistinctLocalized(source, candidate) {
    if (typeof candidate !== "string" || !candidate.trim()) {
      return false;
    }
    return candidate.trim().toLowerCase() !== source.trim().toLowerCase();
  }

  function applyPartialGlossary(text, locale) {
    let result = text;
    for (const [en, localized] of sortedGlossaryEntries(locale)) {
      result = result.replace(glossaryReplacePattern(en), localized);
    }
    return result;
  }

  function translatePhrase(text, locale, copyMapBucket, options = {}) {
    const { mode = "phrase", localizedLabel } = options;

    if (!text || locale === "en") {
      return text;
    }

    if (mode === "helper") {
      const genericHelper = resolveGenericCalculatorHelper(text, locale);
      if (genericHelper) {
        return genericHelper;
      }
    }

    const fromCopyMap = copyMapBucket?.[text]?.[locale];
    if (
      isDistinctLocalized(text, fromCopyMap) &&
      !isLikelyHybrid(fromCopyMap, locale) &&
      !(locale === "tr" && hasForbiddenTrSurface(fromCopyMap))
    ) {
      return fromCopyMap.trim();
    }

    if (phraseGlossary[locale]?.[text]) {
      return phraseGlossary[locale][text];
    }

    if (extraGlossaryByLocale[locale]?.[text]) {
      return extraGlossaryByLocale[locale][text];
    }

    const fromFieldLabel = fieldLabelMap[locale]?.[text];
    if (isDistinctLocalized(text, fromFieldLabel) && !isLikelyHybrid(fromFieldLabel, locale)) {
      return fromFieldLabel.trim();
    }

    if (mode === "helper" && isSentenceLike(text)) {
      if (localizedLabel && HELPER_TEMPLATES[locale]) {
        return HELPER_TEMPLATES[locale](localizedLabel);
      }
      return text;
    }

    const partial = applyPartialGlossary(text, locale);
    if (partial !== text && !isLikelyHybrid(partial, locale)) {
      return partial;
    }

    return text;
  }

  function buildFieldCopy(locale, enLabel, enHelper, key, copyMap = {}) {
    const labelSource = enLabel?.trim() || humanizeKey(key);
    const helperSource = enHelper?.trim() || labelSource;

    const label =
      locale === "en"
        ? labelSource
        : translatePhrase(labelSource, locale, copyMap.labels, { mode: "label" });

    const helper =
      locale === "en"
        ? helperSource
        : translatePhrase(helperSource, locale, copyMap.helpers, {
            mode: "helper",
            localizedLabel: label,
          });

    const placeholder = PLACEHOLDER_TEMPLATES[locale](label);
    return { label, placeholder, helper };
  }

  return { translatePhrase, buildFieldCopy, sortedGlossaryEntries, isSentenceLike };
}
