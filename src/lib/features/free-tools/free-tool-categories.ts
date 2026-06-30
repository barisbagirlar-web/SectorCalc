/**
 * SectorCalc — Free Tool Category Registry v2.0
 *
 * 33 premium-grade categories for free calculation tools.
 * Each category maps a field (alan), sector (sektör), and social purpose (sosyal amaç).
 * Icons, titles, taglines, field, domain, and socialPurpose in all 6 supported locales.
 *
 * ECMI / ISO 9001:2015 — TÜV-certifiable industrial quality.
 */

import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

// ─── Types ──────────────────────────────────────────────────────────────────

export type FreeToolCategorySlug =
  | "quality-six-sigma"
  | "technology-ai-cloud-cyber"
  | "finance-sales-working-capital"
  | "electrical-power-systems"
  | "sustainability-resource-esg"
  | "cnc-additive-manufacturing"
  | "metal-plastics-forming"
  | "process-chemical"
  | "hse-ergonomics"
  | "maintenance-reliability"
  | "project-construction-management"
  | "workforce-hr"
  | "procurement-supply-chain"
  | "food-cold-chain-hygiene"
  | "lean-production"
  | "textile-print-lab"
  | "mechanical-hvac-energy-loss"
  | "packaging-local-business"
  | "global-compliance-trade"
  | "digital-factory-automation"
  | "mathematics-statistics"
  | "health-fitness-daily-life"
  | "conversion-measurement"
  | "automotive-transport"
  | "maritime-shipping"
  | "mining-geology"
  | "furniture-woodworking"
  | "cleaning-facility"
  | "water-wastewater"
  | "tourism-hospitality"
  | "education-academic"
  | "real-estate-property"
  | "aerospace-aviation"
  | "other";

export type FreeToolCategoryEntry = {
  readonly slug: FreeToolCategorySlug;
  readonly order: number;
  readonly icon: string;
  /** Premium line-art SVG symbol (inline, copper/navy stroke, 48×48 viewBox). */
  readonly symbolSvg: string;
  readonly title: Readonly<Record<SupportedLocale, string>>;
  readonly tagline: Readonly<Record<SupportedLocale, string>>;
  /** Field domain (alan) — e.g. "Engineering", "Finance", "Health" */
  readonly field: Readonly<Record<SupportedLocale, string>>;
  /** Industry sector (sektör) — e.g. "Manufacturing", "Construction" */
  readonly domain: Readonly<Record<SupportedLocale, string>>;
  /** Social purpose (sosyal amaç) — e.g. "Industrial Efficiency", "Public Health" */
  readonly socialPurpose: Readonly<Record<SupportedLocale, string>>;
};

/* ──────────────────────────────────────────────
 * Premium line-art SVG symbols (copper style)
 * Each is a clean 48×48 viewBox with stroke-width="1.5"
 * using sc-copper (#B87333) or sc-navy (#1B2A4A) tones.
 * Follows same design language as premium-categories.ts.
 * ────────────────────────────────────────────── */

const SYM_BASE = 'viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

/* --- Reused from premium-categories.ts (20 matching slugs) --- */
const SYM_QUALITY = `<svg ${SYM_BASE}><polygon points="24,4 29,18 44,18 32,27 35,42 24,33 13,42 16,27 4,18 19,18"/><circle cx="24" cy="22" r="4"/></svg>`;
const SYM_TECH = `<svg ${SYM_BASE}><rect x="10" y="10" width="28" height="28" rx="4"/><circle cx="24" cy="24" r="6"/><line x1="24" y1="10" x2="24" y2="4"/><line x1="24" y1="38" x2="24" y2="44"/><line x1="10" y1="24" x2="4" y2="24"/><line x1="38" y1="24" x2="44" y2="24"/></svg>`;
const SYM_FINANCE = `<svg ${SYM_BASE}><line x1="24" y1="8" x2="24" y2="40"/><path d="M14 14c0-4 4-6 10-6s10 2 10 6-4 6-10 6-10 2-10 6 4 6 10 6 10-2 10-6"/></svg>`;
const SYM_ELECTRIC = `<svg ${SYM_BASE}><path d="M20 4l-8 20h8l-4 20 16-24h-8l8-16z"/></svg>`;
const SYM_LEAF = `<svg ${SYM_BASE}><path d="M24 12c-8 0-14 6-14 14v8c0 2 2 4 4 4h20c2 0 4-2 4-4v-8c0-8-6-14-14-14z"/><path d="M24 12V4"/><path d="M18 32l6-8 6 8"/></svg>`;
const SYM_CNC = `<svg ${SYM_BASE}><circle cx="24" cy="24" r="8"/><path d="M24 8v6M24 34v6M8 24h6M34 24h6"/><path d="M14 14l4 4M30 30l4 4M30 14l-4 4M14 30l4-4"/></svg>`;
const SYM_METAL = `<svg ${SYM_BASE}><rect x="8" y="16" width="32" height="20" rx="2"/><path d="M8 16l6-8h20l6 8"/><line x1="24" y1="16" x2="24" y2="36"/><line x1="14" y1="24" x2="18" y2="24"/><line x1="30" y1="24" x2="34" y2="24"/></svg>`;
const SYM_PROCESS = `<svg ${SYM_BASE}><circle cx="16" cy="16" r="6"/><circle cx="36" cy="16" r="6"/><line x1="22" y1="16" x2="30" y2="16"/><line x1="16" y1="22" x2="16" y2="40"/><line x1="36" y1="22" x2="36" y2="40"/><line x1="16" y1="40" x2="36" y2="40"/></svg>`;
const SYM_HSE = `<svg ${SYM_BASE}><path d="M24 6L8 14v8c0 12 6 18 16 20 10-2 16-8 16-20v-8L24 6z"/><line x1="24" y1="18" x2="24" y2="28"/><circle cx="24" cy="32" r="1.5"/></svg>`;
const SYM_MAINTENANCE = `<svg ${SYM_BASE}><circle cx="24" cy="24" r="14"/><path d="M24 10v14l8 8"/><path d="M10 8l4 4M38 8l-4 4M10 40l4-4M38 40l-4-4"/></svg>`;
const SYM_PROJECT = `<svg ${SYM_BASE}><rect x="8" y="6" width="32" height="36" rx="3"/><line x1="16" y1="14" x2="32" y2="14"/><line x1="16" y1="22" x2="32" y2="22"/><line x1="16" y1="30" x2="28" y2="30"/><circle cx="34" cy="34" r="3"/></svg>`;
const SYM_WORKFORCE = `<svg ${SYM_BASE}><circle cx="18" cy="14" r="6"/><circle cx="34" cy="16" r="5"/><path d="M8 40c0-8 4-12 10-12s10 4 10 12"/><path d="M28 38c0-6 3-10 8-10s8 4 8 10"/></svg>`;
const SYM_PROCUREMENT = `<svg ${SYM_BASE}><rect x="6" y="10" width="36" height="28" rx="3"/><line x1="6" y1="18" x2="42" y2="18"/><line x1="18" y1="10" x2="18" y2="38"/><circle cx="14" cy="26" r="2"/><circle cx="14" cy="32" r="2"/></svg>`;
const SYM_FOOD = `<svg ${SYM_BASE}><path d="M12 40V8h6v14h4V8h6v14h4V8h6v32"/><line x1="8" y1="40" x2="40" y2="40"/></svg>`;
const SYM_LEAN = `<svg ${SYM_BASE}><circle cx="24" cy="24" r="18"/><path d="M12 24h24M24 12v24"/><path d="M18 24l6-6 6 6M24 18l-6 6 6 6"/></svg>`;
const SYM_TEXTILE = `<svg ${SYM_BASE}><rect x="8" y="8" width="32" height="32" rx="2"/><line x1="8" y1="20" x2="40" y2="20"/><line x1="8" y1="28" x2="40" y2="28"/><line x1="20" y1="8" x2="20" y2="40"/><line x1="28" y1="8" x2="28" y2="40"/></svg>`;
const SYM_THERMAL = `<svg ${SYM_BASE}><circle cx="24" cy="24" r="14"/><path d="M24 10c-3 0-6 2-6 6 0 4 6 8 6 8s6-4 6-8c0-4-3-6-6-6z"/><path d="M14 36l24-24"/></svg>`;
const SYM_BOX = `<svg ${SYM_BASE}><rect x="6" y="14" width="36" height="24" rx="2"/><path d="M6 14l18 6 18-6"/><line x1="24" y1="20" x2="24" y2="38"/><line x1="12" y1="26" x2="16" y2="24"/><line x1="36" y1="26" x2="32" y2="24"/></svg>`;
const SYM_GLOBE = `<svg ${SYM_BASE}><circle cx="24" cy="24" r="18"/><ellipse cx="24" cy="24" rx="10" ry="18"/><line x1="6" y1="24" x2="42" y2="24"/><path d="M12 12c4-2 8-2 12 0s8 2 12 0M12 36c4 2 8 2 12 0s8-2 12 0"/></svg>`;
const SYM_FACTORY = `<svg ${SYM_BASE}><rect x="6" y="14" width="36" height="26" rx="2"/><line x1="6" y1="24" x2="42" y2="24"/><circle cx="16" cy="34" r="4"/><circle cx="32" cy="34" r="4"/><line x1="24" y1="14" x2="24" y2="24"/><path d="M24 10V6"/></svg>`;

/* --- New premium symbols for free-only categories (14 slugs) --- */
const SYM_MATH = `<svg ${SYM_BASE}><path d="M8 8h32v32H8z"/><path d="M16 16l16 16M32 16L16 32"/><circle cx="24" cy="24" r="3"/></svg>`;
const SYM_HEALTH = `<svg ${SYM_BASE}><path d="M24 8C14 8 8 16 8 24s6 16 16 16 16-8 16-16S34 8 24 8z"/><path d="M24 16v16M16 24h16"/></svg>`;
const SYM_CONVERSION = `<svg ${SYM_BASE}><rect x="6" y="18" width="16" height="20" rx="2"/><rect x="26" y="10" width="16" height="28" rx="2"/><line x1="22" y1="28" x2="26" y2="28"/><path d="M14 12v6M38 30v8"/></svg>`;
const SYM_AUTOMOTIVE = `<svg ${SYM_BASE}><rect x="6" y="24" width="36" height="14" rx="4"/><circle cx="16" cy="34" r="5"/><circle cx="32" cy="34" r="5"/><path d="M10 24l4-10h20l4 10"/><line x1="6" y1="28" x2="42" y2="28"/></svg>`;
const SYM_MARITIME = `<svg ${SYM_BASE}><path d="M8 28l8-16h16l8 16"/><rect x="4" y="28" width="40" height="12" rx="2"/><line x1="24" y1="12" x2="24" y2="6"/><path d="M14 18l10-6 10 6"/></svg>`;
const SYM_MINING = `<svg ${SYM_BASE}><path d="M8 36l6-24h20l6 24"/><line x1="14" y1="28" x2="34" y2="28"/><rect x="18" y="36" width="12" height="8"/><path d="M24 16v8M20 20h8"/><line x1="8" y1="44" x2="40" y2="44"/></svg>`;
const SYM_FURNITURE = `<svg ${SYM_BASE}><rect x="8" y="12" width="32" height="20" rx="2"/><rect x="14" y="32" width="6" height="10"/><rect x="28" y="32" width="6" height="10"/><line x1="8" y1="20" x2="40" y2="20"/><line x1="14" y1="26" x2="18" y2="26"/></svg>`;
const SYM_CLEANING = `<svg ${SYM_BASE}><rect x="18" y="6" width="12" height="32" rx="4"/><rect x="14" y="30" width="20" height="12" rx="2"/><path d="M28 12l8 4M28 16l8 6M28 20l6 8"/><circle cx="24" cy="38" r="2"/></svg>`;
const SYM_WATER = `<svg ${SYM_BASE}><path d="M24 6c-4 8-12 16-12 22 0 6.6 5.4 12 12 12s12-5.4 12-12c0-6-8-14-12-22z"/><line x1="18" y1="22" x2="30" y2="22"/><line x1="16" y1="28" x2="32" y2="28"/></svg>`;
const SYM_TOURISM = `<svg ${SYM_BASE}><circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="8"/><path d="M24 6v8M24 34v8M6 24h8M34 24h8"/><path d="M10 10l8 8M30 30l8 8M30 10l-8 8M10 30l8-8"/></svg>`;
const SYM_EDUCATION = `<svg ${SYM_BASE}><path d="M6 18l18-10 18 10-18 10z"/><path d="M6 18v14l18 10 18-10V18"/><line x1="12" y1="22" x2="12" y2="34"/><line x1="18" y1="19" x2="18" y2="31"/><line x1="30" y1="19" x2="30" y2="31"/><line x1="36" y1="22" x2="36" y2="34"/></svg>`;
const SYM_PROPERTY = `<svg ${SYM_BASE}><path d="M8 24l16-14 16 14"/><rect x="14" y="26" width="20" height="16" rx="1"/><rect x="20" y="30" width="8" height="12"/><rect x="32" y="8" width="8" height="10" rx="1"/><line x1="8" y1="40" x2="40" y2="40"/></svg>`;
const SYM_AERO = `<svg ${SYM_BASE}><ellipse cx="24" cy="24" rx="18" ry="8"/><line x1="24" y1="16" x2="24" y2="8"/><path d="M16 24l-8 16M32 24l8 16"/><line x1="14" y1="24" x2="34" y2="24"/><path d="M24 8c-4 0-8 4-8 8"/><path d="M24 8c4 0 8 4 8 8"/></svg>`;
const SYM_OTHER = `<svg ${SYM_BASE}><circle cx="24" cy="24" r="18"/><circle cx="18" cy="20" r="2.5"/><circle cx="24" cy="20" r="2.5"/><circle cx="30" cy="20" r="2.5"/><path d="M16 30c4-3 12-3 16 0"/></svg>`;

// ─── Category definitions ───────────────────────────────────────────────────

export const FREE_TOOL_CATEGORIES: readonly FreeToolCategoryEntry[] = [
  // ── 1. FINANCE ─────────────────────────────────────────────────────────────
  {
    slug: "finance-sales-working-capital",
    order: 1,
    icon: "Landmark",
    symbolSvg: SYM_FINANCE,
    title: {
      en: "Finance, Sales & Working Capital",
      tr: "Finans, Satış ve İşletme Sermayesi",
      de: "Finanzen, Vertrieb & Working Capital",
      fr: "Finance, ventes et fonds de roulement",
      es: "Finanzas, ventas y capital circulante",
      ar: "المالية والمبيعات ورأس المال العامل",
    },
    tagline: {
      en: "Budgeting, investment, pricing and cash-flow calculators for business finance.",
      tr: "Bütçeleme, yatırım, fiyatlama ve nakit akışı hesaplamaları.",
      de: "Budgetierung, Investition, Preisgestaltung und Cashflow-Rechner.",
      fr: "Budgétisation, investissement, tarification et flux de trésorerie.",
      es: "Presupuestos, inversiones, precios y flujo de caja.",
      ar: "الميزانية والاستثمار والتسعير والتدفق النقدي.",
    },
    field: {
      en: "Business & Economics",
      tr: "İşletme & Ekonomi",
      de: "Wirtschaft & Finanzen",
      fr: "Affaires et économie",
      es: "Negocios y economía",
      ar: "الأعمال والاقتصاد",
    },
    domain: {
      en: "Financial Services",
      tr: "Finansal Hizmetler",
      de: "Finanzdienstleistungen",
      fr: "Services financiers",
      es: "Servicios financieros",
      ar: "الخدمات المالية",
    },
    socialPurpose: {
      en: "Economic Empowerment",
      tr: "Ekonomik Güçlenme",
      de: "Wirtschaftliche Stärkung",
      fr: "Autonomisation économique",
      es: "Empoderamiento económico",
      ar: "التمكين الاقتصادي",
    },
  },

  // ── 2. QUALITY ─────────────────────────────────────────────────────────────
  {
    slug: "quality-six-sigma",
    order: 2,
    icon: "Sigma",
    symbolSvg: SYM_QUALITY,
    title: {
      en: "Quality, SPC & Six Sigma",
      tr: "Kalite, SPC ve Altı Sigma",
      de: "Qualität, SPC & Six Sigma",
      fr: "Qualité, SPC et Six Sigma",
      es: "Calidad, SPC y Seis Sigma",
      ar: "الجودة وSPC وسيغما الستة",
    },
    tagline: {
      en: "Process capability, control charts, defect analysis and quality cost tools.",
      tr: "Proses yeterliliği, kontrol grafikleri, hata analizi ve kalite maliyeti.",
      de: "Prozessfähigkeit, Regelkarten, Fehleranalyse und Qualitätskosten.",
      fr: "Capabilité processus, cartes de contrôle, analyse des défauts et coût qualité.",
      es: "Capacidad de proceso, gráficos de control, análisis de defectos y coste de calidad.",
      ar: "قدرة العملية وخرائط التحكم وتحليل العيوب وتكلفة الجودة.",
    },
    field: {
      en: "Quality Engineering",
      tr: "Kalite Mühendisliği",
      de: "Qualitätstechnik",
      fr: "Ingénierie qualité",
      es: "Ingeniería de calidad",
      ar: "هندسة الجودة",
    },
    domain: {
      en: "Process Management",
      tr: "Süreç Yönetimi",
      de: "Prozessmanagement",
      fr: "Gestion des processus",
      es: "Gestión de procesos",
      ar: "إدارة العمليات",
    },
    socialPurpose: {
      en: "Quality Culture & Zero Defects",
      tr: "Kalite Kültürü & Sıfır Hata",
      de: "Qualitätskultur & Null Fehler",
      fr: "Culture qualité et zéro défaut",
      es: "Cultura de calidad y cero defectos",
      ar: "ثقافة الجودة والعيوب الصفرية",
    },
  },

  // ── 3. TECHNOLOGY ──────────────────────────────────────────────────────────
  {
    slug: "technology-ai-cloud-cyber",
    order: 3,
    icon: "Monitor",
    symbolSvg: SYM_TECH,
    title: {
      en: "Technology, AI, Cloud & Cyber",
      tr: "Teknoloji, AI, Bulut ve Siber Güvenlik",
      de: "Technologie, KI, Cloud & Cyber",
      fr: "Technologie, IA, cloud et cyber",
      es: "Tecnología, IA, nube y ciberseguridad",
      ar: "التكنولوجيا والذكاء الاصطناعي والسحابة والأمن السيبراني",
    },
    tagline: {
      en: "IT infrastructure, cloud cost, cybersecurity, software and data tools.",
      tr: "BT altyapısı, bulut maliyeti, siber güvenlik, yazılım ve veri araçları.",
      de: "IT-Infrastruktur, Cloud-Kosten, Cybersicherheit, Software und Daten.",
      fr: "Infrastructure IT, coût cloud, cybersécurité, logiciels et données.",
      es: "Infraestructura TI, coste cloud, ciberseguridad, software y datos.",
      ar: "البنية التحتية لتقنية المعلومات وتكلفة السحابة والأمن السيبراني والبرمجيات والبيانات.",
    },
    field: {
      en: "Computer Sciences",
      tr: "Bilgisayar Bilimleri",
      de: "Informatik",
      fr: "Sciences informatiques",
      es: "Ciencias de la computación",
      ar: "علوم الحاسوب",
    },
    domain: {
      en: "Information Technology",
      tr: "Bilgi Teknolojisi",
      de: "Informationstechnologie",
      fr: "Technologie de l'information",
      es: "Tecnología de la información",
      ar: "تكنولوجيا المعلومات",
    },
    socialPurpose: {
      en: "Digital Inclusion & Literacy",
      tr: "Dijital Katılım & Okuryazarlık",
      de: "Digitale Inklusion & Kompetenz",
      fr: "Inclusion et littératie numériques",
      es: "Inclusión y alfabetización digital",
      ar: "الشمول الرقمي ومحو الأمية",
    },
  },

  // ── 4. ELECTRICAL ──────────────────────────────────────────────────────────
  {
    slug: "electrical-power-systems",
    order: 4,
    icon: "Zap",
    symbolSvg: SYM_ELECTRIC,
    title: {
      en: "Electrical, Panel & Power Systems",
      tr: "Elektrik, Pano ve Güç Sistemleri",
      de: "Elektrik, Schaltschrank & Energiesysteme",
      fr: "Électricité, armoires et systèmes d'alimentation",
      es: "Electricidad, cuadros y sistemas de potencia",
      ar: "الأنظمة الكهربائية واللوحات والطاقة",
    },
    tagline: {
      en: "Electrical engineering, power distribution, panel design and cable sizing.",
      tr: "Elektrik mühendisliği, güç dağıtımı, pano tasarımı ve kablo kesiti.",
      de: "Elektrotechnik, Energieverteilung, Schaltschrankauslegung und Kabelbemessung.",
      fr: "Génie électrique, distribution d'énergie, conception d'armoires et section de câbles.",
      es: "Ingeniería eléctrica, distribución de energía, diseño de cuadros y sección de cables.",
      ar: "الهندسة الكهربائية وتوزيع الطاقة وتصميم اللوحات وتحديد مقطع الكابل.",
    },
    field: {
      en: "Electrical Engineering",
      tr: "Elektrik Mühendisliği",
      de: "Elektrotechnik",
      fr: "Génie électrique",
      es: "Ingeniería eléctrica",
      ar: "الهندسة الكهربائية",
    },
    domain: {
      en: "Power Systems",
      tr: "Güç Sistemleri",
      de: "Energiesysteme",
      fr: "Systèmes d'alimentation",
      es: "Sistemas de potencia",
      ar: "أنظمة الطاقة",
    },
    socialPurpose: {
      en: "Energy Access & Efficiency",
      tr: "Enerji Erişimi & Verimliliği",
      de: "Energiezugang & Effizienz",
      fr: "Accès à l'énergie et efficacité",
      es: "Acceso a la energía y eficiencia",
      ar: "الوصول إلى الطاقة والكفاءة",
    },
  },

  // ── 5. SUSTAINABILITY ─────────────────────────────────────────────────────
  {
    slug: "sustainability-resource-esg",
    order: 5,
    icon: "Leaf",
    symbolSvg: SYM_LEAF,
    title: {
      en: "Environment, Resources & ESG",
      tr: "Çevre, Kaynak ve Sürdürülebilirlik",
      de: "Umwelt, Ressourcen & ESG",
      fr: "Environnement, ressources et ESG",
      es: "Medio ambiente, recursos y ESG",
      ar: "البيئة والموارد والاستدامة",
    },
    tagline: {
      en: "Carbon footprint, waste, water, energy efficiency and ESG compliance tools.",
      tr: "Karbon ayak izi, atık, su, enerji verimliliği ve ESG uyum araçları.",
      de: "CO₂-Bilanz, Abfall, Wasser, Energieeffizienz und ESG-Compliance.",
      fr: "Empreinte carbone, déchets, eau, efficacité énergétique et conformité ESG.",
      es: "Huella de carbono, residuos, agua, eficiencia energética y cumplimiento ESG.",
      ar: "البصمة الكربونية والنفايات والمياه وكفاءة الطاقة والامتثال البيئي والاجتماعي والحوكمة.",
    },
    field: {
      en: "Environmental Sciences",
      tr: "Çevre Bilimleri",
      de: "Umweltwissenschaften",
      fr: "Sciences de l'environnement",
      es: "Ciencias ambientales",
      ar: "العلوم البيئية",
    },
    domain: {
      en: "Sustainable Energy & Environment",
      tr: "Sürdürülebilir Enerji & Çevre",
      de: "Nachhaltige Energie & Umwelt",
      fr: "Énergie durable et environnement",
      es: "Energía sostenible y medio ambiente",
      ar: "الطاقة المستدامة والبيئة",
    },
    socialPurpose: {
      en: "Climate Action & Sustainability",
      tr: "İklim Eylemi & Sürdürülebilirlik",
      de: "Klimaschutz & Nachhaltigkeit",
      fr: "Action climatique et durabilité",
      es: "Acción climática y sostenibilidad",
      ar: "العمل المناخي والاستدامة",
    },
  },

  // ── 6. CNC MANUFACTURING ──────────────────────────────────────────────────
  {
    slug: "cnc-additive-manufacturing",
    order: 6,
    icon: "Cog",
    symbolSvg: SYM_CNC,
    title: {
      en: "CNC, 3D Printing & Advanced Manufacturing",
      tr: "CNC, 3B Baskı ve İleri İmalat",
      de: "CNC, 3D-Druck & Advanced Manufacturing",
      fr: "CNC, impression 3D et fabrication avancée",
      es: "CNC, impresión 3D y fabricación avanzada",
      ar: "CNC والطباعة ثلاثية الأبعاد والتصنيع المتقدم",
    },
    tagline: {
      en: "Machining parameters, tool life, 3D print cost and advanced process calculators.",
      tr: "İşleme parametreleri, takım ömrü, 3B baskı maliyeti ve ileri proses hesaplamaları.",
      de: "Bearbeitungsparameter, Werkzeugstandzeit, 3D-Druckkosten und fortschrittliche Prozesse.",
      fr: "Paramètres d'usinage, durée d'outil, coût d'impression 3D et procédés avancés.",
      es: "Parámetros de mecanizado, vida útil de la herramienta, coste de impresión 3D y procesos avanzados.",
      ar: "معلمات التشغيل وعمر الأداة وتكلفة الطباعة ثلاثية الأبعاد والعمليات المتقدمة.",
    },
    field: {
      en: "Manufacturing Engineering",
      tr: "İmalat Mühendisliği",
      de: "Fertigungstechnik",
      fr: "Génie de fabrication",
      es: "Ingeniería de fabricación",
      ar: "هندسة التصنيع",
    },
    domain: {
      en: "Advanced Manufacturing",
      tr: "İleri İmalat",
      de: "Fortschrittliche Fertigung",
      fr: "Fabrication avancée",
      es: "Fabricación avanzada",
      ar: "التصنيع المتقدم",
    },
    socialPurpose: {
      en: "Industrial Innovation & Precision",
      tr: "Endüstriyel İnovasyon & Hassasiyet",
      de: "Industrielle Innovation & Präzision",
      fr: "Innovation industrielle et précision",
      es: "Innovación industrial y precisión",
      ar: "الابتكار الصناعي والدقة",
    },
  },

  // ── 7. METALS & PLASTICS ──────────────────────────────────────────────────
  {
    slug: "metal-plastics-forming",
    order: 7,
    icon: "Anvil",
    symbolSvg: SYM_METAL,
    title: {
      en: "Metals, Plastics & Forming",
      tr: "Metal, Plastik ve Şekillendirme",
      de: "Metall, Kunststoff & Umformung",
      fr: "Métaux, plastiques et formage",
      es: "Metales, plásticos y conformado",
      ar: "المعادن والبلاستيك والتشكيل",
    },
    tagline: {
      en: "Sheet metal, casting, injection molding, forging and material forming tools.",
      tr: "Sac metal, döküm, enjeksiyon kalıplama, dövme ve malzeme şekillendirme.",
      de: "Blech, Guss, Spritzguss, Schmieden und Umformung.",
      fr: "Tôle, fonderie, moulage par injection, forgeage et formage des matériaux.",
      es: "Chapa, fundición, moldeo por inyección, forja y conformado de materiales.",
      ar: "الصفائح المعدنية والسبك والقولبة بالحقن والحدادة وتشكيل المواد.",
    },
    field: {
      en: "Materials Science & Engineering",
      tr: "Malzeme Bilimi & Mühendisliği",
      de: "Materialwissenschaft & Werkstofftechnik",
      fr: "Science et génie des matériaux",
      es: "Ciencia e ingeniería de materiales",
      ar: "علوم وهندسة المواد",
    },
    domain: {
      en: "Metal & Plastics Industry",
      tr: "Metal & Plastik Endüstrisi",
      de: "Metall- & Kunststoffindustrie",
      fr: "Industrie métallurgique et plastique",
      es: "Industria del metal y el plástico",
      ar: "صناعة المعادن والبلاستيك",
    },
    socialPurpose: {
      en: "Material Efficiency & Circular Economy",
      tr: "Malzeme Verimliliği & Döngüsel Ekonomi",
      de: "Materialeffizienz & Kreislaufwirtschaft",
      fr: "Efficacité des matériaux et économie circulaire",
      es: "Eficiencia de materiales y economía circular",
      ar: "كفاءة المواد والاقتصاد الدائري",
    },
  },

  // ── 8. CHEMISTRY ──────────────────────────────────────────────────────────
  {
    slug: "process-chemical",
    order: 8,
    icon: "FlaskConical",
    symbolSvg: SYM_PROCESS,
    title: {
      en: "Chemistry, Process & Fluids",
      tr: "Kimya, Proses ve Akışkanlar",
      de: "Chemie, Prozess & Fluide",
      fr: "Chimie, procédés et fluides",
      es: "Química, proceso y fluidos",
      ar: "الكيمياء والعمليات والموائع",
    },
    tagline: {
      en: "Chemical reactions, fluid dynamics, thermodynamics and process engineering.",
      tr: "Kimyasal reaksiyonlar, akışkanlar dinamiği, termodinamik ve proses mühendisliği.",
      de: "Chemische Reaktionen, Fluiddynamik, Thermodynamik und Verfahrenstechnik.",
      fr: "Réactions chimiques, dynamique des fluides, thermodynamique et génie des procédés.",
      es: "Reacciones químicas, dinámica de fluidos, termodinámica e ingeniería de procesos.",
      ar: "التفاعلات الكيميائية وديناميكا الموائع والديناميكا الحرارية وهندسة العمليات.",
    },
    field: {
      en: "Chemical Sciences",
      tr: "Kimya Bilimleri",
      de: "Chemie",
      fr: "Sciences chimiques",
      es: "Ciencias químicas",
      ar: "العلوم الكيميائية",
    },
    domain: {
      en: "Chemical & Process Engineering",
      tr: "Kimya & Proses Mühendisliği",
      de: "Chemie- & Verfahrenstechnik",
      fr: "Génie chimique et des procédés",
      es: "Ingeniería química y de procesos",
      ar: "الهندسة الكيميائية وهندسة العمليات",
    },
    socialPurpose: {
      en: "Chemical Safety & Green Chemistry",
      tr: "Kimyasal Güvenlik & Yeşil Kimya",
      de: "Chemikaliensicherheit & Grüne Chemie",
      fr: "Sécurité chimique et chimie verte",
      es: "Seguridad química y química verde",
      ar: "السلامة الكيميائية والكيمياء الخضراء",
    },
  },

  // ── 9. HSE ─────────────────────────────────────────────────────────────────
  {
    slug: "hse-ergonomics",
    order: 9,
    icon: "ShieldAlert",
    symbolSvg: SYM_HSE,
    title: {
      en: "HSE, Ergonomics & Risk",
      tr: "İSG, Ergonomi ve Risk Yönetimi",
      de: "HSE, Ergonomie & Risiko",
      fr: "HSE, ergonomie et risque",
      es: "HSE, ergonomía y riesgo",
      ar: "السلامة والصحة المهنية وعلم الإنسان والمخاطر",
    },
    tagline: {
      en: "Occupational safety, ergonomic risk, noise, vibration and hazard analysis.",
      tr: "İş sağlığı ve güvenliği, ergonomik risk, gürültü, titreşim ve tehlike analizi.",
      de: "Arbeitssicherheit, ergonomisches Risiko, Lärm, Vibration und Gefahrenanalyse.",
      fr: "Sécurité au travail, risque ergonomique, bruit, vibration et analyse des dangers.",
      es: "Seguridad laboral, riesgo ergonómico, ruido, vibración y análisis de peligros.",
      ar: "السلامة المهنية والمخاطر المريحة والضوضاء والاهتزاز وتحليل المخاطر.",
    },
    field: {
      en: "Occupational Health & Safety",
      tr: "İş Sağlığı & Güvenliği",
      de: "Arbeitssicherheit & Gesundheitsschutz",
      fr: "Santé et sécurité au travail",
      es: "Salud y seguridad ocupacional",
      ar: "الصحة والسلامة المهنية",
    },
    domain: {
      en: "HSE Management",
      tr: "İSG Yönetimi",
      de: "HSE-Management",
      fr: "Gestion HSE",
      es: "Gestión HSE",
      ar: "إدارة الصحة والسلامة والبيئة",
    },
    socialPurpose: {
      en: "Workplace Safety & Worker Protection",
      tr: "İş Yeri Güvenliği & Çalışan Koruma",
      de: "Arbeitsplatzsicherheit & Arbeitnehmerschutz",
      fr: "Sécurité au travail et protection des travailleurs",
      es: "Seguridad laboral y protección del trabajador",
      ar: "سلامة مكان العمل وحماية العمال",
    },
  },

  // ── 10. MAINTENANCE ──────────────────────────────────────────────────────
  {
    slug: "maintenance-reliability",
    order: 10,
    icon: "Wrench",
    symbolSvg: SYM_MAINTENANCE,
    title: {
      en: "Maintenance & Reliability",
      tr: "Bakım, Arıza ve Güvenilirlik",
      de: "Instandhaltung & Zuverlässigkeit",
      fr: "Maintenance et fiabilité",
      es: "Mantenimiento y fiabilidad",
      ar: "الصيانة والموثوقية",
    },
    tagline: {
      en: "MTBF/MTTR, preventive maintenance, spare part optimization and RCA tools.",
      tr: "MTBF/MTTR, koruyucu bakım, yedek parça optimizasyonu ve kök neden analizi.",
      de: "MTBF/MTTR, vorbeugende Instandhaltung, Ersatzteiloptimierung und Ursachenanalyse.",
      fr: "MTBF/MTTR, maintenance préventive, optimisation des pièces de rechange et analyse des causes.",
      es: "MTBF/MTTR, mantenimiento preventivo, optimización de repuestos y análisis de causa raíz.",
      ar: "MTBF/MTTR والصيانة الوقائية وتحسين قطع الغيار وتحليل السبب الجذري.",
    },
    field: {
      en: "Industrial Engineering",
      tr: "Endüstri Mühendisliği",
      de: "Industrietechnik",
      fr: "Génie industriel",
      es: "Ingeniería industrial",
      ar: "الهندسة الصناعية",
    },
    domain: {
      en: "Asset Management",
      tr: "Varlık Yönetimi",
      de: "Anlagenmanagement",
      fr: "Gestion d'actifs",
      es: "Gestión de activos",
      ar: "إدارة الأصول",
    },
    socialPurpose: {
      en: "Operational Excellence & Reliability",
      tr: "Operasyonel Mükemmellik & Güvenilirlik",
      de: "Operative Exzellenz & Zuverlässigkeit",
      fr: "Excellence opérationnelle et fiabilité",
      es: "Excelencia operativa y fiabilidad",
      ar: "التميز التشغيلي والموثوقية",
    },
  },

  // ── 11. CONSTRUCTION ─────────────────────────────────────────────────────
  {
    slug: "project-construction-management",
    order: 11,
    icon: "HardHat",
    symbolSvg: SYM_PROJECT,
    title: {
      en: "Construction & Project Management",
      tr: "İnşaat ve Proje Yönetimi",
      de: "Bau & Projektmanagement",
      fr: "Construction et gestion de projet",
      es: "Construcción y gestión de proyectos",
      ar: "البناء وإدارة المشاريع",
    },
    tagline: {
      en: "Site management, EVM, CPM, structural analysis and construction cost tools.",
      tr: "Şantiye yönetimi, EVM, CPM, yapısal analiz ve inşaat maliyeti hesaplamaları.",
      de: "Baustellenmanagement, EVM, CPM, Tragwerksanalyse und Baukostenrechner.",
      fr: "Gestion de chantier, EVM, CPM, analyse structurelle et coûts de construction.",
      es: "Gestión de obra, EVM, CPM, análisis estructural y costes de construcción.",
      ar: "إدارة المواقع و EVM و CPM والتحليل الإنشائي وتكاليف البناء.",
    },
    field: {
      en: "Civil & Structural Engineering",
      tr: "İnşaat & Yapı Mühendisliği",
      de: "Bau- & Strukturtechnik",
      fr: "Génie civil et structurel",
      es: "Ingeniería civil y estructural",
      ar: "الهندسة المدنية والإنشائية",
    },
    domain: {
      en: "Construction Industry",
      tr: "İnşaat Sektörü",
      de: "Bauindustrie",
      fr: "Industrie de la construction",
      es: "Industria de la construcción",
      ar: "صناعة البناء",
    },
    socialPurpose: {
      en: "Infrastructure Development & Safety",
      tr: "Altyapı Geliştirme & Güvenlik",
      de: "Infrastrukturentwicklung & Sicherheit",
      fr: "Développement des infrastructures et sécurité",
      es: "Desarrollo de infraestructuras y seguridad",
      ar: "تطوير البنية التحتية والسلامة",
    },
  },

  // ── 12. HR ──────────────────────────────────────────────────────────────
  {
    slug: "workforce-hr",
    order: 12,
    icon: "Users",
    symbolSvg: SYM_WORKFORCE,
    title: {
      en: "Workforce, Shift & HR",
      tr: "İş Gücü, Vardiya ve İnsan Kaynakları",
      de: "Belegschaft, Schicht & Personal",
      fr: "Effectifs, équipes et RH",
      es: "Plantilla, turnos y RR. HH.",
      ar: "القوى العاملة والورديات والموارد البشرية",
    },
    tagline: {
      en: "Personnel cost, shift planning, overtime, turnover and HR analytics.",
      tr: "Personel maliyeti, vardiya planlama, fazla mesai, iş gücü devri ve İK analitiği.",
      de: "Personalkosten, Schichtplanung, Überstunden, Fluktuation und HR-Analytik.",
      fr: "Coût du personnel, planification des équipes, heures sup, turnover et analytics RH.",
      es: "Coste de personal, planificación de turnos, horas extra, rotación y analítica de RR. HH.",
      ar: "تكلفة الموظفين وتخطيط الورديات والعمل الإضافي ودوران الموظفين وتحليلات الموارد البشرية.",
    },
    field: {
      en: "Human Resources Management",
      tr: "İnsan Kaynakları Yönetimi",
      de: "Personalmanagement",
      fr: "Gestion des ressources humaines",
      es: "Gestión de recursos humanos",
      ar: "إدارة الموارد البشرية",
    },
    domain: {
      en: "Workforce & Employment",
      tr: "İş Gücü & İstihdam",
      de: "Belegschaft & Beschäftigung",
      fr: "Effectifs et emploi",
      es: "Plantilla y empleo",
      ar: "القوى العاملة والتوظيف",
    },
    socialPurpose: {
      en: "Fair Labor & Decent Work",
      tr: "Adil İşgücü & İnsana Yakışır İş",
      de: "Faire Arbeit & menschenwürdige Arbeit",
      fr: "Travail équitable et travail décent",
      es: "Trabajo justo y trabajo decente",
      ar: "العمل العادل والعمل اللائق",
    },
  },

  // ── 13. SUPPLY CHAIN ─────────────────────────────────────────────────────
  {
    slug: "procurement-supply-chain",
    order: 13,
    icon: "Warehouse",
    symbolSvg: SYM_PROCUREMENT,
    title: {
      en: "Procurement, Supply Chain & Logistics",
      tr: "Tedarik, Satınalma ve Lojistik",
      de: "Beschaffung, Lieferkette & Logistik",
      fr: "Achats, chaîne d'approvisionnement et logistique",
      es: "Compras, cadena de suministro y logística",
      ar: "المشتريات وسلسلة التوريد واللوجستيات",
    },
    tagline: {
      en: "Inventory, EOQ, warehouse, transportation, supplier cost and route optimization.",
      tr: "Envanter, EOQ, depo, nakliye, tedarikçi maliyeti ve rota optimizasyonu.",
      de: "Lagerbestand, EOQ, Lager, Transport, Lieferantenkosten und Routenoptimierung.",
      fr: "Stock, EOQ, entrepôt, transport, coût fournisseur et optimisation d'itinéraire.",
      es: "Inventario, EOQ, almacén, transporte, coste de proveedor y optimización de rutas.",
      ar: "المخزون و EOQ والمستودع والنقل وتكلفة المورد وتحسين المسار.",
    },
    field: {
      en: "Supply Chain Management",
      tr: "Tedarik Zinciri Yönetimi",
      de: "Lieferkettenmanagement",
      fr: "Gestion de la chaîne d'approvisionnement",
      es: "Gestión de la cadena de suministro",
      ar: "إدارة سلسلة التوريد",
    },
    domain: {
      en: "Logistics & Transportation",
      tr: "Lojistik & Taşımacılık",
      de: "Logistik & Transport",
      fr: "Logistique et transport",
      es: "Logística y transporte",
      ar: "اللوجستيات والنقل",
    },
    socialPurpose: {
      en: "Efficient Trade & Commerce",
      tr: "Verimli Ticaret & Ticaret",
      de: "Effizienter Handel & Gewerbe",
      fr: "Commerce et échanges efficaces",
      es: "Comercio e intercambio eficientes",
      ar: "التجارة والتبادل التجاري الفعال",
    },
  },

  // ── 14. FOOD ──────────────────────────────────────────────────────────────
  {
    slug: "food-cold-chain-hygiene",
    order: 14,
    icon: "Salad",
    symbolSvg: SYM_FOOD,
    title: {
      en: "Food, Cold Chain & Hygiene",
      tr: "Gıda, Soğuk Zincir ve Hijyen",
      de: "Lebensmittel, Kühlkette & Hygiene",
      fr: "Alimentation, chaîne du froid et hygiène",
      es: "Alimentación, cadena de frío e higiene",
      ar: "الغذاء وسلسلة التبريد والنظافة",
    },
    tagline: {
      en: "Recipe cost, shelf life, HACCP, cold chain and food safety calculators.",
      tr: "Reçete maliyeti, raf ömrü, HACCP, soğuk zincir ve gıda güvenliği hesaplamaları.",
      de: "Rezeptkosten, Haltbarkeit, HACCP, Kühlkette und Lebensmittelsicherheit.",
      fr: "Coût de recette, durée de conservation, HACCP, chaîne du froid et sécurité alimentaire.",
      es: "Coste de receta, vida útil, HACCP, cadena de frío y seguridad alimentaria.",
      ar: "تكلفة الوصفة ومدة الصلاحية و HACCP وسلسلة التبريد وسلامة الغذاء.",
    },
    field: {
      en: "Food Science & Technology",
      tr: "Gıda Bilimi & Teknolojisi",
      de: "Lebensmittelwissenschaft & -technologie",
      fr: "Science et technologie alimentaires",
      es: "Ciencia y tecnología de los alimentos",
      ar: "علوم وتكنولوجيا الأغذية",
    },
    domain: {
      en: "Food & Beverage Industry",
      tr: "Gıda & İçecek Sektörü",
      de: "Lebensmittel- & Getränkeindustrie",
      fr: "Industrie agroalimentaire",
      es: "Industria de alimentos y bebidas",
      ar: "صناعة الأغذية والمشروبات",
    },
    socialPurpose: {
      en: "Food Security & Safety",
      tr: "Gıda Güvenliği & Emniyeti",
      de: "Lebensmittelsicherheit & -schutz",
      fr: "Sécurité et sûreté alimentaires",
      es: "Seguridad alimentaria",
      ar: "الأمن الغذائي والسلامة",
    },
  },

  // ── 15. LEAN ──────────────────────────────────────────────────────────────
  {
    slug: "lean-production",
    order: 15,
    icon: "ArrowLeftRight",
    symbolSvg: SYM_LEAN,
    title: {
      en: "Efficiency, Lean & OEE",
      tr: "Verimlilik, Yalın Üretim ve OEE",
      de: "Effizienz, Lean & OEE",
      fr: "Efficacité, lean et OEE",
      es: "Eficiencia, lean y OEE",
      ar: "الكفاءة والتصنيع الرشيق و OEE",
    },
    tagline: {
      en: "OEE, SMED, Kaizen, Kanban, 5S, VSM and productivity improvement tools.",
      tr: "OEE, SMED, Kaizen, Kanban, 5S, VSM ve verimlilik iyileştirme araçları.",
      de: "OEE, SMED, Kaizen, Kanban, 5S, VSM und Produktivitätswerkzeuge.",
      fr: "OEE, SMED, Kaizen, Kanban, 5S, VSM et outils d'amélioration de la productivité.",
      es: "OEE, SMED, Kaizen, Kanban, 5S, VSM y herramientas de mejora de productividad.",
      ar: "OEE و SMED و كايزن و كانبان و 5S و VSM وأدوات تحسين الإنتاجية.",
    },
    field: {
      en: "Industrial Engineering",
      tr: "Endüstri Mühendisliği",
      de: "Industrietechnik",
      fr: "Génie industriel",
      es: "Ingeniería industrial",
      ar: "الهندسة الصناعية",
    },
    domain: {
      en: "Manufacturing & Production",
      tr: "İmalat & Üretim",
      de: "Fertigung & Produktion",
      fr: "Fabrication et production",
      es: "Fabricación y producción",
      ar: "التصنيع والإنتاج",
    },
    socialPurpose: {
      en: "Productivity & Operational Efficiency",
      tr: "Verimlilik & Operasyonel Etkinlik",
      de: "Produktivität & Betriebseffizienz",
      fr: "Productivité et efficacité opérationnelle",
      es: "Productividad y eficiencia operativa",
      ar: "الإنتاجية والكفاءة التشغيلية",
    },
  },

  // ── 16. TEXTILE ─────────────────────────────────────────────────────────
  {
    slug: "textile-print-lab",
    order: 16,
    icon: "Shirt",
    symbolSvg: SYM_TEXTILE,
    title: {
      en: "Textile, Printing & Laboratory",
      tr: "Tekstil, Baskı ve Laboratuvar",
      de: "Textil, Druck & Labor",
      fr: "Textile, impression et laboratoire",
      es: "Textil, impresión y laboratorio",
      ar: "المنسوجات والطباعة والمختبر",
    },
    tagline: {
      en: "Fabric, garment, printing, dyeing and laboratory analysis calculators.",
      tr: "Kumaş, konfeksiyon, baskı, boya ve laboratuvar analiz hesaplamaları.",
      de: "Stoff, Bekleidung, Druck, Färben und Laboranalyse-Rechner.",
      fr: "Tissu, vêtement, impression, teinture et analyse de laboratoire.",
      es: "Tejido, prenda, impresión, teñido y análisis de laboratorio.",
      ar: "حاسبات النسيج والملابس والطباعة والصباغة والتحليل المخبري.",
    },
    field: {
      en: "Textile Engineering",
      tr: "Tekstil Mühendisliği",
      de: "Textiltechnik",
      fr: "Génie textile",
      es: "Ingeniería textil",
      ar: "هندسة النسيج",
    },
    domain: {
      en: "Textile & Apparel Industry",
      tr: "Tekstil & Konfeksiyon Sektörü",
      de: "Textil- & Bekleidungsindustrie",
      fr: "Industrie textile et de l'habillement",
      es: "Industria textil y de la confección",
      ar: "صناعة النسيج والملابس",
    },
    socialPurpose: {
      en: "Sustainable Fashion & Textile Innovation",
      tr: "Sürdürülebilir Moda & Tekstil İnovasyonu",
      de: "Nachhaltige Mode & Textilinnovation",
      fr: "Mode durable et innovation textile",
      es: "Moda sostenible e innovación textil",
      ar: "الموضة المستدامة والابتكار في النسيج",
    },
  },

  // ── 17. HVAC-MECHANICAL ──────────────────────────────────────────────────
  {
    slug: "mechanical-hvac-energy-loss",
    order: 17,
    icon: "Thermometer",
    symbolSvg: SYM_THERMAL,
    title: {
      en: "Mechanical, HVAC & Energy Loss",
      tr: "Mekanik, HVAC ve Enerji Kayıpları",
      de: "Mechanik, HVAC & Energieverlust",
      fr: "Mécanique, CVC et pertes énergétiques",
      es: "Mecánica, HVAC y pérdida energética",
      ar: "الميكانيكا والتدفئة والتهوية وتكييف الهواء وفقدان الطاقة",
    },
    tagline: {
      en: "HVAC load, insulation, welding, piping, steam and mechanical system losses.",
      tr: "HVAC yükü, yalıtım, kaynak, boru tesisatı, buhar ve mekanik sistem kayıpları.",
      de: "HVAC-Last, Dämmung, Schweißen, Rohrleitungen, Dampf und mechanische Verluste.",
      fr: "Charge CVC, isolation, soudure, tuyauterie, vapeur et pertes mécaniques.",
      es: "Carga HVAC, aislamiento, soldadura, tuberías, vapor y pérdidas mecánicas.",
      ar: "حمل التدفئة والتهوية وتكييف الهواء والعزل واللحام والأنابيب والبخار والفقد الميكانيكي.",
    },
    field: {
      en: "Mechanical Engineering",
      tr: "Makine Mühendisliği",
      de: "Maschinenbau",
      fr: "Génie mécanique",
      es: "Ingeniería mecánica",
      ar: "الهندسة الميكانيكية",
    },
    domain: {
      en: "HVAC & Mechanical Systems",
      tr: "HVAC & Mekanik Sistemler",
      de: "HLK & mechanische Systeme",
      fr: "CVC et systèmes mécaniques",
      es: "Climatización y sistemas mecánicos",
      ar: "أنظمة التدفئة والتهوية وتكييف الهواء والأنظمة الميكانيكية",
    },
    socialPurpose: {
      en: "Energy Efficiency & Thermal Comfort",
      tr: "Enerji Verimliliği & Termal Konfor",
      de: "Energieeffizienz & thermischer Komfort",
      fr: "Efficacité énergétique et confort thermique",
      es: "Eficiencia energética y confort térmico",
      ar: "كفاءة الطاقة والراحة الحرارية",
    },
  },

  // ── 18. PACKAGING ───────────────────────────────────────────────────────
  {
    slug: "packaging-local-business",
    order: 18,
    icon: "Package",
    symbolSvg: SYM_BOX,
    title: {
      en: "Packaging & Local Business Tools",
      tr: "Ambalaj ve Yerel İşletme Araçları",
      de: "Verpackung & lokale Geschäftstools",
      fr: "Emballage et outils métier locaux",
      es: "Embalaje y herramientas de negocio local",
      ar: "التعبئة وأدوات الأعمال المحلية",
    },
    tagline: {
      en: "Packaging volume, pallet config, material selection and local service pricing.",
      tr: "Ambalaj hacmi, palet konfigürasyonu, malzeme seçimi ve yerel hizmet fiyatlama.",
      de: "Verpackungsvolumen, Palettenkonfiguration, Materialauswahl und lokale Preisgestaltung.",
      fr: "Volume d'emballage, configuration palette, sélection matériaux et tarification locale.",
      es: "Volumen de embalaje, configuración de palé, selección de materiales y precios locales.",
      ar: "حجم التغليف وتكوين البالتة واختيار المواد وتسعير الخدمات المحلية.",
    },
    field: {
      en: "Packaging Engineering",
      tr: "Ambalaj Mühendisliği",
      de: "Verpackungstechnik",
      fr: "Ingénierie de l'emballage",
      es: "Ingeniería del embalaje",
      ar: "هندسة التغليف",
    },
    domain: {
      en: "Print & Packaging Industry",
      tr: "Baskı & Ambalaj Sektörü",
      de: "Druck- & Verpackungsindustrie",
      fr: "Industrie de l'impression et de l'emballage",
      es: "Industria de la impresión y el embalaje",
      ar: "صناعة الطباعة والتغليف",
    },
    socialPurpose: {
      en: "Sustainable Packaging & Waste Reduction",
      tr: "Sürdürülebilir Ambalaj & Atık Azaltma",
      de: "Nachhaltige Verpackung & Abfallreduzierung",
      fr: "Emballage durable et réduction des déchets",
      es: "Embalaje sostenible y reducción de residuos",
      ar: "التغليف المستدام وتقليل النفايات",
    },
  },

  // ── 19. GLOBAL TRADE ─────────────────────────────────────────────────────
  {
    slug: "global-compliance-trade",
    order: 19,
    icon: "Globe",
    symbolSvg: SYM_GLOBE,
    title: {
      en: "Global Trade, Compliance & Tax",
      tr: "Küresel Ticaret, Uyum ve Vergi",
      de: "Globaler Handel, Compliance & Steuern",
      fr: "Commerce mondial, conformité et fiscalité",
      es: "Comercio global, cumplimiento e impuestos",
      ar: "التجارة العالمية والامتثال والضرائب",
    },
    tagline: {
      en: "Customs, incoterms, transfer pricing, IFRS, AML and cross-border trade tools.",
      tr: "Gümrük, incoterms, transfer fiyatlandırması, IFRS, AML ve sınır ötesi ticaret.",
      de: "Zoll, Incoterms, Verrechnungspreise, IFRS, AML und grenzüberschreitender Handel.",
      fr: "Douane, incoterms, prix de transfert, IFRS, LBC et commerce transfrontalier.",
      es: "Aduanas, incoterms, precios de transferencia, IFRS, AML y comercio transfronterizo.",
      ar: "الجمارك والشروط التجارية والتسعير التحويلي والمعايير الدولية ومكافحة غسل الأموال والتجارة عبر الحدود.",
    },
    field: {
      en: "International Business & Law",
      tr: "Uluslararası İşletme & Hukuk",
      de: "Internationales Geschäft & Recht",
      fr: "Affaires internationales et droit",
      es: "Negocios internacionales y derecho",
      ar: "الأعمال التجارية الدولية والقانون",
    },
    domain: {
      en: "Global Trade & Compliance",
      tr: "Küresel Ticaret & Uyum",
      de: "Globaler Handel & Compliance",
      fr: "Commerce mondial et conformité",
      es: "Comercio global y cumplimiento",
      ar: "التجارة العالمية والامتثال",
    },
    socialPurpose: {
      en: "Fair Trade & Regulatory Compliance",
      tr: "Adil Ticaret & Mevzuata Uyum",
      de: "Fairer Handel & regulatorische Compliance",
      fr: "Commerce équitable et conformité réglementaire",
      es: "Comercio justo y cumplimiento normativo",
      ar: "التجارة العادلة والامتثال التنظيمي",
    },
  },

  // ── 20. AUTOMATION ──────────────────────────────────────────────────────
  {
    slug: "digital-factory-automation",
    order: 20,
    icon: "Cpu",
    symbolSvg: SYM_FACTORY,
    title: {
      en: "Automation & Digital Factory",
      tr: "Otomasyon ve Dijital Fabrika",
      de: "Automatisierung & digitale Fabrik",
      fr: "Automatisation et usine numérique",
      es: "Automatización y fábrica digital",
      ar: "الأتمتة والمصنع الرقمي",
    },
    tagline: {
      en: "IoT, robotics, AGV, digital twin, SCADA and industry 4.0 calculators.",
      tr: "IoT, robotik, AGV, dijital ikiz, SCADA ve endüstri 4.0 hesaplamaları.",
      de: "IoT, Robotik, AGV, digitaler Zwilling, SCADA und Industrie 4.0-Rechner.",
      fr: "IoT, robotique, AGV, jumeau numérique, SCADA et Industrie 4.0.",
      es: "IoT, robótica, AGV, gemelo digital, SCADA e Industria 4.0.",
      ar: "إنترنت الأشياء والروبوتات والمركبات الموجهة الآلية والتوأم الرقمي و SCADA والصناعة 4.0.",
    },
    field: {
      en: "Automation & Control Engineering",
      tr: "Otomasyon & Kontrol Mühendisliği",
      de: "Automatisierungs- & Steuerungstechnik",
      fr: "Génie de l'automatisation et du contrôle",
      es: "Ingeniería de automatización y control",
      ar: "هندسة الأتمتة والتحكم",
    },
    domain: {
      en: "Industrial Automation",
      tr: "Endüstriyel Otomasyon",
      de: "Industrielle Automatisierung",
      fr: "Automatisation industrielle",
      es: "Automatización industrial",
      ar: "الأتمتة الصناعية",
    },
    socialPurpose: {
      en: "Industry 4.0 & Smart Manufacturing",
      tr: "Endüstri 4.0 & Akıllı Üretim",
      de: "Industrie 4.0 & intelligente Fertigung",
      fr: "Industrie 4.0 et fabrication intelligente",
      es: "Industria 4.0 y fabricación inteligente",
      ar: "الصناعة 4.0 والتصنيع الذكي",
    },
  },

  // ── 21. MATHEMATICS ─────────────────────────────────────────────────────
  {
    slug: "mathematics-statistics",
    order: 21,
    icon: "Calculator",
    symbolSvg: SYM_MATH,
    title: {
      en: "Mathematics, Statistics & Analytics",
      tr: "Matematik, İstatistik ve Analiz",
      de: "Mathematik, Statistik & Analytik",
      fr: "Mathématiques, statistiques et analyse",
      es: "Matemáticas, estadística y análisis",
      ar: "الرياضيات والإحصاء والتحليل",
    },
    tagline: {
      en: "Algebra, calculus, probability, regression, hypothesis testing and data analysis.",
      tr: "Cebir, kalkülüs, olasılık, regresyon, hipotez testi ve veri analizi.",
      de: "Algebra, Analysis, Wahrscheinlichkeit, Regression, Hypothesentests und Datenanalyse.",
      fr: "Algèbre, analyse, probabilité, régression, tests d'hypothèse et analyse de données.",
      es: "Álgebra, cálculo, probabilidad, regresión, prueba de hipótesis y análisis de datos.",
      ar: "الجبر والتفاضل والتكامل والاحتمالات والانحدار واختبار الفرضيات وتحليل البيانات.",
    },
    field: {
      en: "Mathematical Sciences",
      tr: "Matematik Bilimleri",
      de: "Mathematische Wissenschaften",
      fr: "Sciences mathématiques",
      es: "Ciencias matemáticas",
      ar: "العلوم الرياضية",
    },
    domain: {
      en: "Education & Research",
      tr: "Eğitim & Araştırma",
      de: "Bildung & Forschung",
      fr: "Éducation et recherche",
      es: "Educación e investigación",
      ar: "التعليم والبحث",
    },
    socialPurpose: {
      en: "STEM Education & Data Literacy",
      tr: "STEM Eğitimi & Veri Okuryazarlığı",
      de: "MINT-Bildung & Datenkompetenz",
      fr: "Éducation STEM et littératie des données",
      es: "Educación STEM y alfabetización de datos",
      ar: "تعليم العلوم والتكنولوجيا والهندسة والرياضيات ومعرفة البيانات",
    },
  },

  // ── 22. HEALTH ──────────────────────────────────────────────────────────
  {
    slug: "health-fitness-daily-life",
    order: 22,
    icon: "Heart",
    symbolSvg: SYM_HEALTH,
    title: {
      en: "Health, Sports & Daily Life",
      tr: "Sağlık, Spor ve Günlük Yaşam",
      de: "Gesundheit, Sport & Alltag",
      fr: "Santé, sport et vie quotidienne",
      es: "Salud, deporte y vida diaria",
      ar: "الصحة والرياضة والحياة اليومية",
    },
    tagline: {
      en: "BMI, BMR, fitness, nutrition, pregnancy, age, date and everyday calculators.",
      tr: "VKİ, bazal metabolizma, fitness, beslenme, gebelik, yaş, tarih ve günlük hesaplamalar.",
      de: "BMI, BMR, Fitness, Ernährung, Schwangerschaft, Alter, Datum und Alltagsrechner.",
      fr: "IMC, BMR, fitness, nutrition, grossesse, âge, date et calculateurs quotidiens.",
      es: "IMC, BMR, fitness, nutrición, embarazo, edad, fecha y calculadoras cotidianas.",
      ar: "مؤشر كتلة الجسم ومعدل الأيض الأساسي واللياقة والتغذية والحمل والعمر والتاريخ والحاسبات اليومية.",
    },
    field: {
      en: "Health Sciences & Wellness",
      tr: "Sağlık Bilimleri & Wellness",
      de: "Gesundheitswissenschaften & Wellness",
      fr: "Sciences de la santé et bien-être",
      es: "Ciencias de la salud y bienestar",
      ar: "علوم الصحة والعافية",
    },
    domain: {
      en: "Healthcare & Consumer Wellness",
      tr: "Sağlık Hizmetleri & Tüketici Sağlığı",
      de: "Gesundheitswesen & Verbraucherwohl",
      fr: "Soins de santé et bien-être des consommateurs",
      es: "Atención sanitaria y bienestar del consumidor",
      ar: "الرعاية الصحية وصحة المستهلك",
    },
    socialPurpose: {
      en: "Health & Well-being",
      tr: "Sağlık & Refah",
      de: "Gesundheit & Wohlbefinden",
      fr: "Santé et bien-être",
      es: "Salud y bienestar",
      ar: "الصحة والرفاهية",
    },
  },

  // ── 23. CONVERSION ──────────────────────────────────────────────────────
  {
    slug: "conversion-measurement",
    order: 23,
    icon: "Ruler",
    symbolSvg: SYM_CONVERSION,
    title: {
      en: "Conversion & Measurement",
      tr: "Dönüşüm ve Ölçüm",
      de: "Umrechnung & Messung",
      fr: "Conversion et mesure",
      es: "Conversión y medición",
      ar: "التحويل والقياس",
    },
    tagline: {
      en: "Unit conversion, measurement systems, scales and dimensional analysis tools.",
      tr: "Birim dönüşümü, ölçüm sistemleri, ölçekler ve boyutsal analiz araçları.",
      de: "Einheitenumrechnung, Messsysteme, Skalen und Dimensionsanalyse.",
      fr: "Conversion d'unités, systèmes de mesure, échelles et analyse dimensionnelle.",
      es: "Conversión de unidades, sistemas de medición, escalas y análisis dimensional.",
      ar: "تحويل الوحدات وأنظمة القياس والمقاييس وتحليل الأبعاد.",
    },
    field: {
      en: "Measurement Science",
      tr: "Ölçüm Bilimi",
      de: "Messwissenschaft",
      fr: "Science de la mesure",
      es: "Ciencia de la medición",
      ar: "علم القياس",
    },
    domain: {
      en: "Metrology & Standards",
      tr: "Metroloji & Standartlar",
      de: "Metrologie & Normen",
      fr: "Métrologie et normes",
      es: "Metrología y normas",
      ar: "علم القياس والمعايير",
    },
    socialPurpose: {
      en: "Standardization & Interoperability",
      tr: "Standardizasyon & Birlikte Çalışabilirlik",
      de: "Standardisierung & Interoperabilität",
      fr: "Normalisation et interopérabilité",
      es: "Estandarización e interoperabilidad",
      ar: "التوحيد القياسي وقابلية التشغيل البيني",
    },
  },

  // ── 24. AUTOMOTIVE ──────────────────────────────────────────────────────
  {
    slug: "automotive-transport",
    order: 24,
    icon: "CarFront",
    symbolSvg: SYM_AUTOMOTIVE,
    title: {
      en: "Automotive & Transport",
      tr: "Otomotiv & Taşımacılık",
      de: "Automobil & Transport",
      fr: "Automobile et transport",
      es: "Automoción y transporte",
      ar: "السيارات والنقل",
    },
    tagline: {
      en: "Fuel economy, engine performance, vehicle dynamics and fleet management tools.",
      tr: "Yakıt ekonomisi, motor performansı, araç dinamiği ve filo yönetimi araçları.",
      de: "Kraftstoffverbrauch, Motorleistung, Fahrzeugdynamik und Flottenmanagement.",
      fr: "Économie de carburant, performance moteur, dynamique véhicule et gestion de flotte.",
      es: "Economía de combustible, rendimiento del motor, dinámica del vehículo y gestión de flotas.",
      ar: "الاقتصاد في الوقود وأداء المحرك وديناميكيات المركبات وإدارة الأساطيل.",
    },
    field: {
      en: "Automotive Engineering",
      tr: "Otomotiv Mühendisliği",
      de: "Fahrzeugtechnik",
      fr: "Génie automobile",
      es: "Ingeniería automotriz",
      ar: "هندسة السيارات",
    },
    domain: {
      en: "Automotive & Transport Industry",
      tr: "Otomotiv & Taşımacılık Sektörü",
      de: "Automobil- & Transportindustrie",
      fr: "Industrie automobile et du transport",
      es: "Industria automotriz y del transporte",
      ar: "صناعة السيارات والنقل",
    },
    socialPurpose: {
      en: "Sustainable Mobility & Road Safety",
      tr: "Sürdürülebilir Hareketlilik & Trafik Güvenliği",
      de: "Nachhaltige Mobilität & Verkehrssicherheit",
      fr: "Mobilité durable et sécurité routière",
      es: "Movilidad sostenible y seguridad vial",
      ar: "التنقل المستدام والسلامة على الطرق",
    },
  },

  // ── 25. MARITIME ────────────────────────────────────────────────────────
  {
    slug: "maritime-shipping",
    order: 25,
    icon: "Ship",
    symbolSvg: SYM_MARITIME,
    title: {
      en: "Maritime & Shipping",
      tr: "Denizcilik & Nakliye",
      de: "Schifffahrt & Versand",
      fr: "Maritime et expédition",
      es: "Marítimo y transporte marítimo",
      ar: "البحرية والشحن",
    },
    tagline: {
      en: "Ship stability, cargo calculations, port operations and maritime safety tools.",
      tr: "Gemi stabilitesi, yük hesaplamaları, liman operasyonları ve deniz güvenliği araçları.",
      de: "Schiffsstabilität, Frachtberechnungen, Hafenbetrieb und maritime Sicherheit.",
      fr: "Stabilité du navire, calculs de cargaison, opérations portuaires et sécurité maritime.",
      es: "Estabilidad del buque, cálculos de carga, operaciones portuarias y seguridad marítima.",
      ar: "استقرار السفينة وحسابات البضائع وعمليات الموانئ والسلامة البحرية.",
    },
    field: {
      en: "Naval Engineering",
      tr: "Gemi Mühendisliği",
      de: "Schiffbau",
      fr: "Génie naval",
      es: "Ingeniería naval",
      ar: "الهندسة البحرية",
    },
    domain: {
      en: "Maritime Industry",
      tr: "Denizcilik Sektörü",
      de: "Schifffahrtsindustrie",
      fr: "Industrie maritime",
      es: "Industria marítima",
      ar: "الصناعة البحرية",
    },
    socialPurpose: {
      en: "Blue Economy & Marine Safety",
      tr: "Mavi Ekonomi & Deniz Güvenliği",
      de: "Blaue Wirtschaft & maritime Sicherheit",
      fr: "Économie bleue et sécurité maritime",
      es: "Economía azul y seguridad marítima",
      ar: "الاقتصاد الأزرق والسلامة البحرية",
    },
  },

  // ── 26. MINING ──────────────────────────────────────────────────────────
  {
    slug: "mining-geology",
    order: 26,
    icon: "Pickaxe",
    symbolSvg: SYM_MINING,
    title: {
      en: "Mining & Geology",
      tr: "Madencilik & Jeoloji",
      de: "Bergbau & Geologie",
      fr: "Exploitation minière et géologie",
      es: "Minería y geología",
      ar: "التعدين والجيولوجيا",
    },
    tagline: {
      en: "Ore grade, drilling, blasting, mineral processing and geological survey tools.",
      tr: "Cevher tenörü, sondaj, patlatma, mineral işleme ve jeolojik etüt araçları.",
      de: "Erzgehalt, Bohren, Sprengen, Mineralaufbereitung und geologische Erkundung.",
      fr: "Teneur en minerai, forage, dynamitage, traitement minéral et étude géologique.",
      es: "Ley de mineral, perforación, voladura, procesamiento de minerales y estudio geológico.",
      ar: "درجة الخام والحفر والتفجير ومعالجة المعادن والمسح الجيولوجي.",
    },
    field: {
      en: "Geological & Mining Engineering",
      tr: "Jeoloji & Maden Mühendisliği",
      de: "Geologie & Bergbautechnik",
      fr: "Géologie et génie minier",
      es: "Geología e ingeniería de minas",
      ar: "الهندسة الجيولوجية والتعدينية",
    },
    domain: {
      en: "Extractive Industries",
      tr: "Çıkarma Sanayileri",
      de: "Extraktive Industrien",
      fr: "Industries extractives",
      es: "Industrias extractivas",
      ar: "الصناعات الاستخراجية",
    },
    socialPurpose: {
      en: "Responsible Resource Extraction",
      tr: "Sorumlu Kaynak Çıkarma",
      de: "Verantwortungsvolle Rohstoffgewinnung",
      fr: "Extraction responsable des ressources",
      es: "Extracción responsable de recursos",
      ar: "الاستخراج المسؤول للموارد",
    },
  },

  // ── 27. FURNITURE ──────────────────────────────────────────────────────
  {
    slug: "furniture-woodworking",
    order: 27,
    icon: "Armchair",
    symbolSvg: SYM_FURNITURE,
    title: {
      en: "Furniture & Woodworking",
      tr: "Mobilya & Ahşap İşleri",
      de: "Möbel & Holzbearbeitung",
      fr: "Ameublement et travail du bois",
      es: "Muebles y carpintería",
      ar: "الأثاث والنجارة",
    },
    tagline: {
      en: "Lumber volume, furniture costing, board foot and workshop material tools.",
      tr: "Kereste hacmi, mobilya maliyeti, board foot ve atölye malzeme araçları.",
      de: "Holzvolumen, Möbelkosten, Board-Fuß und Werkstatt-Materialwerkzeuge.",
      fr: "Volume de bois, coût d'ameublement, pied-planche et outils de matériel d'atelier.",
      es: "Volumen de madera, coste de muebles, pie tablar y herramientas de taller.",
      ar: "حجم الخشب وتكلفة الأثاث والقدم اللوحي وأدوات مواد الورشة.",
    },
    field: {
      en: "Wood Technology & Design",
      tr: "Ahşap Teknolojisi & Tasarım",
      de: "Holztechnologie & Design",
      fr: "Technologie du bois et design",
      es: "Tecnología de la madera y diseño",
      ar: "تكنولوجيا الخشب والتصميم",
    },
    domain: {
      en: "Furniture Industry",
      tr: "Mobilya Sektörü",
      de: "Möbelindustrie",
      fr: "Industrie de l'ameublement",
      es: "Industria del mueble",
      ar: "صناعة الأثاث",
    },
    socialPurpose: {
      en: "Sustainable Forestry & Craftsmanship",
      tr: "Sürdürülebilir Ormancılık & Zanaatkarlık",
      de: "Nachhaltige Forstwirtschaft & Handwerkskunst",
      fr: "Foresterie durable et artisanat",
      es: "Silvicultura sostenible y artesanía",
      ar: "الغابات المستدامة والحرفية",
    },
  },

  // ── 28. CLEANING ────────────────────────────────────────────────────────
  {
    slug: "cleaning-facility",
    order: 28,
    icon: "Sparkles",
    symbolSvg: SYM_CLEANING,
    title: {
      en: "Cleaning & Facility Management",
      tr: "Temizlik & Tesis Yönetimi",
      de: "Reinigung & Facility Management",
      fr: "Nettoyage et gestion des installations",
      es: "Limpieza y gestión de instalaciones",
      ar: "التنظيف وإدارة المرافق",
    },
    tagline: {
      en: "Solution dilution, detergent dosage, surface area and labor time calculators.",
      tr: "Solüsyon seyreltme, deterjan dozajı, yüzey alanı ve işçilik süresi hesaplamaları.",
      de: "Lösungsverdünnung, Waschmitteldosierung, Oberfläche und Arbeitszeitrechner.",
      fr: "Dilution de solution, dosage détergent, superficie et calculs de temps de main-d'œuvre.",
      es: "Dilución de solución, dosificación de detergente, superficie y cálculos de tiempo de mano de obra.",
      ar: "تخفيف المحلول وجرعات المنظفات ومساحة السطح وحسابات وقت العمل.",
    },
    field: {
      en: "Facility Management",
      tr: "Tesis Yönetimi",
      de: "Facility Management",
      fr: "Gestion des installations",
      es: "Gestión de instalaciones",
      ar: "إدارة المرافق",
    },
    domain: {
      en: "Cleaning & Hygiene Services",
      tr: "Temizlik & Hijyen Hizmetleri",
      de: "Reinigungs- & Hygienedienste",
      fr: "Services de nettoyage et d'hygiène",
      es: "Servicios de limpieza e higiene",
      ar: "خدمات التنظيف والنظافة",
    },
    socialPurpose: {
      en: "Public Health & Sanitation",
      tr: "Halk Sağlığı & Sanitasyon",
      de: "Öffentliche Gesundheit & Hygiene",
      fr: "Santé publique et assainissement",
      es: "Salud pública y saneamiento",
      ar: "الصحة العامة والصرف الصحي",
    },
  },

  // ── 29. WATER ───────────────────────────────────────────────────────────
  {
    slug: "water-wastewater",
    order: 29,
    icon: "Droplets",
    symbolSvg: SYM_WATER,
    title: {
      en: "Water & Wastewater",
      tr: "Su & Atıksu Yönetimi",
      de: "Wasser & Abwasser",
      fr: "Eau et eaux usées",
      es: "Agua y aguas residuales",
      ar: "المياه والصرف الصحي",
    },
    tagline: {
      en: "Flow rate, pipe sizing, treatment dosing, pool chemistry and irrigation tools.",
      tr: "Debi, boru çapı, arıtma dozajı, havuz kimyası ve sulama araçları.",
      de: "Durchfluss, Rohrbemessung, Aufbereitungsdosierung, Poolchemie und Bewässerung.",
      fr: "Débit, dimensionnement des tuyaux, dosage de traitement, chimie de piscine et irrigation.",
      es: "Caudal, dimensionamiento de tuberías, dosificación de tratamiento, química de piscinas y riego.",
      ar: "معدل التدفق وتحديد أحجام الأنابيب وجرعات المعالجة وكيمياء حمامات السباحة والري.",
    },
    field: {
      en: "Water Resources Engineering",
      tr: "Su Kaynakları Mühendisliği",
      de: "Wasserressourcentechnik",
      fr: "Ingénierie des ressources en eau",
      es: "Ingeniería de recursos hídricos",
      ar: "هندسة الموارد المائية",
    },
    domain: {
      en: "Water & Sanitation Services",
      tr: "Su & Sanitasyon Hizmetleri",
      de: "Wasser- & Sanitärdienste",
      fr: "Services d'eau et d'assainissement",
      es: "Servicios de agua y saneamiento",
      ar: "خدمات المياه والصرف الصحي",
    },
    socialPurpose: {
      en: "Clean Water & Sanitation",
      tr: "Temiz Su & Sanitasyon",
      de: "Sauberes Wasser & Sanitäreinrichtungen",
      fr: "Eau propre et assainissement",
      es: "Agua limpia y saneamiento",
      ar: "المياه النظيفة والصرف الصحي",
    },
  },

  // ── 30. TOURISM ─────────────────────────────────────────────────────────
  {
    slug: "tourism-hospitality",
    order: 30,
    icon: "Luggage",
    symbolSvg: SYM_TOURISM,
    title: {
      en: "Tourism & Hospitality",
      tr: "Turizm & Konaklama",
      de: "Tourismus & Gastgewerbe",
      fr: "Tourisme et hôtellerie",
      es: "Turismo y hostelería",
      ar: "السياحة والضيافة",
    },
    tagline: {
      en: "Hotel occupancy, RevPAR, restaurant food cost, menu pricing and travel tools.",
      tr: "Otel doluluğu, RevPAR, restoran yemek maliyeti, menü fiyatlama ve seyahat araçları.",
      de: "Hotelauslastung, RevPAR, Restaurant-Speisekosten, Menüpreise und Reiseplanung.",
      fr: "Taux d'occupation, RevPAR, coût alimentaire restaurant, prix de menu et voyage.",
      es: "Ocupación hotelera, RevPAR, costo de alimentos de restaurante, precios de menú y viajes.",
      ar: "إشغال الفنادق ومتوسط الإيرادات لكل غرفة وتكلفة طعام المطعم وأسعار القوائم والسفر.",
    },
    field: {
      en: "Hospitality Management",
      tr: "Konaklama Yönetimi",
      de: "Gastgewerbemanagement",
      fr: "Gestion hôtelière",
      es: "Gestión hotelera",
      ar: "إدارة الضيافة",
    },
    domain: {
      en: "Travel & Tourism Industry",
      tr: "Seyahat & Turizm Sektörü",
      de: "Reise- & Tourismusindustrie",
      fr: "Industrie du voyage et du tourisme",
      es: "Industria de viajes y turismo",
      ar: "صناعة السفر والسياحة",
    },
    socialPurpose: {
      en: "Cultural Exchange & Economic Growth",
      tr: "Kültürel Değişim & Ekonomik Büyüme",
      de: "Kulturaustausch & Wirtschaftswachstum",
      fr: "Échange culturel et croissance économique",
      es: "Intercambio cultural y crecimiento económico",
      ar: "التبادل الثقافي والنمو الاقتصادي",
    },
  },

  // ── 31. EDUCATION ───────────────────────────────────────────────────────
  {
    slug: "education-academic",
    order: 31,
    icon: "GraduationCap",
    symbolSvg: SYM_EDUCATION,
    title: {
      en: "Education & Academic",
      tr: "Eğitim & Akademik",
      de: "Bildung & Akademiker",
      fr: "Éducation et académique",
      es: "Educación y académico",
      ar: "التعليم والأكاديميا",
    },
    tagline: {
      en: "GPA, grade, exam score, college planning and study tools.",
      tr: "GPA, not, sınav puanı, üniversite planlama ve çalışma araçları.",
      de: "Notendurchschnitt, Note, Prüfungsergebnis, Studienplanung und Lernwerkzeuge.",
      fr: "Moyenne, notes, score d'examen, planification universitaire et outils d'étude.",
      es: "Promedio, calificación, puntuación de examen, planificación universitaria y herramientas de estudio.",
      ar: "المعدل التراكمي والدرجات ونتائج الامتحانات والتخطيط للجامعة وأدوات الدراسة.",
    },
    field: {
      en: "Education Sciences",
      tr: "Eğitim Bilimleri",
      de: "Bildungswissenschaften",
      fr: "Sciences de l'éducation",
      es: "Ciencias de la educación",
      ar: "علوم التربية",
    },
    domain: {
      en: "Academic & Educational Services",
      tr: "Akademik & Eğitim Hizmetleri",
      de: "Akademische & Bildungsdienste",
      fr: "Services académiques et éducatifs",
      es: "Servicios académicos y educativos",
      ar: "الخدمات الأكاديمية والتعليمية",
    },
    socialPurpose: {
      en: "Equal Access to Education",
      tr: "Eğitime Eşit Erişim",
      de: "Gleicher Zugang zu Bildung",
      fr: "Accès égal à l'éducation",
      es: "Igualdad de acceso a la educación",
      ar: "المساواة في الوصول إلى التعليم",
    },
  },

  // ── 32. REAL ESTATE ─────────────────────────────────────────────────────
  {
    slug: "real-estate-property",
    order: 32,
    icon: "KeyRound",
    symbolSvg: SYM_PROPERTY,
    title: {
      en: "Real Estate & Property",
      tr: "Emlak & Gayrimenkul",
      de: "Immobilien & Grundstücke",
      fr: "Immobilier et propriété",
      es: "Bienes raíces y propiedad",
      ar: "العقارات والممتلكات",
    },
    tagline: {
      en: "Mortgage, property valuation, rental yield and home affordability calculators.",
      tr: "Mortgage, emlak değerleme, kira getirisi ve ev satın alabilirlik hesaplamaları.",
      de: "Hypothek, Immobilienbewertung, Mietrendite und Erschwinglichkeitsrechner.",
      fr: "Hypothèque, évaluation immobilière, rendement locatif et calculateurs d'accessibilité.",
      es: "Hipoteca, valoración de propiedades, rendimiento de alquiler y calculadoras de asequibilidad.",
      ar: "الرهن العقاري وتقييم العقارات والعائد الإيجاري وحاسبات القدرة على الشراء.",
    },
    field: {
      en: "Real Estate Economics",
      tr: "Gayrimenkul Ekonomisi",
      de: "Immobilienökonomie",
      fr: "Économie immobilière",
      es: "Economía inmobiliaria",
      ar: "اقتصاديات العقارات",
    },
    domain: {
      en: "Property Services",
      tr: "Emlak Hizmetleri",
      de: "Immobiliendienstleistungen",
      fr: "Services immobiliers",
      es: "Servicios inmobiliarios",
      ar: "الخدمات العقارية",
    },
    socialPurpose: {
      en: "Housing & Community Development",
      tr: "Konut & Toplumsal Kalkınma",
      de: "Wohnungsbau & Gemeindeentwicklung",
      fr: "Logement et développement communautaire",
      es: "Vivienda y desarrollo comunitario",
      ar: "الإسكان والتنمية المجتمعية",
    },
  },

  // ── 33. AEROSPACE ──────────────────────────────────────────────────────
  {
    slug: "aerospace-aviation",
    order: 33,
    icon: "Plane",
    symbolSvg: SYM_AERO,
    title: {
      en: "Aerospace & Aviation",
      tr: "Havacılık & Uzay",
      de: "Luft- & Raumfahrt",
      fr: "Aérospatiale et aviation",
      es: "Aeroespacial y aviación",
      ar: "الفضاء والطيران",
    },
    tagline: {
      en: "Flight performance, aerodynamics, fuel range and spacecraft engineering tools.",
      tr: "Uçuş performansı, aerodinamik, yakıt menzili ve uzay aracı mühendisliği araçları.",
      de: "Flugleistung, Aerodynamik, Treibstoffreichweite und Raumfahrttechnik.",
      fr: "Performance de vol, aérodynamique, autonomie carburant et génie spatial.",
      es: "Rendimiento de vuelo, aerodinámica, alcance de combustible e ingeniería espacial.",
      ar: "أداء الطيران والديناميكا الهوائية ومدى الوقود وهندسة المركبات الفضائية.",
    },
    field: {
      en: "Aerospace Engineering",
      tr: "Havacılık Mühendisliği",
      de: "Luft- & Raumfahrttechnik",
      fr: "Génie aérospatial",
      es: "Ingeniería aeroespacial",
      ar: "هندسة الطيران والفضاء",
    },
    domain: {
      en: "Aviation & Space Industry",
      tr: "Havacılık & Uzay Sektörü",
      de: "Luft- & Raumfahrtindustrie",
      fr: "Industrie aéronautique et spatiale",
      es: "Industria aeroespacial y de aviación",
      ar: "صناعة الطيران والفضاء",
    },
    socialPurpose: {
      en: "Space Exploration & Aviation Safety",
      tr: "Uzay Keşfi & Havacılık Güvenliği",
      de: "Weltraumforschung & Flugsicherheit",
      fr: "Exploration spatiale et sécurité aérienne",
      es: "Exploración espacial y seguridad aérea",
      ar: "استكشاف الفضاء والسلامة الجوية",
    },
  },

  // ── 34. OTHER (fallback) ─────────────────────────────────────────────────
  {
    slug: "other",
    order: 99,
    icon: "FolderOpen",
    symbolSvg: SYM_OTHER,
    title: {
      en: "Other & Cross-Field Tools",
      tr: "Diğer ve Çapraz Alan Araçları",
      de: "Sonstige & bereichsübergreifende Tools",
      fr: "Autres outils et outils transversaux",
      es: "Otras herramientas y herramientas transversales",
      ar: "أدوات أخرى ومتعددة المجالات",
    },
    tagline: {
      en: "General-purpose and cross-domain calculators not fitting a single category.",
      tr: "Tek bir kategoriye girmeyen genel amaçlı ve çapraz alan hesaplayıcıları.",
      de: "Allzweck- und bereichsübergreifende Rechner, die keiner einzelnen Kategorie zugeordnet sind.",
      fr: "Calculatrices polyvalentes et transversales ne relevant pas d'une seule catégorie.",
      es: "Calculadoras de uso general y transversales que no encajan en una sola categoría.",
      ar: "آلات حاسبة عامة ومتعددة التخصصات لا تندرج تحت فئة واحدة.",
    },
    field: {
      en: "Multidisciplinary",
      tr: "Çok Disiplinli",
      de: "Multidisziplinär",
      fr: "Multidisciplinaire",
      es: "Multidisciplinario",
      ar: "متعدد التخصصات",
    },
    domain: {
      en: "General Purpose",
      tr: "Genel Amaçlı",
      de: "Allzweck",
      fr: "Usage général",
      es: "Propósito general",
      ar: "أغراض عامة",
    },
    socialPurpose: {
      en: "Knowledge Accessibility",
      tr: "Bilgiye Erişilebilirlik",
      de: "Wissenszugänglichkeit",
      fr: "Accessibilité des connaissances",
      es: "Accesibilidad al conocimiento",
      ar: "إمكانية الوصول إلى المعرفة",
    },
  },
];

// ─── Indexes ────────────────────────────────────────────────────────────────

const CATEGORY_BY_SLUG = new Map<FreeToolCategorySlug, FreeToolCategoryEntry>(
  FREE_TOOL_CATEGORIES.map((cat) => [cat.slug, cat]),
);

export function getFreeToolCategoryBySlug(
  slug: string,
): FreeToolCategoryEntry | undefined {
  return CATEGORY_BY_SLUG.get(slug as FreeToolCategorySlug);
}

export function getFreeToolCategories(): readonly FreeToolCategoryEntry[] {
  return FREE_TOOL_CATEGORIES;
}

export function resolveFreeToolCategoryTitle(
  slug: string,
  locale: string,
): string {
  const category = getFreeToolCategoryBySlug(slug);
  if (!category) return slug;
  const label = category.title[locale as SupportedLocale];
  return label ?? category.title.en;
}

export function resolveFreeToolCategoryTagline(
  slug: string,
  locale: string,
): string {
  const category = getFreeToolCategoryBySlug(slug);
  if (!category) return "";
  const tagline = category.tagline[locale as SupportedLocale];
  return tagline ?? category.tagline.en;
}

export function resolveFreeToolCategoryIcon(slug: string): string {
  const category = getFreeToolCategoryBySlug(slug);
  return category?.icon ?? "FolderOpen";
}

/** Resolve the premium SVG symbol string for a given category slug. */
export function resolveFreeToolCategorySymbolSvg(slug: string): string {
  const category = getFreeToolCategoryBySlug(slug);
  return category?.symbolSvg ?? SYM_OTHER;
}

export function resolveFreeToolCategoryField(slug: string, locale: string): string {
  const category = getFreeToolCategoryBySlug(slug);
  if (!category) return "";
  const field = category.field[locale as SupportedLocale];
  return field ?? category.field.en;
}

export function resolveFreeToolCategoryDomain(slug: string, locale: string): string {
  const category = getFreeToolCategoryBySlug(slug);
  if (!category) return "";
  const domain = category.domain[locale as SupportedLocale];
  return domain ?? category.domain.en;
}

export function resolveFreeToolCategorySocialPurpose(slug: string, locale: string): string {
  const category = getFreeToolCategoryBySlug(slug);
  if (!category) return "";
  const purpose = category.socialPurpose[locale as SupportedLocale];
  return purpose ?? category.socialPurpose.en;
}

// ─── Legacy / fallback key mapping ──────────────────────────────────────────
//
// Maps all possible categoryKey values (from schemas, metadata, and fallbacks)
// to one of the canonical categories above.

const CATEGORY_KEY_CANONICAL_MAP: Readonly<Record<string, FreeToolCategorySlug>> = {
  // --- Global category slugs (direct match) ---
  "quality-six-sigma": "quality-six-sigma",
  "technology-ai-cloud-cyber": "technology-ai-cloud-cyber",
  "finance-sales-working-capital": "finance-sales-working-capital",
  "electrical-power-systems": "electrical-power-systems",
  "sustainability-resource-esg": "sustainability-resource-esg",
  "cnc-additive-manufacturing": "cnc-additive-manufacturing",
  "metal-plastics-forming": "metal-plastics-forming",
  "process-chemical": "process-chemical",
  "hse-ergonomics": "hse-ergonomics",
  "maintenance-reliability": "maintenance-reliability",
  "project-construction-management": "project-construction-management",
  "workforce-hr": "workforce-hr",
  "procurement-supply-chain": "procurement-supply-chain",
  "food-cold-chain-hygiene": "food-cold-chain-hygiene",
  "lean-production": "lean-production",
  "textile-print-lab": "textile-print-lab",
  "mechanical-hvac-energy-loss": "mechanical-hvac-energy-loss",
  "packaging-local-business": "packaging-local-business",
  "global-compliance-trade": "global-compliance-trade",
  "digital-factory-automation": "digital-factory-automation",

  // --- catalogCategory values (schema-catalog-metadata) ---
  "chemistry-science": "process-chemical",
  "construction-measurement": "project-construction-management",
  "date-time": "health-fitness-daily-life",
  "ecology-environment": "sustainability-resource-esg",
  "education-academic": "education-academic",
  "energy-carbon": "sustainability-resource-esg",
  "engineering-science": "cnc-additive-manufacturing",
  "everyday-life": "health-fitness-daily-life",
  "finance-business": "finance-sales-working-capital",
  "food-cooking": "food-cold-chain-hygiene",
  "gaming-entertainment": "health-fitness-daily-life",
  "health-body": "health-fitness-daily-life",
  "hobbies-diy": "health-fitness-daily-life",
  "manufacturing-workshop": "lean-production",
  "math-statistics": "mathematics-statistics",
  "physics-science": "process-chemical",
  "conversion": "conversion-measurement",

  // --- categoryId values (in schema JSON files) ---
  cost: "finance-sales-working-capital",
  finance: "finance-sales-working-capital",
  energy: "sustainability-resource-esg",
  sustainability: "sustainability-resource-esg",
  efficiency: "lean-production",
  engineering: "cnc-additive-manufacturing",
  hr: "workforce-hr",
  logistics: "procurement-supply-chain",
  math: "mathematics-statistics",
  quality: "quality-six-sigma",
  safety: "hse-ergonomics",

  // --- Legacy schema category keys ---
  "finans-kredi": "finance-sales-working-capital",
  "finans-ik": "finance-sales-working-capital",
  "maliyet-marj": "finance-sales-working-capital",
  "malzeme-fire-oee": "lean-production",
  "olcum-donusum": "conversion-measurement",
  "teknik-muhendislik": "cnc-additive-manufacturing",
  "enerji-karbon": "sustainability-resource-esg",
  "insaat-saha": "project-construction-management",
  "perakende-gida": "food-cold-chain-hygiene",
  "rota-lojistik": "procurement-supply-chain",
  "kalite-spc-alti-sigma": "quality-six-sigma",
  "isg-risk": "hse-ergonomics",
  "surdurulebilirlik": "sustainability-resource-esg",
  "atolye-tamir": "maintenance-reliability",
  "uretim-imalat": "lean-production",

  // --- Sector taxonomy keys → canonical categories ---
  otomotiv: "automotive-transport",
  denizcilik: "maritime-shipping",
  madencilik: "mining-geology",
  "mobilya-ahsap": "furniture-woodworking",
  temizlik: "cleaning-facility",
  "su-yonetimi": "water-wastewater",
  turizm: "tourism-hospitality",
  egitim: "education-academic",
  emlak: "real-estate-property",
  havacilik: "aerospace-aviation",
};

/** Map any category key (global slug, legacy key, categoryId, sectorKey, etc.) to a canonical FreeToolCategorySlug. */
export function resolveCanonicalCategorySlug(categoryKey: string): FreeToolCategorySlug {
  if (!categoryKey || categoryKey === "diger" || categoryKey === "other") {
    return "other";
  }
  return CATEGORY_KEY_CANONICAL_MAP[categoryKey] ?? "other";
}

/** Return categories sorted by display order, excluding empty categories when called with counts. */
export function getOrderedFreeToolCategories(): readonly FreeToolCategoryEntry[] {
  return [...FREE_TOOL_CATEGORIES].sort((a, b) => a.order - b.order);
}
