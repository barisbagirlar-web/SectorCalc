type AppLocale = "en";

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

const PREMIUM_ROADMAP_I18N: Record<string, PremiumRoadmapCopy> = {
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
    eyebrow: "Strategic Roadmap",
    title: "Strategic Premium Calculator Roadmap",
    subtitle:
      "Planned and live premium calculators from the strategic SectorCalc catalog. Live entries open the current calculator; planned entries remain on the roadmap until release.",
    phaseFilterLabel: "Phase",
    statusFilterLabel: "Status",
    phaseAll: "All Phases",
    phase1: "Phase 1 — Priority Premium Calculators",
    phase2: "Phase 2 — Operational Decision Calculators",
    phase3: "Phase 3 — Traffic & Authority Calculators",
    phase4: "Phase 4 — Niche Technical Calculators",
    phaseBadge: (phase) => `Phase ${phase}`,
    statusAll: "All",
    statusLive: "Live",
    statusPlanned: "Planned",
    scoreLabel: (score) => `Score ${score}`,
    ctaOpen: "Open Calculator",
    ctaComingSoon: "Coming Soon",
    noResults: "No calculators match these filters.",
    categories: {
      "cost-margin": "Cost & Margin",
      "operations-oee": "Operations & OEE",
      "energy-carbon": "Energy & CO₂",
      "finance-hr": "Finanzen & HR",
      "manufacturing-engineering": "Fertigung & Technik",
      "engineering-technical": "Technik & Engineering",
      "quality-lean": "Quality & Lean",
    },
  },
  fr: {
    eyebrow: "Strategic Roadmap",
    title: "Strategic Premium Calculator Roadmap",
    subtitle:
      "Planned and live premium calculators from the strategic SectorCalc catalog. Live entries open the current calculator; planned entries remain on the roadmap until release.",
    phaseFilterLabel: "Phase",
    statusFilterLabel: "Status",
    phaseAll: "All Phases",
    phase1: "Phase 1 — Priority Premium Calculators",
    phase2: "Phase 2 — Operational Decision Calculators",
    phase3: "Phase 3 — Traffic & Authority Calculators",
    phase4: "Phase 4 — Niche Technical Calculators",
    phaseBadge: (phase) => `Phase ${phase}`,
    statusAll: "All",
    statusLive: "Live",
    statusPlanned: "Planned",
    scoreLabel: (score) => `Score ${score}`,
    ctaOpen: "Open Calculator",
    ctaComingSoon: "Coming Soon",
    noResults: "No calculators match these filters.",
    categories: {
      "cost-margin": "Cost & Margin",
      "operations-oee": "Operations & OEE",
      "energy-carbon": "Energy & CO₂",
      "finance-hr": "Finance & HR",
      "manufacturing-engineering": "Manufacturing & Engineering",
      "engineering-technical": "Engineering & Technical",
      "quality-lean": "Quality & Lean",
    },
  },
  es: {
    eyebrow: "Strategic Roadmap",
    title: "Strategic Premium Calculator Roadmap",
    subtitle:
      "Planned and live premium calculators from the strategic SectorCalc catalog. Live entries open the current calculator; planned entries remain on the roadmap until release.",
    phaseFilterLabel: "Phase",
    statusFilterLabel: "Status",
    phaseAll: "All Phases",
    phase1: "Phase 1 — Priority Premium Calculators",
    phase2: "Phase 2 — Operational Decision Calculators",
    phase3: "Phase 3 — Traffic & Authority Calculators",
    phase4: "Phase 4 — Niche Technical Calculators",
    phaseBadge: (phase) => `Phase ${phase}`,
    statusAll: "All",
    statusLive: "Live",
    statusPlanned: "Planned",
    scoreLabel: (score) => `Score ${score}`,
    ctaOpen: "Open Calculator",
    ctaComingSoon: "Coming Soon",
    noResults: "No calculators match these filters.",
    categories: {
      "cost-margin": "Cost & Margin",
      "operations-oee": "Operations & OEE",
      "energy-carbon": "Energy & CO₂",
      "finance-hr": "Finance & HR",
      "manufacturing-engineering": "Manufacturing & Engineering",
      "engineering-technical": "Engineering & Technical",
      "quality-lean": "Quality & Lean",
    },
  },
  ar: {
    eyebrow: "Strategic Roadmap",
    title: "Strategic Premium Calculator Roadmap",
    subtitle:
      "Planned and live premium calculators from the strategic SectorCalc catalog. Live entries open the current calculator; planned entries remain on the roadmap until release.",
    phaseFilterLabel: "Phase",
    statusFilterLabel: "Status",
    phaseAll: "All Phases",
    phase1: "Phase 1 — Priority Premium Calculators",
    phase2: "Phase 2 — Operational Decision Calculators",
    phase3: "Phase 3 — Traffic & Authority Calculators",
    phase4: "Phase 4 — Niche Technical Calculators",
    phaseBadge: (phase) => `Phase ${phase}`,
    statusAll: "All",
    statusLive: "Live",
    statusPlanned: "Planned",
    scoreLabel: (score) => `Score ${score}`,
    ctaOpen: "Open Calculator",
    ctaComingSoon: "Coming Soon",
    noResults: "No calculators match these filters.",
    categories: {
      "cost-margin": "Cost & Margin",
      "operations-oee": "Operations & OEE",
      "energy-carbon": "Energy & CO₂",
      "finance-hr": "Finance & HR",
      "manufacturing-engineering": "Manufacturing & Engineering",
      "engineering-technical": "Engineering & Technical",
      "quality-lean": "Quality & Lean",
    },
  },
};

export function getPremiumRoadmapCopy(locale: string): PremiumRoadmapCopy {
  const key = locale in PREMIUM_ROADMAP_I18N ? (locale as AppLocale) : "en";
  return PREMIUM_ROADMAP_I18N[key];
}
