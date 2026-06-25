import type { AppLocale } from "@/i18n/routing";

export type PremiumRoadmapCopy = {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly phaseFilterLabel: string;
  readonly statusFilterLabel: string;
  readonly phaseAll: string;
  readonly phase1: string;
  readonly phase2: string;
  readonly phase3: string;
  readonly phase4: string;
  readonly phaseBadge: (phase: number) => string;
  readonly statusAll: string;
  readonly statusLive: string;
  readonly statusPlanned: string;
  readonly scoreLabel: (score: string) => string;
  readonly ctaOpen: string;
  readonly ctaComingSoon: string;
  readonly noResults: string;
  readonly categories: Record<string, string>;
};

const PREMIUM_ROADMAP_I18N: Record<AppLocale, PremiumRoadmapCopy> = {
  en: {
    eyebrow: "Strategic roadmap",
    title: "Strategic Premium Calculator Roadmap",
    subtitle:
      "Planned and live premium calculators from the SectorCalc strategic catalog. Live items open the current calculator; planned items stay on the roadmap until release.",
    phaseFilterLabel: "Phase",
    statusFilterLabel: "Status",
    phaseAll: "All phases",
    phase1: "Phase 1 — Priority premium calculators",
    phase2: "Phase 2 — Operational decision calculators",
    phase3: "Phase 3 — Traffic and authority calculators",
    phase4: "Phase 4 — Niche technical calculators",
    phaseBadge: (phase) => `Phase ${phase}`,
    statusAll: "All",
    statusLive: "Live",
    statusPlanned: "Planned",
    scoreLabel: (score) => `Score ${score}`,
    ctaOpen: "Open calculator",
    ctaComingSoon: "On roadmap",
    noResults: "No calculators match these filters.",
    categories: {
      "cost-margin": "Cost & margin",
      "operations-oee": "Operations & OEE",
      "energy-carbon": "Energy & carbon",
      "finance-hr": "Finance & HR",
      "manufacturing-engineering": "Manufacturing & engineering",
      "engineering-technical": "Engineering & technical",
      "quality-lean": "Quality & lean",
    },
  },
  tr: {
    eyebrow: "Strategic roadmap",
    title: "Strategic Premium Calculator Roadmap",
    subtitle:
      "Planned and live premium calculators from the SectorCalc strategic catalog. Live items open the current calculator; planned items stay on the roadmap until release.",
    phaseFilterLabel: "Phase",
    statusFilterLabel: "Status",
    phaseAll: "All phases",
    phase1: "Phase 1 — Priority premium calculators",
    phase2: "Phase 2 — Operational decision calculators",
    phase3: "Phase 3 — Traffic and authority calculators",
    phase4: "Phase 4 — Niche technical calculators",
    phaseBadge: (phase) => `Phase ${phase}`,
    statusAll: "All",
    statusLive: "Live",
    statusPlanned: "Planned",
    scoreLabel: (score) => `Score ${score}`,
    ctaOpen: "Open calculator",
    ctaComingSoon: "On roadmap",
    noResults: "No calculators match these filters.",
    categories: {
      "cost-margin": "Cost & margin",
      "operations-oee": "Operations & OEE",
      "energy-carbon": "Energy & carbon",
      "finance-hr": "Finance & HR",
      "manufacturing-engineering": "Manufacturing & engineering",
      "engineering-technical": "Engineering & technical",
      "quality-lean": "Quality & lean",
    },
  },
  de: {
    eyebrow: "Strategische Roadmap",
    title: "Strategische Premium-Rechner-Roadmap",
    subtitle:
      "Geplante und live Premium-Rechner aus dem strategischen SectorCalc-Katalog. Live-Einträge öffnen den aktuellen Rechner; geplante bleiben bis zur Veröffentlichung auf der Roadmap.",
    phaseFilterLabel: "Phase",
    statusFilterLabel: "Status",
    phaseAll: "Alle Phasen",
    phase1: "Phase 1 — Prioritäre Premium-Rechner",
    phase2: "Phase 2 — Operative Entscheidungsrechner",
    phase3: "Phase 3 — Traffic- und Autoritätsrechner",
    phase4: "Phase 4 — Nischen-Technikrechner",
    phaseBadge: (phase) => `Phase ${phase}`,
    statusAll: "Alle",
    statusLive: "Live",
    statusPlanned: "Geplant",
    scoreLabel: (score) => `Score ${score}`,
    ctaOpen: "Rechner öffnen",
    ctaComingSoon: "Demnächst",
    noResults: "Keine Rechner passen zu diesen Filtern.",
    categories: {
      "cost-margin": "Kosten & Marge",
      "operations-oee": "Betrieb & OEE",
      "energy-carbon": "Energie & CO₂",
      "finance-hr": "Finanzen & HR",
      "manufacturing-engineering": "Fertigung & Technik",
      "engineering-technical": "Technik & Engineering",
      "quality-lean": "Qualität & Lean",
    },
  },
  fr: {
    eyebrow: "Feuille de route stratégique",
    title: "Feuille de route des calculateurs premium",
    subtitle:
      "Calculateurs premium planifiés et en ligne du catalogue stratégique SectorCalc. Les entrées en ligne ouvrent le calculateur actuel ; les planifiés restent sur la feuille de route jusqu'à la sortie.",
    phaseFilterLabel: "Phase",
    statusFilterLabel: "Statut",
    phaseAll: "Toutes les phases",
    phase1: "Phase 1 — Calculateurs premium prioritaires",
    phase2: "Phase 2 — Calculateurs de décision opérationnelle",
    phase3: "Phase 3 — Calculateurs trafic et autorité",
    phase4: "Phase 4 — Calculateurs techniques de niche",
    phaseBadge: (phase) => `Phase ${phase}`,
    statusAll: "Tous",
    statusLive: "En ligne",
    statusPlanned: "Planifié",
    scoreLabel: (score) => `Score ${score}`,
    ctaOpen: "Ouvrir le calculateur",
    ctaComingSoon: "Bientôt",
    noResults: "Aucun calculateur ne correspond à ces filtres.",
    categories: {
      "cost-margin": "Coût et marge",
      "operations-oee": "Opérations et OEE",
      "energy-carbon": "Énergie et carbone",
      "finance-hr": "Finance et RH",
      "manufacturing-engineering": "Fabrication et ingénierie",
      "engineering-technical": "Ingénierie et technique",
      "quality-lean": "Qualité et lean",
    },
  },
  es: {
    eyebrow: "Hoja de ruta estratégica",
    title: "Hoja de ruta de calculadoras premium",
    subtitle:
      "Calculadoras premium planificadas y en vivo del catálogo estratégico de SectorCalc. Las entradas en vivo abren la calculadora actual; las planificadas permanecen en la hoja de ruta hasta el lanzamiento.",
    phaseFilterLabel: "Fase",
    statusFilterLabel: "Estado",
    phaseAll: "Todas las fases",
    phase1: "Fase 1 — Calculadoras premium prioritarias",
    phase2: "Fase 2 — Calculadoras de decisión operativa",
    phase3: "Fase 3 — Calculadoras de tráfico y autoridad",
    phase4: "Fase 4 — Calculadoras técnicas de nicho",
    phaseBadge: (phase) => `Fase ${phase}`,
    statusAll: "Todos",
    statusLive: "En vivo",
    statusPlanned: "Planificado",
    scoreLabel: (score) => `Puntuación ${score}`,
    ctaOpen: "Abrir calculadora",
    ctaComingSoon: "Próximamente",
    noResults: "Ninguna calculadora coincide con estos filtros.",
    categories: {
      "cost-margin": "Costo y margen",
      "operations-oee": "Operaciones y OEE",
      "energy-carbon": "Energía y carbono",
      "finance-hr": "Finanzas y RR. HH.",
      "manufacturing-engineering": "Manufactura e ingeniería",
      "engineering-technical": "Ingeniería y técnica",
      "quality-lean": "Calidad y lean",
    },
  },
  ar: {
    eyebrow: "خارطة الطريق الاستراتيجية",
    title: "خارطة طريق الحاسبات المميزة",
    subtitle:
      "حاسبات مميزة مخططة ومباشرة من الكتالوج الاستراتيجي لـ SectorCalc. العناصر المباشرة تفتح الحاسبة الحالية؛ المخططة تبقى على خارطة الطريق حتى الإطلاق.",
    phaseFilterLabel: "المرحلة",
    statusFilterLabel: "الحالة",
    phaseAll: "كل المراحل",
    phase1: "المرحلة 1 — حاسبات مميزة ذات أولوية",
    phase2: "المرحلة 2 — حاسبات القرار التشغيلي",
    phase3: "المرحلة 3 — حاسبات الحركة والسلطة",
    phase4: "المرحلة 4 — حاسبات تقنية متخصصة",
    phaseBadge: (phase) => `المرحلة ${phase}`,
    statusAll: "الكل",
    statusLive: "مباشر",
    statusPlanned: "مخطط",
    scoreLabel: (score) => `النتيجة ${score}`,
    ctaOpen: "افتح الحاسبة",
    ctaComingSoon: "قريبًا",
    noResults: "لا توجد حاسبات تطابق هذه الفلاتر.",
    categories: {
      "cost-margin": "التكلفة والهامش",
      "operations-oee": "العمليات وOEE",
      "energy-carbon": "الطاقة والكربون",
      "finance-hr": "المالية والموارد البشرية",
      "manufacturing-engineering": "التصنيع والهندسة",
      "engineering-technical": "الهندسة والتقنية",
      "quality-lean": "الجودة واللين",
    },
  },
};

export function getPremiumRoadmapCopy(locale: string): PremiumRoadmapCopy {
  const key = locale in PREMIUM_ROADMAP_I18N ? (locale as AppLocale) : "en";
  return PREMIUM_ROADMAP_I18N[key];
}
