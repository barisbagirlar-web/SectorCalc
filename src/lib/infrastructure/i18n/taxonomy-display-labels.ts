import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";
import { SUPPORTED_LOCALES } from "@/lib/infrastructure/i18n/locale-config";
import {
  TAXONOMY_CATEGORY_DISPLAY_LABELS,
  TAXONOMY_SECTOR_DISPLAY_LABELS,
  type LocaleLabelMap,
} from "@/lib/infrastructure/i18n/taxonomy-display-labels.generated";

export { TAXONOMY_CATEGORY_DISPLAY_LABELS, TAXONOMY_SECTOR_DISPLAY_LABELS };

function normalizeLocale(locale: string): SupportedLocale {
  const lower = locale.toLowerCase() as SupportedLocale;
  return SUPPORTED_LOCALES.includes(lower) ? lower : "en";
}

function resolveFromMap(
  map: Readonly<Record<string, LocaleLabelMap>>,
  key: string,
  locale: string,
): string | null {
  const labels = map[key];
  if (!labels) {
    return null;
  }
  return labels[normalizeLocale(locale)];
}

export function resolveTaxonomySectorDisplayLabel(sectorId: string, locale: string): string | null {
  return resolveFromMap(TAXONOMY_SECTOR_DISPLAY_LABELS, sectorId, locale);
}

export function resolveTaxonomyCategoryDisplayLabel(categoryId: string, locale: string): string | null {
  return resolveFromMap(TAXONOMY_CATEGORY_DISPLAY_LABELS, categoryId, locale);
}

/** Localized profession chips for sector taxonomy tiles (Turkish source keys). */
const PROFESSION_DISPLAY_LABELS: Readonly<Record<string, LocaleLabelMap>> = {
  "Uretim Engineer": {
    en: "Production Engineer",
    tr: "Uretim Engineer",
    de: "Produktionsingenieur",
    fr: "Ingénieur de production",
    es: "Ingeniero de producción",
    ar: "مهندس إنتاج",
  },
  "Kalite Engineer": {
    en: "Quality Engineer",
    tr: "Kalite Engineer",
    de: "Qualitätsingenieur",
    fr: "Ingénieur qualité",
    es: "Ingeniero de calidad",
    ar: "مهندس جودة",
  },
  "Tasarim Engineer": {
    en: "Design Engineer",
    tr: "Tasarim Engineer",
    de: "Konstruktionsingenieur",
    fr: "Ingénieur conception",
    es: "Ingeniero de diseño",
    ar: "مهندس تصميم",
  },
  "Process Engineer": {
    en: "Process Engineer",
    tr: "Process Engineer",
    de: "Verfahrensingenieur",
    fr: "Ingénieur procédés",
    es: "Ingeniero de procesos",
    ar: "مهندس عمليات",
  },
  "Finans Muduru": {
    en: "Finance Manager",
    tr: "Finans Muduru",
    de: "Finanzleiter",
    fr: "Directeur financier",
    es: "Director financiero",
    ar: "مدير مالي",
  },
  "Enerji Engineer": {
    en: "Energy Engineer",
    tr: "Enerji Engineer",
    de: "Energieingenieur",
    fr: "Ingénieur énergie",
    es: "Ingeniero energético",
    ar: "مهندس طاقة",
  },
  "Insaat Engineer": {
    en: "Civil Engineer",
    tr: "Insaat Engineer",
    de: "Bauingenieur",
    fr: "Ingénieur civil",
    es: "Ingeniero civil",
    ar: "مهندس مدني",
  },
  "Genel Uzman": {
    en: "General Specialist",
    tr: "Genel Uzman",
    de: "Fachexperte",
    fr: "Spécialiste général",
    es: "Especialista general",
    ar: "خبير عام",
  },
};

export function resolveTaxonomyProfessionDisplayLabel(profession: string, locale: string): string {
  const mapped = PROFESSION_DISPLAY_LABELS[profession];
  if (mapped) {
    return mapped[normalizeLocale(locale)];
  }
  return profession;
}

export function resolveTaxonomyProfessionsForLocale(
  professions: readonly string[],
  locale: string,
): readonly string[] {
  return professions.map((profession) => resolveTaxonomyProfessionDisplayLabel(profession, locale));
}
