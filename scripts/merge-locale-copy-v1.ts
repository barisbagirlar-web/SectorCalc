/**
 * One-shot merge: adds canonical locale copy sections to messages/*.json
 * Run: npx tsx scripts/merge-locale-copy-v1.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { LOCALE_CTA } from "../src/lib/i18n/locale-cta";
import { LOCALE_GLOSSARY } from "../src/lib/i18n/locale-glossary";
import type { SupportedLocale } from "../src/lib/i18n/locale-config";

const LOCALES: SupportedLocale[] = ["en", "tr", "de", "fr", "es", "ar"];

const PREMIUM_REPORT_SECTIONS: Record<
  SupportedLocale,
  Record<string, string>
> = {
  en: {
    executiveSummary: "Executive summary",
    mainExposure: "Main exposure",
    hiddenDrivers: "Hidden drivers",
    thresholdCheck: "Threshold check",
    suggestedActions: "Suggested actions",
    assumptions: "Assumptions",
    exportReady: "Export-ready report",
    legalNote: "Legal note",
  },
  tr: {
    executiveSummary: "Yönetici özeti",
    mainExposure: "Ana maruziyet",
    hiddenDrivers: "Gizli sürücüler",
    thresholdCheck: "Eşik kontrolü",
    suggestedActions: "Önerilen aksiyonlar",
    assumptions: "Varsayımlar",
    exportReady: "Dışa aktarmaya hazır rapor",
    legalNote: "Yasal not",
  },
  de: {
    executiveSummary: "Zusammenfassung",
    mainExposure: "Hauptrisiko",
    hiddenDrivers: "Verlusttreiber",
    thresholdCheck: "Schwellenwertprüfung",
    suggestedActions: "Empfohlene Maßnahmen",
    assumptions: "Annahmen",
    exportReady: "Exportfähiger Bericht",
    legalNote: "Rechtlicher Hinweis",
  },
  fr: {
    executiveSummary: "Synthèse",
    mainExposure: "Exposition principale",
    hiddenDrivers: "Facteurs cachés",
    thresholdCheck: "Contrôle des seuils",
    suggestedActions: "Actions recommandées",
    assumptions: "Hypothèses",
    exportReady: "Rapport exportable",
    legalNote: "Note légale",
  },
  es: {
    executiveSummary: "Resumen ejecutivo",
    mainExposure: "Exposición principal",
    hiddenDrivers: "Factores ocultos",
    thresholdCheck: "Control de umbrales",
    suggestedActions: "Acciones recomendadas",
    assumptions: "Supuestos",
    exportReady: "Informe listo para exportar",
    legalNote: "Nota legal",
  },
  ar: {
  },
};

const LEGAL: Record<
  SupportedLocale,
  { disclaimer: string; premiumDisclaimer: string; reportNote: string }
> = {
  en: {
    disclaimer:
      "This result is a technical estimate based on your inputs. It does not replace financial, legal, medical or engineering advice.",
    premiumDisclaimer:
      "This report is a decision-support simulation. It does not replace financial, legal, medical or engineering advice.",
    reportNote:
      "For operational reference only — verify assumptions before committing to pricing or contracts.",
  },
  tr: {
    disclaimer:
      "Bu sonuç, girdiğiniz değerlere dayalı teknik bir tahmindir. Finansal, hukuki, tıbbi veya mühendislik danışmanlığının yerine geçmez.",
    premiumDisclaimer:
      "Bu rapor karar destek simülasyonudur. Finansal, hukuki, tıbbi veya mühendislik danışmanlığının yerine geçmez.",
    reportNote:
      "Yalnızca operasyonel referans içindir — fiyat veya sözleşme öncesi varsayımları doğrulayın.",
  },
  de: {
    disclaimer:
      "Dieses Ergebnis ist eine technische Schätzung auf Basis Ihrer Eingaben. Es ersetzt keine finanzielle, rechtliche, medizinische oder ingenieurtechnische Beratung.",
    premiumDisclaimer:
      "Dieser Bericht ist eine Entscheidungsunterstützung. Er ersetzt keine finanzielle, rechtliche, medizinische oder ingenieurtechnische Beratung.",
    reportNote:
      "Nur zur operativen Orientierung — prüfen Sie Annahmen vor Preis- oder Vertragsentscheidungen.",
  },
  fr: {
    disclaimer:
      "Ce résultat est une estimation technique basée sur vos saisies. Il ne remplace pas un conseil financier, juridique, médical ou d'ingénierie.",
    premiumDisclaimer:
      "Ce rapport est une aide à la décision. Il ne remplace pas un conseil financier, juridique, médical ou d'ingénierie.",
    reportNote:
      "Référence opérationnelle uniquement — vérifiez les hypothèses avant tout engagement tarifaire ou contractuel.",
  },
  es: {
    disclaimer:
      "Este resultado es una estimación técnica basada en sus datos. No sustituye asesoramiento financiero, legal, médico o de ingeniería.",
    premiumDisclaimer:
      "Este informe es una ayuda a la decisión. No sustituye asesoramiento financiero, legal, médico o de ingeniería.",
    reportNote:
      "Solo referencia operativa — verifique los supuestos antes de fijar precios o contratos.",
  },
  ar: {
    disclaimer:
    premiumDisclaimer:
    reportNote:
  },
};

const ERRORS: Record<
  SupportedLocale,
  Record<
    | "calculationFailed"
    | "invalidInput"
    | "networkError"
    | "accessDenied"
    | "notFound"
    | "generic",
    string
  >
> = {
  en: {
    calculationFailed:
      "We could not calculate this result. Check the inputs and try again.",
    invalidInput:
      "One or more values are invalid. Please review the highlighted fields.",
    networkError: "Connection failed. Check your network and try again.",
    accessDenied: "You need premium access for this report.",
    notFound: "This page or tool could not be found.",
    generic: "Something went wrong. Please try again.",
  },
  tr: {
    calculationFailed:
      "Bu sonucu hesaplayamadık. Girdiğiniz değerleri kontrol edip tekrar deneyin.",
    invalidInput:
      "Bir veya daha fazla değer geçersiz. İşaretli alanları kontrol edin.",
    networkError:
      "Bağlantı kurulamadı. Ağınızı kontrol edip tekrar deneyin.",
    accessDenied: "Bu rapor için premium erişim gerekir.",
    notFound: "Sayfa veya araç bulunamadı.",
    generic: "Bir sorun oluştu. Lütfen tekrar deneyin.",
  },
  de: {
    calculationFailed:
      "Das Ergebnis konnte nicht berechnet werden. Bitte prüfen Sie die Eingaben.",
    invalidInput:
      "Mindestens ein Wert ist ungültig. Bitte markierte Felder prüfen.",
    networkError:
      "Verbindung fehlgeschlagen. Netzwerk prüfen und erneut versuchen.",
    accessDenied: "Für diesen Bericht ist Premium-Zugang erforderlich.",
    notFound: "Seite oder Tool nicht gefunden.",
    generic: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
  },
  fr: {
    calculationFailed:
      "Le résultat n'a pas pu être calculé. Vérifiez les valeurs saisies.",
    invalidInput:
      "Une ou plusieurs valeurs sont invalides. Vérifiez les champs signalés.",
    networkError:
      "Connexion impossible. Vérifiez le réseau et réessayez.",
    accessDenied: "Un accès premium est requis pour ce rapport.",
    notFound: "Page ou outil introuvable.",
    generic: "Une erreur s'est produite. Veuillez réessayer.",
  },
  es: {
    calculationFailed:
      "No se pudo calcular el resultado. Revise los datos introducidos.",
    invalidInput:
      "Uno o más valores no son válidos. Revise los campos marcados.",
    networkError:
      "Error de conexión. Compruebe la red e inténtelo de nuevo.",
    accessDenied: "Necesita acceso premium para este informe.",
    notFound: "No se encontró la página o la herramienta.",
    generic: "Algo salió mal. Inténtelo de nuevo.",
  },
  ar: {
    calculationFailed:
    invalidInput:
    networkError:
  },
};

const SEO: Record<
  SupportedLocale,
  Record<
    | "homeTitle"
    | "homeDescription"
    | "freeToolsTitle"
    | "freeToolsDescription"
    | "pricingTitle"
    | "pricingDescription"
    | "premiumToolsTitle"
    | "premiumToolsDescription",
    string
  >
> = {
  en: {
    homeTitle: "SectorCalc — Sector calculators and decision reports",
    homeDescription:
      "Measure hidden loss, margin exposure and operational risk with sector-specific calculators — without ERP complexity.",
    freeToolsTitle: "Free Sector Calculators | SectorCalc",
    freeToolsDescription:
      "Free browser calculators for cost, measurement, energy and business decisions. No sign-up required.",
    pricingTitle: "Pricing | SectorCalc",
    pricingDescription:
      "Free calculators and premium decision reports — single reports from $9, Pro from $19/month.",
    premiumToolsTitle: "Premium Analyzers | SectorCalc",
    premiumToolsDescription:
      "Hidden-loss diagnostics, threshold checks and export-ready decision reports for operational teams.",
  },
  tr: {
    homeTitle: "SectorCalc — Sektörel hesaplama ve karar raporları",
    homeDescription:
      "Görünmeyen kayıp, marj maruziyeti ve operasyonel riski sektöre özel hesaplama araçlarıyla ölçün — ERP karmaşıklığı olmadan.",
    freeToolsTitle: "Ücretsiz Sektörel Hesaplama Araçları | SectorCalc",
    freeToolsDescription:
      "Maliyet, ölçüm, enerji ve iş kararları için ücretsiz tarayıcı hesaplayıcıları. Kayıt gerekmez.",
    pricingTitle: "Fiyatlandırma | SectorCalc",
    pricingDescription:
      "Ücretsiz hesaplayıcılar ve premium karar raporları — tek rapor $9'dan, Pro $19/ay.",
    premiumToolsTitle: "Premium Analiz Araçları | SectorCalc",
    premiumToolsDescription:
      "Görünmeyen kayıp analizi, eşik kontrolü ve dışa aktarmaya hazır karar raporları.",
  },
  de: {
    homeTitle: "SectorCalc — Branchenrechner und Entscheidungsberichte",
    homeDescription:
      "Verborgene Verluste, Margenrisiko und Betriebsrisiko mit branchenspezifischen Rechnern messen — ohne ERP-Komplexität.",
    freeToolsTitle: "Kostenlose Branchenrechner | SectorCalc",
    freeToolsDescription:
      "Kostenlose Browser-Rechner für Kosten, Messung, Energie und Geschäftsentscheidungen. Keine Anmeldung.",
    pricingTitle: "Preise | SectorCalc",
    pricingDescription:
      "Gratis-Rechner und Premium-Entscheidungsberichte — Einzelberichte ab $9, Pro ab $19/Monat.",
    premiumToolsTitle: "Premium-Analysen | SectorCalc",
    premiumToolsDescription:
      "Verlustdiagnose, Schwellenwertprüfung und exportfähige Entscheidungsberichte für Betriebsteams.",
  },
  fr: {
    homeTitle: "SectorCalc — Calculateurs sectoriels et rapports de décision",
    homeDescription:
      "Mesurez pertes cachées, exposition marge et risque opérationnel avec des outils sectoriels — sans complexité ERP.",
    freeToolsTitle: "Calculateurs sectoriels gratuits | SectorCalc",
    freeToolsDescription:
      "Calculateurs gratuits pour coûts, mesures, énergie et décisions métier. Sans inscription.",
    pricingTitle: "Tarifs | SectorCalc",
    pricingDescription:
      "Outils gratuits et rapports premium — rapport unique dès 9 $, Pro dès 19 $/mois.",
    premiumToolsTitle: "Analyses premium | SectorCalc",
    premiumToolsDescription:
      "Diagnostic des pertes, contrôle des seuils et rapports exportables pour équipes opérationnelles.",
  },
  es: {
    homeTitle: "SectorCalc — Calculadoras sectoriales e informes de decisión",
    homeDescription:
      "Mida pérdidas ocultas, exposición de margen y riesgo operativo con herramientas sectoriales — sin complejidad ERP.",
    freeToolsTitle: "Calculadoras sectoriales gratuitas | SectorCalc",
    freeToolsDescription:
      "Calculadoras gratuitas para costes, medición, energía y decisiones de negocio. Sin registro.",
    pricingTitle: "Precios | SectorCalc",
    pricingDescription:
      "Calculadoras gratis e informes premium — informe único desde 9 $, Pro desde 19 $/mes.",
    premiumToolsTitle: "Análisis premium | SectorCalc",
    premiumToolsDescription:
      "Diagnóstico de pérdidas, control de umbrales e informes listos para exportar.",
  },
  ar: {
    homeDescription:
    freeToolsDescription:
    pricingDescription:
    premiumToolsDescription:
  },
};

const LOCALE_LABELS: Record<
  SupportedLocale,
  { label: string; fr?: string }
> = {
  en: { label: "Language", fr: "Français" },
  tr: { label: "Dil", fr: "Français" },
  de: { label: "Sprache", fr: "Français" },
  fr: { label: "Langue", fr: "Français" },
  es: { label: "Idioma", fr: "Français" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PREMIUM_DECISION_REPORT: Record<SupportedLocale, Record<string, any>> = {
  en: {},
  tr: {},
  de: {
    documentLabel: "Premium-Entscheidungsbericht",
    reportEyebrow: "Entscheidungsbericht",
    decisionDesk: "Entscheidungstisch",
    runPrompt: "Buchungswerte eingeben und Analyse starten.",
    ledgerEntries: "Buchungswerte",
    runAnalysis: "Analyse starten",
    whatThisMeans: "Was das bedeutet",
    hiddenDriversTitle: "Verlusttreiber hinter dem Ergebnis",
    hiddenDriversIntro:
      "Diese Sekundärwerte erklären, was das Hauptergebnis nach oben oder unten drückt.",
    thresholdTitle: "Schwellenwertprüfung",
    suggestedActionTitle: "Empfohlene Maßnahme",
    actionImmediate: "Sofort",
    actionMonitoring: "Beobachten",
    actionDecision: "Entscheidung",
    assumptionsTitle: "Verwendete Annahmen",
    legalTitle: "Rechtlicher Hinweis",
    exportTitle: "Premium-Berichtsausgabe",
    previewCta: "Bericht ansehen",
    bufferedExposure: "Gepuffertes Risiko",
    status: { Critical: "Kritisch", Warning: "Warnung", Acceptable: "Akzeptabel" },
    export: {
      title: "Premium-Berichtsausgabe",
      sectionExecutive: "Zusammenfassung",
      sectionDrivers: "Verlusttreiber",
      sectionThreshold: "Schwellenwertprüfung",
      sectionAction: "Empfohlene Maßnahme",
      sectionAssumptions: "Annahmen",
      sectionReady: "PDF/CSV bereit",
      printPdf: "Drucken / PDF speichern",
      downloadCsv: "CSV laden",
      copySummary: "Berichtszusammenfassung kopieren",
      copied: "Kopiert",
      copyFailed: "Kopieren fehlgeschlagen",
      openPrintPage: "Druckseite öffnen",
      backToReport: "Zurück zum Bericht",
    },
    locked: {
      title: "Vollständigen Entscheidungsbericht öffnen",
      text: "Die Vorschau zeigt das Hauptrisiko. Der vollständige Bericht zeigt Verlusttreiber, Schwellenwertinterpretation, empfohlene Maßnahmen und exportfähige Ausgabe.",
      bulletBreakdown: "Vollständige Verlustaufschlüsselung",
      bulletThreshold: "Schwellenwertinterpretation",
      bulletAction: "Empfohlener Maßnahmenplan",
      bulletExport: "PDF- / CSV-Export",
      bulletSaved: "Gespeicherte Berichtsausgabe",
      unlockCta: "Bericht öffnen",
      pricingCta: "Preise ansehen",
      valueLine:
        "Ideal, wenn das Ergebnis Preis-, Betriebs- oder Managemententscheidungen beeinflusst.",
      exportLocked: "Export ist im vollständigen Entscheidungsbericht enthalten.",
      unlockPrint: "Zum Drucken / PDF-Speichern freischalten",
      unlockCsv: "Zum CSV-Download freischalten",
      samplePrintNote:
        "Beispielvorschau — vollständigen Bericht öffnen, um ohne Beispielhinweis zu drucken.",
    },
    decisionValue: {
      title: "Entscheidungswert",
      intro: "Wobei dieser Bericht hilft",
      bullet1: "Hauptverlusttreiber identifizieren",
      bullet2: "Mit Warn- und kritischen Schwellenwerten vergleichen",
      bullet3: "Ergebnis in praktische Maßnahme umsetzen",
      bullet4: "Bericht für Management oder Kunden exportieren",
    },
  },
  fr: {
    documentLabel: "Rapport de décision premium",
    reportEyebrow: "Rapport de décision",
    decisionDesk: "Table de décision",
    runPrompt: "Saisissez les valeurs et lancez l'analyse.",
    ledgerEntries: "Entrées comptables",
    runAnalysis: "Lancer l'analyse",
    whatThisMeans: "Ce que cela signifie",
    hiddenDriversTitle: "Facteurs cachés derrière le résultat",
    hiddenDriversIntro:
      "Ces sorties secondaires expliquent ce qui fait monter ou baisser le résultat principal.",
    thresholdTitle: "Contrôle des seuils",
    suggestedActionTitle: "Action recommandée",
    actionImmediate: "Immédiat",
    actionMonitoring: "Surveiller",
    actionDecision: "Décision",
    assumptionsTitle: "Hypothèses utilisées",
    legalTitle: "Note légale",
    exportTitle: "Sortie du rapport premium",
    previewCta: "Aperçu du rapport",
    bufferedExposure: "Exposition tamponnée",
    status: { Critical: "Critique", Warning: "Alerte", Acceptable: "Acceptable" },
    export: {
      title: "Sortie du rapport premium",
      sectionExecutive: "Synthèse",
      sectionDrivers: "Facteurs cachés",
      sectionThreshold: "Contrôle des seuils",
      sectionAction: "Action recommandée",
      sectionAssumptions: "Hypothèses",
      sectionReady: "PDF/CSV prêt",
      printPdf: "Imprimer / Enregistrer PDF",
      downloadCsv: "Télécharger CSV",
      copySummary: "Copier le résumé",
      copied: "Copié",
      copyFailed: "Échec de la copie",
      openPrintPage: "Ouvrir la page d'impression",
      backToReport: "Retour au rapport",
    },
    locked: {
      title: "Ouvrir le rapport de décision complet",
      text: "L'aperçu montre l'exposition principale. Le rapport complet montre les facteurs cachés, l'interprétation des seuils, les actions recommandées et la sortie exportable.",
      bulletBreakdown: "Ventilation complète des pertes",
      bulletThreshold: "Interprétation des seuils",
      bulletAction: "Plan d'action recommandé",
      bulletExport: "Export PDF / CSV",
      bulletSaved: "Rapport enregistré",
      unlockCta: "Ouvrir le rapport",
      pricingCta: "Voir les tarifs",
      valueLine:
        "Idéal lorsque le résultat influence tarifs, opérations ou décisions de gestion.",
      exportLocked: "L'export est inclus dans le rapport complet.",
      unlockPrint: "Ouvrir pour imprimer / enregistrer PDF",
      unlockCsv: "Ouvrir pour télécharger CSV",
      samplePrintNote:
        "Aperçu exemple — ouvrez le rapport complet pour imprimer sans mention d'exemple.",
    },
    decisionValue: {
      title: "Valeur décisionnelle",
      intro: "Ce que ce rapport aide à décider",
      bullet1: "Identifier le principal facteur de perte cachée",
      bullet2: "Comparer aux seuils d'alerte et critiques",
      bullet3: "Transformer le résultat en action concrète",
      bullet4: "Exporter le rapport pour la direction ou le client",
    },
  },
  es: {
    documentLabel: "Informe de decisión premium",
    reportEyebrow: "Informe de decisión",
    decisionDesk: "Mesa de decisión",
    runPrompt: "Introduzca los valores y ejecute el análisis.",
    ledgerEntries: "Entradas contables",
    runAnalysis: "Ejecutar análisis",
    whatThisMeans: "Qué significa",
    hiddenDriversTitle: "Factores ocultos detrás del resultado",
    hiddenDriversIntro:
      "Estas salidas secundarias explican qué empuja el resultado principal hacia arriba o abajo.",
    thresholdTitle: "Control de umbrales",
    suggestedActionTitle: "Acción recomendada",
    actionImmediate: "Inmediata",
    actionMonitoring: "Monitorizar",
    actionDecision: "Decisión",
    assumptionsTitle: "Supuestos utilizados",
    legalTitle: "Nota legal",
    exportTitle: "Salida del informe premium",
    previewCta: "Vista previa",
    bufferedExposure: "Exposición amortiguada",
    status: { Critical: "Crítico", Warning: "Advertencia", Acceptable: "Aceptable" },
    export: {
      title: "Salida del informe premium",
      sectionExecutive: "Resumen ejecutivo",
      sectionDrivers: "Factores ocultos",
      sectionThreshold: "Control de umbrales",
      sectionAction: "Acción recomendada",
      sectionAssumptions: "Supuestos",
      sectionReady: "PDF/CSV listo",
      printPdf: "Imprimir / Guardar PDF",
      downloadCsv: "Descargar CSV",
      copySummary: "Copiar resumen",
      copied: "Copiado",
      copyFailed: "Error al copiar",
      openPrintPage: "Abrir página de impresión",
      backToReport: "Volver al informe",
    },
    locked: {
      title: "Abrir el informe de decisión completo",
      text: "La vista previa muestra la exposición principal. El informe completo muestra factores ocultos, interpretación de umbrales, acciones recomendadas y salida exportable.",
      bulletBreakdown: "Desglose completo de pérdidas",
      bulletThreshold: "Interpretación de umbrales",
      bulletAction: "Plan de acción recomendado",
      bulletExport: "Exportación PDF / CSV",
      bulletSaved: "Informe guardado",
      unlockCta: "Abrir informe",
      pricingCta: "Ver precios",
      valueLine:
        "Ideal cuando el resultado afecta precios, operaciones o decisiones de gestión.",
      exportLocked: "La exportación está incluida en el informe completo.",
      unlockPrint: "Abrir para imprimir / guardar PDF",
      unlockCsv: "Abrir para descargar CSV",
      samplePrintNote:
        "Vista previa de ejemplo — abra el informe completo para imprimir sin etiqueta de ejemplo.",
    },
    decisionValue: {
      title: "Valor de decisión",
      intro: "Qué ayuda a decidir este informe",
      bullet1: "Identificar el principal factor de pérdida oculta",
      bullet2: "Comparar con umbrales de alerta y críticos",
      bullet3: "Convertir el resultado en acción práctica",
      bullet4: "Exportar el informe para dirección o cliente",
    },
  },
  ar: {
    hiddenDriversIntro:
    export: {
    },
    locked: {
      valueLine:
      samplePrintNote:
    },
    decisionValue: {
    },
  },
};

const CRITICAL_PATCHES: Record<
  SupportedLocale,
  Record<string, unknown>
> = {
  en: {},
  tr: {
    "premiumDecisionReport.locked.unlockCta": "Raporu aç",
    "premiumDecisionReport.locked.title": "Tam karar raporunu açın",
    "premiumDecisionReport.locked.unlockPrint": "PDF için raporu açın",
    "premiumDecisionReport.locked.unlockCsv": "CSV için raporu açın",
  },
  de: {
    "osGate.label": "Abonnement erforderlich",
    "osGate.message":
      "Diese Funktion erfordert die Intelligence-Ebene. Mit Pro freischalten.",
    "osGate.singleCta": "Lauf · {price}",
    "osGate.proCta": "Pro · {price}",
    "freeTool.unlockVerdictTitle": "Vollständiges Urteil ansehen",
    "freeTool.unlockVerdictBody":
      "P90-Sicherpreis, Margenleck-Analyse und empfohlene Maßnahme — in der Gratis-Stufe ausgeblendet.",
    "freeTool.unlockVerdictCta": "Urteil ansehen",
    "freeTool.unlockVerdictLoading": "Zugang wird geprüft…",
    "home.freeCheck.cta": "Gratis-Margen-Check",
    "home.premiumStep.title": "Vollständiges Urteil",
    "home.premiumStep.cta": "Premium-Analysen",
    "home.cta.primary": "Gratis-Tools entdecken",
    "home.cta.secondary": "Beispielbericht ansehen",
    "emptyStates.login.cta": "Anmelden",
    "emptyStates.reports.ctaPremium": "Premium-Analysen öffnen",
    "checkoutPages.successTitle": "Zahlung erhalten.",
    "checkoutPages.successPremiumCta": "Premium-Analysen öffnen",
    "checkoutPages.cancelPricingCta": "Zurück zu Preisen",
  },
  fr: {
    "valueProps.eyebrow": "Mesure universelle",
    "valueProps.title": "Quatre dimensions de perte — une plateforme",
    "valueProps.subtitle":
      "SectorCalc révèle fuites financières, matières, temps et énergie avec contrôles gratuits et analyses premium.",
    "valueProps.financial": "Perte financière",
    "valueProps.financialDesc":
      "Fuites de marge, coûts et profits avant devalider un devis ou contrat.",
    "valueProps.material": "Perte matière",
    "valueProps.materialDesc":
      "Rebut, gaspillage et écarts de rendement ignorés par les calculateurs standards.",
    "valueProps.time": "Perte de temps",
    "valueProps.timeDesc":
      "Temps de réglage, retards et risque d'efficacité type OEE.",
    "valueProps.energy": "Perte énergétique",
    "valueProps.energyDesc":
      "kWh, carbone et risques de conformité type CBAM.",
    "sectors.title": "Choisissez parmi {count} secteurs actifs",
    "sectors.subtitle":
      "Neuf catégories — de la CNC à l'agriculture, l'énergie et le quotidien.",
    "sectors.viewAll": "Voir les {count} secteurs →",
    "sectors.browseByCategory": "Par catégorie",
    "sectors.startFree": "Check gratuit",
    "sectors.viewPremium": "Analyse premium",
    "pricing.tagline":
      "Analyses premium : prix plancher, diagnostics et rapports exportables.",
    "pricing.roiCopy":
      "Un mauvais devis évité peut financer une année Pro.",
    "pricing.sampleReport": "Voir un exemple de rapport →",
    "pricing.browsePremium": "Analyses premium →",
    "pricing.startFree": "Commencer avec les outils gratuits →",
    "pricing.availableNow": "Disponible",
    "pricing.waitlist": "Liste d'attente",
    "osGate.label": "Abonnement requis",
    "osGate.message":
      "Cette fonction nécessite la couche Intelligence. Débloquez avec Pro.",
    "osGate.singleCta": "Lancer · {price}",
    "osGate.proCta": "Pro · {price}",
    "home.freeCheck.cta": "Check marge gratuit",
    "home.premiumStep.title": "Rapport de décision complet",
    "home.premiumStep.cta": "Analyses premium",
    "home.cta.primary": "Outils gratuits",
    "home.cta.secondary": "Exemple de rapport",
    "emptyStates.login.cta": "Se connecter",
    "emptyStates.reports.ctaPremium": "Ouvrir les analyses",
    "checkoutPages.successTitle": "Paiement reçu.",
    "checkoutPages.successPremiumCta": "Ouvrir les analyses premium",
    "checkoutPages.cancelPricingCta": "Retour aux tarifs",
  },
  es: {
    "osGate.label": "Suscripción requerida",
    "osGate.message":
      "Esta función requiere la capa Intelligence. Desbloquee con Pro.",
    "osGate.singleCta": "Ejecutar · {price}",
    "osGate.proCta": "Pro · {price}",
    "freeTool.unlockVerdictTitle": "Ver dictamen completo",
    "freeTool.unlockVerdictBody":
      "Precio seguro P90, análisis de fugas de margen y acción recomendada — no incluido en la versión gratuita.",
    "freeTool.unlockVerdictCta": "Ver dictamen",
    "freeTool.unlockVerdictLoading": "Comprobando acceso…",
    "home.freeCheck.cta": "Control de margen gratis",
    "home.premiumStep.title": "Dictamen completo",
    "home.premiumStep.cta": "Análisis premium",
    "home.cta.primary": "Herramientas gratis",
    "home.cta.secondary": "Ver informe de ejemplo",
    "emptyStates.login.cta": "Iniciar sesión",
    "emptyStates.reports.ctaPremium": "Abrir análisis premium",
    "checkoutPages.successTitle": "Pago recibido.",
    "checkoutPages.successPremiumCta": "Abrir análisis premium",
    "checkoutPages.cancelPricingCta": "Volver a precios",
  },
  ar: {
    "osGate.message":
    "osGate.proCta": "Pro · {price}",
    "freeTool.unlockVerdictBody":
  },
};

function setNested(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split(".");
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]!;
    if (typeof current[key] !== "object" || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[parts[parts.length - 1]!] = value;
}

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): void {
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      typeof target[key] === "object" &&
      target[key] !== null &&
      !Array.isArray(target[key])
    ) {
      deepMerge(
        target[key] as Record<string, unknown>,
        value as Record<string, unknown>,
      );
    } else {
      target[key] = value;
    }
  }
}

function buildSections(locale: SupportedLocale): Record<string, unknown> {
  const g = LOCALE_GLOSSARY;
  return {
    navigation: {
      tools: locale === "en" ? "Tools" : g.calculator[locale],
      pricing: g.pricing[locale],
      account:
        locale === "tr"
          ? "Hesap"
          : locale === "de"
            ? "Konto"
            : locale === "fr"
              ? "Compte"
              : locale === "es"
                ? "Cuenta"
                : locale === "ar"
                  : "Account",
      freeTools: g.freeCalculator[locale],
      premiumTools: g.premiumAnalyzer[locale],
      reports: g.decisionReport[locale],
    },
    homepage: {
      headline:
        locale === "en"
          ? "Measure hidden loss across your sector"
          : SEO[locale].homeDescription.split("—")[0]?.trim() ??
            SEO[locale].homeTitle,
      primaryCta: LOCALE_CTA[locale].startFree,
      secondaryCta: LOCALE_CTA[locale].viewFreeTools,
    },
    freeTools: {
      title: SEO[locale].freeToolsTitle.replace(" | SectorCalc", ""),
      metaTitle: SEO[locale].freeToolsTitle,
      calculate: LOCALE_CTA[locale].calculateNow,
    },
    premiumTools: {
      title: g.premiumAnalyzer[locale],
      openAnalyzer: LOCALE_CTA[locale].openPremiumAnalyzer,
    },
    categories: {
      title:
        locale === "tr"
          ? "Kategoriye göre göz at"
          : locale === "de"
            ? "Nach Kategorie"
            : locale === "fr"
              ? "Par catégorie"
              : locale === "es"
                ? "Por categoría"
                : locale === "ar"
                  : "Browse by category",
      viewAll:
        locale === "tr"
          ? "Tüm kategoriler"
          : locale === "de"
            ? "Alle Kategorien"
            : locale === "fr"
              ? "Toutes les catégories"
              : locale === "es"
                ? "Todas las categorías"
                : locale === "ar"
                  : "View all categories",
    },
    industries: {
      title:
        locale === "tr"
          ? "Sektöre göre keşfet"
          : locale === "de"
            ? "Nach Branche"
            : locale === "fr"
              ? "Par secteur"
              : locale === "es"
                ? "Por sector"
                : locale === "ar"
                  : "Explore by industry",
      viewAll: LOCALE_CTA[locale].chooseSector,
    },
    calculator: {
      calculate: LOCALE_CTA[locale].calculateNow,
      awaiting:
        locale === "en"
          ? "Enter values to see your result"
          : locale === "tr"
            ? "Sonucu görmek için değerleri girin"
            : locale === "de"
              ? "Werte eingeben für das Ergebnis"
              : locale === "fr"
                ? "Saisissez les valeurs pour voir le résultat"
                : locale === "es"
                  ? "Introduzca valores para ver el resultado"
      validationRequired:
        locale === "en"
          ? "Please select a value."
          : locale === "tr"
            ? "Lütfen bir değer seçin."
            : locale === "de"
              ? "Bitte einen Wert wählen."
              : locale === "fr"
                ? "Veuillez sélectionner une valeur."
                : locale === "es"
                  ? "Seleccione un valor."
      validationNumber:
        locale === "en"
          ? "Enter a valid number."
          : locale === "tr"
            ? "Geçerli bir sayı girin."
            : locale === "de"
              ? "Gültige Zahl eingeben."
              : locale === "fr"
                ? "Saisissez un nombre valide."
                : locale === "es"
                  ? "Introduzca un número válido."
    },
    premiumReport: PREMIUM_REPORT_SECTIONS[locale],
    export: {
      downloadCsv: LOCALE_CTA[locale].downloadCsv,
      printReport: LOCALE_CTA[locale].printReport,
      copySummary: LOCALE_CTA[locale].copySummary,
    },
    legal: LEGAL[locale],
    errors: ERRORS[locale],
    seo: SEO[locale],
    cta: LOCALE_CTA[locale],
  };
}

const root = join(process.cwd(), "messages");

for (const locale of LOCALES) {
  const filePath = join(root, `${locale}.json`);
  const data = JSON.parse(readFileSync(filePath, "utf8")) as Record<
    string,
    unknown
  >;

  deepMerge(data, buildSections(locale));

  if (PREMIUM_DECISION_REPORT[locale] && Object.keys(PREMIUM_DECISION_REPORT[locale]).length > 0) {
    deepMerge(
      data,
      { premiumDecisionReport: PREMIUM_DECISION_REPORT[locale] },
    );
  }

  for (const [path, value] of Object.entries(CRITICAL_PATCHES[locale])) {
    setNested(data, path, value);
  }

  const localeBlock = (data.locale ?? {}) as Record<string, string>;
  localeBlock.label = LOCALE_LABELS[locale].label;
  localeBlock.fr = "Français";
  data.locale = localeBlock;

  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Updated messages/${locale}.json`);
}

console.log("Locale copy v1 merge complete.");
