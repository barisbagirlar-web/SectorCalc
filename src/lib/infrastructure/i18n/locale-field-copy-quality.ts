import { containsForbiddenTrSurfaceEnglish } from "@/lib/infrastructure/i18n/calculator-surface-forbidden";
import { isSupportedLocale, type SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

const TR_ENGLISH_LEAK_RE =
  /\b(?:Replacement|Fully|Wear|Percentage|Average|Machine|Tool|Scrap|Rework|burdened|required|including|insert|index|single|before|after|during|expected|due|based|beyond|tracking|operation|overhead|depreciation|material|labor|defective|purchase|produced|allocated|adjustment|dimensionless)\b/i;

const TR_GARBLED_HYBRID_RE = /[a-zğüşöçı]{2}[A-Z][a-zA-Zğüşöçı]{2,}/;

export type FieldDisplayCopyLike = {
  readonly label: string;
  readonly placeholder?: string;
  readonly helper?: string;
};

function hasTrLocaleCopyLeak(text: string): boolean {
  if (!text.trim()) {
    return false;
  }
  return (
    containsForbiddenTrSurfaceEnglish(text) ||
    TR_ENGLISH_LEAK_RE.test(text) ||
    TR_GARBLED_HYBRID_RE.test(text)
  );
}

/** Detect glossary/polish residue — TR copy that still contains English surface words. */
export function hasCalculatorFieldCopyResidue(
  locale: string,
  copy: FieldDisplayCopyLike,
): boolean {
  if (!copy.label.trim() || locale === "en" || !isSupportedLocale(locale)) {
    return false;
  }

  if (locale !== "tr") {
    return false;
  }

  const surfaces = [copy.label, copy.helper, copy.placeholder].filter(
    (value): value is string => typeof value === "string" && value.trim().length > 0,
  );

  return surfaces.some((surface) => hasTrLocaleCopyLeak(surface));
}

export function isSnakeCaseTechnicalKey(value: string): boolean {
  const trimmed = value.trim();
  return /^[a-z][a-z0-9]*(?:_[a-z0-9]+)+$/.test(trimmed);
}
