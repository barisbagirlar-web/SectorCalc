/* eslint-disable */
// @ts-nocheck

import {
  getGlobalCategoryBySlug,
  resolveGlobalCategoryTitle,
} from "@/lib/catalog/global-tool-category-taxonomy";
import { resolveIndustrySectorDisplayLabel } from "@/lib/infrastructure/i18n/industry-sector-display-labels";
import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";
import { SUPPORTED_LOCALES } from "@/lib/infrastructure/i18n/locale-config";
import { CATEGORY_TAXONOMY, TAXONOMY_CATEGORY_NAMES } from "@/lib/features/tools/category-taxonomy";
import {
  resolveTaxonomyCategoryDisplayLabel,
  resolveTaxonomySectorDisplayLabel,
} from "@/lib/infrastructure/i18n/taxonomy-display-labels";
// import { getSectorById } from "@/lib/features/tools/taxonomy";

type LocaleLabelMap = Readonly<Record<SupportedLocale, string>>;

function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function resolveLocalizedLabel(map: LocaleLabelMap | undefined, locale: string): string | null {
  if (!map) {
    return null;
  }
  const normalized = locale.toLowerCase() as SupportedLocale;
  if (SUPPORTED_LOCALES.includes(normalized)) {
    return map[normalized];
  }
  return map.en;
}

/** Schema catalog category keys → localized sidebar labels (all 6 locales). */
const SCHEMA_CATEGORY_LABELS: Readonly<Record<string, LocaleLabelMap>> = {
  "finans-kredi": {
    en: "Finance & Credit",
    tr: "Finans & Kredi",
    de: "Finanzen & Kredit",
    fr: "Finance et crédit",
    es: "Finanzas y crédito",
    ar: "المالية والائتمان",
  },
  "malzeme-fire-oee": {
    en: "Material, Scrap & OEE",
    tr: "Malzeme, Fire & OEE",
    de: "Material, Ausschuss & OEE",
    fr: "Matériaux, rebuts et OEE",
    es: "Material, merma y OEE",
    ar: "المواد والهدر وOEE",
  },
  "olcum-donusum": {
    en: "Measurement & Conversion",
    tr: "Measurement & Donusum",
    de: "Messung & Umrechnung",
    fr: "Mesure et conversion",
    es: "Medición y conversión",
    ar: "القياس والتحويل",
  },
  "teknik-muhendislik": {
    en: "Technical & Engineering",
    tr: "Teknik & Engineerlik",
    de: "Technik & Engineering",
    fr: "Technique et ingénierie",
    es: "Técnica e ingeniería",
    ar: "التقنية والهندسة",
  },
  "maliyet-marj": {
    en: "Cost & Margin",
    tr: "Maliyet & Marj",
    de: "Kosten & Marge",
    fr: "Coût et marge",
    es: "Coste y margen",
    ar: "التكلفة والهامش",
  },
  diger: {
    en: "Other",
    tr: "Diger",
    de: "Sonstiges",
    fr: "Autre",
    es: "Otros",
    ar: "أخرى",
  },
  "enerji-karbon": {
    en: "Energy & Carbon",
    tr: "Enerji & Karbon",
    de: "Energie & CO₂",
    fr: "Énergie et carbone",
    es: "Energía y carbono",
    ar: "الطاقة والكربون",
  },
  "insaat-saha": {
    en: "Construction & Field",
    tr: "Insaat & Saha",
    de: "Bau & Baustelle",
    fr: "Construction et chantier",
    es: "Construcción y obra",
    ar: "البناء والموقع",
  },
  "perakende-gida": {
    en: "Retail & Food",
    tr: "Perakende & Gida",
    de: "Einzelhandel & Lebensmittel",
    fr: "Commerce et alimentation",
    es: "Retail y alimentación",
    ar: "التجزئة والغذاء",
  },
  "rota-lojistik": {
    en: "Routing & Logistics",
    tr: "Rota & Lojistik",
    de: "Route & Logistik",
    fr: "Itinéraire et logistique",
    es: "Ruta y logística",
    ar: "المسار واللوجستيات",
  },
  "finans-ik": {
    en: "Finance & HR",
    tr: "Finans & IK",
    de: "Finanzen & Personal",
    fr: "Finance et RH",
    es: "Finanzas y RR. HH.",
    ar: "المالية والموارد البشرية",
  },
  ...Object.fromEntries(
    TAXONOMY_CATEGORY_NAMES.map((title) => {
      const entry = CATEGORY_TAXONOMY[title];
      return [
        entry.slug,
        {
          tr: entry.trTitle,
          en: entry.enTitle,
          de: entry.enTitle,
          fr: entry.enTitle,
          es: entry.enTitle,
          ar: entry.enTitle,
        } satisfies LocaleLabelMap,
      ] as const;
    }),
  ),
};

/** Schema catalog sector keys → localized sidebar labels (all 6 locales). */
const SCHEMA_SECTOR_LABELS: Readonly<Record<string, LocaleLabelMap>> = {
  "uretim-imalat": {
    en: "Manufacturing & Production",
    tr: "Uretim & Imalat",
    de: "Produktion & Fertigung",
    fr: "Production et fabrication",
    es: "Producción y fabricación",
    ar: "التصنيع والإنتاج",
  },
  "lojistik-sevkiyat": {
    en: "Logistics & Shipping",
    tr: "Lojistik & Sevkiyat",
    de: "Logistik & Versand",
    fr: "Logistique et expédition",
    es: "Logística y envío",
    ar: "اللوجستيات والشحن",
  },
  "atolye-tamir": {
    en: "Workshop & Repair",
    tr: "Atolye & Tamir",
    de: "Werkstatt & Reparatur",
    fr: "Atelier et réparation",
    es: "Taller y reparación",
    ar: "الورشة والإصلاح",
  },
  cleaning: {
    en: "Cleaning Services",
    tr: "Temizlik Hizmetleri",
    de: "Reinigungsdienste",
    fr: "Services de nettoyage",
    es: "Servicios de limpieza",
    ar: "خدمات التنظيف",
  },
  ecommerce: {
    en: "E-commerce",
    tr: "E-ticaret",
    de: "E-Commerce",
    fr: "Commerce en ligne",
    es: "Comercio electrónico",
    ar: "التجارة الإلكترونية",
  },
  "daily-renovation": {
    en: "Daily Life & Renovation",
    tr: "Gunluk Hayat & Tadilat",
    de: "Alltag & Renovierung",
    fr: "Vie quotidienne et rénovation",
    es: "Vida diaria y reformas",
    ar: "الحياة اليومية والتجديد",
  },
  "energy-consumption": {
    en: "Energy Consumption",
    tr: "Enerji Tuketimi",
    de: "Energieverbrauch",
    fr: "Consommation d'énergie",
    es: "Consumo energético",
    ar: "استهلاك الطاقة",
  },
  "cnc-manufacturing": {
    en: "CNC Manufacturing",
    tr: "CNC Imalat",
    de: "CNC-Fertigung",
    fr: "Fabrication CNC",
    es: "Fabricación CNC",
    ar: "تصنيع CNC",
  },
  restaurant: {
    en: "Restaurant & Hospitality",
    tr: "Restoran & Konaklama",
    de: "Gastronomie & Hotellerie",
    fr: "Restauration et hôtellerie",
    es: "Restauración y hostelería",
    ar: "المطاعم والضيافة",
  },
  construction: {
    en: "Construction",
    tr: "Insaat",
    de: "Bauwesen",
    fr: "Construction",
    es: "Construcción",
    ar: "البناء",
  },
  "landscaping-lawn-care": {
    en: "Landscaping & Lawn Care",
    tr: "Peyzaj & Bahce Bakimi",
    de: "Landschaftsbau & Rasenpflege",
    fr: "Aménagement paysager et pelouse",
    es: "Paisajismo y césped",
    ar: "تنسيق الحدائق والعناية بالمسطحات",
  },
  "isg-risk": {
    en: "HSE & Risk",
    tr: "EHS & Risk",
    de: "Arbeitsschutz & Risiko",
    fr: "SST et risque",
    es: "PRL y riesgo",
    ar: "السلامة والمخاطر",
  },
  surdurulebilirlik: {
    en: "Sustainability",
    tr: "Surdurulebilirlik",
    de: "Nachhaltigkeit",
    fr: "Durabilité",
    es: "Sostenibilidad",
    ar: "الاستدامة",
  },
  "kalite-spc-alti-sigma": {
    en: "Quality, SPC & Six Sigma",
    tr: "Kalite, SPC & Alti Sigma",
    de: "Qualität, SPC & Six Sigma",
    fr: "Qualité, SPC et Six Sigma",
    es: "Calidad, SPC y Seis Sigma",
    ar: "الجودة وSPC وسي سيجما",
  },
};

export function resolveSchemaCatalogCategoryLabel(categoryKey: string, locale: string): string {
  const taxonomyCategory = resolveTaxonomyCategoryDisplayLabel(categoryKey, locale);
  if (taxonomyCategory) {
    return taxonomyCategory;
  }

  const globalCategory = getGlobalCategoryBySlug(categoryKey);
  if (globalCategory) {
    return resolveGlobalCategoryTitle(globalCategory, locale);
  }

  return (
    resolveLocalizedLabel(SCHEMA_CATEGORY_LABELS[categoryKey], locale) ?? humanizeSlug(categoryKey)
  );
}

export function resolveSchemaCatalogSectorLabel(sectorKey: string, locale: string): string {
  const industryLabel = resolveIndustrySectorDisplayLabel(sectorKey, locale);
  if (industryLabel) {
    return industryLabel;
  }

  const taxonomySectorLabel = resolveTaxonomySectorDisplayLabel(sectorKey, locale);
  if (taxonomySectorLabel) {
    return taxonomySectorLabel;
  }

  const taxonomySector = getSectorById(sectorKey);
  if (taxonomySector) {
    const normalized = locale.toLowerCase() as SupportedLocale;
    if (normalized === "en" || !SUPPORTED_LOCALES.includes(normalized)) {
      return taxonomySector.labelEn;
    }
    return taxonomySector.label;
  }

  const fromCategoryMap = SCHEMA_CATEGORY_LABELS[sectorKey];
  if (fromCategoryMap) {
    return resolveLocalizedLabel(fromCategoryMap, locale) ?? humanizeSlug(sectorKey);
  }

  return resolveLocalizedLabel(SCHEMA_SECTOR_LABELS[sectorKey], locale) ?? humanizeSlug(sectorKey);
}
