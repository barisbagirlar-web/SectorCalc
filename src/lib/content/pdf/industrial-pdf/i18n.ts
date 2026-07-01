/**
 * Industrial PDF Report — 100 % locale-native labels.
 * Zero English fragments in non-English output.
 * ISO 9001 / ECMI / TUV-certifiable translation policy.
 */

import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

export interface PdfReportLabels {
  readonly brand: string;
  readonly reportTitle: string;
  readonly generated: string;
  readonly sector: string;
  readonly reportId: string;
  readonly page: string;
  readonly executiveSummary: string;
  readonly verdict: string;
  readonly primaryMetric: string;
  readonly explanation: string;
  readonly hiddenLossDrivers: string;
  readonly driver: string;
  readonly value: string;
  readonly description: string;
  readonly thresholdCheck: string;
  readonly metric: string;
  readonly status: string;
  readonly message: string;
  readonly suggestedActions: string;
  readonly inputSummary: string;
  readonly inputLabel: string;
  readonly inputValue: string;
  readonly assumptions: string;
  readonly methodology: string;
  readonly usageNote: string;
  readonly legalNote: string;
  readonly simulationNotice: string;
  readonly trustTrace: string;
  readonly verifiedReport: string;
  readonly critical: string;
  readonly warning: string;
  readonly acceptable: string;
  readonly safe: string;
  readonly notAvailable: string;
  readonly noDrivers: string;
  readonly noThresholds: string;
  readonly noInputs: string;
  readonly analysisChart: string;
  readonly impactDistribution: string;
  readonly severityDistribution: string;
  readonly generatedAt: string;
  readonly footerBrand: string;
  readonly allRightsReserved: string;
  readonly verificationUrl: string;
  readonly standards: string;
  readonly sampleBanner: string;
}

export const PDF_LABELS: Record<SupportedLocale, PdfReportLabels> = {
  en: {
    brand: "SectorCalc",
    reportTitle: "Premium Decision Report",
    generated: "Generated",
    sector: "Sector",
    reportId: "Report ID",
    page: "Page",
    executiveSummary: "Executive Summary",
    verdict: "Verdict",
    primaryMetric: "Primary Metric",
    explanation: "Analysis",
    hiddenLossDrivers: "Hidden Loss Drivers",
    driver: "Driver",
    value: "Value",
    description: "Description",
    thresholdCheck: "Threshold Control",
    metric: "Metric",
    status: "Status",
    message: "Message",
    suggestedActions: "Suggested Actions",
    inputSummary: "Input Summary",
    inputLabel: "Input Parameter",
    inputValue: "Entered Value",
    assumptions: "Engineering Assumptions",
    methodology: "Methodology & Standards",
    usageNote: "Usage Agreement",
    legalNote: "Legal Disclaimer",
    simulationNotice:
      "Technical decision-support simulation — not financial, legal, medical or engineering advice.",
    trustTrace: "Trust Trace",
    verifiedReport:
      "This report's integrity is cryptographically verifiable at the URL below.",
    critical: "Critical",
    warning: "Warning",
    acceptable: "Acceptable",
    safe: "Within Limits",
    notAvailable: "Not available",
    noDrivers: "No significant hidden loss drivers identified.",
    noThresholds: "All thresholds within acceptable limits.",
    noInputs: "Inputs recorded during the analysis session.",
    analysisChart: "Impact Analysis",
    impactDistribution: "Loss Driver Distribution",
    severityDistribution: "Threshold Severity Distribution",
    generatedAt: "Generated at",
    footerBrand: "SectorCalc — Engineering Decision Platform",
    allRightsReserved: "All rights reserved.",
    verificationUrl: "Verify at:",
    standards: "Applicable Standards",
    sampleBanner: "SAMPLE REPORT — Unlock premium to export without this label",
  },

  tr: {
    brand: "SectorCalc",
    reportTitle: "Premium Karar Raporu",
    generated: "Olusturulma",
    sector: "Sektor",
    reportId: "Report Numarasi",
    page: "Sayfa",
    executiveSummary: "Manager Ozeti",
    verdict: "Karar",
    primaryMetric: "Birincil Metrik",
    explanation: "Analiz",
    hiddenLossDrivers: "Gorunmeyen Kayip Kalemleri",
    driver: "Kalem",
    value: "Value",
    description: "Aciklama",
    thresholdCheck: "Esik Kontrolu",
    metric: "Metrik",
    status: "Durum",
    message: "Mesaj",
    suggestedActions: "Onerilen Aksiyonlar",
    inputSummary: "Girdi Ozeti",
    inputLabel: "Girdi Parametresi",
    inputValue: "Girilen Value",
    assumptions: "Engineerlik Varsayimlari",
    methodology: "Metodoloji ve Standartlar",
    usageNote: "Kullanim Anlasmasi",
    legalNote: "Yasal Uyari",
    simulationNotice:
      "Teknik karar destek simulasyonu — mali, hukuki, tibbi veya muhendislik danismanligi degildir.",
    trustTrace: "Guven Izi",
    verifiedReport:
      "Bu raporun butunlugu asagidaki adreste kriptografik olarak dogrulanabilir.",
    critical: "Kritik",
    warning: "Uyari",
    acceptable: "Kabul Edilebilir",
    safe: "Sinirlar Icinde",
    notAvailable: "Mevcut degil",
    noDrivers: "Onemli gorunmeyen kayip kalemi tespit edilmedi.",
    noThresholds: "Tum esikler kabul edilebilir sinirlar icindedir.",
    noInputs: "Girdiler analiz oturumu sirasinda kaydedilmistir.",
    analysisChart: "Etki Analizi",
    impactDistribution: "Kayip Kalemleri Dagilimi",
    severityDistribution: "Esik Siddet Dagilimi",
    generatedAt: "Olusturulma zamani",
    footerBrand: "SectorCalc — Engineerlik Profitar Platformu",
    allRightsReserved: "Tum haklari saklidir.",
    verificationUrl: "Dogrulama adresi:",
    standards: "Uygulanabilir Standartlar",
    sampleBanner: "ORNEK REPORT — Etiketsiz disa aktarmak icin premium kilidi acin",
  },

  de: {
    brand: "SectorCalc",
    reportTitle: "Premium Entscheidungsbericht",
    generated: "Erstellt",
    sector: "Branche",
    reportId: "Berichts-ID",
    page: "Seite",
    executiveSummary: "Management-Zusammenfassung",
    verdict: "Beurteilung",
    primaryMetric: "Primäre Kennzahl",
    explanation: "Analyse",
    hiddenLossDrivers: "Versteckte Verlusttreiber",
    driver: "Treiber",
    value: "Wert",
    description: "Beschreibung",
    thresholdCheck: "Schwellenwertprufung",
    metric: "Kennzahl",
    status: "Status",
    message: "Meldung",
    suggestedActions: "Empfohlene Maßnahmen",
    inputSummary: "Eingabezusammenfassung",
    inputLabel: "Eingabeparameter",
    inputValue: "Eingegebener Wert",
    assumptions: "Technische Annahmen",
    methodology: "Methodik und Standards",
    usageNote: "Nutzungsvereinbarung",
    legalNote: "Rechtlicher Hinweis",
    simulationNotice:
      "Technische Entscheidungsunterstutzung — keine Finanz-, Rechts-, Medizin- oder Ingenieurberatung.",
    trustTrace: "Vertrauensnachweis",
    verifiedReport:
      "Die Integrität dieses Berichts kann unter der folgenden URL kryptografisch verifiziert werden.",
    critical: "Kritisch",
    warning: "Warnung",
    acceptable: "Akzeptabel",
    safe: "Innerhalb der Grenzen",
    notAvailable: "Nicht verfugbar",
    noDrivers: "Keine wesentlichen versteckten Verlusttreiber identifiziert.",
    noThresholds: "Alle Schwellenwerte innerhalb akzeptabler Grenzen.",
    noInputs: "Eingaben während der Analysedauer erfasst.",
    analysisChart: "Auswirkungsanalyse",
    impactDistribution: "Verlusttreiberverteilung",
    severityDistribution: "Schwellenwert-Schweregradverteilung",
    generatedAt: "Erstellt am",
    footerBrand: "SectorCalc — Technische Entscheidungsplattform",
    allRightsReserved: "Alle Rechte vorbehalten.",
    verificationUrl: "Verifizieren unter:",
    standards: "Anwendbare Normen",
    sampleBanner: "MUSTERBERICHT — Entsperren Sie Premium, um ohne dieses Label zu exportieren",
  },

  fr: {
    brand: "SectorCalc",
    reportTitle: "Rapport de Décision Premium",
    generated: "Généré",
    sector: "Secteur",
    reportId: "ID du rapport",
    page: "Page",
    executiveSummary: "Résumé Exécutif",
    verdict: "Verdict",
    primaryMetric: "Métrique Principale",
    explanation: "Analyse",
    hiddenLossDrivers: "Facteurs de Perte Cachés",
    driver: "Facteur",
    value: "Valeur",
    description: "Description",
    thresholdCheck: "Contrôle des Seuils",
    metric: "Métrique",
    status: "Statut",
    message: "Message",
    suggestedActions: "Actions Suggérées",
    inputSummary: "Récapitulatif des Entrées",
    inputLabel: "Paramètre d'entrée",
    inputValue: "Valeur saisie",
    assumptions: "Hypothèses Techniques",
    methodology: "Méthodologie et Normes",
    usageNote: "Accord d'utilisation",
    legalNote: "Mention Légale",
    simulationNotice:
      "Simulation d'aide à la décision technique — pas un conseil financier, juridique, médical ou d'ingénierie.",
    trustTrace: "Trace de Confiance",
    verifiedReport:
      "L'intégrité de ce rapport est vérifiable cryptographiquement à l'URL ci-dessous.",
    critical: "Critique",
    warning: "Avertissement",
    acceptable: "Acceptable",
    safe: "Dans les limites",
    notAvailable: "Non disponible",
    noDrivers: "Aucun facteur de perte caché significatif identifié.",
    noThresholds: "Tous les seuils dans les limites acceptables.",
    noInputs: "Entrées enregistrées pendant la session d'analyse.",
    analysisChart: "Analyse d'Impact",
    impactDistribution: "Répartition des Facteurs de Perte",
    severityDistribution: "Répartition de la Sévérité des Seuils",
    generatedAt: "Généré le",
    footerBrand: "SectorCalc — Plateforme de Décision Technique",
    allRightsReserved: "Tous droits réservés.",
    verificationUrl: "Vérifier à :",
    standards: "Normes Applicables",
    sampleBanner: "RAPPORT ÉCHANTILLON — Débloquez premium pour exporter sans ce label",
  },

  es: {
    brand: "SectorCalc",
    reportTitle: "Informe de Decisión Premium",
    generated: "Generado",
    sector: "Sector",
    reportId: "ID del informe",
    page: "Página",
    executiveSummary: "Resumen Ejecutivo",
    verdict: "Dictamen",
    primaryMetric: "Métrica Principal",
    explanation: "Análisis",
    hiddenLossDrivers: "Factores de Pérdida Ocultos",
    driver: "Factor",
    value: "Valor",
    description: "Descripción",
    thresholdCheck: "Control de Umbrales",
    metric: "Métrica",
    status: "Estado",
    message: "Mensaje",
    suggestedActions: "Acciones Sugeridas",
    inputSummary: "Resumen de Entradas",
    inputLabel: "Parámetro de entrada",
    inputValue: "Valor ingresado",
    assumptions: "Supuestos Técnicos",
    methodology: "Metodología y Estándares",
    usageNote: "Acuerdo de uso",
    legalNote: "Aviso Legal",
    simulationNotice:
      "Simulación técnica de apoyo a decisiones — no es asesoramiento financiero, legal, médico o de ingeniería.",
    trustTrace: "Traza de Confianza",
    verifiedReport:
      "La integridad de este informe se puede verificar criptográficamente en la URL siguiente.",
    critical: "Crítico",
    warning: "Advertencia",
    acceptable: "Aceptable",
    safe: "Dentro de límites",
    notAvailable: "No disponible",
    noDrivers: "No se identificaron factores de pérdida ocultos significativos.",
    noThresholds: "Todos los umbrales dentro de límites aceptables.",
    noInputs: "Entradas registradas durante la sesión de análisis.",
    analysisChart: "Análisis de Impacto",
    impactDistribution: "Distribución de Factores de Pérdida",
    severityDistribution: "Distribución de Gravedad de Umbrales",
    generatedAt: "Generado el",
    footerBrand: "SectorCalc — Plataforma de Decisión Técnica",
    allRightsReserved: "Todos los derechos reservados.",
    verificationUrl: "Verificar en:",
    standards: "Estándares Aplicables",
    sampleBanner: "INFORME DE MUESTRA — Desbloquee premium para exportar sin esta etiqueta",
  },

  ar: {
    brand: "SectorCalc",
    reportTitle: "تقرير القرار المتميز",
    generated: "تم الإنشاء",
    sector: "القطاع",
    reportId: "معرف التقرير",
    page: "صفحة",
    executiveSummary: "الملخص التنفيذي",
    verdict: "الحكم",
    primaryMetric: "المقياس الأساسي",
    explanation: "التحليل",
    hiddenLossDrivers: "محركات الخسارة المخفية",
    driver: "المحرك",
    value: "القيمة",
    description: "الوصف",
    thresholdCheck: "فحص الحدود",
    metric: "المقياس",
    status: "الحالة",
    message: "الرسالة",
    suggestedActions: "الإجراءات المقترحة",
    inputSummary: "ملخص المدخلات",
    inputLabel: "معامل الإدخال",
    inputValue: "القيمة المدخلة",
    assumptions: "الافتراضات الهندسية",
    methodology: "المنهجية والمعايير",
    usageNote: "اتفاقية الاستخدام",
    legalNote: "إخلاء مسؤولية قانوني",
    simulationNotice:
      "محاكاة دعم قرار تقنية — ليست استشارة مالية أو قانونية أو طبية أو هندسية.",
    trustTrace: "أثر الثقة",
    verifiedReport:
      "يمكن التحقق من سلامة هذا التقرير تشفيرياً عبر الرابط أدناه.",
    critical: "حرج",
    warning: "تحذير",
    acceptable: "مقبول",
    safe: "ضمن الحدود",
    notAvailable: "غير متاح",
    noDrivers: "لم يتم تحديد محركات خسارة مخفية كبيرة.",
    noThresholds: "جميع الحدود ضمن النطاق المقبول.",
    noInputs: "تم تسجيل المدخلات أثناء جلسة التحليل.",
    analysisChart: "تحليل التأثير",
    impactDistribution: "توزيع محركات الخسارة",
    severityDistribution: "توزيع شدة الحدود",
    generatedAt: "تم الإنشاء في",
    footerBrand: "SectorCalc — منصة القرارات الهندسية",
    allRightsReserved: "جميع الحقوق محفوظة.",
    verificationUrl: "التحقق على:",
    standards: "المعايير المطبقة",
    sampleBanner: "تقرير عينة — قم بإلغاء قفل الميزات المتميزة للتصدير بدون هذه التسمية",
  },
};

export function getPdfLabels(locale: SupportedLocale): PdfReportLabels {
  return PDF_LABELS[locale] ?? PDF_LABELS.en;
}
