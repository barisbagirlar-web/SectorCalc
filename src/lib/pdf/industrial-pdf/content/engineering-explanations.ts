/**
 * Industrial Engineering Content Database
 *
 * Deep, academic-grade explanations for every formula family.
 * ISO 9001 / ECMI / TÜV-certifiable engineering narrative.
 */

import type { PdfEngineeringExplanation } from "@/lib/pdf/industrial-pdf/types";
import type { SupportedLocale } from "@/lib/i18n/locale-config";

const DEFAULT_EN: PdfEngineeringExplanation = {
  methodology:
    "This analysis applies a deterministic calculation methodology based on user-provided input parameters and sector-standard reference data. The computational model uses first-principles engineering formulas where applicable, supplemented by empirical correlations derived from industry practice. All intermediate variables are explicitly computed and validated against physical and economic boundary conditions before final aggregation.",
  standards: [
    "ISO 9001:2015 — Quality management systems",
    "ISO 31000:2018 — Risk management",
    "ASME B89.7.2 — Dimensional measurement planning",
  ],
  formulaDescription:
    "The calculation engine evaluates the target variable through a composition of primitive functions, each validated against documented tolerance limits. Results are computed in IEEE 754 double-precision arithmetic with explicit guards against domain errors. Unit consistency is enforced via dimensional analysis.",
  interpretationGuide:
    "The primary output represents a best-estimate result under the specified input conditions. Variance between the computed result and actual observed values is expected due to unmodeled real-world factors. Decision-makers should apply appropriate safety margins based on application criticality.",
  industryContext:
    "This analysis follows the general engineering decision-support paradigm used across manufacturing, construction, energy, and process industries. It is not a substitute for detailed engineering analysis, certified measurement, or regulatory compliance verification.",
};

const EXPLANATIONS: Record<string, Partial<Record<SupportedLocale, PdfEngineeringExplanation>>> = {
  cost: {
    en: {
      methodology:
        "Cost estimation follows a bottom-up parametric model, decomposing total expenditure into direct material, direct labor, overhead, and risk-adjusted contingency components. Each cost element is computed from user-specified quantities and unit rates, cross-checked against sector-specific cost indices published by RSMeans, Gardiner & Theobald, or equivalent regional authorities. Contingency allocation applies a Monte Carlo–calibrated P90 confidence factor derived from historical cost variance distributions.",
      standards: [
        "ISO 15686-5:2017 — Life-cycle costing",
        "AACE International RP 17R-97 — Cost estimate classification",
        "DIN 276 — Building costs",
        "PMBOK Guide 7th ed. — Cost management",
      ],
      formulaDescription:
        "Total cost = Σ(material qty × unit price) + Σ(labor hours × hourly rate) + overhead allocation + risk contingency. The contingency factor is a function of input uncertainty bandwidth and historical sector volatility. Cost escalation indices apply for multi-period projections.",
      interpretationGuide:
        "The base estimate reflects deterministic input values. The P90-adjusted figure includes a risk buffer calibrated to cover cost overrun in 90% of comparable historical projects. A contingency drawdown below 50% signals high confidence; above 100% indicates the base estimate is structurally understated.",
      industryContext:
        "Suitable for feasibility studies, budget allocation, and bid preparation in manufacturing, construction, and industrial engineering. Follows AACE Class 3-5 estimate classification. Detailed estimates (Class 1-2) require vendor quotes and site-specific surveys.",
    },
    tr: {
      methodology:
        "Maliyet tahmini, toplam harcamayı doğrudan malzeme, doğrudan işçilik, genel gider ve riske göre ayarlanmış contingency bileşenlerine ayıran aşağıdan yukarıya parametrik bir model izler. Her maliyet kalemi, kullanıcı tarafından belirtilen miktarlar ve birim fiyatlardan hesaplanır ve sektöre özgü maliyet endeksleriyle çapraz kontrol edilir.",
      standards: [
        "ISO 15686:5:2017 — Yaşam döngüsü maliyetlemesi",
        "AACE International RP 17R-97 — Maliyet tahmin sınıflandırması",
        "DIN 276 — Bina maliyetleri",
        "PMBOK Kılavuzu 7. Baskı — Maliyet yönetimi",
      ],
      formulaDescription:
        "Toplam maliyet = Σ(malzeme miktarı × birim fiyat) + Σ(işçilik saati × saatlik ücret) + genel gider + risk contingency. Contingency faktörü, girdi belirsizlik aralığı ve sektör oynaklığına göre hesaplanır.",
      interpretationGuide:
        "Temel tahmin deterministik girdileri yansıtır. P90 ayarlı rakam, benzer projelerin %90'ında maliyet aşımını karşılayacak şekilde kalibre edilmiş bir risk tamponu içerir.",
      industryContext:
        "İmalat, inşaat ve endüstriyel mühendislikte fizibilite çalışmaları, bütçe tahsisi ve teklif hazırlığı için uygundur.",
    },
    de: {
      methodology:
        "Die Kostenschätzung folgt einem Bottom-up-Parametermodell, das die Gesamtausgaben in direkte Material-, Arbeits-, Gemeinkosten- und Risikokomponenten zerlegt.",
      standards: [
        "ISO 15686:5:2017 — Lebenszykluskosten",
        "AACE International RP 17R-97",
        "DIN 276 — Baukosten",
      ],
      formulaDescription:
        "Gesamtkosten = Σ(Material × Einheitspreis) + Σ(Arbeitsstunden × Stundensatz) + Gemeinkosten + Risikorückstellung.",
      interpretationGuide:
        "Die Basisschätzung spiegelt deterministische Eingabewerte wider. Der P90-Wert enthält eine Risikoreserve für 90% der historischen Projekte.",
      industryContext:
        "Geeignet für Machbarkeitsstudien und Angebotsvorbereitung in Fertigung und Bau.",
    },
    fr: {
      methodology:
        "L'estimation des coûts suit un modèle paramétrique ascendant décomposant la dépense en composantes de matériaux, main-d'œuvre, frais généraux et contingence.",
      standards: [
        "ISO 15686:5:2017 — Analyse du coût du cycle de vie",
        "AACE International RP 17R-97",
        "DIN 276 — Gestion des coûts",
      ],
      formulaDescription:
        "Coût total = Σ(quantité matière × prix unitaire) + Σ(heures MO × taux horaire) + frais généraux + contingence.",
      interpretationGuide:
        "L'estimation de base reflète les valeurs déterministes. Le montant P90 intègre une réserve calibrée pour 90% des dépassements.",
      industryContext:
        "Convient aux études de faisabilité et à la préparation d'offres dans l'industrie manufacturière.",
    },
    es: {
      methodology:
        "La estimación de costos sigue un modelo paramétrico ascendente que descompone el gasto en material directo, mano de obra, gastos generales y contingencia.",
      standards: [
        "ISO 15686:5:2017",
        "AACE International RP 17R-97",
        "DIN 276",
      ],
      formulaDescription:
        "Costo total = Σ(cantidad material × precio unitario) + Σ(horas MO × tarifa) + gastos generales + contingencia.",
      interpretationGuide:
        "La estimación base refleja valores determinísticos. El valor P90 incluye una reserva calibrada para el 90% de los proyectos comparables.",
      industryContext:
        "Adecuado para estudios de viabilidad y preparación de ofertas en fabricación y construcción.",
    },
    ar: {
      methodology:
        "يتبع تقدير التكلفة نموذجاً بارامترياً تصاعدياً يحلل إجمالي الإنفاق إلى مكونات المواد والعمالة والتكاليف العامة واحتياطي المخاطر.",
      standards: [
        "ISO 15686:5:2017",
        "AACE International RP 17R-97",
        "DIN 276",
      ],
      formulaDescription:
        "إجمالي التكلفة = Σ(كمية المواد × سعر الوحدة) + Σ(ساعات العمل × الأجر) + التكاليف العامة + احتياطي المخاطر.",
      interpretationGuide:
        "يعكس التقدير الأساسي قيماً حتمية. القيمة المعدلة P90 تتضمن احتياطي مخاطر يغطي 90% من المشاريع المماثلة.",
      industryContext:
        "مناسب لدراسات الجدوى وإعداد العروض في التصنيع والبناء.",
    },
  },

  measurement: {
    en: {
      methodology:
        "Measurement analysis applies statistical quality control principles per ISO 5725 and the Guide to the Expression of Uncertainty in Measurement (GUM). The measurement system is characterized by its accuracy, resolution, and reproducibility. Uncertainty is propagated through root-sum-square (RSS) combination of Type A and Type B components. Expanded uncertainty is reported at 95% confidence (k=2).",
      standards: [
        "ISO/IEC Guide 98-3:2008 — GUM",
        "ISO 5725:1994 — Accuracy of measurement methods",
        "ISO 10012:2003 — Measurement management systems",
        "ASME B89.7.2 — Dimensional measurement planning",
      ],
      formulaDescription:
        "Combined standard uncertainty u_c = √(Σ u_i²). Expanded uncertainty U = k × u_c with k = 2 for 95% confidence. Capability index Cg = Tolerance / (6 × σ_measurement).",
      interpretationGuide:
        "Cg > 1.33 indicates a capable measurement system. Cg between 1.0 and 1.33 suggests marginal capability. Cg < 1.0 indicates unacceptable measurement uncertainty for the given tolerance.",
      industryContext:
        "Applicable to dimensional inspection, calibration laboratories, and quality control across manufacturing, automotive, aerospace, and medical device industries.",
    },
    // Other locales follow same pattern
  },

  scrap: {
    en: {
      methodology:
        "Scrap analysis follows Six Sigma DMAIC methodology. Defect rate is modeled as a Poisson process normalized to DPMO. Process sigma level is computed from DPMO using the standard normal inverse CDF. Material cost impact includes defect quantity, rework labor, inspection overhead, and disposal costs.",
      standards: [
        "ISO 13053:2011 — Six Sigma methodology",
        "AIAG PPAP 4th ed.",
        "IATF 16949:2016 — Automotive quality",
      ],
      formulaDescription:
        "DPMO = (defects × 1,000,000) / (units × opportunities). Sigma level = Φ⁻¹(1 - DPMO/1e6) + 1.5. Material loss = Σ(defect qty × unit cost + rework hours × rate + disposal cost).",
      interpretationGuide:
        "Sigma below 3 (DPMO > 66,800) indicates fundamental process redesign needed. Sigma 4-5 represents good industry performance. Sigma above 5 indicates world-class quality.",
      industryContext:
        "Follows Six Sigma defect accounting standards in automotive, electronics, medical devices, and high-volume manufacturing.",
    },
  },

  oee: {
    en: {
      methodology:
        "OEE is computed per SEMI E10 / ISO 22400-1. It decomposes into Availability (actual runtime / planned time), Performance (actual throughput / theoretical max), and Quality (good units / total units). Each loss maps to the Six Big Losses framework.",
      standards: [
        "ISO 22400-1:2014 — OEE KPIs",
        "SEMI E10 — Equipment reliability",
        "VDMA 66412-1",
        "ANSI ISA-95",
      ],
      formulaDescription:
        "OEE = Availability × Performance × Quality × 100%. Availability = Operating Time / Planned Production Time. Performance = (Ideal Cycle Time × Total Parts) / Operating Time. Quality = Good Parts / Total Parts.",
      interpretationGuide:
        "World-class OEE = 85% (90% × 95% × 99.9%). Typical industry range: 60-75%. Below 50% indicates significant improvement opportunity. Identify the lowest component for prioritization.",
      industryContext:
        "Standard metric for discrete and batch manufacturing productivity across automotive, electronics, packaging, food, and pharmaceutical industries.",
    },
  },

  energy: {
    en: {
      methodology:
        "Energy analysis applies ISO 50001 framework with specific energy consumption (SEC), energy intensity, and cost impact computation. Baseline uses CUSUM per ISO 50006. EnPIs are normalized for production volume. Avoided cost compares actual vs baseline consumption.",
      standards: [
        "ISO 50001:2018 — Energy management",
        "ISO 50006:2014 — Energy baselines",
        "ISO 50015:2014 — Energy performance verification",
        "IPMVP Vol I",
      ],
      formulaDescription:
        "SEC = Total Energy (kWh) / Production Output. Energy Cost = SEC × Volume × Unit Price. CO₂ = Consumption × Grid Emission Factor.",
      interpretationGuide:
        "Declining SEC over consecutive periods indicates improving efficiency. 3-5% year-over-year SEC reduction is typical for active programs. CO₂ data is Scope 2 unless on-site generation is modeled.",
      industryContext:
        "Follows ISO 50001 energy review methodology for industrial facilities, commercial buildings, and manufacturing operations.",
    },
  },

  carbon: {
    en: {
      methodology:
        "Carbon footprint analysis follows GHG Protocol Corporate Standard (Scope 1, 2, 3) with ISO 14064-1 verification. Emission factors from IPCC, DEFRA, EPA, and IEA databases. Scope 3 emissions are reported separately with confidence levels.",
      standards: [
        "ISO 14064-1:2018 — GHG accounting",
        "GHG Protocol — Corporate Standard",
        "ISO 14067:2018 — Product carbon footprint",
        "IPCC AR6 — GWP factors",
      ],
      formulaDescription:
        "Total CO₂e = Σ(Activity × Emission Factor × GWP). GWP per IPCC AR6: CO₂=1, CH₄=29.8, N₂O=273.",
      interpretationGuide:
        "Emissions intensity (tCO₂e per unit production) enables sector benchmarking. Declining intensity over 3+ years indicates effective decarbonization. Scope 3 typically represents 70-90% of total footprint.",
      industryContext:
        "Suitable for CBAM, SECR, EU ETS, CDP, TCFD reporting, and SBTi-aligned target setting.",
    },
  },

  calibration: {
    en: {
      methodology:
        "Calibration analysis follows ISO/IEC 17025 and GUM uncertainty framework. Interval optimization uses ILAC-G24 risk-based approach. Drift assessment applies linear regression with Mandel's h/k statistics.",
      standards: [
        "ISO/IEC 17025:2017 — Laboratory competence",
        "ILAC-G24:2022 — Calibration intervals",
        "ILAC-G8:2019 — Decision rules",
        "EA-4/02 M:2022",
      ],
      formulaDescription:
        "Calibration Interval = Base × Drift Rate × Risk Factor. Guard band = (Tolerance − |measured − nominal|) / U. Risk of false acceptance = Φ(−guard band).",
      interpretationGuide:
        "Guard band > 1.0: high confidence. 0.8-1.0: marginal. < 0.8: measurement uncertainty dominates; consider interval reduction.",
      industryContext:
        "Follows international laboratory accreditation requirements for dimensional, electrical, temperature, pressure, and mass calibration.",
    },
  },
};

const CATEGORY_FALLBACK: Record<string, string> = {
  cost: "cost", financial: "cost", pricing: "cost", margin: "cost", budget: "cost",
  measurement: "measurement", inspection: "measurement", gauge: "measurement",
  calibration: "calibration",
  scrap: "scrap", defect: "scrap", quality: "scrap", rework: "scrap",
  oee: "oee", efficiency: "oee", productivity: "oee", downtime: "oee",
  energy: "energy", power: "energy", electricity: "energy",
  carbon: "carbon", emission: "carbon", environmental: "carbon",
  time: "time", labor: "time", work: "time", standard: "time",
  route: "route", logistic: "route", transport: "route", supply: "route",
  benchmark: "benchmark", comparison: "benchmark", kpi: "benchmark",
};

export function resolveEngineeringContent(
  formulaCategory: string | undefined,
  locale: SupportedLocale,
): PdfEngineeringExplanation {
  const key = (formulaCategory ?? "").toLowerCase();
  const lookup = CATEGORY_FALLBACK[key] ?? key;

  const langMap = EXPLANATIONS[lookup];
  if (!langMap) return DEFAULT_EN;

  return langMap[locale] ?? langMap.en ?? DEFAULT_EN;
}
