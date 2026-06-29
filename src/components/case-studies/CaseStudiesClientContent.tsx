"use client";

import { useState } from "react";
import Link from "@/lib/navigation/next-link";
import type { CaseStudyEntry } from "@/lib/case-studies/case-study-types";

// Scoped localized UI keys
const TRANSLATIONS = {
  tr: {
    tools: "Tools",
    sectors: "Sectors",
    methodology: "Methodology",
    pricing: "Pricing",
    start: "Get Started",
    home: "Home",
    resources: "Resources",
    dizin: "Field Analyses Directory",
    scope: "Scope",
    sector: "Sector",
    method: "Method",
    standard: "Standard",
    analyses: "field analyses",
    industries: "industries",
    det_formula: "deterministic formula",
    saha_dizin: "Field Analyses",
    desc_subtitle: "All field analyses in a single table. Click header to sort; click row to view details.",
    caption: "SectorCalc Field Analyses — Master Directory (EN)",
    th_num: "#",
    th_sector: "Sector",
    th_analysis: "Field Analysis",
    th_finding: "Key Finding",
    th_doc: "Document",
    faq_sec_head: "Frequently Asked Questions",
    standards_ref: "Referenced Standards",
    footer_text: "Engineering-grade calculations for engineering-grade decisions.",
    abstract_title: "Abstract / Definition",
    abstract_text: "A field analysis directory is a structured catalog of engineering reports that measure hidden cost leaks and quote margin erosion in industrial operations using real field data. Each record includes a problem definition, example parameters, a deterministic calculation formula, and a verified outcome.",
    count_suffix: "analyses",
    tanim: "Definition — What is it?",
    hesaplama: "Calculation Formula",
    detay: "View Detailed Report →",
    arac: "Open Related Calculator",
  },
  en: {
    tools: "Tools",
    sectors: "Sectors",
    methodology: "Methodology",
    pricing: "Pricing",
    start: "Start",
    home: "Home",
    resources: "Resources",
    dizin: "Field Analyses Directory",
    scope: "Scope",
    sector: "Sector",
    method: "Method",
    standard: "Standard",
    analyses: "field analyses",
    industries: "industries",
    det_formula: "deterministic formula",
    saha_dizin: "Field Analyses",
    desc_subtitle: "All field analyses in a single table. Click header to sort; click row to view details.",
    caption: "SectorCalc Field Analyses — Master Directory (EN)",
    th_num: "#",
    th_sector: "Sector",
    th_analysis: "Field Analysis",
    th_finding: "Key Finding",
    th_doc: "Document",
    faq_sec_head: "Frequently Asked Questions",
    standards_ref: "Referenced Standards",
    footer_text: "Engineering-grade calculations for engineering-grade decisions.",
    abstract_title: "Abstract / Definition",
    abstract_text: "A field analysis directory is a structured catalog of engineering reports that measure hidden cost leaks and quote margin erosion in industrial operations using real field data. Each record includes a problem definition, example parameters, a deterministic calculation formula, and a verified outcome.",
    count_suffix: "analyses",
    tanim: "Definition — What is it?",
    hesaplama: "Calculation Formula",
    detay: "View Detailed Report →",
    arac: "Open Related Calculator",
  },
  de: {
    tools: "Tools",
    sectors: "Branchen",
    methodology: "Methodik",
    pricing: "Preise",
    start: "Loslegen",
    home: "Startseite",
    resources: "Ressourcen",
    dizin: "Verzeichnis der Feldanalysen",
    scope: "Umfang",
    sector: "Branche",
    method: "Methode",
    standard: "Standard",
    analyses: "Feldanalysen",
    industries: "Branchen",
    det_formula: "deterministische Formel",
    saha_dizin: "Feldanalysen",
    desc_subtitle: "Alle Feldanalysen in einer Tabelle. Klicken Sie auf den Spaltenkopf zum Sortieren; klicken Sie auf die Zeile für Details.",
    caption: "SectorCalc Feldanalysen — Hauptverzeichnis (DE)",
    th_num: "#",
    th_sector: "Branche",
    th_analysis: "Feldanalyse",
    th_finding: "Wichtigste Erkenntnis",
    th_doc: "Dokument",
    faq_sec_head: "Häufig gestellte Fragen",
    standards_ref: "Referenzierte Standards",
    footer_text: "Berechnungen in Ingenieursqualität für Entscheidungen in Ingenieursqualität.",
    abstract_title: "Zusammenfassung / Definition",
    abstract_text: "Das Feldanalysen-Verzeichnis ist ein strukturierter Katalog von Ingenieurberichten, die verdeckte Kostenabflüsse und Angebotsmarge-Erosionen im industriellen Betrieb anhand realer Felddaten messen. Jeder Datensatz enthält eine Problemdefinition, Beispielparameter, eine deterministische Berechnungsformel und ein verifiziertes Ergebnis.",
    count_suffix: "Analysen",
    tanim: "Definition — Was ist das?",
    hesaplama: "Berechnungsformel",
    detay: "Detaillierten Bericht anzeigen →",
    arac: "Zugehöriges Tool öffnen",
  },
  fr: {
    tools: "Outils",
    sectors: "Secteurs",
    methodology: "Méthodologie",
    pricing: "Tarifs",
    start: "Commencer",
    home: "Accueil",
    resources: "Ressources",
    dizin: "Annuaire des analyses de terrain",
    scope: "Portée",
    sector: "Secteur",
    method: "Méthode",
    standard: "Norme",
    analyses: "analyses de terrain",
    industries: "secteurs",
    det_formula: "formule déterministe",
    saha_dizin: "Analyses de terrain",
    desc_subtitle: "Toutes les analyses de terrain dans un seul tableau. Cliquez sur l'en-tête pour trier ; cliquez sur la ligne pour voir les détails.",
    caption: "Analyses de terrain SectorCalc — Annuaire maître (FR)",
    th_num: "#",
    th_sector: "Secteur",
    th_analysis: "Analyse de terrain",
    th_finding: "Conclusion clé",
    th_doc: "Document",
    faq_sec_head: "Questions fréquemment posées",
    standards_ref: "Normes de référence",
    footer_text: "Des calculs de qualité d'ingénierie pour des décisions de qualité d'ingénierie.",
    abstract_title: "Résumé / Définition",
    abstract_text: "Un annuaire d'analyses de terrain est un catalogue structuré de rapports d'ingénierie qui mesurent les fuites de coûts cachées et l'érosion des marges de devis dans les opérations industrielles à l'aide de données de terrain réelles. Chaque enregistrement comprend une définition du problème, des exemples de paramètres, une formule de calcul déterministe et un résultat vérifié.",
    count_suffix: "analyses",
    tanim: "Définition — Qu'est-ce que c'est ?",
    hesaplama: "Formule de calcul",
    detay: "Voir le rapport détaillé →",
    arac: "Ouvrir l'outil associé",
  },
  es: {
    tools: "Herramientas",
    sectors: "Sectores",
    methodology: "Metodología",
    pricing: "Precios",
    start: "Comenzar",
    home: "Inicio",
    resources: "Recursos",
    dizin: "Directorio de análisis de campo",
    scope: "Alcance",
    sector: "Sector",
    method: "Método",
    standard: "Estándar",
    analyses: "análisis de campo",
    industries: "sectores",
    det_formula: "fórmula determinista",
    saha_dizin: "Análisis de campo",
    desc_subtitle: "Todos los análisis de campo en una sola tabla. Haga clic en el encabezado para ordenar; haga clic en la fila para ver los detalles.",
    caption: "Análisis de campo de SectorCalc — Directorio maestro (ES)",
    th_num: "#",
    th_sector: "Sector",
    th_analysis: "Análisis de campo",
    th_finding: "Hallazgo clave",
    th_doc: "Documento",
    faq_sec_head: "Preguntas frecuentes",
    standards_ref: "Normas de referencia",
    footer_text: "Cálculos de calidad de ingeniería para decisiones de calidad de ingeniería.",
    abstract_title: "Resumen / Definición",
    abstract_text: "Un directorio de análisis de campo es un catálogo estructurado de informes de ingeniería que miden las fugas de costos ocultos y la erosión del margen de cotización en operaciones industriales utilizando datos de campo reales. Cada registro incluye una definición del problema, parámetros de ejemplo, una fórmula de cálculo determinista y un resultado verificado.",
    count_suffix: "análisis",
    tanim: "Definición — ¿Qué es?",
    hesaplama: "Fórmula de cálculo",
    detay: "Ver informe detallado →",
    arac: "Abrir herramienta relacionada",
  },
  ar: {
    tools: "الأدوات",
    sectors: "القطاعات",
    methodology: "المنهجية",
    pricing: "الأسعار",
    start: "البدء",
    home: "الرئيسية",
    resources: "الموارد",
    dizin: "دليل التحليلات الميدانية",
    scope: "النطاق",
    sector: "القطاع",
    method: "الأسلوب",
    standard: "المعيار",
    analyses: "تحليلات ميدانية",
    industries: "قطاعات صناعية",
    det_formula: "صيغة حتمية",
    saha_dizin: "التحليلات الميدانية",
    desc_subtitle: "جميع التحليلات الميدانية في جدول واحد. انقر فوق رأس العمود للترتيب؛ انقر فوق الصف للتفاصيل.",
    caption: "التحليلات الميدانية لـ SectorCalc — الدليل الرئيسي (AR)",
    th_num: "#",
    th_sector: "القطاع",
    th_analysis: "التحليل الميداني",
    th_finding: "النتيجة الرئيسية",
    th_doc: "المستند",
    faq_sec_head: "الأسئلة الشائعة",
    standards_ref: "المعايير المرجعية",
    footer_text: "حسابات بمستوى هندسي لاتخاذ قرارات بمستوى هندسي.",
    abstract_title: "ملخص / تعريف",
    abstract_text: "دليل التحليلات الميدانية هو كتالوج منظم للتقارير الهندسية التي تقيس تسرب التكاليف الخفية وتآكل هامش عروض الأسعار في العمليات الصناعية باستخدام بيانات ميدانية حقيقية. يتضمن كل سجل تعريفاً للمشكلة، ومعلمات مثال، وصيغة حساب حتمية، ونتيجة موثقة.",
    count_suffix: "تحليلات",
    tanim: "التعريف — ما هو؟",
    hesaplama: "صيغة الحساب",
    detay: "عرض التقرير التفصيلي &larr;",
    arac: "فتح الأداة ذات الصلة",
  }
};

const LOCALIZED_FAQS: Record<string, Array<{ q: string; a: string }>> = {
  tr: [
    {
      q: "What is an engineering field analysis?",
      a: "A field analysis is a structured study that evaluates a company's actual operational data using deterministic engineering formulas to quantify hidden cost leaks and quote margin erosion. Each analysis includes a problem definition, example parameters, a calculation methodology, and a verified outcome."
    },
    {
      q: "How is a cost leakage analysis conducted?",
      a: "In addition to direct costs (materials, bare labor), hidden overheads such as setup times, downtime allowances, scrap rates, logistics, and warranty reserves are added using a deterministic formula. The result reveals the margin deviation between the paper proposal and the actual cost base."
    },
    {
      q: "What standards are these field analyses based on?",
      a: "The analyses refer to ISO 9001, VDI 2067, ASME B31.3, ASHRAE 90.1, IEC 60034, EN 13306, DIN 276 as well as Lean and Six Sigma methodologies. Each calculation is deterministically designed according to recognized engineering standards."
    },
    {
      q: "For which sectors are field analyses available?",
      a: "The directory covers 12 sectors: CNC/machining, construction/bid management, industrial cleaning, logistics, energy management, welding/metal fabrication, HVAC, plumbing/electrical, sheet metal, restaurant/food, e-commerce, and sustainability/carbon (CBAM)."
    },
    {
      q: "How can quote margin erosion be prevented?",
      a: "The first step is to quantify hidden overheads: setup, downtime, scrap, delays, and warranty reserves must be included in the starting quote price. SectorCalc's corresponding Premium tools automatically calculate the minimum safe quote floor to protect your margin for each industry."
    }
  ],
  en: [
    {
      q: "What is an engineering field analysis?",
      a: "A field analysis is a structured study that evaluates a company's actual operational data using deterministic engineering formulas to quantify hidden cost leaks and quote margin erosion. Each analysis includes a problem definition, example parameters, a calculation methodology, and a verified outcome."
    },
    {
      q: "How is a cost leakage analysis conducted?",
      a: "In addition to direct costs (materials, bare labor), hidden overheads such as setup times, downtime allowances, scrap rates, logistics, and warranty reserves are added using a deterministic formula. The result reveals the margin deviation between the paper proposal and the actual cost base."
    },
    {
      q: "What standards are these field analyses based on?",
      a: "The analyses refer to ISO 9001, VDI 2067, ASME B31.3, ASHRAE 90.1, IEC 60034, EN 13306, DIN 276 as well as Lean and Six Sigma methodologies. Each calculation is deterministically designed according to recognized engineering standards."
    },
    {
      q: "For which sectors are field analyses available?",
      a: "The directory covers 12 sectors: CNC/machining, construction/bid management, industrial cleaning, logistics, energy management, welding/metal fabrication, HVAC, plumbing/electrical, sheet metal, restaurant/food, e-commerce, and sustainability/carbon (CBAM)."
    },
    {
      q: "How can quote margin erosion be prevented?",
      a: "The first step is to quantify hidden overheads: setup, downtime, scrap, delays, and warranty reserves must be included in the starting quote price. SectorCalc's corresponding Premium tools automatically calculate the minimum safe quote floor to protect your margin for each industry."
    }
  ],
  de: [
    {
      q: "Was ist eine ingenieurtechnische Feldanalyse?",
      a: "Eine Feldanalyse ist eine strukturierte Studie, die die tatsächlichen Betriebsdaten eines Unternehmens mithilfe deterministischer Ingenieurformeln bewertet, um verdeckte Kostenabflüsse und Angebotsmargenerosionen zu quantifizieren. Jede Analyse umfasst eine Problemdefinition, Beispielparameter, eine Berechnungsmethodik und ein verifiziertes Ergebnis."
    },
    {
      q: "Wie wird eine Kostenleckage-Analyse durchgeführt?",
      a: "Zusätzlich zu den direkten Kosten (Material, reine Arbeitszeit) werden verdeckte Gemeinkosten wie Rüstzeiten, Stillstandszeiten, Ausschussraten, Logistik und Gewährleistungsrückstellungen mithilfe einer deterministischen Formel hinzugerechnet. Das Ergebnis zeigt die Margenabweichung zwischen dem theoretischen Angebot und der tatsächlichen Kostenbasis."
    },
    {
      q: "Auf welchen Standards basieren diese Feldanalysen?",
      a: "Die Analysen beziehen sich auf ISO 9001, VDI 2067, ASME B31.3, ASHRAE 90.1, IEC 60034, EN 13306, DIN 276 sowie Lean- und Six-Sigma-Methoden. Jede Berechnung ist deterministisch nach anerkannten Ingenieursstandards ausgelegt."
    },
    {
      q: "Für welche Branchen sind Feldanalysen verfügbar?",
      a: "Das Verzeichnis umfasst 12 Branchen: CNC/Zerspanung, Bauwesen/Angebotsmanagement, industrielle Reinigung, Logistik, Energiemanagement, Schweißen/Metallverarbeitung, HLK, Sanitär/Elektrik, Blechbearbeitung, Restaurant/Lebensmittel, E-Commerce und Nachhaltigkeit/Kohlenstoff (CBAM)."
    },
    {
      q: "Wie kann eine Erosion der Angebotsmarge verhindert werden?",
      a: "Der erste Schritt besteht darin, verdeckte Gemeinkosten zu quantifizieren: Rüst-, Stillstands-, Ausschuss-, Verzögerungs- und Gewährleistungsrückstellungen müssen in den anfänglichen Angebotspreis einbezogen werden. Die entsprechenden Premium-Analysatoren von SectorCalc berechnen automatisch die minimale sichere Angebotsschwelle, um Ihre Marge in jeder Branche zu schützen."
    }
  ],
  fr: [
    {
      q: "Qu'est-ce qu'une analyse de terrain d'ingénierie ?",
      a: "Une analyse de terrain est une étude structurée qui évalue les données opérationnelles réelles d'une entreprise à l'aide de formules d'ingénierie déterministes pour quantifier les fuites de coûts cachées et l'érosion de la marge des devis. Chaque analyse comprend une définition du problème, des exemples de paramètres, une méthodologie de calcul et un résultat vérifié."
    },
    {
      q: "Comment est réalisée une analyse des fuites de coûts ?",
      a: "En plus des coûts directs (matériaux, main-d'œuvre brute), les frais généraux cachés tels que les temps de réglage, les allocations pour temps d'arrêt, les taux de rebut, la logistique et les réserves de garantie sont ajoutés à l'aide d'une formule déterministe. Le résultat révèle l'écart de marge entre la proposition théorique et la base de coûts réelle."
    },
    {
      q: "Sur quelles normes reposent ces analyses de terrain ?",
      a: "Les analyses font référence aux normes ISO 9001, VDI 2067, ASME B31.3, ASHRAE 90.1, IEC 60034, EN 13306, DIN 276 ainsi qu'aux méthodologies Lean et Six Sigma. Chaque calcul est conçu de manière déterministe conformément aux normes d'ingénierie reconnues."
    },
    {
      q: "Pour quels secteurs les analyses de terrain sont-elles disponibles ?",
      a: "L'annuaire couvre 12 secteurs : CNC/usinage, construction/gestion des appels d'offres, nettoyage industriel, logistique, gestion de l'énergie, soudage/fabrication métallique, CVC, plomberie/électricité, tôlerie, restauration/alimentation, commerce électronique et durabilité/carbone (CBAM)."
    },
    {
      q: "Comment prévenir l'érosion de la marge des devis ?",
      a: "La première étape consiste à quantifier les frais généraux cachés : les temps de réglage, les temps d'arrêt, les rebuts, les retards et les réserves de garantie doivent être inclus dans le prix de départ du devis. Les outils Pro correspondants de SectorCalc calculent automatiquement le seuil de devis minimum sûr pour protéger votre marge pour chaque industrie."
    }
  ],
  es: [
    {
      q: "¿Qué es un análisis de campo de ingeniería?",
      a: "Un análisis de campo es un estudio estructurado que evalúa los datos operativos reales de una empresa mediante fórmulas de ingeniería deterministas para cuantificar las fugas de costos ocultos y la erosión del margen de cotización. Cada análisis incluye una definición del problema, parámetros de ejemplo, una metodología de cálculo y un resultado verificado."
    },
    {
      q: "¿Cómo se realiza un análisis de fuga de costos?",
      a: "Además de los costos directos (materiales, mano de obra directa), los gastos generales ocultos, como los tiempos de configuración, los márgenes por tiempo de inactividad, las tasas de desperdicio, la logística y las reservas de garantía, se agregan mediante una fórmula determinista. El resultado revela la desviación del margen entre la propuesta teórica y la base de costos real."
    },
    {
      q: "¿En qué normas se basan estos análisis de campo?",
      a: "Los análisis hacen referencia a las normas ISO 9001, VDI 2067, ASME B31.3, ASHRAE 90.1, IEC 60034, EN 13306, DIN 276, así como a las metodologías Lean y Six Sigma. Cada cálculo está diseñado de forma determinista de acuerdo con los estándares de ingeniería reconocidos."
    },
    {
      q: "¿Para qué sectores están disponibles los análisis de campo?",
      a: "El directorio cubre 12 sectores: CNC/mecanizado, construcción/gestión de licitaciones, limpieza industrial, logística, gestión de energía, soldadura/fabricación de metales, HVAC, fontanería/electricidad, chapa, restaurante/alimentación, comercio electrónico y sostenibilidad/carbono (CBAM)."
    },
    {
      q: "¿Cómo se puede prevenir la erosión del margen de cotización?",
      a: "El primer paso es cuantificar los gastos generales ocultos: la configuración, el tiempo de inactividad, el desperdicio, los retrasos y las reservas de garantía deben incluirse en el precio inicial de la cotización. Las correspondientes herramientas Pro de SectorCalc calculan automáticamente el precio mínimo de cotización seguro para proteger su margen en cada sector."
    }
  ],
  ar: [
    {
      q: "ما هو التحليل الميداني الهندسي؟",
      a: "التحليل الميداني هو دراسة هيكلية تقيم البيانات التشغيلية الفعلية للشركة باستخدام صياغ هندسية حتمية لتحديد تسرب التكاليف الخفية وتآكل هامش عرض السعر. يتضمن كل تحليل تعريفاً للمشكلة، ومعلمات مثال، ومنهجية حسابية، ونتيجة موثقة."
    },
    {
      q: "كيف يتم إجراء تحليل تسرب التكاليف؟",
      a: "بالإضافة إلى التكاليف المباشرة (المواد، العمالة الصافية)، يتم إضافة المصاريف غير المباشرة المخفية مثل أوقات الإعداد، وتكاليف فترات التوقف، ومعدلات الهدر، والخدمات اللوجستية، واحتياطيات الضمان باستخدام صيغة حتمية. تكشف النتيجة عن انحراف الهامش بين العرض النظري وقاعدة التكلفة الفعلية."
    },
    {
      q: "ما هي المعايير التي تستند إليها هذه التحليلات الميدانية؟",
      a: "تشير التحليلات إلى معايير ISO 9001 و VDI 2067 و ASME B31.3 و ASHRAE 90.1 و IEC 60034 و EN 13306 و DIN 276 بالإضافة إلى منهجيات Lean و Six Sigma. تم تصميم كل حساب بشكل حتمي وفقاً للمعايير الهندسية المعترف بها."
    },
    {
      q: "ما هي القطاعات التي تتوفر لها تحليلات ميدانية؟",
      a: "يغطي الدليل 12 قطاعاً: التصنيع باستخدام الحاسب الآلي (CNC)/الماشينينج، وإدارة التشييد/العطاءات، والتنظيف الصناعي، والخدمات اللوجستية، وإدارة الطاقة، واللحام/تشكيل المعادن، والتدفئة والتهوية وتكييف الهواء (HVAC)، والسباكة/الكهرباء، وأعمال الصفائح المعدنية، والمطاعم/الأغذية، والتجارة الإلكترونية، والاستدامة/الكربون (CBAM)."
    },
    {
      q: "ما هي القطاعات التي تتوفر لها تحليلات ميدانية؟",
      a: "الخطوة الأولى هي تحديد المصاريف غير المباشرة المخفية: يجب تضمين أوقات الإعداد، والتوقف، والهدر، والتأخيرات، واحتياطيات الضمان في سعر عرض السعر الأساسي. تحسب أدوات Pro المقابلة من SectorCalc تلقائياً الحد الأدنى الآمن لعرض السعر لحماية هامشك في كل قطاع."
    }
  ]
};

interface CaseStudiesClientContentProps {
  readonly locale: string;
  readonly studies: readonly CaseStudyEntry[];
  readonly toolHrefs: Record<string, string>;
}

export function CaseStudiesClientContent({ locale, studies, toolHrefs }: CaseStudiesClientContentProps) {
  const isAr = false;
  const tr = TRANSLATIONS[locale as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  const faqs = LOCALIZED_FAQS[locale as keyof typeof LOCALIZED_FAQS] || LOCALIZED_FAQS.en;

  // Build rows with index for the table
  const [rows, setRows] = useState(() =>
    studies.map((s, idx) => ({
      i: idx + 1,
      id: s.slug.replace(/-field-analysis$/, ""),
      docId: s.slug.replace(/-field-analysis$/, "").toUpperCase(),
      sector: s.sectorLabel,
      anchor: `sector-${s.sector}`,
      title: s.title,
      finding: s.calculationResult,
      formula: s.calculationLogic,
      report: `/${locale}/case-studies/${s.slug}`,
      tool: toolHrefs[s.slug] || `/${locale}/pricing?tool=${s.toolSlug}`,
    }))
  );

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [openIndexes, setOpenIndexes] = useState<Record<number, boolean>>({});

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...rows].sort((a, b) => {
      const valA = a[key as keyof typeof a];
      const valB = b[key as keyof typeof b];

      if (key === "i") {
        return direction === "asc"
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      }

      return direction === "asc"
        ? String(valA).localeCompare(String(valB), locale)
        : String(valB).localeCompare(String(valA), locale);
    });
    setRows(sorted);
  };

  const toggleFaq = (idx: number) => {
    setOpenIndexes((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Grouping for the cards grid
  const grouped: Record<string, { name: string; items: typeof rows }> = {};
  rows.forEach((s) => {
    if (!grouped[s.anchor]) {
      grouped[s.anchor] = { name: s.sector, items: [] };
    }
    grouped[s.anchor].items.push(s);
  });

  const sectorsJump = Object.entries(grouped).map(([anchor, g]) => ({
    anchor,
    name: g.name,
  }));

  return (
    <div className="case-studies-container" dir={isAr ? "rtl" : "ltr"}>
      {/* Styles exactly matching the user's stylesheet scoped to case-studies-container */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .case-studies-container {
            --cream: #F0EEE6;
            --cream-2: #FAF9F5;
            --ink: #1A1915;
            --ink-soft: #3A382F;
            --muted: #7A776B;
            --terra: #BD5D3A;
            --terra-deep: #9E4A2D;
            --line: #DBD8CC;
            --line-soft: #E8E5DA;
            --good: #3F7A52;
            --serif: Georgia, 'Times New Roman', serif;
            --sans: 'Inter', system-ui, sans-serif;
            --mono: 'JetBrains Mono', ui-monospace, monospace;
            background: var(--cream);
            color: var(--ink);
            font-family: var(--sans);
            line-height: 1.6;
            min-height: 100vh;
            padding-bottom: 60px;
          }
          .case-studies-container .wrap {
            max-width: 1080px;
            margin: 0 auto;
            padding: 0 32px;
          }
          .case-studies-container a {
            color: inherit;
          }

          /* NAV */
          .case-studies-container .nav {
            border-bottom: 1px solid var(--line);
            background: rgba(240, 238, 230, 0.9);
            backdrop-filter: blur(12px);
            position: sticky;
            top: 0;
            z-index: 40;
          }
          .case-studies-container .nav .wrap {
            display: flex;
            align-items: center;
            gap: 28px;
            padding: 15px 32px;
          }
          .case-studies-container .brand {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 700;
            font-size: 18px;
            letter-spacing: -.02em;
            text-decoration: none;
          }
          .case-studies-container .brand .mk {
            width: 21px;
            height: 21px;
            background: var(--ink);
            position: relative;
          }
          .case-studies-container .brand .mk::after {
            content: "";
            position: absolute;
            inset: 5px 5px auto auto;
            width: 8px;
            height: 8px;
            background: var(--terra);
          }
          .case-studies-container .nav .links {
            display: flex;
            gap: 24px;
            margin-left: 8px;
          }
          .case-studies-container .nav .links a {
            font-size: 14px;
            color: var(--ink-soft);
            text-decoration: none;
            font-weight: 500;
          }
          .case-studies-container .nav .links a:hover {
            color: var(--terra);
          }
          .case-studies-container .nav .cta {
            margin-left: auto;
            font-size: 13.5px;
            font-weight: 600;
            background: var(--ink);
            color: var(--cream);
            padding: 9px 16px;
            text-decoration: none;
            transition: background 0.2s;
          }
          .case-studies-container .nav .cta:hover {
            background: var(--terra-deep);
          }

          /* BREADCRUMB */
          .case-studies-container .crumb {
            padding: 20px 0 0;
          }
          .case-studies-container .crumb ol {
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            font-family: var(--mono);
            font-size: 11.5px;
            color: var(--muted);
            letter-spacing: .02em;
          }
          .case-studies-container .crumb a {
            text-decoration: none;
            color: var(--muted);
          }
          .case-studies-container .crumb a:hover {
            color: var(--terra-deep);
          }
          .case-studies-container .crumb li::after {
            content: "/";
            margin-left: 8px;
            margin-right: 8px;
            color: var(--line);
          }
          .case-studies-container .crumb li:last-child::after {
            content: "";
          }
          .case-studies-container .crumb li:last-child {
            color: var(--ink-soft);
          }

          /* HEADER */
          .case-studies-container header.doc {
            padding: 26px 0 30px;
            border-bottom: 2px solid var(--ink);
          }
          .case-studies-container .eyebrow {
            font-family: var(--mono);
            font-size: 11px;
            letter-spacing: .1em;
            text-transform: uppercase;
            color: var(--terra-deep);
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .case-studies-container .eyebrow::before {
            content: "";
            width: 26px;
            height: 2px;
            background: var(--terra);
          }
          .case-studies-container h1 {
            font-family: var(--serif);
            font-weight: 400;
            font-size: 44px;
            line-height: 1.1;
            letter-spacing: -.02em;
            max-width: 760px;
          }
          .case-studies-container .doc-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 26px;
            margin-top: 22px;
            font-family: var(--mono);
            font-size: 11.5px;
            color: var(--muted);
          }
          .case-studies-container .doc-meta b {
            color: var(--ink);
            font-weight: 600;
          }

          /* ABSTRACT / DEFINITION (featured snippet target) */
          .case-studies-container .abstract {
            border-left: 3px solid var(--terra);
            padding: 4px 0 4px 22px;
            margin: 34px 0 0;
            max-width: 780px;
          }
          .case-studies-container .abstract .lab {
            font-family: var(--mono);
            font-size: 10.5px;
            letter-spacing: .06em;
            text-transform: uppercase;
            color: var(--terra-deep);
            margin-bottom: 10px;
          }
          .case-studies-container .abstract p {
            font-size: 17px;
            line-height: 1.6;
            color: var(--ink-soft);
          }
          .case-studies-container .abstract p b {
            color: var(--ink);
          }

          /* KEY FACTS dl */
          .case-studies-container .keyfacts {
            margin-top: 26px;
            border: 1px solid var(--line);
            background: var(--cream-2);
          }
          .case-studies-container .keyfacts dl {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
          }
          .case-studies-container .keyfacts div {
            padding: 18px 20px;
            border-right: 1px solid var(--line);
          }
          .case-studies-container .keyfacts div:last-child {
            border-right: none;
          }
          .case-studies-container .keyfacts dt {
            font-family: var(--mono);
            font-size: 10px;
            letter-spacing: .05em;
            text-transform: uppercase;
            color: var(--muted);
            margin-bottom: 9px;
          }
          .case-studies-container .keyfacts dd {
            font-family: var(--serif);
            font-size: 26px;
            color: var(--ink);
            line-height: 1;
          }
          .case-studies-container .keyfacts dd small {
            font-family: var(--sans);
            font-size: 12px;
            color: var(--muted);
            display: block;
            margin-top: 6px;
            letter-spacing: 0;
          }

          /* SECTION HEADS */
          .case-studies-container .sec-head {
            margin: 56px 0 20px;
          }
          .case-studies-container .sec-head h2 {
            font-family: var(--serif);
            font-weight: 400;
            font-size: 28px;
            letter-spacing: -.01em;
          }
          .case-studies-container .sec-head .sh-sub {
            font-size: 14px;
            color: var(--muted);
            margin-top: 6px;
          }

          /* MASTER INDEX TABLE */
          .case-studies-container .index-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid var(--ink);
            font-size: 13.5px;
            background: var(--cream-2);
          }
          .case-studies-container .index-table caption {
            text-align: left;
            font-family: var(--mono);
            font-size: 10.5px;
            letter-spacing: .05em;
            text-transform: uppercase;
            color: var(--muted);
            padding-bottom: 10px;
          }
          .case-studies-container .index-table thead th {
            background: var(--ink);
            color: var(--cream);
            text-align: left;
            padding: 13px 14px;
            font-family: var(--mono);
            font-size: 10.5px;
            letter-spacing: .04em;
            text-transform: uppercase;
            font-weight: 600;
            cursor: pointer;
            user-select: none;
          }
          .case-studies-container .index-table thead th .ar {
            opacity: .4;
            margin-left: 5px;
          }
          .case-studies-container .index-table tbody td {
            padding: 14px;
            border-bottom: 1px solid var(--line-soft);
            vertical-align: top;
          }
          .case-studies-container .index-table tbody tr:last-child td {
            border-bottom: none;
          }
          .case-studies-container .index-table tbody tr:hover td {
            background: #f2ede4;
          }
          .case-studies-container .index-table .num {
            font-family: var(--mono);
            color: var(--muted);
            font-size: 12px;
          }
          .case-studies-container .index-table .sector {
            font-family: var(--mono);
            font-size: 11px;
            color: var(--terra-deep);
            font-weight: 600;
            white-space: nowrap;
          }
          .case-studies-container .index-table .title a {
            font-weight: 600;
            color: var(--ink);
            text-decoration: none;
          }
          .case-studies-container .index-table .title a:hover {
            color: var(--terra-deep);
          }
          .case-studies-container .index-table .finding {
            font-family: var(--mono);
            font-size: 12px;
            color: var(--ink-soft);
          }
          .case-studies-container .index-table .docid {
            font-family: var(--mono);
            font-size: 10.5px;
            color: var(--muted);
            white-space: nowrap;
          }

          /* SECTOR JUMP */
          .case-studies-container .jump {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 24px;
          }
          .case-studies-container .jump a {
            font-family: var(--mono);
            font-size: 11.5px;
            border: 1px solid var(--line);
            background: var(--cream-2);
            padding: 8px 11px;
            text-decoration: none;
            color: var(--ink-soft);
            transition: all 0.2s;
          }
          .case-studies-container .jump a:hover {
            border-color: var(--terra);
            color: var(--terra-deep);
          }

          /* SECTOR GROUP */
          .case-studies-container .sector-group {
            margin-top: 50px;
            scroll-margin-top: 80px;
          }
          .case-studies-container .sg-head {
            display: flex;
            align-items: baseline;
            gap: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--ink);
            margin-bottom: 24px;
          }
          .case-studies-container .sg-head h2 {
            font-family: var(--serif);
            font-weight: 400;
            font-size: 24px;
          }
          .case-studies-container .sg-head .count {
            font-family: var(--mono);
            font-size: 11px;
            color: var(--muted);
            margin-left: auto;
          }

          /* ABSTRACT CARD (per study) */
          .case-studies-container .study {
            border: 1px solid var(--line);
            background: var(--cream-2);
            margin-bottom: 18px;
            scroll-margin-top: 80px;
          }
          .case-studies-container .study-head {
            padding: 20px 22px 0;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
          }
          .case-studies-container .study-head h3 {
            font-family: var(--serif);
            font-weight: 400;
            font-size: 19px;
            line-height: 1.3;
            max-width: 660px;
          }
          .case-studies-container .study-head .docid {
            font-family: var(--mono);
            font-size: 10px;
            color: var(--muted);
            border: 1px solid var(--line);
            padding: 5px 8px;
            white-space: nowrap;
            flex: 0 0 auto;
          }
          .case-studies-container .study-body {
            padding: 16px 22px 22px;
          }
          .case-studies-container .def {
            margin: 14px 0;
          }
          .case-studies-container .def .q {
            font-family: var(--mono);
            font-size: 11px;
            letter-spacing: .04em;
            text-transform: uppercase;
            color: var(--terra-deep);
            margin-bottom: 7px;
          }
          .case-studies-container .def p {
            font-size: 14px;
            line-height: 1.6;
            color: var(--ink-soft);
          }
          .case-studies-container .finding-box {
            display: flex;
            align-items: center;
            gap: 16px;
            background: var(--ink);
            color: var(--cream);
            padding: 15px 18px;
            margin: 16px 0;
          }
          .case-studies-container .finding-box .fl {
            font-family: var(--mono);
            font-size: 9.5px;
            letter-spacing: .06em;
            text-transform: uppercase;
            color: #9a978c;
            flex: 0 0 auto;
          }
          .case-studies-container .finding-box .fv {
            font-family: var(--mono);
            font-size: 15px;
            font-weight: 600;
            color: var(--terra);
            line-height: 1.4;
          }
          .case-studies-container .formula {
            margin: 14px 0;
          }
          .case-studies-container .formula .q {
            font-family: var(--mono);
            font-size: 11px;
            letter-spacing: .04em;
            text-transform: uppercase;
            color: var(--muted);
            margin-bottom: 8px;
          }
          .case-studies-container .formula code {
            display: block;
            font-family: var(--mono);
            font-size: 12px;
            line-height: 1.7;
            background: var(--cream);
            border: 1px solid var(--line);
            padding: 14px 16px;
            color: var(--ink-soft);
            white-space: pre-wrap;
            word-break: break-word;
          }
          .case-studies-container .formula code b {
            color: var(--terra-deep);
          }
          .case-studies-container .study-links {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 16px;
          }
          .case-studies-container .study-links a {
            font-size: 13px;
            font-weight: 600;
            text-decoration: none;
            padding: 11px 15px;
            transition: all 0.2s;
          }
          .case-studies-container .study-links .primary {
            background: var(--terra);
            color: #fff;
          }
          .case-studies-container .study-links .primary:hover {
            background: var(--terra-deep);
          }
          .case-studies-container .study-links .ghost {
            border: 1px solid var(--ink);
            color: var(--ink);
          }
          .case-studies-container .study-links .ghost:hover {
            background: var(--ink);
            color: var(--cream);
          }

          /* GLOBAL FAQ */
          .case-studies-container .faq {
            margin-top: 60px;
            border-top: 2px solid var(--ink);
            padding-top: 30px;
          }
          .case-studies-container .faq-item {
            border-bottom: 1px solid var(--line);
          }
          .case-studies-container .faq-q {
            width: 100%;
            text-align: left;
            background: none;
            border: none;
            cursor: pointer;
            padding: 20px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            font-family: var(--serif);
            font-size: 19px;
            color: var(--ink);
          }
          .case-studies-container .faq-q .pm {
            font-size: 22px;
            color: var(--terra);
            transition: transform 0.2s;
            flex: 0 0 auto;
          }
          .case-studies-container .faq-item.open .faq-q .pm {
            transform: rotate(45deg);
          }
          .case-studies-container .faq-a {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
          }
          .case-studies-container .faq-item.open .faq-a {
            max-height: 400px;
          }
          .case-studies-container .faq-a p {
            font-size: 14.5px;
            line-height: 1.7;
            color: var(--ink-soft);
            padding: 0 0 22px;
          }
          .case-studies-container .faq-a p b {
            color: var(--ink);
          }

          /* STANDARDS STRIP */
          .case-studies-container .standards {
            margin-top: 50px;
            border: 1px solid var(--line);
            background: var(--cream-2);
            padding: 24px;
          }
          .case-studies-container .standards .sl {
            font-family: var(--mono);
            font-size: 10.5px;
            letter-spacing: .06em;
            text-transform: uppercase;
            color: var(--muted);
            margin-bottom: 16px;
          }
          .case-studies-container .standards .grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
          .case-studies-container .standards .grid span {
            font-family: var(--mono);
            font-size: 11px;
            border: 1px solid var(--line);
            padding: 7px 11px;
            color: var(--ink-soft);
          }

          .case-studies-container footer {
            margin-top: 60px;
            border-top: 1px solid var(--line);
            padding: 30px 0;
            font-family: var(--mono);
            font-size: 11px;
            color: var(--muted);
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px;
          }

          @media(max-width:760px){
            .case-studies-container .wrap {
              padding: 0 18px;
            }
            .case-studies-container .nav .links {
              display: none;
            }
            .case-studies-container h1 {
              font-size: 32px;
            }
            .case-studies-container .keyfacts dl {
              grid-template-columns: 1fr 1fr;
            }
            .case-studies-container .keyfacts div:nth-child(2) {
              border-right: none;
            }
            .case-studies-container .index-table .docid,
            .case-studies-container .index-table thead th:nth-child(5) {
              display: none;
            }
            .case-studies-container .abstract p {
              font-size: 15px;
            }
          }
        `,
      }} />

      {/* NAV */}
      <nav className="nav">
        <div className="wrap">
          <Link className="brand" href={`/${locale}`} aria-label="SectorCalc home">
            <svg className="sc-logo-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ width: "24px", height: "24px" }}>
              <rect x="2" y="2" width="13" height="13" fill="#1A1915"/>
              <rect x="17" y="2" width="13" height="13" fill="#BD5D3A"/>
              <rect x="2" y="17" width="13" height="13" fill="#1A1915" fillOpacity="0.30"/>
              <rect x="17" y="17" width="13" height="13" fill="#BD5D3A" fillOpacity="0.30"/>
            </svg>
            <span className="sc-logo-text" style={{ fontFamily:"Georgia,'Times New Roman',serif", fontSize: "19px", fontWeight: 700, color: "#1A1915", letterSpacing: "-0.02em", marginLeft: "8px" }}>
              SectorCalc
            </span>
          </Link>
          <div className="links">
            <Link href={`/${locale}/free-tools`}>{tr.tools}</Link>
            <Link href={`/${locale}/industries`}>{tr.sectors}</Link>
            <Link href={`/${locale}/methodology`}>{tr.methodology}</Link>
            <Link href={`/${locale}/pricing`}>{tr.pricing}</Link>
          </div>
          <Link className="cta" href={`/${locale}/login`}>
            {tr.start}
          </Link>
        </div>
      </nav>

      <main className="wrap">
        {/* BREADCRUMB */}
        <nav className="crumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href={`/${locale}`}>{tr.home}</Link>
            </li>
            <li>
              <Link href={`/${locale}/methodology`}>{tr.resources}</Link>
            </li>
            <li>{tr.dizin}</li>
          </ol>
        </nav>

        {/* HEADER + ABSTRACT */}
        <header className="doc">
          <div className="eyebrow">{tr.dizin}</div>
          <h1>{tr.dizin} — {tr.footer_text}</h1>
          <div className="doc-meta">
            <span>
              <b id="mCount">{studies.length}</b> {tr.analyses}
            </span>
            <span>
              <b>12</b> {tr.industries}
            </span>
            <span>
              {tr.method}: <b>{tr.det_formula}</b>
            </span>
            <span>
              {tr.standard}: <b>ISO · VDI · ASME</b>
            </span>
          </div>

          <div className="abstract">
            <div className="lab">{tr.abstract_title}</div>
            <p>{tr.abstract_text}</p>
          </div>

          <div className="keyfacts">
            <dl>
              <div>
                <dt>{tr.scope}</dt>
                <dd>
                  {studies.length}
                  <small>{tr.analyses}</small>
                </dd>
              </div>
              <div>
                <dt>{tr.sector}</dt>
                <dd>
                  12
                  <small>{tr.industries}</small>
                </dd>
              </div>
              <div>
                <dt>{tr.method}</dt>
                <dd>
                  Det.
                  <small>{tr.det_formula}</small>
                </dd>
              </div>
              <div>
                <dt>{tr.standard}</dt>
                <dd>
                  9+
                  <small>ISO · VDI · ASME</small>
                </dd>
              </div>
            </dl>
          </div>
        </header>

        {/* MASTER INDEX */}
        <div className="sec-head">
          <h2>{tr.dizin}</h2>
          <div className="sh-sub">{tr.desc_subtitle}</div>
        </div>
        
        <table className="index-table" id="indexTable">
          <caption>{tr.caption}</caption>
          <thead>
            <tr>
              <th onClick={() => handleSort("i")}>
                {tr.th_num}
                <span className="ar">{sortConfig?.key === "i" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "↕"}</span>
              </th>
              <th onClick={() => handleSort("sector")}>
                {tr.th_sector}
                <span className="ar">{sortConfig?.key === "sector" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "↕"}</span>
              </th>
              <th onClick={() => handleSort("title")}>
                {tr.th_analysis}
                <span className="ar">{sortConfig?.key === "title" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "↕"}</span>
              </th>
              <th onClick={() => handleSort("finding")}>
                {tr.th_finding}
                <span className="ar">{sortConfig?.key === "finding" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "↕"}</span>
              </th>
              <th onClick={() => handleSort("docId")}>
                {tr.th_doc}
                <span className="ar">{sortConfig?.key === "docId" ? (sortConfig.direction === "asc" ? "▲" : "▼") : "↕"}</span>
              </th>
            </tr>
          </thead>
          <tbody id="indexBody">
            {rows.map((s) => (
              <tr key={s.id}>
                <td className="num">{String(s.i).padStart(2, "0")}</td>
                <td className="sector">{s.sector}</td>
                <td className="title">
                  <a href={`#${s.id}`}>{s.title}</a>
                </td>
                <td className="finding">{s.finding}</td>
                <td className="docid">{s.docId}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* SECTOR JUMP */}
        <div className="jump" id="jump">
          {sectorsJump.map((s) => (
            <a key={s.anchor} href={`#${s.anchor}`}>
              {s.name}
            </a>
          ))}
        </div>

        {/* SECTOR GROUPS + study cards */}
        <div id="groups">
          {Object.entries(grouped).map(([anchor, g]) => (
            <section className="sector-group" id={anchor} key={anchor}>
              <div className="sg-head">
                <h2>{g.name}</h2>
                <span className="count">
                  {g.items.length} {tr.count_suffix}
                </span>
              </div>
              
              {g.items.map((s) => {
                const originalEntry = studies.find((item) => item.slug.replace(/-field-analysis$/, "") === s.id);
                return (
                  <article className="study" id={s.id} key={s.id}>
                    <div className="study-head">
                      <h3>{s.title}</h3>
                      <span className="docid">DOC · {s.docId}</span>
                    </div>
                    <div className="study-body">
                      <div className="def">
                        <div className="q">{tr.tanim}</div>
                        <p dangerouslySetInnerHTML={{ __html: originalEntry?.whatIsIt || s.finding }} />
                      </div>
                      
                      <div className="finding-box">
                        <span className="fl">{tr.th_finding}</span>
                        <span className="fv">{s.finding}</span>
                      </div>
                      
                      <div className="formula">
                        <div className="q">{tr.hesaplama}</div>
                        <code>
                          {s.formula}
                        </code>
                      </div>
                      
                      <div className="study-links">
                        <Link className="primary" href={s.report}>
                          {tr.detay}
                        </Link>
                        <Link className="ghost" href={s.tool}>
                          {tr.arac}
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          ))}
        </div>

        {/* GLOBAL FAQ */}
        <section className="faq" id="faq">
          <div className="sec-head" style={{ marginTop: 0 }}>
            <h2>{tr.faq_sec_head}</h2>
          </div>
          <div id="faqList">
            {faqs.map((f, idx) => (
              <div className={`faq-item ${openIndexes[idx] ? "open" : ""}`} key={idx}>
                <button className="faq-q" onClick={() => toggleFaq(idx)}>
                  {f.q}
                  <span className="pm">{openIndexes[idx] ? "×" : "+"}</span>
                </button>
                <div className="faq-a" style={{ maxHeight: openIndexes[idx] ? "400px" : "0" }}>
                  <p>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STANDARDS */}
        <div className="standards">
          <div className="sl">{tr.standards_ref}</div>
          <div className="grid">
            <span>ISO 9001</span>
            <span>VDI 2067</span>
            <span>ASME B31.3</span>
            <span>ASHRAE 90.1</span>
            <span>IEC 60034</span>
            <span>EN 13306</span>
            <span>DIN 276</span>
            <span>Lean</span>
            <span>Six Sigma</span>
          </div>
        </div>

        <footer>
          <span>SectorCalc · Izmir, Turkiye</span>
          <span>{tr.footer_text}</span>
        </footer>
      </main>
    </div>
  );
}
