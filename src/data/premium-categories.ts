/**
 * Premium Category Registry - 20 industrial loss & efficiency categories.
 *
 * Single source for all premium tool categories with full i18n (6 languages),
 * Lucide icon assignments, and premium line-art SVG symbols.
 *
 * ECMI / ISO 9001 - TUV-certifiable engineering quality.
 * Every category ties to a measurable loss family or business function.
 */

import {
  Cog,
  Sigma,
  FlaskConical,
  Cpu,
  Hammer,
  Building2,
  Factory,
  Wrench,
  ShieldAlert,
  Package,
  Users,
  Banknote,
  Leaf,
  UtensilsCrossed,
  Shirt,
  Zap,
  Thermometer,
  Box,
  Globe,
  Microchip,
  type LucideIcon,
} from "lucide-react";

export type PremiumCategorySlug =
  | "lean-production"
  | "quality-six-sigma"
  | "process-chemical"
  | "cnc-additive-manufacturing"
  | "metal-plastics-forming"
  | "project-construction-management"
  | "digital-factory-automation"
  | "maintenance-reliability"
  | "hse-ergonomics"
  | "procurement-supply-chain"
  | "workforce-hr"
  | "finance-sales-working-capital"
  | "sustainability-resource-esg"
  | "food-cold-chain-hygiene"
  | "textile-print-lab"
  | "electrical-power-systems"
  | "mechanical-hvac-energy-loss"
  | "packaging-local-business"
  | "global-compliance-trade"
  | "technology-ai-cloud-cyber";

export interface PremiumCategoryEntry {
  /** Canonical English slug (also used as locale key). */
  readonly slug: PremiumCategorySlug;
  /** Lucide icon component for the category header. */
  readonly icon: LucideIcon;
  /**
   * Premium line-art SVG symbol (inline, copper/navy stroke, 48×48 viewBox).
   * Supplies a visual signature for each category at premium tier.
   */
  readonly symbolSvg: string;
  /** Category title in all 6 supported locales. */
  readonly title: {
    readonly en: string;

    readonly de: string;
    readonly fr: string;
    readonly es: string;
    readonly ar: string;
  };
  /** Short description of the category's scope in all 6 locales. */
  readonly description: {
    readonly en: string;

    readonly de: string;
    readonly fr: string;
    readonly es: string;
    readonly ar: string;
  };
  /** Sort priority (lower = first). */
  readonly priority: number;
}

/* ──────────────────────────────────────────────
 * Premium line-art SVG symbols (copper style)
 * Each is a clean 48×48 viewBox with stroke-width="1.5"
 * using sc-copper (#B87333) or sc-navy (#1B2A4A) tones.
 * ────────────────────────────────────────────── */

const SYMBOL_BASE = 'viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

const SYMBOL_LEAN = `<svg ${SYMBOL_BASE}><circle cx="24" cy="24" r="18"/><path d="M12 24h24M24 12v24"/><path d="M18 24l6-6 6 6M24 18l-6 6 6 6"/></svg>`;
const SYMBOL_QUALITY = `<svg ${SYMBOL_BASE}><polygon points="24,4 29,18 44,18 32,27 35,42 24,33 13,42 16,27 4,18 19,18"/><circle cx="24" cy="22" r="4"/></svg>`;
const SYMBOL_PROCESS = `<svg ${SYMBOL_BASE}><circle cx="16" cy="16" r="6"/><circle cx="36" cy="16" r="6"/><line x1="22" y1="16" x2="30" y2="16"/><line x1="16" y1="22" x2="16" y2="40"/><line x1="36" y1="22" x2="36" y2="40"/><line x1="16" y1="40" x2="36" y2="40"/></svg>`;
const SYMBOL_CNC = `<svg ${SYMBOL_BASE}><circle cx="24" cy="24" r="8"/><path d="M24 8v6M24 34v6M8 24h6M34 24h6"/><path d="M14 14l4 4M30 30l4 4M30 14l-4 4M14 30l4-4"/></svg>`;
const SYMBOL_METAL = `<svg ${SYMBOL_BASE}><rect x="8" y="16" width="32" height="20" rx="2"/><path d="M8 16l6-8h20l6 8"/><line x1="24" y1="16" x2="24" y2="36"/><line x1="14" y1="24" x2="18" y2="24"/><line x1="30" y1="24" x2="34" y2="24"/></svg>`;
const SYMBOL_PROJECT = `<svg ${SYMBOL_BASE}><rect x="8" y="6" width="32" height="36" rx="3"/><line x1="16" y1="14" x2="32" y2="14"/><line x1="16" y1="22" x2="32" y2="22"/><line x1="16" y1="30" x2="28" y2="30"/><circle cx="34" cy="34" r="3"/></svg>`;
const SYMBOL_FACTORY = `<svg ${SYMBOL_BASE}><rect x="6" y="14" width="36" height="26" rx="2"/><line x1="6" y1="24" x2="42" y2="24"/><circle cx="16" cy="34" r="4"/><circle cx="32" cy="34" r="4"/><line x1="24" y1="14" x2="24" y2="24"/><path d="M24 10V6"/></svg>`;
const SYMBOL_MAINTENANCE = `<svg ${SYMBOL_BASE}><circle cx="24" cy="24" r="14"/><path d="M24 10v14l8 8"/><path d="M10 8l4 4M38 8l-4 4M10 40l4-4M38 40l-4-4"/></svg>`;
const SYMBOL_HSE = `<svg ${SYMBOL_BASE}><path d="M24 6L8 14v8c0 12 6 18 16 20 10-2 16-8 16-20v-8L24 6z"/><line x1="24" y1="18" x2="24" y2="28"/><circle cx="24" cy="32" r="1.5"/></svg>`;
const SYMBOL_PROCUREMENT = `<svg ${SYMBOL_BASE}><rect x="6" y="10" width="36" height="28" rx="3"/><line x1="6" y1="18" x2="42" y2="18"/><line x1="18" y1="10" x2="18" y2="38"/><circle cx="14" cy="26" r="2"/><circle cx="14" cy="32" r="2"/></svg>`;
const SYMBOL_WORKFORCE = `<svg ${SYMBOL_BASE}><circle cx="18" cy="14" r="6"/><circle cx="34" cy="16" r="5"/><path d="M8 40c0-8 4-12 10-12s10 4 10 12"/><path d="M28 38c0-6 3-10 8-10s8 4 8 10"/></svg>`;
const SYMBOL_FINANCE = `<svg ${SYMBOL_BASE}><line x1="24" y1="8" x2="24" y2="40"/><path d="M14 14c0-4 4-6 10-6s10 2 10 6-4 6-10 6-10 2-10 6 4 6 10 6 10-2 10-6"/></svg>`;
const SYMBOL_LEAF = `<svg ${SYMBOL_BASE}><path d="M24 12c-8 0-14 6-14 14v8c0 2 2 4 4 4h20c2 0 4-2 4-4v-8c0-8-6-14-14-14z"/><path d="M24 12V4"/><path d="M18 32l6-8 6 8"/></svg>`;
const SYMBOL_FOOD = `<svg ${SYMBOL_BASE}><path d="M12 40V8h6v14h4V8h6v14h4V8h6v32"/><line x1="8" y1="40" x2="40" y2="40"/></svg>`;
const SYMBOL_TEXTILE = `<svg ${SYMBOL_BASE}><rect x="8" y="8" width="32" height="32" rx="2"/><line x1="8" y1="20" x2="40" y2="20"/><line x1="8" y1="28" x2="40" y2="28"/><line x1="20" y1="8" x2="20" y2="40"/><line x1="28" y1="8" x2="28" y2="40"/></svg>`;
const SYMBOL_ELECTRIC = `<svg ${SYMBOL_BASE}><path d="M20 4l-8 20h8l-4 20 16-24h-8l8-16z"/></svg>`;
const SYMBOL_THERMAL = `<svg ${SYMBOL_BASE}><circle cx="24" cy="24" r="14"/><path d="M24 10c-3 0-6 2-6 6 0 4 6 8 6 8s6-4 6-8c0-4-3-6-6-6z"/><path d="M14 36l24-24"/></svg>`;
const SYMBOL_BOX = `<svg ${SYMBOL_BASE}><rect x="6" y="14" width="36" height="24" rx="2"/><path d="M6 14l18 6 18-6"/><line x1="24" y1="20" x2="24" y2="38"/><line x1="12" y1="26" x2="16" y2="24"/><line x1="36" y1="26" x2="32" y2="24"/></svg>`;
const SYMBOL_GLOBE = `<svg ${SYMBOL_BASE}><circle cx="24" cy="24" r="18"/><ellipse cx="24" cy="24" rx="10" ry="18"/><line x1="6" y1="24" x2="42" y2="24"/><path d="M12 12c4-2 8-2 12 0s8 2 12 0M12 36c4 2 8 2 12 0s8-2 12 0"/></svg>`;
const SYMBOL_CHIP = `<svg ${SYMBOL_BASE}><rect x="10" y="10" width="28" height="28" rx="4"/><circle cx="24" cy="24" r="6"/><line x1="24" y1="10" x2="24" y2="4"/><line x1="24" y1="38" x2="24" y2="44"/><line x1="10" y1="24" x2="4" y2="24"/><line x1="38" y1="24" x2="44" y2="24"/></svg>`;

export const PREMIUM_CATEGORIES: readonly PremiumCategoryEntry[] = [
  {
    slug: "lean-production",
    icon: Cog,
    symbolSvg: SYMBOL_LEAN,
    priority: 1,
    title: {
      en: "Lean Production & Line Efficiency",
      de: "Lean Production & Linieneffizienz",
      fr: "Production Lean & Efficacité de Ligne",
      es: "Producción Lean y Eficiencia de Línea",
      ar: "الإنتاج الرشيد وكفاءة الخط",
    },
    description: {
      en: "SMED, Kanban, VSM, Kaizen, Andon, line balancing, muda waste and takt-time optimisation tools.",
      de: "SMED, Kanban, VSM, Kaizen, Andon, Linienabstimmung, Muda-Verschwendung und Taktzeit-Optimierung.",
      fr: "SMED, Kanban, VSM, Kaizen, Andon, équilibrage de ligne, gaspillage muda et optimisation du temps takt.",
      es: "SMED, Kanban, VSM, Kaizen, Andon, balanceo de línea, desperdicio muda y optimización del tiempo takt.",
      ar: "أدوات SMED، كانبان، VSM، كايزن، أندون، موازنة الخط، هدر مودا وتحسين وقت التكت.",
    },
  },
  {
    slug: "quality-six-sigma",
    icon: Sigma,
    symbolSvg: SYMBOL_QUALITY,
    priority: 2,
    title: {
      en: "Quality, SPC & Six Sigma",
      de: "Qualität, SPC & Six Sigma",
      fr: "Qualité, SPC et Six Sigma",
      es: "Calidad, SPC y Seis Sigma",
      ar: "الجودة وSPC وسي سيجما",
    },
    description: {
      en: "Cpk/Ppk, MSA, FMEA, SPC, Taguchi, RTY, AQL sampling and quality project selection tools.",
      de: "Cpk/Ppk, MSA, FMEA, SPC, Taguchi, RTY, AQL-Stichproben und Qualitätsprojektauswahl.",
      fr: "Cpk/Ppk, MSA, FMEA, SPC, Taguchi, RTY, échantillonnage AQL et sélection de projets qualité.",
      es: "Cpk/Ppk, MSA, FMEA, SPC, Taguchi, RTY, muestreo AQL y selección de proyectos de calidad.",
      ar: "Cpk/Ppk، MSA، FMEA، SPC، تاجوتشي، RTY، عينات AQL وأدوات اختيار مشاريع الجودة.",
    },
  },
  {
    slug: "process-chemical",
    icon: FlaskConical,
    symbolSvg: SYMBOL_PROCESS,
    priority: 3,
    title: {
      en: "Process, Chemical & Fluids",
      de: "Prozess, Chemie & Fluide",
      fr: "Procédé, Chimie et Fluides",
      es: "Proceso, Química y Fluidos",
      ar: "المعالجة والكيمياء والسوائل",
    },
    description: {
      en: "Batch yield, mass balance, pipe friction, blending optimisation and safety relief sizing.",
      de: "Chargenausbeute, Massenbilanz, Rohrreibungsverlust, Mischungsoptimierung und Sicherheitsventilauslegung.",
      fr: "Rendement de lot, bilan massique, perte de charge, optimisation de mélange et dimensionnement de soupape.",
      es: "Rendimiento de lote, balance de masa, pérdida por fricción, optimización de mezcla y dimensionado de válvula de seguridad.",
      ar: "إنتاجية الدفعة، توازن الكتلة، فقد الاحتكاك، تحسين المزج وتحديد حجم صمام الأمان.",
    },
  },
  {
    slug: "cnc-additive-manufacturing",
    icon: Cpu,
    symbolSvg: SYMBOL_CNC,
    priority: 4,
    title: {
      en: "CNC, 3D Printing & Advanced Manufacturing",
      de: "CNC, 3D-Druck & Fertigung",
      fr: "CNC, Impression 3D et Fabrication Avancée",
      es: "CNC, Impresión 3D y Fabricación Avanzada",
      ar: "CNC والطباعة ثلاثية الأبعاد والتصنيع المتقدم",
    },
    description: {
      en: "CNC cycle time, cutting parameters, tool life, 3D print orientation, nesting and machining strategy.",
      de: "CNC-Zykluszeit, Schnittparameter, Werkzeugstandzeit, 3D-Druck-Orientierung, Nesting und Bearbeitungsstrategie.",
      fr: "Temps de cycle CNC, paramètres de coupe, durée d'outil, orientation 3D, imbrication et stratégie d'usinage.",
      es: "Tiempo de ciclo CNC, parámetros de corte, vida útil de la herramienta, orientación 3D, anidamiento y estrategia de mecanizado.",
      ar: "وقت دورة CNC، معلمات القطع، عمر الأداة، اتجاه الطباعة ثلاثية الأبعاد، التعشيش واستراتيجية التصنيع.",
    },
  },
  {
    slug: "metal-plastics-forming",
    icon: Hammer,
    symbolSvg: SYMBOL_METAL,
    priority: 5,
    title: {
      en: "Sheet Metal, Casting, Plastics & Forming",
      de: "Blech, Guss, Kunststoff & Umformung",
      fr: "Tôle, Fonderie, Plasturgie et Formage",
      es: "Chapa, Fundición, Plásticos y Conformado",
      ar: "الصفائح المعدنية، الصب، البلاستيك والتشكيل",
    },
    description: {
      en: "Nesting scrap, casting yield, injection cycle, press force, springback compensation and die life.",
      de: "Nesting-Verschnitt, Gießausbeute, Spritzzyklus, Presskraft, Ruckfederung und Werkzeuglebensdauer.",
      fr: "Chute de nesting, rendement de fonderie, cycle d'injection, force de presse, retour élastique et durée de vie d'outillage.",
      es: "Desperdicio de anidamiento, rendimiento de fundición, ciclo de inyección, fuerza de prensa, recuperación elástica y vida útil del molde.",
      ar: "هدر التعشيش، إنتاجية الصب، دورة الحقن، قوة الكبس، الارتداد وعمر القالب.",
    },
  },
  {
    slug: "project-construction-management",
    icon: Building2,
    symbolSvg: SYMBOL_PROJECT,
    priority: 6,
    title: {
      en: "Project, Site & Construction Management",
      de: "Projekt-, Baustellen- & Bauleitung",
      fr: "Gestion de Projet, Chantier et Construction",
      es: "Gestión de Proyecto, Obra y Construcción",
      ar: "إدارة المشاريع والمواقع والبناء",
    },
    description: {
      en: "EVM, CPM, resource levelling, contract risk, progress billing, scaffolding optimisation and site costs.",
      de: "EVM, CPM, Ressourcen-Nivellierung, Vertragsrisiko, Abschlagsrechnung, Gerustoptimierung und Baustellenkosten.",
      fr: "EVM, CPM, nivellement des ressources, risque contractuel, facturation d'avancement, échafaudage et coûts de chantier.",
      es: "EVM, CPM, nivelación de recursos, riesgo contractual, facturación de avance, andamios y costos de obra.",
      ar: "EVM، CPM، تسوية الموارد، مخاطر العقود، الفوترة حسب التقدم، تحسين السقالات وتكاليف الموقع.",
    },
  },
  {
    slug: "digital-factory-automation",
    icon: Factory,
    symbolSvg: SYMBOL_FACTORY,
    priority: 7,
    title: {
      en: "Digital Factory & Automation",
      de: "Digitale Fabrik & Automatisierung",
      fr: "Usine Numérique et Automatisation",
      es: "Fábrica Digital y Automatización",
      ar: "المصنع الرقمي والأتمتة",
    },
    description: {
      en: "IoT sensor ROI, digital twin, cobot, AGV, energy monitoring and paperless manufacturing tools.",
      de: "IoT-Sensor-ROI, digitaler Zwilling, Cobot, AGV, Energieuberwachung und papierlose Fertigung.",
      fr: "ROI des capteurs IoT, jumeau numérique, cobot, AGV, suivi énergétique et production sans papier.",
      es: "ROI de sensores IoT, gemelo digital, cobot, AGV, monitoreo energético y fabricación sin papel.",
      ar: "ROI مستشعرات إنترنت الأشياء، التوأم الرقمي، الكوبوت، AGV، مراقبة الطاقة والتصنيع غير الورقي.",
    },
  },
  {
    slug: "maintenance-reliability",
    icon: Wrench,
    symbolSvg: SYMBOL_MAINTENANCE,
    priority: 8,
    title: {
      en: "Maintenance & Reliability",
      de: "Instandhaltung & Zuverlässigkeit",
      fr: "Maintenance et Fiabilité",
      es: "Mantenimiento y Confiabilidad",
      ar: "الصيانة والموثوقية",
    },
    description: {
      en: "MTBF/MTTR, spare parts, preventive maintenance, RCA, criticality matrix and reliability strategy.",
      de: "MTBF/MTTR, Ersatzteile, vorbeugende Instandhaltung, RCA, Kritikalitätsmatrix und Zuverlässigkeitsstrategie.",
      fr: "MTBF/MTTR, pièces de rechange, maintenance préventive, RCA, matrice de criticité et stratégie de fiabilité.",
      es: "MTBF/MTTR, repuestos, mantenimiento preventivo, RCA, matriz de criticidad y estrategia de confiabilidad.",
      ar: "MTBF/MTTR، قطع الغيار، الصيانة الوقائية، RCA، مصفوفة الأهمية واستراتيجية الموثوقية.",
    },
  },
  {
    slug: "hse-ergonomics",
    icon: ShieldAlert,
    symbolSvg: SYMBOL_HSE,
    priority: 9,
    title: {
      en: "HSE, Ergonomics & Risk Cost",
      de: "Arbeitsschutz, Ergonomie & Risikokosten",
      fr: "HSE, Ergonomie et Coût du Risque",
      es: "HSE, Ergonomía y Coste de Riesgo",
      ar: "السلامة والصحة المهنية، بيئة العمل وتكلفة المخاطر",
    },
    description: {
      en: "Accident total cost, HSE investment ROI, noise/vibration exposure and ergonomics loss.",
      de: "Unfall-Gesamtkosten, HSE-Investitions-ROI, Lärm-/Vibrationsbelastung und Ergonomieverlust.",
      fr: "Coût total d'accident, ROI des investissements HSE, exposition au bruit/vibrations et perte ergonomique.",
      es: "Costo total de accidente, ROI de inversión HSE, exposición a ruido/vibraciones y pérdida ergonómica.",
      ar: "التكلفة الإجمالية للحوادث، ROI استثمارات الصحة والسلامة، التعرض للضوضاء/الاهتزاز وخسارة بيئة العمل.",
    },
  },
  {
    slug: "procurement-supply-chain",
    icon: Package,
    symbolSvg: SYMBOL_PROCUREMENT,
    priority: 10,
    title: {
      en: "Procurement, Supply Chain & Logistics",
      de: "Beschaffung, Lieferkette & Logistik",
      fr: "Achats, Chaîne d'Approvisionnement et Logistique",
      es: "Compras, Cadena de Suministro y Logística",
      ar: "المشتريات، سلسلة التوريد والخدمات اللوجستية",
    },
    description: {
      en: "Supplier TCO, transport mode, MOQ, import/domestic risk, warehouse layout and reverse logistics.",
      de: "Lieferanten-TCO, Transportart, MOQ, Import-/Inlandsrisiko, Lagerlayout und Reverse Logistics.",
      fr: "TCO fournisseur, mode de transport, MOQ, risque import/domestique, layout d'entrepôt et logistique inverse.",
      es: "TCO de proveedor, modo de transporte, MOQ, riesgo importación/nacional, layout de almacén y logística inversa.",
      ar: "TCO المورد، وضع النقل، MOQ، مخاطر الاستيراد/المحلي، تخطيط المستودع واللوجستيات العكسية.",
    },
  },
  {
    slug: "workforce-hr",
    icon: Users,
    symbolSvg: SYMBOL_WORKFORCE,
    priority: 11,
    title: {
      en: "Workforce, Shift & HR Cost",
      de: "Arbeitskräfte, Schicht & Personalkosten",
      fr: "Main-d'Œuvre, Poste et Coût RH",
      es: "Fuerza Laboral, Turno y Coste de RR. HH.",
      ar: "القوى العاملة، الوردية وتكلفة الموارد البشرية",
    },
    description: {
      en: "Turnover cost, shift comparison, bonus/commission ROI, training ROI, overtime vs hiring breakeven.",
      de: "Fluktuationskosten, Schichtvergleich, Bonus-ROI, Schulungs-ROI, Uberstunden vs Einstellung.",
      fr: "Coût de turnover, comparaison de postes, ROI des primes/commissions, ROI formation, heures sup vs embauche.",
      es: "Costo de rotación, comparación de turnos, ROI de bonos/comisiones, ROI de capacitación, horas extra vs contratación.",
      ar: "تكلفة دوران الموظفين، مقارنة الورديات، ROI الحوافز والعمولات، ROI التدريب، العمل الإضافي مقابل التوظيف.",
    },
  },
  {
    slug: "finance-sales-working-capital",
    icon: Banknote,
    symbolSvg: SYMBOL_FINANCE,
    priority: 12,
    title: {
      en: "Finance, Sales & Working Capital",
      de: "Finanzen, Vertrieb & Betriebskapital",
      fr: "Finance, Ventes et Fonds de Roulement",
      es: "Finanzas, Ventas y Capital de Trabajo",
      ar: "المالية والمبيعات ورأس المال العامل",
    },
    description: {
      en: "CLV/CAC, churn, channel profitability, warranty, cash conversion, leasing, price elasticity and FX.",
      de: "CLV/CAC, Abwanderung, Kanalprofitabilität, Garantie, Cash Conversion, Leasing, Preiselastizität und FX.",
      fr: "CLV/CAC, attrition, rentabilité des canaux, garantie, conversion de trésorerie, leasing, élasticité-prix et FX.",
      es: "CLV/CAC, abandono, rentabilidad de canal, garantía, conversión de efectivo, leasing, elasticidad precio y FX.",
      ar: "CLV/CAC، التراجع، ربحية القناة، الضمان، تحويل النقد، التأجير، مرونة السعر والعملات الأجنبية.",
    },
  },
  {
    slug: "sustainability-resource-esg",
    icon: Leaf,
    symbolSvg: SYMBOL_LEAF,
    priority: 13,
    title: {
      en: "Sustainability, Resources & ESG",
      de: "Nachhaltigkeit, Ressourcen & ESG",
      fr: "Durabilité, Ressources et ESG",
      es: "Sostenibilidad, Recursos y ESG",
      ar: "الاستدامة والموارد والحوكمة البيئية والاجتماعية",
    },
    description: {
      en: "Water, waste, ISO 50001, circular economy, solar/wind ROI, CBAM and Scope 1-2-3 emissions.",
      de: "Wasser, Abfall, ISO 50001, Kreislaufwirtschaft, Solar-/Wind-ROI, CBAM und Scope-1-2-3-Emissionen.",
      fr: "Eau, déchets, ISO 50001, économie circulaire, ROI solaire/éolien, CBAM et émissions Scope 1-2-3.",
      es: "Agua, residuos, ISO 50001, economía circular, ROI solar/eólico, CBAM y emisiones Scope 1-2-3.",
      ar: "المياه، النفايات، ISO 50001، الاقتصاد الدائري، ROI الطاقة الشمسية/الرياح، CBAM وانبعاثات النطاق 1-2-3.",
    },
  },
  {
    slug: "food-cold-chain-hygiene",
    icon: UtensilsCrossed,
    symbolSvg: SYMBOL_FOOD,
    priority: 14,
    title: {
      en: "Food, Cold Chain & Hygiene",
      de: "Lebensmittel, Kuhlkette & Hygiene",
      fr: "Alimentation, Chaîne du Froid et Hygiène",
      es: "Alimentación, Cadena de Frío e Higiene",
      ar: "الأغذية، سلسلة التبريد والنظافة",
    },
    description: {
      en: "Shelf life, recipe cost, HACCP deviation, cold chain break, restaurant plate cost and CIP chemical.",
      de: "Haltbarkeit, Rezepturkosten, HACCP-Abweichung, Kuhlkettenbruch, Tellerkosten und CIP-Chemie.",
      fr: "Durée de conservation, coût de recette, écart HACCP, rupture de chaîne du froid, coût assiette et chimie CIP.",
      es: "Vida útil, costo de receta, desviación HACCP, ruptura de cadena de frío, costo de plato y química CIP.",
      ar: "مدة الصلاحية، تكلفة الوصفة، انحراف HACCP، كسر سلسلة التبريد، تكلفة الطبق وكيمياء CIP.",
    },
  },
  {
    slug: "textile-print-lab",
    icon: Shirt,
    symbolSvg: SYMBOL_TEXTILE,
    priority: 15,
    title: {
      en: "Textile, Printing & Laboratory",
      de: "Textil, Druck & Labor",
      fr: "Textile, Impression et Laboratoire",
      es: "Textil, Impresión y Laboratorio",
      ar: "المنسوجات والطباعة والمختبر",
    },
    description: {
      en: "Fabric spreading, sewing line balance, dye recipe, print waste, press setup waste and lab analysis.",
      de: "Stoffauslegen, Nähabstimmung, Farbrezeptur, Druckabfall, Makulatur und Laboranalyse.",
      fr: "Étalage de tissu, équilibrage de ligne de couture, recette de teinture, déchet d'impression, maculature et analyse labo.",
      es: "Extendido de tela, balanceo de línea de costura, receta de tinte, desperdicio de impresión, maculatura y análisis de laboratorio.",
      ar: "فرد القماش، موازنة خط الخياطة، وصفة الصبغة، هدر الطباعة، التلف وأماكن التحليل المختبري.",
    },
  },
  {
    slug: "electrical-power-systems",
    icon: Zap,
    symbolSvg: SYMBOL_ELECTRIC,
    priority: 16,
    title: {
      en: "Electrical, Panel & Power Systems",
      de: "Elektrik, Schaltschrank & Stromversorgung",
      fr: "Électrique, Armoire et Systèmes d'Alimentation",
      es: "Eléctrica, Tablero y Sistemas de Potencia",
      ar: "الكهرباء واللوحات وأنظمة الطاقة",
    },
    description: {
      en: "Panel heat load, cable sizing, power factor correction, generator/UPS sizing and reactive penalty.",
      de: "Schaltschrank-Wärmelast, Kabelquerschnitt, Kompensation, Generator/USV-Auslegung und Blindstromstrafe.",
      fr: "Charge thermique d'armoire, section de câble, compensation, dimensionnement générateur/onduleur et pénalité réactive.",
      es: "Carga térmica de tablero, sección de cable, compensación, dimensionado de generador/UPS y penalización reactiva.",
      ar: "الحمل الحراري للوحة، مقطع الكابل، تعويض معامل القدرة، تحديد حجم المولد/UPS وعقوبة القدرة غير الفعالة.",
    },
  },
  {
    slug: "mechanical-hvac-energy-loss",
    icon: Thermometer,
    symbolSvg: SYMBOL_THERMAL,
    priority: 17,
    title: {
      en: "Mechanical, HVAC & Energy Loss",
      de: "Mechanik, HLK & Energieverluste",
      fr: "Mécanique, CVC et Pertes Énergétiques",
      es: "Mecánica, HVAC y Pérdidas Energéticas",
      ar: "الميكانيكا والتدفئة والتهوية وتكييف الهواء وفقدان الطاقة",
    },
    description: {
      en: "Welding cost, brazing, adhesive, heat load, duct friction, insulation, steam trap, exchanger and vacuum.",
      de: "Schweißkosten, Loten, Klebstoff, Wärmelast, Kanalreibung, Isolierung, Kondensatableiter, Wärmetauscher und Vakuum.",
      fr: "Coût de soudure, brasage, adhésif, charge thermique, friction de conduit, isolation, purgeur, échangeur et vide.",
      es: "Costo de soldadura, soldadura fuerte, adhesivo, carga térmica, fricción de conducto, aislamiento, purgador, intercambiador y vacío.",
      ar: "تكلفة اللحام، اللحام بالنحاس، المادة اللاصقة، الحمل الحراري، احتكاك القناة، العزل، مصيدة البخار، المبادل والتفريغ.",
    },
  },
  {
    slug: "packaging-local-business",
    icon: Box,
    symbolSvg: SYMBOL_BOX,
    priority: 18,
    title: {
      en: "Packaging & Local Business Tools",
      de: "Verpackung & lokale Geschäftswerkzeuge",
      fr: "Emballage et Outils pour Entreprises Locales",
      es: "Embalaje y Herramientas para Negocios Locales",
      ar: "التعبئة والتغليف وأدوات الأعمال المحلية",
    },
    description: {
      en: "Package sizing, material substitution, pallet configuration, volumetric weight and auto shop quoting.",
      de: "Verpackungsgroße, Materialsubstitution, Palettenkonfiguration, Volumengewicht und Kfz-Reparaturangebote.",
      fr: "Dimensionnement d'emballage, substitution de matériau, configuration palette, poids volumétrique et devis auto.",
      es: "Dimensionado de embalaje, sustitución de material, configuración de palet, peso volumétrico y cotización de taller.",
      ar: "تحجيم التغليف، استبدال المواد، تكوين البليت، الوزن الحجمي وعروض ورشة السيارات.",
    },
  },
  {
    slug: "global-compliance-trade",
    icon: Globe,
    symbolSvg: SYMBOL_GLOBE,
    priority: 19,
    title: {
      en: "Global Compliance, Trade & Tax",
      de: "Globale Compliance, Handel & Steuern",
      fr: "Conformité Mondiale, Commerce et Fiscalité",
      es: "Cumplimiento Global, Comercio e Impuestos",
      ar: "الامتثال العالمي والتجارة والضرائب",
    },
    description: {
      en: "Data privacy, IFRS/SOX, AML/KYC, supply chain risk, transfer pricing, FTA and country risk premium.",
      de: "Datenschutz, IFRS/SOX, AML/KYC, Lieferkettenrisiko, Verrechnungspreise, FHA und Länderrisikoprämie.",
      fr: "Confidentialité des données, IFRS/SOX, AML/KYC, risque de chaîne d'approvisionnement, prix de transfert, ALE et prime de risque pays.",
      es: "Privacidad de datos, IFRS/SOX, AML/KYC, riesgo de cadena de suministro, precios de transferencia, TLC y prima de riesgo país.",
      ar: "خصوصية البيانات، IFRS/SOX، AML/KYC، مخاطر سلسلة التوريد، التسعير التحويلي، اتفاقية التجارة الحرة وعلاوة مخاطر الدولة.",
    },
  },
  {
    slug: "technology-ai-cloud-cyber",
    icon: Microchip,
    symbolSvg: SYMBOL_CHIP,
    priority: 20,
    title: {
      en: "Technology, AI, Cloud & Cyber Risk",
      de: "Technologie, KI, Cloud & Cyber-Risiko",
      fr: "Technologie, IA, Cloud et Risque Cyber",
      es: "Tecnología, IA, Nube y Riesgo Cibernético",
      ar: "التكنولوجيا والذكاء الاصطناعي والسحابة والمخاطر السيبرانية",
    },
    description: {
      en: "Cloud cost, SaaS shelfware, AI token, automation ROI, EU AI Act, EOR and cybersecurity breach cost.",
      de: "Cloud-Kosten, SaaS-Shelfware, KI-Token, Automatisierungs-ROI, EU AI Act, EOR und Cybersicherheitskosten.",
      fr: "Coût cloud, logiciels SaaS inutilisés, token IA, ROI automation, EU AI Act, EOR et coût de brèche cyber.",
      es: "Costo cloud, shelfware SaaS, token IA, ROI automatización, EU AI Act, EOR y costo de brecha de seguridad.",
      ar: "تكلفة السحابة، البرامج غير المستخدمة SaaS، رمز الذكاء الاصطناعي، ROI الأتمتة، قانون الذكاء الاصطناعي الأوروبي، EOR وتكلفة الاختراق السيبراني.",
    },
  },
];

/**
 * Resolve a PremiumCategoryEntry by slug. Returns undefined for unknown slugs.
 * @param slug - Category slug to look up
 * @returns The category entry or undefined
 */
export function getPremiumCategoryBySlug(
  slug: string,
): PremiumCategoryEntry | undefined {
  return PREMIUM_CATEGORIES.find((cat) => cat.slug === slug);
}

/**
 * Get all premium category slugs in priority order.
 */
export function getPremiumCategorySlugs(): readonly PremiumCategorySlug[] {
  return PREMIUM_CATEGORIES.map((cat) => cat.slug);
}

/**
 * Resolve a category title for a given locale.
 * Falls back to English for unsupported locales.
 */
export function resolvePremiumCategoryTitle(
  slug: PremiumCategorySlug,
  locale: string,
): string {
  const cat = getPremiumCategoryBySlug(slug);
  if (!cat) {
    return slug;
  }
  const localeKey = locale.toLowerCase();
  if (localeKey === "de") return cat.title.de;
  if (localeKey === "fr") return cat.title.fr;
  if (localeKey === "es") return cat.title.es;
  if (localeKey === "ar") return cat.title.ar;
  return cat.title.en;
}
