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
    tr: {
      methodology:
        "Ölçüm analizi, ISO 5725 ve Ölçümde Belirsizliğin İfadesi Kılavuzu'na (GUM) göre istatistiksel kalite kontrol ilkelerini uygular. Ölçüm sistemi; doğruluk, çözünürlük ve tekrarlanabilirlik ile karakterize edilir. Belirsizlik, Tip A ve Tip B bileşenlerinin kareler toplamının karekökü (RSS) yöntemiyle birleştirilir. Genişletilmiş belirsizlik %95 güven düzeyinde (k=2) raporlanır.",
      standards: [
        "ISO/IEC Kılavuzu 98-3:2008 — GUM",
        "ISO 5725:1994 — Ölçüm yöntemlerinin doğruluğu",
        "ISO 10012:2003 — Ölçüm yönetim sistemleri",
        "ASME B89.7.2 — Boyutsal ölçüm planlaması",
      ],
      formulaDescription:
        "Birleşik standart belirsizlik u_c = √(Σ u_i²). Genişletilmiş belirsizlik U = k × u_c, k=2 ile %95 güven için. Yetenek indeksi Cg = Tolerans / (6 × σ_ölçüm).",
      interpretationGuide:
        "Cg > 1.33 yetenekli ölçüm sistemi. Cg 1.0-1.33 arası marjinal. Cg < 1.0 kabul edilemez ölçüm belirsizliği.",
      industryContext:
        "Boyutsal muayene, kalibrasyon laboratuvarları ve imalat, otomotiv, havacılık ve tıbbi cihaz sektörlerinde kalite kontrol için uygundur.",
    },
    de: {
      methodology:
        "Die Messanalyse wendet Grundsätze der statistischen Qualitätskontrolle nach ISO 5725 und dem GUM an. Das Messsystem wird durch Genauigkeit, Auflösung und Reproduzierbarkeit charakterisiert. Die Unsicherheit wird durch RSS-Kombination von Typ-A- und Typ-B-Komponenten fortgepflanzt.",
      standards: [
        "ISO/IEC Guide 98-3:2008 — GUM",
        "ISO 5725:1994 — Genauigkeit von Messverfahren",
        "ISO 10012:2003 — Messmanagementsysteme",
        "ASME B89.7.2 — Maßplanung",
      ],
      formulaDescription:
        "Kombinierte Standardunsicherheit u_c = √(Σ u_i²). Erweiterte Unsicherheit U = k × u_c (k=2, 95% Vertrauen). Fähigkeitsindex Cg = Toleranz / (6 × σ_Messung).",
      interpretationGuide:
        "Cg > 1.33: fähiges Messsystem. Cg 1,0-1,33: grenzwertig. Cg < 1,0: inakzeptable Messunsicherheit.",
      industryContext:
        "Anwendbar für Maßprüfung, Kalibrierlaboratorien und Qualitätskontrolle in Fertigung, Automobil, Luftfahrt und Medizintechnik.",
    },
    fr: {
      methodology:
        "L'analyse des mesures applique les principes de maîtrise statistique de la qualité selon l'ISO 5725 et le GUM. Le système de mesure est caractérisé par sa justesse, sa résolution et sa reproductibilité. L'incertitude est propagée par combinaison RSS des composantes de type A et B.",
      standards: [
        "ISO/IEC Guide 98-3:2008 — GUM",
        "ISO 5725:1994 — Justesse des méthodes de mesure",
        "ISO 10012:2003 — Systèmes de management de la mesure",
        "ASME B89.7.2 — Planification dimensionnelle",
      ],
      formulaDescription:
        "Incertitude-type composée u_c = √(Σ u_i²). Incertitude élargie U = k × u_c (k=2, 95% confiance). Indice de capabilité Cg = Tolérance / (6 × σ_mesure).",
      interpretationGuide:
        "Cg > 1,33 : système capable. Cg 1,0-1,33 : marginal. Cg < 1,0 : incertitude inacceptable.",
      industryContext:
        "Applicable à l'inspection dimensionnelle, aux laboratoires d'étalonnage et au contrôle qualité dans l'industrie manufacturière, l'automobile, l'aérospatiale et les dispositifs médicaux.",
    },
    es: {
      methodology:
        "El análisis de mediciones aplica principios de control estadístico de calidad según ISO 5725 y la GUM. El sistema de medición se caracteriza por su exactitud, resolución y reproducibilidad. La incertidumbre se propaga mediante combinación RSS de componentes Tipo A y Tipo B.",
      standards: [
        "ISO/IEC Guide 98-3:2008 — GUM",
        "ISO 5725:1994 — Exactitud de métodos de medición",
        "ISO 10012:2003 — Sistemas de gestión de mediciones",
        "ASME B89.7.2 — Planificación de medición dimensional",
      ],
      formulaDescription:
        "Incertidumbre típica combinada u_c = √(Σ u_i²). Incertidumbre expandida U = k × u_c (k=2, 95% confianza). Índice de capacidad Cg = Tolerancia / (6 × σ_medición).",
      interpretationGuide:
        "Cg > 1.33: sistema capaz. Cg 1.0-1.33: marginal. Cg < 1.0: incertidumbre inaceptable.",
      industryContext:
        "Aplicable a inspección dimensional, laboratorios de calibración y control de calidad en fabricación, automoción, aeroespacial y dispositivos médicos.",
    },
    ar: {
      methodology:
        "يطبق تحليل القياس مبادئ مراقبة الجودة الإحصائية وفقاً لـ ISO 5725 ودليل التعبير عن عدم اليقين في القياس (GUM). يتميز نظام القياس بدقته واستبانته وقابليته للتكرار. يتم نشر عدم اليقين من خلال الجمع التربيعي لمكونات النوع A والنوع B.",
      standards: [
        "ISO/IEC دليل 98-3:2008 — GUM",
        "ISO 5725:1994 — دقة طرق القياس",
        "ISO 10012:2003 — أنظمة إدارة القياس",
        "ASME B89.7.2 — تخطيط القياس البعدي",
      ],
      formulaDescription:
        "عدم اليقين المعياري المركب u_c = √(Σ u_i²). عدم اليقين الموسع U = k × u_c (k=2 لـ 95% ثقة). مؤشر القدرة Cg = التسامح / (6 × σ_قياس).",
      interpretationGuide:
        "Cg > 1.33: نظام قياس قادر. Cg 1.0-1.33: هامشي. Cg < 1.0: عدم يقين غير مقبول.",
      industryContext:
        "ينطبق على الفحص البعدي ومختبرات المعايرة ومراقبة الجودة في التصنيع والسيارات والفضاء والأجهزة الطبية.",
    },
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
    tr: {
      methodology:
        "Hurda analizi, Altı Sigma DMAIC metodolojisini izler. Hata oranı, DPMO'ya normalize edilmiş bir Poisson süreci olarak modellenir. Süreç sigma seviyesi, DPMO'dan standart normal ters CDF kullanılarak hesaplanır. Malzeme maliyet etkisi; hata miktarı, yeniden işçilik, muayene genel gideri ve bertaraf maliyetlerini içerir.",
      standards: [
        "ISO 13053:2011 — Altı Sigma metodolojisi",
        "AIAG PPAP 4. baskı",
        "IATF 16949:2016 — Otomotiv kalitesi",
      ],
      formulaDescription:
        "DPMO = (hatalar × 1.000.000) / (birim × fırsat). Sigma seviyesi = Φ⁻¹(1 - DPMO/1e6) + 1.5. Malzeme kaybı = Σ(hata miktarı × birim maliyet + yeniden işçilik saati × ücret + bertaraf maliyeti).",
      interpretationGuide:
        "Sigma 3'ün altında (DPMO > 66.800) temel süreç yeniden tasarımı gerekir. Sigma 4-5 iyi endüstri performansı. Sigma 5 üstü dünya standartlarında kalite.",
      industryContext:
        "Otomotiv, elektronik, tıbbi cihazlar ve yüksek hacimli imalatta Altı Sigma hata muhasebesi standartlarını takip eder.",
    },
    de: {
      methodology:
        "Die Ausschussanalyse folgt der Six-Sigma-DMAIC-Methodik. Die Fehlerrate wird als Poisson-Prozess modelliert und auf DPMO normalisiert. Der Prozess-Sigma-Wert wird aus dem DPMO mithilfe der inversen Standardnormal-CDF berechnet.",
      standards: [
        "ISO 13053:2011 — Six Sigma Methodik",
        "AIAG PPAP 4. Aufl.",
        "IATF 16949:2016 — Automobilqualität",
      ],
      formulaDescription:
        "DPMO = (Fehler × 1.000.000) / (Einheiten × Gelegenheiten). Sigma-Level = Φ⁻¹(1 - DPMO/1e6) + 1,5. Materialverlust = Σ(Fehlermenge × Stückkosten + Nacharbeitsstunden × Satz + Entsorgungskosten).",
      interpretationGuide:
        "Sigma unter 3 (DPMO > 66.800): grundlegende Prozessneugestaltung erforderlich. Sigma 4-5: gute Industriepraxis. Sigma über 5: Weltklasse-Qualität.",
      industryContext:
        "Befolgt Six-Sigma-Fehlerbewertungsstandards in der Automobil-, Elektronik-, Medizintechnik- und Großserienfertigung.",
    },
    fr: {
      methodology:
        "L'analyse des rebuts suit la méthodologie Six Sigma DMAIC. Le taux de défauts est modélisé comme un processus de Poisson normalisé en DPMO. Le niveau sigma du processus est calculé à partir du DPMO à l'aide de la fonction CDF inverse normale standard.",
      standards: [
        "ISO 13053:2011 — Méthodologie Six Sigma",
        "AIAG PPAP 4e éd.",
        "IATF 16949:2016 — Qualité automobile",
      ],
      formulaDescription:
        "DPMO = (défauts × 1 000 000) / (unités × opportunités). Niveau sigma = Φ⁻¹(1 - DPMO/1e6) + 1,5. Perte matière = Σ(qté défauts × coût unitaire + heures reprise × taux + coût élimination).",
      interpretationGuide:
        "Sigma < 3 (DPMO > 66 800) : reconception fondamentale requise. Sigma 4-5 : bonne performance industrielle. Sigma > 5 : qualité de classe mondiale.",
      industryContext:
        "Respecte les normes de comptabilisation des défauts Six Sigma dans l'automobile, l'électronique, les dispositifs médicaux et la fabrication en grande série.",
    },
    es: {
      methodology:
        "El análisis de desperdicio sigue la metodología DMAIC de Six Sigma. La tasa de defectos se modela como un proceso de Poisson normalizado a DPMO. El nivel sigma del proceso se calcula a partir del DPMO usando la CDF inversa normal estándar.",
      standards: [
        "ISO 13053:2011 — Metodología Six Sigma",
        "AIAG PPAP 4ª ed.",
        "IATF 16949:2016 — Calidad automotriz",
      ],
      formulaDescription:
        "DPMO = (defectos × 1.000.000) / (unidades × oportunidades). Nivel Sigma = Φ⁻¹(1 - DPMO/1e6) + 1.5. Pérdida de material = Σ(cant. defectos × costo unitario + horas retrabajo × tarifa + costo eliminación).",
      interpretationGuide:
        "Sigma < 3 (DPMO > 66.800): rediseño fundamental necesario. Sigma 4-5: buen rendimiento industrial. Sigma > 5: calidad de clase mundial.",
      industryContext:
        "Sigue estándares de contabilidad de defectos Six Sigma en automoción, electrónica, dispositivos médicos y fabricación de alto volumen.",
    },
    ar: {
      methodology:
        "يتبع تحليل الخردة منهجية DMAIC لنظام Six Sigma. يتم نمذجة معدل الخلل كعملية بواسون وتطبيعها إلى DPMO. يتم حساب مستوى sigma للعملية من DPMO باستخدام دالة التوزيع التراكمي العكسي الطبيعية.",
      standards: [
        "ISO 13053:2011 — منهجية Six Sigma",
        "AIAG PPAP الطبعة الرابعة",
        "IATF 16949:2016 — جودة السيارات",
      ],
      formulaDescription:
        "DPMO = (العيوب × 1,000,000) / (الوحدات × الفرص). مستوى Sigma = Φ⁻¹(1 - DPMO/1e6) + 1.5. فقدان المواد = Σ(كمية العيوب × تكلفة الوحدة + ساعات إعادة العمل × الأجر + تكلفة التخلص).",
      interpretationGuide:
        "Sigma أقل من 3 (DPMO > 66,800) يشير إلى الحاجة لإعادة تصميم العملية. Sigma 4-5 يمثل أداء صناعي جيد. Sigma فوق 5 يشير إلى جودة عالمية.",
      industryContext:
        "يتبع معايير محاسبة العيوب Six Sigma في السيارات والإلكترونيات والأجهزة الطبية والتصنيع عالي الحجم.",
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
    tr: {
      methodology:
        "OEE, SEMI E10 / ISO 22400-1'e göre hesaplanır. Kullanılabilirlik (gerçek çalışma süresi / planlanan süre), Performans (gerçek üretim / teorik maksimum) ve Kalite (iyi birim / toplam birim) olarak üç bileşene ayrılır. Her kayıp Altı Büyük Kayıp çerçevesine eşlenir.",
      standards: [
        "ISO 22400-1:2014 — OEE KPI'ları",
        "SEMI E10 — Ekipman güvenilirliği",
        "VDMA 66412-1",
        "ANSI ISA-95",
      ],
      formulaDescription:
        "OEE = Kullanılabilirlik × Performans × Kalite × %100. Kullanılabilirlik = Çalışma Süresi / Planlanan Üretim Süresi. Performans = (İdeal Çevrim Süresi × Toplam Parça) / Çalışma Süresi. Kalite = İyi Parça / Toplam Parça.",
      interpretationGuide:
        "Dünya standartlarında OEE = %85 (%90 × %95 × %99.9). Tipik endüstri aralığı: %60-75. %50'nin altı önemli iyileştirme fırsatını gösterir.",
      industryContext:
        "Otomotiv, elektronik, paketleme, gıda ve ilaç endüstrilerinde kesikli ve partili üretim verimliliği için standart metriktir.",
    },
    de: {
      methodology:
        "OEE wird nach SEMI E10 / ISO 22400-1 berechnet und in Verfügbarkeit, Leistung und Qualität zerlegt. Jeder Verlust wird den Six Big Losses zugeordnet.",
      standards: [
        "ISO 22400-1:2014 — OEE-Kennzahlen",
        "SEMI E10 — Anlagenzuverlässigkeit",
        "VDMA 66412-1",
        "ANSI ISA-95",
      ],
      formulaDescription:
        "OEE = Verfügbarkeit × Leistung × Qualität × 100%. Verfügbarkeit = Betriebszeit / geplante Produktionszeit. Leistung = (Ideale Taktzeit × Teile) / Betriebszeit. Qualität = Gutteile / Gesamtteile.",
      interpretationGuide:
        "Weltklasse-OEE = 85% (90% × 95% × 99,9%). Typischer Bereich: 60-75%. Unter 50%: erhebliches Verbesserungspotenzial.",
      industryContext:
        "Standardkennzahl für diskrete und Chargenfertigung in Automobil, Elektronik, Verpackung, Lebensmittel und Pharma.",
    },
    fr: {
      methodology:
        "Le TRS est calculé selon SEMI E10 / ISO 22400-1. Il se décompose en Disponibilité, Performance et Qualité. Chaque perte est rattachée aux Six Grandes Pertes.",
      standards: [
        "ISO 22400-1:2014 — Indicateurs TRS",
        "SEMI E10 — Fiabilité des équipements",
        "VDMA 66412-1",
        "ANSI ISA-95",
      ],
      formulaDescription:
        "TRS = Disponibilité × Performance × Qualité × 100%. Disponibilité = Temps de marche / Temps prévu. Performance = (Temps de cycle idéal × Pièces) / Temps de marche. Qualité = Bonnes pièces / Pièces totales.",
      interpretationGuide:
        "TRS de classe mondiale = 85% (90% × 95% × 99,9%). Plage typique : 60-75%. Sous 50% : potentiel d'amélioration significatif.",
      industryContext:
        "Métrique standard de productivité pour la fabrication discrète et par lots dans l'automobile, l'électronique, l'emballage, l'agroalimentaire et la pharmacie.",
    },
    es: {
      methodology:
        "El OEE se calcula según SEMI E10 / ISO 22400-1. Se descompone en Disponibilidad, Rendimiento y Calidad. Cada pérdida se asigna al marco de las Seis Grandes Pérdidas.",
      standards: [
        "ISO 22400-1:2014 — KPIs OEE",
        "SEMI E10 — Confiabilidad de equipos",
        "VDMA 66412-1",
        "ANSI ISA-95",
      ],
      formulaDescription:
        "OEE = Disponibilidad × Rendimiento × Calidad × 100%. Disponibilidad = Tiempo operativo / Tiempo planificado. Rendimiento = (Tiempo ciclo ideal × Piezas) / Tiempo operativo. Calidad = Piezas buenas / Piezas totales.",
      interpretationGuide:
        "OEE de clase mundial = 85% (90% × 95% × 99.9%). Rango típico: 60-75%. Por debajo de 50% indica oportunidad significativa de mejora.",
      industryContext:
        "Métrica estándar para productividad en fabricación discreta y por lotes en automoción, electrónica, embalaje, alimentación y farmacia.",
    },
    ar: {
      methodology:
        "يتم حساب OEE وفقاً لـ SEMI E10 / ISO 22400-1. ينقسم إلى التوفر (وقت التشغيل الفعلي / الوقت المخطط)، الأداء (الإنتاج الفعلي / الحد الأقصى النظري)، والجودة (الوحدات الجيدة / إجمالي الوحدات).",
      standards: [
        "ISO 22400-1:2014 — مؤشرات OEE",
        "SEMI E10 — موثوقية المعدات",
        "VDMA 66412-1",
        "ANSI ISA-95",
      ],
      formulaDescription:
        "OEE = التوفر × الأداء × الجودة × 100%. التوفر = وقت التشغيل / وقت الإنتاج المخطط. الأداء = (وقت الدورة المثالي × إجمالي القطع) / وقت التشغيل. الجودة = القطع الجيدة / إجمالي القطع.",
      interpretationGuide:
        "OEE عالمي المستوى = 85% (90% × 95% × 99.9%). النطاق النموذجي: 60-75%. أقل من 50% يشير إلى فرصة تحسين كبيرة.",
      industryContext:
        "مقياس قياسي لإنتاجية التصنيع المنفصل والدفعي في السيارات والإلكترونيات والتعبئة والتغليف والأغذية والأدوية.",
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
    tr: {
      methodology:
        "Enerji analizi, ISO 50001 çerçevesini özgül enerji tüketimi (SEC), enerji yoğunluğu ve maliyet etkisi hesaplamasıyla uygular. Temel çizgi, ISO 50006'ya göre CUSUM kullanır. Enerji performans göstergeleri (EnPI) üretim hacmine göre normalize edilir.",
      standards: [
        "ISO 50001:2018 — Enerji yönetimi",
        "ISO 50006:2014 — Enerji temel çizgileri",
        "ISO 50015:2014 — Enerji performans doğrulaması",
        "IPMVP Cilt I",
      ],
      formulaDescription:
        "SEC = Toplam Enerji (kWh) / Üretim Çıktısı. Enerji Maliyeti = SEC × Hacim × Birim Fiyat. CO₂ = Tüketim × Şebeke Emisyon Faktörü.",
      interpretationGuide:
        "Ardışık dönemlerde düşen SEC, artan verimliliği gösterir. Aktif programlarda yıllık %3-5 SEC düşüşü tipiktir. CO₂ verisi, yerinde üretim modellenmediği sürece Kapsam 2'dir.",
      industryContext:
        "Endüstriyel tesisler, ticari binalar ve imalat operasyonlarında ISO 50001 enerji gözden geçirme metodolojisini takip eder.",
    },
    de: {
      methodology:
        "Die Energieanalyse wendet das ISO-50001-Framework mit spezifischem Energieverbrauch (SEC), Energieintensität und Kostenauswirkung an. Die Basislinie verwendet CUSUM nach ISO 50006. EnPI werden für das Produktionsvolumen normalisiert.",
      standards: [
        "ISO 50001:2018 — Energiemanagement",
        "ISO 50006:2014 — Energiebaselines",
        "ISO 50015:2014 — Überprüfung der Energieeffizienz",
        "IPMVP Band I",
      ],
      formulaDescription:
        "SEC = Gesamtenergie (kWh) / Produktionsausstoß. Energiekosten = SEC × Volumen × Einheitspreis. CO₂ = Verbrauch × Netz-Emissionsfaktor.",
      interpretationGuide:
        "Sinkender SEC über mehrere Perioden zeigt verbesserte Effizienz. 3-5% SEC-Reduktion pro Jahr ist typisch. CO₂-Daten sind Scope 2, sofern keine Eigenerzeugung modelliert wird.",
      industryContext:
        "Befolgt die ISO-50001-Energiebewertungsmethodik für Industrieanlagen, Gewerbegebäude und Fertigungsbetriebe.",
    },
    fr: {
      methodology:
        "L'analyse énergétique applique le cadre ISO 50001 avec la consommation spécifique d'énergie (SEC), l'intensité énergétique et le calcul de l'impact financier. La référence utilise CUSUM selon ISO 50006. Les EnPI sont normalisés par volume de production.",
      standards: [
        "ISO 50001:2018 — Management de l'énergie",
        "ISO 50006:2014 — Références énergétiques",
        "ISO 50015:2014 — Vérification de la performance énergétique",
        "IPMVP Vol I",
      ],
      formulaDescription:
        "SEC = Énergie totale (kWh) / Production. Coût énergétique = SEC × Volume × Prix unitaire. CO₂ = Consommation × Facteur d'émission réseau.",
      interpretationGuide:
        "Une baisse du SEC sur plusieurs périodes indique une amélioration de l'efficacité. Une réduction annuelle de 3-5% du SEC est typique. Les données CO₂ sont Scope 2 sauf si la production sur site est modélisée.",
      industryContext:
        "Suit la méthodologie d'audit énergétique ISO 50001 pour les installations industrielles, les bâtiments commerciaux et les opérations de fabrication.",
    },
    es: {
      methodology:
        "El análisis energético aplica el marco ISO 50001 con consumo específico de energía (SEC), intensidad energética y cálculo de impacto de costos. La línea base utiliza CUSUM según ISO 50006. Los EnPI se normalizan por volumen de producción.",
      standards: [
        "ISO 50001:2018 — Gestión de la energía",
        "ISO 50006:2014 — Líneas base energéticas",
        "ISO 50015:2014 — Verificación del desempeño energético",
        "IPMVP Vol I",
      ],
      formulaDescription:
        "SEC = Energía Total (kWh) / Producción. Costo Energético = SEC × Volumen × Precio Unitario. CO₂ = Consumo × Factor de Emisión de la Red.",
      interpretationGuide:
        "SEC decreciente en períodos consecutivos indica mejora de eficiencia. Reducción anual del 3-5% del SEC es típica. Los datos de CO₂ son Alcance 2 a menos que se modele generación in situ.",
      industryContext:
        "Sigue la metodología de revisión energética ISO 50001 para instalaciones industriales, edificios comerciales y operaciones de fabricación.",
    },
    ar: {
      methodology:
        "يطبق تحليل الطاقة إطار ISO 50001 مع حساب استهلاك الطاقة المحدد (SEC) وكثافة الطاقة وتأثير التكلفة. يستخدم خط الأساس CUSUM وفقاً لـ ISO 50006. يتم تطبيع مؤشرات أداء الطاقة حسب حجم الإنتاج.",
      standards: [
        "ISO 50001:2018 — إدارة الطاقة",
        "ISO 50006:2014 — خطوط الأساس للطاقة",
        "ISO 50015:2014 — التحقق من أداء الطاقة",
        "IPMVP المجلد I",
      ],
      formulaDescription:
        "SEC = إجمالي الطاقة (كيلوواط ساعة) / الإنتاج. تكلفة الطاقة = SEC × الحجم × سعر الوحدة. CO₂ = الاستهلاك × عامل انبعاثات الشبكة.",
      interpretationGuide:
        "انخفاض SEC على فترات متتالية يشير إلى تحسين الكفاءة. تخفيض 3-5% سنوياً في SEC هو النمط النموذجي. بيانات CO₂ هي النطاق 2 ما لم يتم نمذجة التوليد في الموقع.",
      industryContext:
        "يتبع منهجية مراجعة الطاقة ISO 50001 للمنشآت الصناعية والمباني التجارية وعمليات التصنيع.",
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
    tr: {
      methodology:
        "Karbon ayak izi analizi, ISO 14064-1 doğrulamasıyla GHG Protokolü Kurumsal Standardı'nı (Kapsam 1, 2, 3) takip eder. Emisyon faktörleri IPCC, DEFRA, EPA ve IEA veritabanlarından alınır. Kapsam 3 emisyonları güven düzeyleriyle birlikte ayrı raporlanır.",
      standards: [
        "ISO 14064-1:2018 — Sera gazı muhasebesi",
        "GHG Protokolü — Kurumsal Standart",
        "ISO 14067:2018 — Ürün karbon ayak izi",
        "IPCC AR6 — GWP faktörleri",
      ],
      formulaDescription:
        "Toplam CO₂e = Σ(Faaliyet × Emisyon Faktörü × GWP). IPCC AR6'ya göre GWP: CO₂=1, CH₄=29.8, N₂O=273.",
      interpretationGuide:
        "Emisyon yoğunluğu (birim üretim başına tCO₂e) sektör kıyaslamasına olanak sağlar. 3+ yıl boyunca düşen yoğunluk etkin karbonsuzlaştırmayı gösterir. Kapsam 3, tipik olarak toplam ayak izinin %70-90'ını oluşturur.",
      industryContext:
        "CBAM, SECR, AB ETS, CDP, TCFD raporlaması ve SBTi uyumlu hedef belirleme için uygundur.",
    },
    de: {
      methodology:
        "Die Kohlenstoffbilanzanalyse folgt dem GHG-Protocol-Corporate-Standard (Scope 1, 2, 3) mit ISO-14064-1-Verifizierung. Emissionsfaktoren aus IPCC-, DEFRA-, EPA- und IEA-Datenbanken. Scope-3-Emissionen werden getrennt mit Konfidenzniveaus ausgewiesen.",
      standards: [
        "ISO 14064-1:2018 — Treibhausgasbilanzierung",
        "GHG Protocol — Corporate Standard",
        "ISO 14067:2018 — Produkt-Kohlenstoffbilanz",
        "IPCC AR6 — GWP-Faktoren",
      ],
      formulaDescription:
        "Gesamt CO₂e = Σ(Aktivität × Emissionsfaktor × GWP). GWP nach IPCC AR6: CO₂=1, CH₄=29,8, N₂O=273.",
      interpretationGuide:
        "Emissionsintensität (tCO₂e pro Produktionseinheit) ermöglicht Branchenvergleiche. Sinkende Intensität über 3+ Jahre zeigt wirksame Dekarbonisierung. Scope 3 macht typischerweise 70-90% des Gesamtfußabdrucks aus.",
      industryContext:
        "Geeignet für CBAM, SECR, EU-ETS, CDP, TCFD-Berichterstattung und SBTi-Zielsetzung.",
    },
    fr: {
      methodology:
        "L'analyse de l'empreinte carbone suit le GHG Protocol Corporate Standard (Scope 1, 2, 3) avec vérification ISO 14064-1. Facteurs d'émission issus des bases IPCC, DEFRA, EPA et AIE. Les émissions Scope 3 sont rapportées séparément avec niveaux de confiance.",
      standards: [
        "ISO 14064-1:2018 — Comptabilité GES",
        "GHG Protocol — Corporate Standard",
        "ISO 14067:2018 — Empreinte carbone produit",
        "IPCC AR6 — Facteurs GWP",
      ],
      formulaDescription:
        "CO₂e total = Σ(Activité × Facteur d'émission × GWP). GWP selon IPCC AR6 : CO₂=1, CH₄=29,8, N₂O=273.",
      interpretationGuide:
        "L'intensité d'émission (tCO₂e par unité produite) permet le benchmarking sectoriel. Une baisse sur 3+ ans indique une décarbonation efficace. Le Scope 3 représente 70-90% de l'empreinte totale.",
      industryContext:
        "Adapté aux rapports CBAM, SECR, EU ETS, CDP, TCFD et à la définition d'objectifs alignés SBTi.",
    },
    es: {
      methodology:
        "El análisis de huella de carbono sigue el Estándar Corporativo del GHG Protocol (Alcance 1, 2, 3) con verificación ISO 14064-1. Factores de emisión de bases de datos IPCC, DEFRA, EPA y AIE. Las emisiones de Alcance 3 se reportan por separado con niveles de confianza.",
      standards: [
        "ISO 14064-1:2018 — Contabilidad GEI",
        "GHG Protocol — Estándar Corporativo",
        "ISO 14067:2018 — Huella de carbono de producto",
        "IPCC AR6 — Factores GWP",
      ],
      formulaDescription:
        "CO₂e total = Σ(Actividad × Factor de Emisión × GWP). GWP según IPCC AR6: CO₂=1, CH₄=29.8, N₂O=273.",
      interpretationGuide:
        "La intensidad de emisiones (tCO₂e por unidad de producción) permite la comparación sectorial. La disminución por más de 3 años indica descarbonización efectiva. El Alcance 3 representa típicamente el 70-90% de la huella total.",
      industryContext:
        "Adecuado para informes CBAM, SECR, EU ETS, CDP, TCFD y establecimiento de objetivos alineados con SBTi.",
    },
    ar: {
      methodology:
        "يتبع تحليل البصمة الكربونية المعيار المؤسسي لبروتوكول الغازات الدفيئة (النطاق 1، 2، 3) مع التحقق وفقاً لـ ISO 14064-1. عوامل الانبعاثات من قواعد بيانات IPCC و DEFRA و EPA و IEA. يتم الإبلاغ عن انبعاثات النطاق 3 بشكل منفصل مع مستويات الثقة.",
      standards: [
        "ISO 14064-1:2018 — محاسبة الغازات الدفيئة",
        "بروتوكول الغازات الدفيئة — المعيار المؤسسي",
        "ISO 14067:2018 — البصمة الكربونية للمنتج",
        "IPCC AR6 — عوامل GWP",
      ],
      formulaDescription:
        "إجمالي CO₂e = Σ(النشاط × عامل الانبعاثات × GWP). GWP حسب IPCC AR6: CO₂=1، CH₄=29.8، N₂O=273.",
      interpretationGuide:
        "كثافة الانبعاثات (طن CO₂e لكل وحدة إنتاج) تمكن من المقارنة القطاعية. الانخفاض على مدى 3+ سنوات يشير إلى إزالة كربون فعالة. النطاق 3 يمثل عادة 70-90% من إجمالي البصمة.",
      industryContext:
        "مناسب لتقارير CBAM و SECR و EU ETS و CDP و TCFD وتحديد الأهداف المتوافقة مع SBTi.",
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
    tr: {
      methodology:
        "Kalibrasyon analizi, ISO/IEC 17025 ve GUM belirsizlik çerçevesini takip eder. Aralık optimizasyonu, ILAC-G24 risk temelli yaklaşımı kullanır. Sürüklenme değerlendirmesi, Mandel h/k istatistikleriyle doğrusal regresyon uygular.",
      standards: [
        "ISO/IEC 17025:2017 — Laboratuvar yeterliliği",
        "ILAC-G24:2022 — Kalibrasyon aralıkları",
        "ILAC-G8:2019 — Karar kuralları",
        "EA-4/02 M:2022",
      ],
      formulaDescription:
        "Kalibrasyon Aralığı = Taban × Sürüklenme Oranı × Risk Faktörü. Koruma bandı = (Tolerans − |ölçülen − nominal|) / U. Yanlış kabul riski = Φ(−koruma bandı).",
      interpretationGuide:
        "Koruma bandı > 1.0: yüksek güven. 0.8-1.0: marjinal. < 0.8: ölçüm belirsizliği baskın; aralık azaltımı düşünülmeli.",
      industryContext:
        "Boyutsal, elektriksel, sıcaklık, basınç ve kütle kalibrasyonu için uluslararası laboratuvar akreditasyon gereksinimlerini takip eder.",
    },
    de: {
      methodology:
        "Die Kalibrierungsanalyse folgt ISO/IEC 17025 und dem GUM-Ansatz. Die Intervalloptimierung verwendet den risikobasierten ILAC-G24-Ansatz. Die Driftbewertung erfolgt mittels linearer Regression mit Mandels h/k-Statistiken.",
      standards: [
        "ISO/IEC 17025:2017 — Laborkompetenz",
        "ILAC-G24:2022 — Kalibrierintervalle",
        "ILAC-G8:2019 — Entscheidungsregeln",
        "EA-4/02 M:2022",
      ],
      formulaDescription:
        "Kalibrierintervall = Basis × Driftrate × Risikofaktor. Schutzband = (Toleranz − |gemessen − nominal|) / U. Risiko der Fehlannahme = Φ(−Schutzband).",
      interpretationGuide:
        "Schutzband > 1,0: hohe Sicherheit. 0,8-1,0: grenzwertig. < 0,8: Messunsicherheit dominiert; Intervallverkürzung in Betracht ziehen.",
      industryContext:
        "Befolgt internationale Laborakkreditierungsanforderungen für Maß-, Elektro-, Temperatur-, Druck- und Massekalibrierung.",
    },
    fr: {
      methodology:
        "L'analyse d'étalonnage suit l'ISO/IEC 17025 et le cadre GUM. L'optimisation des intervalles utilise l'approche basée sur le risque ILAC-G24. L'évaluation de la dérive applique une régression linéaire avec les statistiques h/k de Mandel.",
      standards: [
        "ISO/IEC 17025:2017 — Compétence des laboratoires",
        "ILAC-G24:2022 — Intervalles d'étalonnage",
        "ILAC-G8:2019 — Règles de décision",
        "EA-4/02 M:2022",
      ],
      formulaDescription:
        "Intervalle d'étalonnage = Base × Taux de dérive × Facteur de risque. Bande de garde = (Tolérance − |mesuré − nominal|) / U. Risque d'acceptation erronée = Φ(−bande de garde).",
      interpretationGuide:
        "Bande de garde > 1,0 : haute confiance. 0,8-1,0 : marginal. < 0,8 : incertitude de mesure dominante ; envisager une réduction d'intervalle.",
      industryContext:
        "Suit les exigences d'accréditation des laboratoires internationaux pour l'étalonnage dimensionnel, électrique, de température, de pression et de masse.",
    },
    es: {
      methodology:
        "El análisis de calibración sigue la ISO/IEC 17025 y el marco de incertidumbre GUM. La optimización de intervalos utiliza el enfoque basado en riesgo ILAC-G24. La evaluación de deriva aplica regresión lineal con estadísticos h/k de Mandel.",
      standards: [
        "ISO/IEC 17025:2017 — Competencia de laboratorios",
        "ILAC-G24:2022 — Intervalos de calibración",
        "ILAC-G8:2019 — Reglas de decisión",
        "EA-4/02 M:2022",
      ],
      formulaDescription:
        "Intervalo de Calibración = Base × Tasa de Deriva × Factor de Riesgo. Banda de guarda = (Tolerancia − |medido − nominal|) / U. Riesgo de aceptación falsa = Φ(−banda de guarda).",
      interpretationGuide:
        "Banda de guarda > 1.0: alta confianza. 0.8-1.0: marginal. < 0.8: la incertidumbre de medición domina; considerar reducción de intervalo.",
      industryContext:
        "Sigue los requisitos internacionales de acreditación de laboratorios para calibración dimensional, eléctrica, temperatura, presión y masa.",
    },
    ar: {
      methodology:
        "يتبع تحليل المعايرة ISO/IEC 17025 وإطار عدم اليقين GUM. يستخدم تحسين الفاصل الزمني نهج ILAC-G24 القائم على المخاطر. يقيم تقييم الانحراف باستخدام الانحدار الخطي مع إحصائيات Mandel h/k.",
      standards: [
        "ISO/IEC 17025:2017 — كفاءة المختبرات",
        "ILAC-G24:2022 — فترات المعايرة",
        "ILAC-G8:2019 — قواعد القرار",
        "EA-4/02 M:2022",
      ],
      formulaDescription:
        "فاصل المعايرة = الأساس × معدل الانحراف × عامل المخاطرة. نطاق الحماية = (التسامح − |المقاس − الاسمي|) / U. خطر القبول الخاطئ = Φ(−نطاق الحماية).",
      interpretationGuide:
        "نطاق الحماية > 1.0: ثقة عالية. 0.8-1.0: هامشي. < 0.8: عدم يقين القياس يسيطر؛ يجب النظر في تقليل الفاصل الزمني.",
      industryContext:
        "يتبع متطلبات اعتماد المختبرات الدولية لمعايرة الأبعاد والكهرباء ودرجة الحرارة والضغط والكتلة.",
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
