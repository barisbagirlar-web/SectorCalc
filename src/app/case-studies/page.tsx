/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-nocheck
import type { Metadata } from "next";
import { listCaseStudies } from "@/lib/case-studies/case-study-registry";
import { getCaseStudyToolHref, type CaseStudyEntry } from "@/lib/case-studies/case-study-types";
import { createPageMetadata } from "@/lib/metadata";
import { CaseStudiesClientContent } from "@/components/case-studies/CaseStudiesClientContent";

type PageProps = { params: Promise<{ locale: string }> };

const METADATA_BY_LOCALE: Record<string, { title: string; description: string }> = {
  tr: {
    title: "Mühendislik Saha Analizleri Dizini — Maliyet Kaçağı & Teklif Marjı İncelemeleri | SectorCalc",
    description: "14 sektörde gerçek saha verisiyle hazırlanmış mühendislik maliyet kaçağı ve teklif marjı erozyonu analizleri. CNC, inşaat, enerji, lojistik, HVAC ve daha fazlası için deterministik formüller ve doküman dizini.",
  },
  en: {
    title: "Engineering Field Analyses Directory — Cost Leakage & Quote Margin Reviews | SectorCalc",
    description: "Engineering cost leakage and quote margin erosion analyses prepared with real field data in 14 sectors. Deterministic formulas and document directory for CNC, construction, energy, logistics, HVAC and more.",
  },
  de: {
    title: "Verzeichnis für ingenieurtechnische Feldanalysen — Kostenleckage & Angebotsmargen-Bewertungen | SectorCalc",
    description: "Mit realen Felddaten erstellte ingenieurwissenschaftliche Kostenleckage- und Angebotsmargenerosionsanalysen in 14 Sektoren. Deterministische Formeln und Dokumentenverzeichnis für CNC, Bauwesen, Energie, Logistik, HLK und mehr.",
  },
  fr: {
    title: "Annuaire des analyses de terrain d'ingénierie — Fuites de coûts & Revues de marges | SectorCalc",
    description: "Analyses d'ingénierie des fuites de coûts et de l'érosion des marges de devis préparées avec des données de terrain réelles dans 14 secteurs. Formules déterministes et annuaire de documents pour la CNC, la construction, l'énergie, la logistique, le CVC et plus.",
  },
  es: {
    title: "Directorio de análisis de campo de ingeniería — Fuga de costos & Revisiones de márgenes | SectorCalc",
    description: "Análisis de ingeniería de fuga de costos y erosión del margen de cotización preparados con datos de campo reales en 14 sectores. Fórmulas deterministas y directorio de documentos para CNC, construcción, energía, logística, HVAC y más.",
  },
  ar: {
    title: "دليل التحليلات الميدانية الهندسية — مراجعات تسرب التكاليف وتآكل الهوامش | SectorCalc",
    description: "تحليلات هندسية لتسرب التكاليف وتآكل هامش عرض السعر تم إعدادها ببيانات ميدانية حقيقية في 14 قطاعاً. صيغ حتمية ودليل مستندات للخراطة الرقمية (CNC)، والتشييد، والطاقة، والخدمات اللوجستية، والتدفئة والتهوية وتكييف الهواء (HVAC) والمزيد.",
  },
};

const TRANSLATIONS = {
  tr: {
    home: "Ana Sayfa",
    resources: "Kaynaklar",
    dizin: "Saha Analizleri Dizini",
  },
  en: {
    home: "Home",
    resources: "Resources",
    dizin: "Field Analyses Directory",
  },
  de: {
    home: "Startseite",
    resources: "Ressourcen",
    dizin: "Verzeichnis der Feldanalysen",
  },
  fr: {
    home: "Accueil",
    resources: "Ressources",
    dizin: "Annuaire des analyses de terrain",
  },
  es: {
    home: "Inicio",
    resources: "Recursos",
    dizin: "Directorio de análisis de campo",
  },
  ar: {
    home: "الرئيسية",
    resources: "الموارد",
    dizin: "دليل التحليلات الميدانية",
  }
};

const LOCALIZED_FAQS: Record<string, Array<{ q: string; a: string }>> = {
  tr: [
    {
      q: "Mühendislik saha analizi (field analysis) nedir?",
      a: "Saha analizi, bir işletmenin gerçek operasyonel verisini deterministik mühendislik formülleriyle inceleyerek gizli maliyet kaçaklarını ve teklif marjı erozyonunu sayısallaştıran yapılandırılmış bir çalışmadır. Her analiz; problem tanımı, örnek parametreler, hesaplama metodolojisi ve doğrulanmış sonuç içerir."
    },
    {
      q: "Maliyet kaçağı analizi nasıl yapılır?",
      a: "Doğrudan maliyetlere (malzeme, çıplak işçilik) ek olarak; hazırlık süreleri, duruş payları, fire oranları, lojistik ve garanti rezervleri gibi gizli yükler deterministik bir formülle eklenir. Sonuç, kâğıt üzerindeki teklif ile fiili maliyet tabanı arasındaki marj sapmasını ortaya koyar."
    },
    {
      q: "Bu saha analizleri hangi standartlara dayanır?",
      a: "Analizler ISO 9001, VDI 2067, ASME B31.3, ASHRAE 90.1, IEC 60034, EN 13306, DIN 276 ile Lean ve Six Sigma metodolojilerine referans verir. Her hesaplama, sektörün kabul görmüş mühendislik kabullerine göre deterministik olarak kurgulanmıştır."
    },
    {
      q: "Hangi sektörler için saha analizi mevcut?",
      a: "Dizin 12 sektörü kapsar: CNC/talaşlı imalat, inşaat/teklif yönetimi, endüstriyel temizlik, lojistik, enerji yönetimi, kaynak/metal fabrikasyon, HVAC, tesisat/elektrik, sac metal, restoran/gıda, e-ticaret ve sürdürülebilirlik/karbon (CBAM)."
    },
    {
      q: "Teklif marjı erozyonu nasıl önlenir?",
      a: "İlk adım gizli yükleri sayısallaştırmaktır: hazırlık, duruş, fire, gecikme ve garanti rezervleri teklif taban fiyatına dahil edilmelidir. SectorCalc'in ilgili Pro araçları, her sektör için marjı koruyacak minimum güvenli teklif barajını otomatik hesaplar."
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
      a: "The first step is to quantify hidden overheads: setup, downtime, scrap, delays, and warranty reserves must be included in the starting quote price. SectorCalc's corresponding Pro tools automatically calculate the minimum safe quote floor to protect your margin for each industry."
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
      a: "Der erste Schritt besteht darin, verdeckte Gemeinkosten zu quantifizieren: Rüst-, Stillstands-, Ausschuss-, Verzögerungs- und Gewährleistungsrückstellungen müssen in den anfänglichen Angebotspreis einbezogen werden. Die entsprechenden Pro-Tools von SectorCalc berechnen automatisch die minimale sichere Angebotsschwelle, um Ihre Marge in jeder Branche zu schützen."
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const metadata = METADATA_BY_LOCALE[locale] || METADATA_BY_LOCALE.en;

  return createPageMetadata({
    title: metadata.title,
    description: metadata.description,
    path: "/case-studies",
    locale: locale as "en",
  });
}

export default async function CaseStudiesIndexPage({ params }: PageProps) {
  const locale = "en";
  
  
  const allStudies = listCaseStudies(locale);

  // Pre-calculate tool links for each case study
  const toolHrefs: Record<string, string> = {};
  for (const entry of allStudies) {
    toolHrefs[entry.slug] = getCaseStudyToolHref(entry, locale);
  }

  const tr = TRANSLATIONS[locale as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  const faqs = LOCALIZED_FAQS[locale as keyof typeof LOCALIZED_FAQS] || LOCALIZED_FAQS.en;
  const baseUrl = "https://sectorcalc.com";
  const desc = METADATA_BY_LOCALE[locale]?.description || METADATA_BY_LOCALE.en.description;

  // Composite Google JSON-LD schema matching BreadcrumbList, CollectionPage and FAQPage
  const compositeSchema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": tr.home,
          "item": `${baseUrl}/${locale}`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": tr.resources,
          "item": `${baseUrl}/${locale}/methodology`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": tr.dizin,
          "item": `${baseUrl}/${locale}/case-studies`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": tr.dizin,
      "inLanguage": locale,
      "url": `${baseUrl}/${locale}/case-studies`,
      "description": desc,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": allStudies.length,
        "itemListElement": allStudies.map((s, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "url": `${baseUrl}/${locale}/case-studies/${s.slug}`,
          "name": s.title
        }))
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    }
  ];

  return (
    <>
      {/* Inject Composite JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(compositeSchema) }}
      />

      <CaseStudiesClientContent
        locale={locale}
        studies={allStudies}
        toolHrefs={toolHrefs}
      />
    </>
  );
}
