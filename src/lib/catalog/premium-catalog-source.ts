import { buildCategorizedToolIndex } from "@/lib/catalog/build-categorized-tool-index";
import type { CatalogSearchEntry } from "@/lib/catalog/catalog-search";
import type { GlobalToolCategorySlug } from "@/lib/catalog/global-tool-category-taxonomy";
import { listPremiumCatalogCategories } from "@/lib/premium/premium-category-resolver";

export function normalizeToolSearchText(value: string): string {
  return value
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export type PremiumCatalogToolItem = {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly categoryId: GlobalToolCategorySlug;
  readonly categoryLabel: string;
  readonly routePath: string | null;
  readonly isActive: boolean;
  readonly searchTerms: readonly string[];
  readonly aliases: readonly string[];
  readonly keywords: readonly string[];
};

type PremiumCatalogToolOverride = {
  readonly categoryId?: GlobalToolCategorySlug;
  readonly titles?: Partial<Record<string, string>>;
  readonly descriptions?: Partial<Record<string, string>>;
  readonly searchTerms?: readonly string[];
  readonly aliases?: readonly string[];
  readonly keywords?: readonly string[];
};

const SEVEN_MUDA_SLUG = "7-israf-muda-avcisi-parasal-karsilik-calculator";

const PREMIUM_CATALOG_TOOL_OVERRIDES: Readonly<Record<string, PremiumCatalogToolOverride>> = {
  [SEVEN_MUDA_SLUG]: {
    categoryId: "lean-production",
    titles: {
      tr: "7 Muda Maliyet Hesaplayıcı",
      en: "7 Muda Waste Cost Calculator",
      de: "7 Verschwendungsarten (Muda) – monetärer Impact-Rechner",
      fr: "Calculateur d'impact monétaire des 7 gaspillages (Muda)",
      es: "Calculadora de impacto monetario de los 7 desperdicios (Muda)",
      ar: "حاسبة الأثر المالي لسبعة أنواع الهدر (مودا)",
    },
    descriptions: {
      tr: "7 İsraf (Muda) türlerinin parasal karşılığını hesaplar.",
      en: "Calculates the monetary cost of the seven Muda waste types.",
      de: "Überproduktion, Warten, Transport, Bestand, Bewegung, Fehler und Überbearbeitung bleiben ohne Periodenkosten unsichtbar.",
      fr: "Surproduction, attente, transport, stock, mouvement, défauts et sur-traitement restent invisibles sans coût périodique.",
      es: "Sobreproducción, espera, transporte, inventario, movimiento, defectos y sobreproceso quedan invisibles sin costo periódico.",
      ar: "الإنتاج الزائد والانتظار والنقل والمخزون والحركة والعيوب والمعالجة الزائدة تبقى غير مرئية دون تكلفة دورية.",
    },
    searchTerms: [
      "7 muda",
      "muda",
      "7 israf",
      "israf",
      "maliyet",
      "parasal karşılık",
      "waste cost",
      "lean waste",
      "seven muda",
      "seven wastes",
    ],
    aliases: ["7 wastes", "seven muda wastes", "lean muda"],
    keywords: ["lean", "waste", "muda", "israf", "maliyet"],
  },
  "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator": {
    categoryId: "lean-production",
    titles: {
      tr: "5S Denetim Skoru - Verimlilik Kaybı Maliyet Dönüştürücü",
      en: "5S Audit Score Efficiency Loss Cost Converter",
      de: "5S-Audit-Score – Effizienzverlust-Kostenrechner",
      fr: "Score audit 5S – convertisseur coût de perte d'efficacité",
      es: "Puntuación auditoría 5S – conversor de costo de pérdida de eficiencia",
      ar: "درجة تدقيق 5S – محول تكلفة فقدان الكفاءة",
    },
    descriptions: {
      tr: "5S puanının parasal karşılığı bilinmez; iyileştirme önceliği verilemez ve kayıp görünmez kalır.",
      en: "5S audit scores are tracked, but the monetary impact of disorganization and search time stays invisible.",
      de: "Ohne monetäre 5S-Bewertung fehlt die Priorität für Workplace-Organisation und Suchzeitverluste.",
      fr: "Sans valorisation monétaire du 5S, les priorités d'amélioration du poste de travail manquent.",
      es: "Sin valoración monetaria del 5S faltan prioridades de mejora en el puesto de trabajo.",
      ar: "بدون تقييم مالي لـ 5S تفتقر أولويات تحسين مكان العمل.",
    },
    searchTerms: ["5s", "denetim", "verimlilik", "lean", "audit score"],
    keywords: ["5s", "lean", "efficiency", "audit"],
  },
  "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator": {
    categoryId: "cnc-additive-manufacturing",
    titles: {
      tr: "3B Baskı Destek Yapısı ve Post-Proses Maliyet Hesaplayıcı",
      en: "3D Print Support Structure and Post-Process Cost Calculator",
      de: "3D-Druck Stützstruktur & Nachbearbeitungskosten-Rechner",
      fr: "Calculateur coût supports 3D et post-traitement",
      es: "Calculadora de costo de soportes 3D y postproceso",
      ar: "حاسبة تكلفة هياكل الدعم والمعالجة اللاحقة للطباعة ثلاثية الأبعاد",
    },
    descriptions: {
      tr: "Destek malzemesi ve temizleme işçiliği maliyete eklenmez; teklif marjı sessizce erir.",
      en: "Support material and cleaning labor are often omitted from additive manufacturing quotes.",
      de: "Stützmaterial und Reinigungsarbeit werden oft nicht in Additive-Angebote eingerechnet.",
      fr: "Matériau de support et nettoyage sont souvent absents des devis d'impression additive.",
      es: "Material de soporte y limpieza suelen omitirse en cotizaciones de impresión aditiva.",
      ar: "غالبًا ما يُستبعد مادة الدعم والتنظيف من عروض الطباعة الإضافية.",
    },
    searchTerms: ["3d print", "support", "post process", "additive"],
    keywords: ["3d", "additive", "support", "post-process"],
  },
  "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator": {
    categoryId: "cnc-additive-manufacturing",
    titles: {
      tr: "3B Baskı Parti Optimizasyonu ve Yuvalama Hesaplayıcı",
      en: "3D Print Batch Nesting and Bed Utilization Calculator",
      de: "3D-Druck Batch-Nesting & Bett-Auslastungs-Rechner",
      fr: "Calculateur optimisation lot et nesting 3D",
      es: "Calculadora de optimización de lote y anidamiento 3D",
      ar: "حاسبة تحسين الدفعة والتعشيش للطباعة ثلاثية الأبعاد",
    },
    descriptions: {
      tr: "Tablaya kaç parça sığacağı optimize edilmez; makine kapasitesi boşa harcanır.",
      en: "Unclear parts-per-bed planning wastes machine hours and inflates unit cost.",
      de: "Unklare Teilezahl pro Druckbett verschwendet Maschinenstunden und erhöht Stückkosten.",
      fr: "Sans pièces par plateau optimisées, les heures machine sont gaspillées.",
      es: "Sin piezas optimizadas por cama se desperdician horas de máquina.",
      ar: "بدون تحسين القطع لكل سرير تُهدر ساعات الماكينة.",
    },
    searchTerms: ["3d print", "nesting", "batch", "bed utilization"],
    keywords: ["3d", "nesting", "batch", "utilization"],
  },
  "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator": {
    categoryId: "cnc-additive-manufacturing",
    titles: {
      tr: "3B Baskı vs. Talaşlı İmalat Başabaş Noktası Hesaplayıcı",
      en: "3D Print vs CNC Machining Break-even Calculator",
      de: "3D-Druck vs Zerspanung Break-even-Rechner",
      fr: "Calculateur seuil de rentabilité 3D vs usinage",
      es: "Calculadora de punto de equilibrio 3D vs mecanizado",
      ar: "حاسبة نقطة التعادل بين الطباعة ثلاثية الأبعاد والتشغيل الآلي",
    },
    descriptions: {
      tr: "Hangi adette hangi yöntemin ekonomik olduğu bilinmez; yanlış üretim yöntemi seçilir.",
      en: "Without a quantity crossover threshold, teams pick the wrong manufacturing method.",
      de: "Ohne Mengen-Schwellenwert wird die falsche Fertigungsmethode gewählt.",
      fr: "Sans quantité seuil, la mauvaise méthode de fabrication est choisie.",
      es: "Sin cantidad umbral se elige el método de fabricación incorrecto.",
      ar: "بدون كمية عتبة يُختار أسلوب التصنيع الخاطئ.",
    },
    searchTerms: ["3d print", "cnc", "breakeven", "crossover"],
    keywords: ["3d", "cnc", "breakeven", "manufacturing"],
  },
};

function resolveLocalizedCopy(
  locale: string,
  override: PremiumCatalogToolOverride | undefined,
  field: "titles" | "descriptions",
  fallback: Record<string, string>,
): string {
  const localized = override?.[field]?.[locale] ?? override?.[field]?.en;
  if (localized) {
    return localized;
  }
  return fallback[locale] ?? fallback.en ?? "";
}

export function buildPremiumCatalogTools(locale: string): readonly PremiumCatalogToolItem[] {
  const categoryLabels = new Map(
    listPremiumCatalogCategories(locale).map((category) => [category.slug, category.title]),
  );

  const premiumItems = buildCategorizedToolIndex().filter(
    (item) => item.tier === "premium" || item.tier === "premium-schema",
  );

  const bySlug = new Map<string, PremiumCatalogToolItem>();

  for (const item of premiumItems) {
    if (bySlug.has(item.slug)) {
      continue;
    }

    const override = PREMIUM_CATALOG_TOOL_OVERRIDES[item.slug];
    const categoryId = override?.categoryId ?? item.categorySlug;

    bySlug.set(item.slug, {
      slug: item.slug,
      title: resolveLocalizedCopy(locale, override, "titles", item.title),
      description: resolveLocalizedCopy(locale, override, "descriptions", item.description),
      categoryId,
      categoryLabel: categoryLabels.get(categoryId) ?? categoryId,
      routePath: item.routePath,
      isActive: item.publicStatus === "active" && item.routePath !== null,
      searchTerms: override?.searchTerms ?? [],
      aliases: override?.aliases ?? [],
      keywords: override?.keywords ?? [],
    });
  }

  return [...bySlug.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

export function buildPremiumCatalogSearchHaystack(tool: PremiumCatalogToolItem): string {
  return normalizeToolSearchText(
    [
      tool.title,
      tool.description,
      tool.slug,
      tool.slug.replace(/-/g, " "),
      tool.categoryId,
      tool.categoryLabel,
      ...tool.searchTerms,
      ...tool.aliases,
      ...tool.keywords,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

export function buildSearchablePremiumToolHaystack(tool: {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly categorySlug: string;
  readonly categoryLabel?: string;
  readonly searchTerms?: readonly string[];
  readonly aliases?: readonly string[];
  readonly keywords?: readonly string[];
}): string {
  return normalizeToolSearchText(
    [
      tool.title,
      tool.description,
      tool.slug,
      tool.slug.replace(/-/g, " "),
      tool.categorySlug,
      tool.categoryLabel ?? tool.categorySlug,
      ...(tool.searchTerms ?? []),
      ...(tool.aliases ?? []),
      ...(tool.keywords ?? []),
    ]
      .filter(Boolean)
      .join(" "),
  );
}

/** Typeahead entries for premium discovery — active routable tools only. */
export function buildPremiumCatalogSearchEntries(
  tools: readonly {
    readonly slug: string;
    readonly title: string;
    readonly description: string;
    readonly categorySlug: string;
    readonly categoryLabel?: string;
    readonly routePath: string | null;
    readonly isActive: boolean;
    readonly searchTerms?: readonly string[];
    readonly aliases?: readonly string[];
    readonly keywords?: readonly string[];
  }[],
): readonly CatalogSearchEntry[] {
  return tools
    .filter((tool) => tool.isActive && tool.routePath)
    .map((tool) => ({
      title: tool.title,
      description: tool.description,
      href: tool.routePath!,
      groupLabel: tool.categoryLabel ?? tool.categorySlug,
      slug: tool.slug,
      tier: "premium" as const,
      haystack: buildSearchablePremiumToolHaystack(tool),
    }));
}
