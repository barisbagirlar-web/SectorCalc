#!/usr/bin/env node
/**
 * Normalizes user-facing "analyzer/analysis" copy to calculator/calculation terminology
 * across all locale message files.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const MESSAGES_DIR = join(ROOT, "messages");

/** Longest-first replacements per locale (string values only). */
const VALUE_REPLACEMENTS = {
  en: [
    ["Premium Analyzers", "Premium Calculators"],
    ["premium analyzers", "premium calculators"],
    ["Premium Analyzer", "Premium Calculator"],
    ["premium analyzer", "premium calculator"],
    ["View analyzers", "View calculators"],
    ["Showing analyzers", "Showing calculators"],
    ["View analyzer", "View calculator"],
    ["Open analyzers", "Open calculators"],
    ["open analyzers", "open calculators"],
    ["Return to analyzer", "Return to calculator"],
    ["Return to the premium analyzer", "Return to the premium calculator"],
    ["Browse premium analyzers", "Browse premium calculators"],
    ["Explore premium analyzers", "Explore premium calculators"],
    ["premium verdict analyzers", "premium verdict calculators"],
    ["verdict analyzers", "verdict calculators"],
    ["Intelligence analyzers", "Intelligence calculators"],
    ["Risk Analyzers", "Risk Calculators"],
    ["Risk Analyzer", "Risk Calculator"],
    ["Hidden Loss Decision Reports — Premium Analyzers", "Hidden Loss Decision Reports — Premium Calculators"],
    ["All Premium Analyzers", "All Premium Calculators"],
    ["View Premium Analyzers", "View Premium Calculators"],
    ["Decision analyzer", "Decision calculator"],
    ["decision analyzer", "decision calculator"],
    ["Run analysis", "Run calculation"],
    ["run analysis", "run calculation"],
    ["Run the analysis", "Run the calculation"],
    ["Open analysis", "Open calculation"],
    ["one-off analysis", "one-off calculation"],
    ["margin analysis", "margin calculation"],
    ["Hidden variable analysis", "Hidden variable calculation"],
    ["MarginCore analysis", "MarginCore calculation"],
    ["valid analysis", "valid calculation"],
    ["preview analysis", "preview calculation"],
    ["deeper analysis", "deeper calculation"],
    ["Operational decision analysis", "Operational decision calculation"],
    ["Search calculators and analyzers", "Search calculators"],
    ["{# analyzer", "{# calculator"],
    ["{# analyzers", "{# calculators"],
    [" analyzers", " calculators"],
    [" analyzer", " calculator"],
    [" analyses", " calculations"],
    [" analysis", " calculation"],
    ["Analyze", "Calculate"],
    ["analyze", "calculate"],
  ],
  // tr: removed
  de: [
    ["Premium-Analysatoren", "Premium-Rechner"],
    ["Premium-Analysator", "Premium-Rechner"],
    ["premium Analysatoren", "Premium-Rechner"],
    ["premium Analysator", "Premium-Rechner"],
    ["Analysatoren", "Rechner"],
    ["Analysator", "Rechner"],
    ["Analyse öffnen", "Berechnung öffnen"],
    ["Analyse starten", "Berechnung starten"],
    ["View analyzers", "Rechner ansehen"],
    ["View analyzer", "Rechner ansehen"],
    ["Showing analyzers", "Rechner werden angezeigt"],
    ["{# analyzer", "{# Rechner"],
    ["{# analyzers", "{# Rechner"],
    [" analyzers", " Rechner"],
    [" analyzer", " Rechner"],
    ["Rechner und Analysen", "Rechner suchen"],
    ["Open full CNC Quote Risk Analyzer", "CNC-Angebotsrisiko-Rechner öffnen"],
    ["Open CNC Quote Risk Analyzer", "CNC-Angebotsrisiko-Rechner öffnen"],
    ["Decision analyzer", "Entscheidungsrechner"],
    ["premium analyzer", "Premium-Rechner"],
    ["MarginCore analysis", "MarginCore-Berechnung"],
    ["one-off analysis", "einmalige Berechnung"],
    ["margin analysis", "Margenberechnung"],
    ["Return to analyzer", "Zurück zum Rechner"],
    ["Return to the premium analyzer", "Zum Premium-Rechner zurückkehren"],
    ["Run a premium analyzer", "Premium-Rechner ausführen"],
    ["Premium-Analyzer", "Premium-Rechner"],
    ["Premium Analyzer", "Premium-Rechner"],
    [" für diesen Analyzer.", " für diesen Rechner."],
    ["genutzten Analyzer", "genutzten Rechner"],
  ],
  fr: [
    ["Analyseurs premium", "Calculateurs premium"],
    ["analyseurs premium", "calculateurs premium"],
    ["Analyseur premium", "Calculateur premium"],
    ["analyseur premium", "calculateur premium"],
    ["Ouvrir l'analyseur", "Ouvrir le calculateur"],
    ["Ouvrir l'analyse", "Ouvrir le calcul"],
    ["Lancer l'analyse", "Lancer le calcul"],
    ["Analyseurs", "Calculateurs"],
    ["Analyseur", "Calculateur"],
    ["analyseurs", "calculateurs"],
    ["analyseur", "calculateur"],
    ["Analyse", "Calcul"],
    ["analyser", "calculer"],
    ["View analyzers", "Voir les calculateurs"],
    ["View analyzer", "Voir le calculateur"],
    ["{# analyzer", "{# calculateur"],
    ["{# analyzers", "{# calculateurs"],
    ["Open full CNC Quote Risk Analyzer", "Ouvrir le calculateur de risque devis CNC"],
    ["Open CNC Quote Risk Analyzer", "Ouvrir le calculateur de risque devis CNC"],
    ["Decision analyzer", "Calculateur de décision"],
    ["premium analyzer", "calculateur premium"],
    ["MarginCore analysis", "calcul MarginCore"],
    ["one-off analysis", "calcul ponctuel"],
    ["margin analysis", "calcul de marge"],
    ["Return to analyzer", "Retour au calculateur"],
    ["Return to the premium analyzer", "Retour au calculateur premium"],
    ["Run a premium analyzer", "Lancer un calculateur premium"],
  ],
  es: [
    ["Analizadores premium", "Calculadoras premium"],
    ["analizadores premium", "calculadoras premium"],
    ["Analizador premium", "Calculadora premium"],
    ["analizador premium", "calculadora premium"],
    ["Abrir análisis", "Abrir cálculo"],
    ["Abrir analizador", "Abrir calculadora"],
    ["Analizadores", "Calculadoras"],
    ["Analizador", "Calculadora"],
    ["analizadores", "calculadoras"],
    ["analizador", "calculadora"],
    ["Análisis", "Cálculo"],
    ["análisis", "cálculo"],
    ["analizar", "calcular"],
    ["View analyzers", "Ver calculadoras"],
    ["View analyzer", "Ver calculadora"],
    ["{# analyzer", "{# calculadora"],
    ["{# analyzers", "{# calculadoras"],
    ["Open full CNC Quote Risk Analyzer", "Abrir calculadora de riesgo de presupuesto CNC"],
    ["Open CNC Quote Risk Analyzer", "Abrir calculadora de riesgo de presupuesto CNC"],
    ["Decision analyzer", "Calculadora de decisión"],
    ["premium analyzer", "calculadora premium"],
    ["MarginCore analysis", "cálculo MarginCore"],
    ["one-off analysis", "cálculo puntual"],
    ["margin analysis", "cálculo de margen"],
    ["Return to analyzer", "Volver a la calculadora"],
    ["Return to the premium analyzer", "Volver a la calculadora premium"],
    ["Run a premium analyzer", "Ejecutar una calculadora premium"],
  ],
  ar: [
    ["Premium Analyzers", "Premium Calculators"],
    ["premium analyzers", "premium calculators"],
    ["Premium Analyzer", "Premium Calculator"],
    ["premium analyzer", "premium calculator"],
    ["Decision analyzer", "Decision calculator"],
    ["View analyzers", "View calculators"],
    ["View analyzer", "View calculator"],
    ["Return to analyzer", "Return to calculator"],
    ["Open analysis", "Open calculation"],
    ["Open premium analyzers", "Open premium calculators"],
    ["Browse premium analyzers", "Browse premium calculators"],
    ["Explore premium analyzers", "Explore premium calculators"],
    ["Intelligence analyzers", "Intelligence calculators"],
    ["Risk Analyzers", "Risk Calculators"],
    ["Risk Analyzer", "Risk Calculator"],
    ["Analyze", "Calculate"],
    ["analysis", "calculation"],
    ["analyzers", "calculators"],
    ["analyzer", "calculator"],
    ["افتح التحليل", "ابدأ الحساب"],
    ["تحليل", "حساب"],
    ["محلل", "حاسبة"],
    ["يحلل", "يحسب"],
  ],
};

const CATALOG_EXPLORER_PATCH = {
  de: {
    "labels.categories.navLabel": "Nach Funktion stöbern",
    "labels.categories.countLabel": "{count, plural, one {# Werkzeug} other {# Werkzeuge}}",
    "labels.categories.viewCategory": "Werkzeuge ansehen",
    "labels.categories.viewCategoryOpen": "Werkzeuge werden angezeigt",
    "labels.free-tools.navLabel": "Nach Kategorie stöbern",
    "labels.premium-tools.navLabel": "Nach Berichtstyp stöbern",
    "labels.premium-tools.countLabel": "{count, plural, one {# Rechner} other {# Rechner}}",
    "labels.premium-tools.viewCategory": "Rechner ansehen",
    "labels.premium-tools.viewCategoryOpen": "Rechner werden angezeigt",
    "labels.premium-tools.openItem": "Rechner öffnen →",
    "labels.industries.navLabel": "Nach Branchengruppe stöbern",
    "discoveryCards.ctaOpenAnalysis": "Berechnung öffnen",
    "discoveryFooter.freeToolsLead": "Brauchen Sie eine tiefere Berechnung?",
    "search.placeholder.homepage": "Rechner suchen…",
  },
  fr: {
    "labels.categories.navLabel": "Parcourir par fonction",
    "labels.categories.countLabel": "{count, plural, one {# outil} other {# outils}}",
    "labels.categories.viewCategory": "Voir les outils",
    "labels.categories.viewCategoryOpen": "Outils affichés",
    "labels.free-tools.navLabel": "Parcourir par catégorie",
    "labels.premium-tools.navLabel": "Parcourir par type de rapport",
    "labels.premium-tools.countLabel": "{count, plural, one {# calculateur} other {# calculateurs}}",
    "labels.premium-tools.viewCategory": "Voir les calculateurs",
    "labels.premium-tools.viewCategoryOpen": "Calculateurs affichés",
    "labels.premium-tools.openItem": "Ouvrir le calculateur →",
    "labels.industries.navLabel": "Parcourir par groupe sectoriel",
    "discoveryCards.ctaOpenAnalysis": "Ouvrir le calcul",
    "discoveryFooter.freeToolsLead": "Besoin d'un calcul plus détaillé ?",
    "search.placeholder.homepage": "Rechercher des calculateurs…",
  },
  es: {
    "labels.categories.navLabel": "Explorar por función",
    "labels.categories.countLabel": "{count, plural, one {# herramienta} other {# herramientas}}",
    "labels.categories.viewCategory": "Ver herramientas",
    "labels.categories.viewCategoryOpen": "Herramientas mostradas",
    "labels.free-tools.navLabel": "Explorar por categoría",
    "labels.premium-tools.navLabel": "Explorar por tipo de informe",
    "labels.premium-tools.countLabel": "{count, plural, one {# calculadora} other {# calculadoras}}",
    "labels.premium-tools.viewCategory": "Ver calculadoras",
    "labels.premium-tools.viewCategoryOpen": "Calculadoras mostradas",
    "labels.premium-tools.openItem": "Abrir calculadora →",
    "labels.industries.navLabel": "Explorar por grupo sectorial",
    "discoveryCards.ctaOpenAnalysis": "Abrir cálculo",
    "discoveryFooter.freeToolsLead": "¿Necesita un cálculo más detallado?",
    "search.placeholder.homepage": "Buscar calculadoras…",
  },
  ar: {
    "labels.categories.navLabel": "تصفح حسب الوظيفة",
    "labels.categories.countLabel": "{count, plural, one {# أداة} other {# أدوات}}",
    "labels.categories.viewCategory": "عرض الأدوات",
    "labels.categories.viewCategoryOpen": "الأدوات معروضة",
    "labels.free-tools.navLabel": "تصفح حسب الفئة",
    "labels.premium-tools.navLabel": "تصفح حسب نوع التقرير",
    "labels.premium-tools.countLabel": "{count, plural, one {# حاسبة} other {# حاسبات}}",
    "labels.premium-tools.viewCategory": "عرض الحاسبات",
    "labels.premium-tools.viewCategoryOpen": "الحاسبات معروضة",
    "labels.premium-tools.openItem": "فتح الحاسبة →",
    "labels.industries.navLabel": "تصفح حسب مجموعة القطاع",
    "discoveryCards.ctaOpenAnalysis": "فتح الحساب",
    "discoveryFooter.freeToolsLead": "هل تحتاج حسابًا أعمق؟",
    "search.placeholder.homepage": "البحث في الحاسبات…",
  },
};

function applyReplacements(value, locale) {
  const rules = VALUE_REPLACEMENTS[locale] ?? VALUE_REPLACEMENTS.en;
  let out = value;
  for (const [from, to] of rules) {
    if (out.includes(from)) {
      out = out.split(from).join(to);
    }
  }
  if (locale === "de") {
    out = out
      .replaceAll("Premium-Berechnungn", "Premium-Rechner")
      .replaceAll("Berechnungtool", "Rechner")
      .replaceAll("Premium-Berechnungtool", "Premium-Rechner");
  }
  return out;
}

function transformNode(node, locale) {
  if (typeof node === "string") {
    return applyReplacements(node, locale);
  }
  if (Array.isArray(node)) {
    return node.map((item) => transformNode(item, locale));
  }
  if (node && typeof node === "object") {
    const out = {};
    for (const [key, value] of Object.entries(node)) {
      out[key] = transformNode(value, locale);
    }
    return out;
  }
  return node;
}

function setByPath(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    cur = cur[parts[i]];
    if (!cur) return;
  }
  cur[parts[parts.length - 1]] = value;
}

function setRootPath(obj, path, value) {
  setByPath(obj, path, value);
}

/** Explicit dot-path fixes after bulk replace (locale parity + terminology). */
const EXPLICIT_ROOT_PATCHES = {
  fr: {
    "valueProps.subtitle":
      "SectorCalc révèle fuites financières, matières, temps et énergie avec contrôles gratuits et calculateurs premium.",
    "pricing.proDescription":
      "Calculateurs premium illimités dans tous les secteurs avec rapports enregistrés.",
    "pricing.proFeatures":
      "Tous les calculateurs|Rapports enregistrés|Export PDF|Résiliable à tout moment",
    "pricing.proAnnualFeatures":
      "Tous les calculateurs|Rapports enregistrés|PDF|Onboarding prioritaire",
    "checkoutPages.successPremiumCta": "Ouvrir les calculateurs premium",
    "freeTrafficCatalog.sectorToolsLead":
      "Contrôles gratuits par secteur liés aux calculateurs premium sur 27 secteurs.",
    "freeTrafficCatalog.premiumUpsellBody":
      "Les calculateurs premium ajoutent prix plancher, détection de fuite de marge et verdicts accepter / revoir le prix — inclus avec SectorCalc Pro.",
    "freeTrafficCatalog.premiumUpsellCta": "Explorer les calculateurs premium",
    "freeTrafficCatalog.tool.premiumBlockBody":
      "Les calculateurs gratuits montrent le premier chiffre. Les calculateurs premium ajoutent facteurs cachés, seuils, actions suggérées et rapports exportables.",
    "purchaseSuccess.proUpsellBody":
      "27 secteurs, calculateurs premium illimités et rapports enregistrés — Pro à partir de 19 $/mois.",
    "home.premiumStep.subtitle":
      "Les calculateurs premium ajoutent prix minimum sûr, fuites de marge, action suggérée et export PDF — la couche décisionnelle avant de chiffrer.",
    "homeDashboard.grid.subtitle":
      "Modules de risque groupés — pré-contrôles gratuits et calculateurs premium.",
    "emptyStates.reports.ctaPremium": "Ouvrir les calculateurs premium",
  },
  es: {
    "freeTrafficCatalog.sectorToolsLead":
      "Comprobaciones gratuitas por sector vinculadas a calculadoras premium en 27 sectores.",
    "freeTrafficCatalog.premiumUpsellBody":
      "Las calculadoras premium añaden precio mínimo seguro, detección de fuga de margen y veredictos aceptar / revisar precio — incluido con SectorCalc Pro.",
    "freeTrafficCatalog.tool.premiumBlockBody":
      "Las calculadoras gratuitas muestran el primer número. Las calculadoras premium añaden impulsores ocultos, umbrales, acciones sugeridas e informes exportables.",
    "home.premiumStep.subtitle":
      "Las calculadoras premium añaden precio mínimo seguro, fugas de margen, acción sugerida y exportación PDF — la capa de decisión antes de presupuestar.",
    "homeDashboard.grid.subtitle":
      "Módulos de riesgo agrupados — precontroles gratuitos y calculadoras premium.",
    "emptyStates.reports.ctaPremium": "Abrir calculadoras premium",
    "checkoutPages.successPremiumCta": "Abrir calculadoras premium",
  },
  de: {
    "pricing.proDescription":
      "Unbegrenzte Premium-Rechner in allen Branchen mit gespeicherten Berichten.",
    "pricing.proFeatures":
      "Alle Rechner|Gespeicherte Berichte|PDF-Export|Jederzeit kündbar",
    "pricing.proAnnualFeatures":
      "Alle Rechner|Gespeicherte Berichte|PDF|Prioritäts-Onboarding",
    "purchaseSuccess.proUpsellBody":
      "27 Branchen, unbegrenzte Premium-Rechner und gespeicherte Berichte — Pro ab $19/Monat.",
    "enterprise.businessPlan.features.0": "Premium-Rechner in 27 Branchen",
    "enterprise.bundles.body":
      "Bündeln Sie die von Ihrer Branche am häufigsten genutzten Rechner in einem fokussierten Paket, damit Teams ohne Ablenkung das richtige Werkzeug finden.",
    "enterprise.faq.items.1.a":
      "Ja. SectorCalc deckt 27 Branchen ab, und Branchenpakete gruppieren die von Ihren Teams am häufigsten genutzten Rechner.",
    "smartForm.notices.requiredInputReason":
      "Jedes Feld entspricht einer verifizierten Vertragseingabe für diesen Rechner.",
    "industryPage.openAnalyzer": "Rechner öffnen →",
    "industryPage.premiumAnalyzerLink": "Premium-Rechner",
  },
  // tr: removed
};

for (const file of readdirSync(MESSAGES_DIR).filter((f) => f.endsWith(".json"))) {
  const locale = file.replace(".json", "");
  const path = join(MESSAGES_DIR, file);
  const data = transformNode(JSON.parse(readFileSync(path, "utf8")), locale);

  const catalogPatch = CATALOG_EXPLORER_PATCH[locale];
  if (catalogPatch && data.catalogExplorer) {
    for (const [dotPath, value] of Object.entries(catalogPatch)) {
      setByPath(data.catalogExplorer, dotPath, value);
    }
  }

  // EN catalogExplorer premium labels — explicit fix
  if (locale === "en" && data.catalogExplorer) {
    data.catalogExplorer.labels["premium-tools"] = {
      navLabel: "Browse by report type",
      countLabel: "{count, plural, one {# calculator} other {# calculators}}",
      viewCategory: "View calculators",
      viewCategoryOpen: "Showing calculators",
      openItem: "View calculator →",
    };
    data.catalogExplorer.discoveryCards ??= {};
    data.catalogExplorer.discoveryCards.ctaOpenAnalysis = "Open calculation";
    data.catalogExplorer.discoveryFooter ??= {};
    data.catalogExplorer.discoveryFooter.freeToolsLead = "Need a deeper calculation?";
    data.catalogExplorer.search ??= { placeholder: {} };
    data.catalogExplorer.search.placeholder.homepage = "Search calculators…";
  }

  // tr: removed

  const explicit = EXPLICIT_ROOT_PATCHES[locale];
  if (explicit) {
    for (const [dotPath, value] of Object.entries(explicit)) {
      setRootPath(data, dotPath, value);
    }
  }

  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Normalized messages/${file}`);
}

const SOURCE_REPLACEMENTS = [
  ["Premium Analyzers", "Premium Calculators"],
  ["premium analyzers", "premium calculators"],
  ["Premium Analyzer", "Premium Calculator"],
  ["premium analyzer", "premium calculator"],
  ["Hidden Loss Decision Reports — Premium Analyzers", "Hidden Loss Decision Reports — Premium Calculators"],
  ["All Premium Analyzers", "All Premium Calculators"],
  ["View the CNC OEE Loss Analyzer", "View the CNC OEE Loss Calculator"],
  ["View the CNC Tool Wear Cost Analyzer", "View the CNC Tool Wear Cost Calculator"],
  ["View the Sheet Metal Scrap Risk Analyzer", "View the Sheet Metal Scrap Risk Calculator"],
  ["View the Construction Project Overrun Analyzer", "View the Construction Project Overrun Calculator"],
  ["View the Subcontractor Margin Leak Analyzer", "View the Subcontractor Margin Leak Calculator"],
  ["View the Roofing Weather Delay Analyzer", "View the Roofing Weather Delay Risk Calculator"],
  ["View the Logistics Route Loss Analyzer", "View the Logistics Route Loss Calculator"],
  ["View the Fuel Route Drift Analyzer", "View the Fuel Route Drift Calculator"],
  ["View the Energy Peak Cost Analyzer", "View the Energy Peak Cost Calculator"],
  ["View the Compressor Leak Cost Analyzer", "View the Compressor Leak Cost Calculator"],
  ["View the Carbon Compliance Risk Analyzer", "View the Carbon Compliance Risk Calculator"],
  ["Irrigation Yield Loss Analyzer", "Irrigation Yield Loss Calculator"],
  ["Dairy Feed Efficiency Analyzer", "Dairy Feed Efficiency Calculator"],
  ["Restaurant Menu Margin Analyzer", "Restaurant Menu Margin Calculator"],
  ["Cloud API Cost Overrun Analyzer", "Cloud API Cost Overrun Calculator"],
  ["Calibration Drift Risk Analyzer", "Calibration Drift Risk Calculator"],
  ["CNC OEE Loss Analyzer", "CNC OEE Loss Calculator"],
  ["Carbon Compliance Risk Analyzer", "Carbon Compliance Risk Calculator"],
  ["When should I use a premium analyzer?", "When should I use a premium calculator?"],
  ["When should I use a premium construction analyzer?", "When should I use a premium construction calculator?"],
  ["When should I use a premium route analyzer?", "When should I use a premium route calculator?"],
  ["When should I use a premium energy analyzer?", "When should I use a premium energy calculator?"],
  ["Use a premium analyzer when", "Use a premium calculator when"],
  ["premium analyzers when", "premium calculators when"],
  ["premium analyzers for", "premium calculators for"],
  ["premium analyzers add", "premium calculators add"],
  ["premium analyzers show", "premium calculators show"],
  ["Premium route analyzers", "Premium route calculators"],
  ["Premium overrun analyzers", "Premium overrun calculators"],
  ["premium overrun analyzers", "premium overrun calculators"],
  ["premium analyzers for", "premium calculators for"],
  ["hidden-loss analyzers", "hidden-loss calculators"],
  ["fuel drift analyzers", "fuel drift calculators"],
  ["compliance analyzers", "compliance calculators"],
  ["feed efficiency analyzers", "feed efficiency calculators"],
  ["27 premium analyzers", "27 premium calculators"],
  ["View analyzer →", "View calculator →"],
  ["Open analyzer", "Open calculator"],
  ["Analyse öffnen", "Rechner öffnen"],
  ["Ouvrir l'analyse", "Ouvrir le calcul"],
  ["Abrir análisis", "Abrir cálculo"],
  ["فتح التحليل", "فتح الحساب"],
  ["Need decision-level analysis?", "Need decision-level calculation?"],
  ["Change Order Impact Analyzer", "Change Order Impact Calculator"],
  ["Open Change Order Impact Analyzer", "Open Change Order Impact Calculator"],
  ["CNC Minimum Safe Quote Analyzer", "CNC Minimum Safe Quote Calculator"],
  ["This premium analyzer helps", "This premium calculator helps"],
  ["This analyzer estimates", "This calculator estimates"],
  ["full bid analysis", "full bid calculation"],
  ["scenario analysis and", "scenario calculation and"],
  ["scenario analysis.", "scenario calculation."],
  ["Risk Analyzer", "Risk Calculator"],
  ["Sector-specific analyzer access", "Sector-specific calculator access"],
  ["Scenario analysis rows", "Scenario calculation rows"],
  ["analyze quote risk", "calculate quote risk"],
  ["analyze change order impact", "calculate change order impact"],
  [" quote risk analyzer", " quote risk calculator"],
  [" impact analyzer", " impact calculator"],
  [" bid risk analyzer", " bid risk calculator"],
  [" optimization analyzer", " optimization calculator"],
  [" yield analyzer", " yield calculator"],
  [" profit analyzer", " profit calculator"],
  ["from the analyzer page", "from the calculator page"],
  ["Run a premium analyzer", "Run a premium calculator"],
  ["Run premium analyzer", "Run premium calculator"],
  ["from the calculator page", "from the calculator page"],
  ["Run analysis", "Run calculation"],
  ["Run legacy analysis", "Run legacy calculation"],
  ["Analysis blocked", "Calculation blocked"],
  ["Run the analysis", "Run the calculation"],
  ["Enter job inputs and run the analysis.", "Enter job inputs and run the calculation."],
  ["margin risk analysis", "margin risk calculation"],
  ["Audit Verdict & Risk Analysis", "Audit Verdict & Risk Calculation"],
  ["Audit Verdict &amp; Risk Analysis", "Audit Verdict &amp; Risk Calculation"],
  ["Scenario Analysis", "Scenario calculation"],
  ["Scenario analysis", "Scenario calculation"],
  ["Browse premium analyzers", "Browse premium calculators"],
  ["Browse all premium analyzers", "Browse all premium calculators"],
  ["All premium analyzers unlocked", "All premium calculators unlocked"],
  ["Premium analyzers in pack", "Premium calculators in pack"],
  ["Premium analyzers require", "Premium calculators require"],
  ["Restore premium analyzer access", "Restore premium calculator access"],
  ["Run premium analyzer", "Run premium calculator"],
  ["one premium analyzer", "one premium calculator"],
  ["the premium analyzer for", "the premium calculator for"],
  ["your premium analyzer", "your premium calculator"],
  ["analyzer inputs", "calculator inputs"],
  ["P90 analysis", "P90 calculation"],
  ["What does the premium analyzer add?", "What does the premium calculator add?"],
  ["one premium analyzer run", "one premium calculator run"],
  ["all sector analyzers", "all sector calculators"],
  ["Open full CNC Minimum Safe Quote Analyzer", "Open CNC Minimum Safe Quote Calculator"],
  ["Open the CNC Minimum Safe Quote Analyzer", "Open the CNC Minimum Safe Quote Calculator"],
  ["Use this premium analyzer to", "Use this premium calculator to"],
  ["for hidden drivers, thresholds and export-ready reports. Upgrade to the premium analyzer", "for hidden drivers, thresholds and export-ready reports. Upgrade to the premium calculator"],
  ["related premium analyzers", "related premium calculators"],
  ["Premium analyzer for", "Premium calculator for"],
  ["premium analyzer preview", "premium calculator preview"],
  ["to premium analyzer", "to premium calculator"],
  ["Premium analyzer opens", "Premium calculator opens"],
  ["Top premium analyzers", "Top premium calculators"],
  ["No premium analyzer opens", "No premium calculator opens"],
  ["Unlock the premium analyzer for", "Unlock the premium calculator for"],
  ["scenario analysis,", "scenario calculation,"],
  ["scenario analysis and", "scenario calculation and"],
  ["scenario analysis.", "scenario calculation."],
  ["bid analysis,", "bid calculation,"],
  ["Analyze e-commerce", "Calculate e-commerce"],
];

const SOURCE_WALK_DIRS = [
  "src/components",
  "src/app",
  "src/data",
  "src/lib/i18n",
  "src/lib/seo",
  "src/lib/billing",
  "src/lib/commercial",
  "src/lib/premium-schema/premium-schema-catalog.ts",
  "src/lib/analytics/revenue-funnel.ts",
];

function collectSourceFiles() {
  const files = new Set();
  for (const rel of SOURCE_WALK_DIRS) {
    const abs = join(ROOT, rel);
    try {
      const stat = statSync(abs);
      if (stat.isFile()) {
        files.add(rel);
        continue;
      }
    } catch {
      continue;
    }
    const stack = [abs];
    while (stack.length) {
      const dir = stack.pop();
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        const relPath = full.replace(`${ROOT}/`, "");
        if (entry.isDirectory()) {
          if (entry.name === "__tests__" || entry.name === "admin") continue;
          stack.push(full);
          continue;
        }
        if (!/\.(tsx?|jsx?)$/.test(entry.name)) continue;
        if (relPath.includes("__tests__")) continue;
        if (relPath.startsWith("src/app/admin")) continue;
        files.add(relPath);
      }
    }
  }
  return [...files];
}

function applySourceReplacements(text) {
  let out = text;
  for (const [from, to] of SOURCE_REPLACEMENTS) {
    if (out.includes(from)) {
      out = out.split(from).join(to);
    }
  }
  return out;
}

for (const relPath of collectSourceFiles()) {
  const absPath = join(ROOT, relPath);
  const text = readFileSync(absPath, "utf8");
  const next = applySourceReplacements(text);
  if (next !== text) {
    writeFileSync(absPath, next, "utf8");
    console.log(`Normalized ${relPath}`);
  }
}

for (const file of readdirSync(join(ROOT, "src/lib/premium-schema/schemas")).filter((f) => f.endsWith(".ts"))) {
  const absPath = join(ROOT, "src/lib/premium-schema/schemas", file);
  let text = readFileSync(absPath, "utf8");
  const next = text.replaceAll(/ Analyzer"/g, ' Calculator"').replaceAll("Analysis period", "Calculation period");
  if (next !== text) {
    writeFileSync(absPath, next, "utf8");
    console.log(`Normalized src/lib/premium-schema/schemas/${file}`);
  }
}
