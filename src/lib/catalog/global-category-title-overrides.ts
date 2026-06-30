import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";
import type { GlobalToolCategorySlug } from "@/lib/catalog/global-tool-category-taxonomy";

/** Per-locale overrides for premium-152 global category titles (de, fr, es, ar). */
export const GLOBAL_CATEGORY_TITLE_OVERRIDES: Readonly<
  Partial<Record<GlobalToolCategorySlug, Partial<Record<SupportedLocale, string>>>>
> = {
  "lean-production": {
    de: "Lean-Produktion & Linieneffizienz",
    fr: "Production lean et efficacité de ligne",
    es: "Producción lean y eficiencia de línea",
    ar: "الإنتاج الرشيق وكفاءة الخط",
  },
  "quality-six-sigma": {
    de: "Qualität, SPC & Six Sigma",
    fr: "Qualité, SPC et Six Sigma",
    es: "Calidad, SPC y Seis Sigma",
    ar: "الجودة وSPC وسيغما الستة",
  },
  "process-chemical": {
    de: "Prozess, Chemie & Fluide",
    fr: "Procédés, chimie et fluides",
    es: "Proceso, química y fluidos",
    ar: "العمليات والكيمياء والموائع",
  },
  "cnc-additive-manufacturing": {
    de: "CNC, 3D-Druck & Advanced Manufacturing",
    fr: "CNC, impression 3D et fabrication avancée",
    es: "CNC, impresión 3D y fabricación avanzada",
    ar: "CNC والطباعة ثلاثية الأبعاد والتصنيع المتقدم",
  },
  "metal-plastics-forming": {
    de: "Blech, Guss, Kunststoff & Umformung",
    fr: "Tôle, fonderie, plastique et formage",
    es: "Chapa, fundición, plástico y conformado",
    ar: "الصفائح والسبك والبلاستيك والتشكيل",
  },
  "project-construction-management": {
    de: "Projekt, Baustelle & Bauleitung",
    fr: "Projet, chantier et gestion de construction",
    es: "Proyecto, obra y gestión de construcción",
    ar: "إدارة المشاريع والمواقع والبناء",
  },
  "digital-factory-automation": {
    de: "Digitale Fabrik & Automatisierung",
    fr: "Usine numérique et automatisation",
    es: "Fábrica digital y automatización",
    ar: "المصنع الرقمي والأتمتة",
  },
  "maintenance-reliability": {
    de: "Instandhaltung & Zuverlässigkeit",
    fr: "Maintenance et fiabilité",
    es: "Mantenimiento y fiabilidad",
    ar: "الصيانة والموثوقية",
  },
  "hse-ergonomics": {
    de: "HSE, Ergonomie & Risikokosten",
    fr: "HSE, ergonomie et coût des risques",
    es: "HSE, ergonomía y coste de riesgo",
    ar: "السلامة والصحة المهنية وعلم الإنسان وتكلفة المخاطر",
  },
  "procurement-supply-chain": {
    de: "Beschaffung, Lieferkette & Logistik",
    fr: "Achats, chaîne d'approvisionnement et logistique",
    es: "Compras, cadena de suministro y logística",
    ar: "المشتريات وسلسلة التوريد واللوجستيات",
  },
  "workforce-hr": {
    de: "Belegschaft, Schicht & HR-Kosten",
    fr: "Effectifs, équipes et coûts RH",
    es: "Plantilla, turnos y costes de RR. HH.",
    ar: "القوى العاملة والورديات وتكاليف الموارد البشرية",
  },
  "finance-sales-working-capital": {
    de: "Finanzen, Vertrieb & Working Capital",
    fr: "Finance, ventes et fonds de roulement",
    es: "Finanzas, ventas y capital circulante",
    ar: "المالية والمبيعات ورأس المال العامل",
  },
  "sustainability-resource-esg": {
    de: "Nachhaltigkeit, Ressourcen & ESG",
    fr: "Durabilité, ressources et ESG",
    es: "Sostenibilidad, recursos y ESG",
    ar: "الاستدامة والموارد وحوكمة ESG",
  },
  "food-cold-chain-hygiene": {
    de: "Lebensmittel, Kühlkette & Hygiene",
    fr: "Alimentation, chaîne du froid et hygiène",
    es: "Alimentación, cadena de frío e higiene",
    ar: "الغذاء وسلسلة التبريد والنظافة",
  },
  "textile-print-lab": {
    de: "Textil, Druck & Labor",
    fr: "Textile, impression et laboratoire",
    es: "Textil, impresión y laboratorio",
    ar: "النسيج والطباعة والمختبر",
  },
  "electrical-power-systems": {
    de: "Elektrik, Schaltschrank & Energiesysteme",
    fr: "Électricité, armoires et systèmes d'alimentation",
    es: "Electricidad, cuadros y sistemas de potencia",
    ar: "الأنظمة الكهربائية واللوحات والطاقة",
  },
  "mechanical-hvac-energy-loss": {
    de: "Mechanik, HVAC & Energieverlust",
    fr: "Mécanique, CVC et pertes énergétiques",
    es: "Mecánica, HVAC y pérdida energética",
    ar: "الميكانيكا وتكييف الهواء وفقد الطاقة",
  },
  "packaging-local-business": {
    de: "Verpackung & lokale Geschäftstools",
    fr: "Emballage et outils métier locaux",
    es: "Embalaje y herramientas locales",
    ar: "التعبئة وأدوات الأعمال المحلية",
  },
  "global-compliance-trade": {
    de: "Compliance, Handel & Steuern",
    fr: "Conformité, commerce et fiscalité",
    es: "Cumplimiento, comercio e impuestos",
    ar: "الامتثال والتجارة والضرائب",
  },
  "technology-ai-cloud-cyber": {
    de: "Technologie, KI, Cloud & Cyberrisiko",
    fr: "Technologie, IA, cloud et risque cyber",
    es: "Tecnología, IA, nube y riesgo cibernético",
    ar: "التكنولوجيا والذكاء الاصطناعي والسحابة والمخاطر السيبرانية",
  },
};

export function resolveGlobalCategoryTitleForLocale(
  slug: GlobalToolCategorySlug,
  locale: string,
  trTitle: string,
  enTitle: string,
): string {
  const overrides = GLOBAL_CATEGORY_TITLE_OVERRIDES[slug];
  const localized = overrides?.[locale as SupportedLocale];
  if (localized) {
    return localized;
  }
  if (locale === "tr") {
    return trTitle;
  }
  return enTitle;
}
