#!/usr/bin/env node
/** Sync freeToolUi + premiumDecisionReport calculator terminology across locales. */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "de", "fr", "es", "ar"];

const FREE_TOOL_UI = {
  en: {
    premiumAnalyzer: "Premium calculator",
    runAnalysis: "Run calculation",
    analysisBlockedTitle: "Calculation blocked",
    contractFormEyebrow: "Contract-driven form",
    contractFormDecisionGoal: "What result do these inputs produce under the documented formula?",
    contractFormAssumptionsRules: "{assumptionCount} governed assumption(s) · {ruleCount} validation rule(s)",
    contractFormRulesOnly: "{ruleCount} validation rule(s) active",
    contractFormTrustAria: "Smart form trust summary",
    requiredInputsTitle: "Required inputs",
    requiredInputsDescription: "Core contract inputs for a valid calculation path.",
    optionalInputsTitle: "Optional refinements",
    optionalInputsDescription: "Improve estimate fidelity without breaking defaults.",
    advancedInputsTitle: "Advanced inputs",
    advancedInputsDescription: "Professional depth overrides when available.",
    contractNotFound: "Smart form contract not found for this tool.",
    calculationSteps: "Calculation steps",
    calculationStepsEmpty: "Calculation steps will appear when this contract exposes deterministic trace.",
    calculationStepDecisionGoal: "Decision goal",
    calculationStepFormulaSummary: "Formula summary",
  },
  de: {
    premiumAnalyzer: "Premium-Rechner",
    runAnalysis: "Berechnung starten",
    analysisBlockedTitle: "Berechnung blockiert",
    contractFormEyebrow: "Formelbasierte Berechnung",
    contractFormDecisionGoal: "Welches Ergebnis liefern diese Eingaben nach der dokumentierten Formel?",
    contractFormAssumptionsRules: "{assumptionCount} geregelte Annahme(n) · {ruleCount} Validierungsregel(n)",
    contractFormRulesOnly: "{ruleCount} Validierungsregel(n) aktiv",
    contractFormTrustAria: "Smart-Formular-Vertrauensübersicht",
    requiredInputsTitle: "Erforderliche Eingaben",
    requiredInputsDescription: "Kern-Eingaben für einen gültigen Berechnungspfad.",
    optionalInputsTitle: "Optionale Verfeinerungen",
    optionalInputsDescription: "Verbessert die Schätzgenauigkeit ohne Standardwerte zu brechen.",
    advancedInputsTitle: "Erweiterte Eingaben",
    advancedInputsDescription: "Professionelle Tiefe, wenn verfügbar.",
    contractNotFound: "Smart-Formular-Vertrag für dieses Tool nicht gefunden.",
    calculationSteps: "Berechnungsschritte",
    calculationStepsEmpty: "Berechnungsschritte erscheinen, wenn dieser Vertrag deterministische Spur liefert.",
    calculationStepDecisionGoal: "Entscheidungsziel",
    calculationStepFormulaSummary: "Formelübersicht",
  },
  fr: {
    premiumAnalyzer: "Calculateur premium",
    runAnalysis: "Lancer le calcul",
    analysisBlockedTitle: "Calcul bloqué",
    contractFormEyebrow: "Calcul piloté par contrat",
    contractFormDecisionGoal: "Quel résultat ces entrées produisent-elles selon la formule documentée ?",
    contractFormAssumptionsRules: "{assumptionCount} hypothèse(s) régie(s) · {ruleCount} règle(s) de validation",
    contractFormRulesOnly: "{ruleCount} règle(s) de validation active(s)",
    contractFormTrustAria: "Résumé de confiance du formulaire intelligent",
    requiredInputsTitle: "Entrées requises",
    requiredInputsDescription: "Entrées essentielles pour un chemin de calcul valide.",
    optionalInputsTitle: "Affinements optionnels",
    optionalInputsDescription: "Améliore la fidélité de l'estimation sans casser les valeurs par défaut.",
    advancedInputsTitle: "Entrées avancées",
    advancedInputsDescription: "Profondeur professionnelle lorsque disponible.",
    contractNotFound: "Contrat de formulaire intelligent introuvable pour cet outil.",
    calculationSteps: "Étapes de calcul",
    calculationStepsEmpty: "Les étapes apparaîtront lorsque ce contrat expose une trace déterministe.",
    calculationStepDecisionGoal: "Objectif de décision",
    calculationStepFormulaSummary: "Résumé de formule",
  },
  es: {
    premiumAnalyzer: "Calculadora premium",
    runAnalysis: "Iniciar cálculo",
    analysisBlockedTitle: "Cálculo bloqueado",
    contractFormEyebrow: "Cálculo basado en contrato",
    contractFormDecisionGoal: "¿Qué resultado producen estas entradas según la fórmula documentada?",
    contractFormAssumptionsRules: "{assumptionCount} supuesto(s) gobernado(s) · {ruleCount} regla(s) de validación",
    contractFormRulesOnly: "{ruleCount} regla(s) de validación activa(s)",
    contractFormTrustAria: "Resumen de confianza del formulario inteligente",
    requiredInputsTitle: "Entradas requeridas",
    requiredInputsDescription: "Entradas básicas para una ruta de cálculo válida.",
    optionalInputsTitle: "Refinamientos opcionales",
    optionalInputsDescription: "Mejora la fidelidad de la estimación sin romper valores predeterminados.",
    advancedInputsTitle: "Entradas avanzadas",
    advancedInputsDescription: "Profundidad profesional cuando esté disponible.",
    contractNotFound: "Contrato de formulario inteligente no encontrado para esta herramienta.",
    calculationSteps: "Pasos de cálculo",
    calculationStepsEmpty: "Los pasos aparecerán cuando este contrato exponga trazabilidad determinista.",
    calculationStepDecisionGoal: "Objetivo de decisión",
    calculationStepFormulaSummary: "Resumen de fórmula",
  },
  ar: {
    premiumAnalyzer: "حاسبة مميزة",
    runAnalysis: "بدء الحساب",
    analysisBlockedTitle: "الحساب محظور",
    contractFormEyebrow: "حساب قائم على العقد",
    contractFormDecisionGoal: "ما النتيجة التي تنتجها هذه المدخلات وفق الصيغة الموثقة؟",
    contractFormAssumptionsRules: "{assumptionCount} افتراض(ات) محكوم · {ruleCount} قاعدة تحقق",
    contractFormRulesOnly: "{ruleCount} قاعدة تحقق نشطة",
    contractFormTrustAria: "ملخص ثقة النموذج الذكي",
    requiredInputsTitle: "المدخلات المطلوبة",
    requiredInputsDescription: "مدخلات أساسية لمسار حساب صالح.",
    optionalInputsTitle: "تحسينات اختيارية",
    optionalInputsDescription: "تحسّن دقة التقدير دون كسر القيم الافتراضية.",
    advancedInputsTitle: "مدخلات متقدمة",
    advancedInputsDescription: "عمق احترافي عند التوفر.",
    contractNotFound: "لم يُعثر على عقد النموذج الذكي لهذه الأداة.",
    calculationSteps: "خطوات الحساب",
    calculationStepsEmpty: "ستظهر خطوات الحساب عندما يعرض هذا العقد أثرًا حتميًا.",
    calculationStepDecisionGoal: "هدف القرار",
    calculationStepFormulaSummary: "ملخص الصيغة",
  },
};

const PREMIUM_DECISION_PATCH = {
  en: {
    runPrompt: "Enter your operating values and run the calculation.",
    runAnalysis: "Run calculation",
  },
  de: {
    runPrompt: "Geben Sie Ihre Betriebswerte ein und starten Sie die Berechnung.",
    runAnalysis: "Berechnung starten",
  },
  fr: {
    runPrompt: "Saisissez vos valeurs opérationnelles et lancez le calcul.",
    runAnalysis: "Lancer le calcul",
  },
  es: {
    runPrompt: "Introduzca sus valores operativos e inicie el cálculo.",
    runAnalysis: "Iniciar cálculo",
  },
  ar: {
    runPrompt: "أدخل قيم التشغيل وابدأ الحساب.",
    runAnalysis: "بدء الحساب",
  },
};

const PREMIUM_SCHEMA_PAGE = {
  en: {
    eyebrow: "Premium calculator",
    featuredQuestion: "What does {name} calculate?",
    bullet1: "Hidden-loss drivers and threshold checks",
    bullet2: "Suggested actions for operational review",
    bullet3: "Export-ready PDF and CSV on paid plans",
    legalQuestion: "Is this financial or engineering advice?",
    legalAnswer:
      "No. SectorCalc premium calculators are decision-support tools with transparent assumptions. They do not replace professional financial, legal, or engineering advice.",
    serviceType: "Operational decision calculation",
  },
  de: {
    eyebrow: "Premium-Rechner",
    featuredQuestion: "Was berechnet {name}?",
    bullet1: "Versteckte Verlusttreiber und Schwellenprüfungen",
    bullet2: "Empfohlene Maßnahmen zur operativen Prüfung",
    bullet3: "PDF- und CSV-Export in kostenpflichtigen Plänen",
    legalQuestion: "Ist dies Finanz- oder Ingenieurberatung?",
    legalAnswer:
      "Nein. SectorCalc Premium-Rechner sind Entscheidungsunterstützung mit transparenten Annahmen. Sie ersetzen keine professionelle Finanz-, Rechts- oder Ingenieurberatung.",
    serviceType: "Operative Entscheidungsberechnung",
  },
  fr: {
    eyebrow: "Calculateur premium",
    featuredQuestion: "Que calcule {name} ?",
    bullet1: "Facteurs de perte cachée et contrôles de seuil",
    bullet2: "Actions suggérées pour revue opérationnelle",
    bullet3: "PDF et CSV exportables sur les plans payants",
    legalQuestion: "S'agit-il d'un conseil financier ou d'ingénierie ?",
    legalAnswer:
      "Non. Les calculateurs premium SectorCalc sont des outils d'aide à la décision avec hypothèses transparentes. Ils ne remplacent pas un conseil financier, juridique ou d'ingénierie professionnel.",
    serviceType: "Calcul de décision opérationnelle",
  },
  es: {
    eyebrow: "Calculadora premium",
    featuredQuestion: "¿Qué calcula {name}?",
    bullet1: "Impulsores de pérdida oculta y controles de umbral",
    bullet2: "Acciones sugeridas para revisión operativa",
    bullet3: "PDF y CSV listos para exportar en planes de pago",
    legalQuestion: "¿Es asesoramiento financiero o de ingeniería?",
    legalAnswer:
      "No. Las calculadoras premium de SectorCalc son herramientas de apoyo a decisiones con supuestos transparentes. No sustituyen asesoramiento financiero, legal o de ingeniería profesional.",
    serviceType: "Cálculo de decisión operativa",
  },
  ar: {
    eyebrow: "حاسبة مميزة",
    featuredQuestion: "ماذا تحسب {name}؟",
    bullet1: "محركات الخسارة الخفية وفحوصات العتبات",
    bullet2: "إجراءات مقترحة للمراجعة التشغيلية",
    bullet3: "PDF وCSV جاهزان للتصدير في الخطط المدفوعة",
    legalQuestion: "هل هذه نصيحة مالية أو هندسية؟",
    legalAnswer:
      "لا. حاسبات SectorCalc المميزة أدوات دعم قرار بافتراضات شفافة. لا تحل محل المشورة المالية أو القانونية أو الهندسية المهنية.",
    serviceType: "حساب قرار تشغيلي",
  },
};

const CONTENT_AUTHORITY_PREMIUM = {
  en: {
    whenToUseTitle: "When to use this calculator",
    whenToUseBody:
      "Use this calculator when the result affects pricing, operations, capacity, scheduling or management reporting.",
    measuresTitle: "What this calculator measures",
    decidesTitle: "What this calculator helps decide",
    faqMeasureTitle: "What does this calculator measure?",
    faqPremiumTitle: "When should I use a premium calculator?",
    faqPremiumAnswer:
      "Use a premium calculator when the estimate affects pricing, operations or management decisions and you need hidden drivers, thresholds and export-ready reports.",
    relatedPremiumTitle: "Related premium calculator",
    relatedPremiumCta: "View the related premium calculator",
    decidesBody:
      "Use this calculator when you need to decide whether current inputs sit inside acceptable exposure bands, which driver to investigate first, and whether to reprice, reschedule or redesign before repeating the work.",
    reportBullet1: "Executive summary with threshold status",
    reportBullet2: "Hidden loss driver breakdown",
    reportBullet3: "Suggested actions and assumption notes",
    reportBullet4: "Export-ready PDF and CSV on paid access",
  },
  de: {
    whenToUseTitle: "Wann dieser Rechner sinnvoll ist",
    whenToUseBody:
      "Nutzen Sie diesen Rechner, wenn das Ergebnis Preise, Betrieb, Kapazität, Planung oder Management-Reporting beeinflusst.",
    measuresTitle: "Was dieser Rechner misst",
    decidesTitle: "Bei welcher Entscheidung dieser Rechner hilft",
    faqMeasureTitle: "Was misst dieser Rechner?",
    faqPremiumTitle: "Wann sollte ich einen Premium-Rechner nutzen?",
    faqPremiumAnswer:
      "Nutzen Sie einen Premium-Rechner, wenn die Schätzung Preise, Betrieb oder Management-Entscheidungen beeinflusst und Sie versteckte Treiber, Schwellen und exportfähige Berichte benötigen.",
    relatedPremiumTitle: "Verwandter Premium-Rechner",
    relatedPremiumCta: "Verwandten Premium-Rechner ansehen",
  },
  fr: {
    whenToUseTitle: "Quand utiliser ce calculateur",
    whenToUseBody:
      "Utilisez ce calculateur lorsque le résultat affecte les prix, les opérations, la capacité, la planification ou le reporting de gestion.",
    measuresTitle: "Ce que ce calculateur mesure",
    decidesTitle: "Quelle décision ce calculateur aide",
    faqMeasureTitle: "Que mesure ce calculateur ?",
    faqPremiumTitle: "Quand utiliser un calculateur premium ?",
    faqPremiumAnswer:
      "Utilisez un calculateur premium lorsque l'estimation affecte les prix, les opérations ou les décisions de gestion et que vous avez besoin de facteurs cachés, de seuils et de rapports exportables.",
    relatedPremiumTitle: "Calculateur premium associé",
    relatedPremiumCta: "Voir le calculateur premium associé",
  },
  es: {
    whenToUseTitle: "Cuándo usar esta calculadora",
    whenToUseBody:
      "Use esta calculadora cuando el resultado afecte precios, operaciones, capacidad, planificación o informes de gestión.",
    measuresTitle: "Qué mide esta calculadora",
    decidesTitle: "Qué decisión ayuda esta calculadora",
    faqMeasureTitle: "¿Qué mide esta calculadora?",
    faqPremiumTitle: "¿Cuándo usar una calculadora premium?",
    faqPremiumAnswer:
      "Use una calculadora premium cuando la estimación afecte precios, operaciones o decisiones de gestión y necesite impulsores ocultos, umbrales e informes exportables.",
    relatedPremiumTitle: "Calculadora premium relacionada",
    relatedPremiumCta: "Ver la calculadora premium relacionada",
  },
  ar: {
    whenToUseTitle: "متى تستخدم هذه الحاسبة",
    whenToUseBody:
      "استخدم هذه الحاسبة عندما تؤثر النتيجة على التسعير أو العمليات أو السعة أو التخطيط أو تقارير الإدارة.",
    measuresTitle: "ما الذي تقيسه هذه الحاسبة",
    decidesTitle: "ما القرار الذي تساعد هذه الحاسبة فيه",
    faqMeasureTitle: "ماذا تقيس هذه الحاسبة؟",
    faqPremiumTitle: "متى أستخدم حاسبة مميزة؟",
    faqPremiumAnswer:
      "استخدم حاسبة مميزة عندما يؤثر التقدير على التسعير أو العمليات أو قرارات الإدارة وتحتاج إلى محركات خفية وعتبات وتقارير قابلة للتصدير.",
    relatedPremiumTitle: "حاسبة مميزة ذات صلة",
    relatedPremiumCta: "عرض الحاسبة المميزة ذات الصلة",
  },
};

const CONTENT_AUTHORITY_FREE = {
  es: {
    faqPremiumTitle: "¿Cuándo usar una calculadora premium?",
    faqPremiumAnswer:
      "Use una calculadora premium cuando la estimación afecte precios, operaciones o decisiones de gestión y necesite impulsores ocultos, umbrales e informes exportables.",
    relatedPremiumTitle: "Calculadora premium relacionada",
    relatedPremiumCta: "Ver la calculadora premium relacionada",
  },
  ar: {
    faqPremiumTitle: "متى أستخدم حاسبة مميزة؟",
    faqPremiumAnswer:
      "استخدم حاسبة مميزة عندما يؤثر التقدير على التسعير أو العمليات أو قرارات الإدارة وتحتاج إلى محركات خفية وعتبات وتقارير قابلة للتصدير.",
    relatedPremiumTitle: "حاسبة مميزة ذات صلة",
    relatedPremiumCta: "عرض الحاسبة المميزة ذات الصلة",
  },
  en: {
    faqPremiumTitle: "When should I use a premium calculator?",
    faqPremiumAnswer:
      "Use a premium calculator when the estimate affects pricing, operations or management decisions and you need hidden drivers, thresholds and export-ready reports.",
    relatedPremiumTitle: "Related premium calculator",
    relatedPremiumCta: "View the related premium calculator",
  },
  de: {
    faqPremiumTitle: "Wann sollte ich einen Premium-Rechner nutzen?",
    faqPremiumAnswer:
      "Nutzen Sie einen Premium-Rechner, wenn die Schätzung Preise, Betrieb oder Management-Entscheidungen beeinflusst und Sie versteckte Treiber, Schwellen und exportfähige Berichte benötigen.",
    relatedPremiumTitle: "Verwandter Premium-Rechner",
    relatedPremiumCta: "Verwandten Premium-Rechner ansehen",
  },
  fr: {
    faqPremiumTitle: "Quand utiliser un calculateur premium ?",
    faqPremiumAnswer:
      "Utilisez un calculateur premium lorsque l'estimation affecte les prix, les opérations ou les décisions de gestion et que vous avez besoin de facteurs cachés, de seuils et de rapports exportables.",
    relatedPremiumTitle: "Calculateur premium associé",
    relatedPremiumCta: "Voir le calculateur premium associé",
  },
};

for (const locale of LOCALES) {
  const path = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(path, "utf8"));
  messages.freeToolUi = { ...(messages.freeToolUi ?? {}), ...FREE_TOOL_UI[locale] };
  messages.premiumDecisionReport = {
    ...(messages.premiumDecisionReport ?? {}),
    ...PREMIUM_DECISION_PATCH[locale],
  };
  messages.premiumSchemaPage = PREMIUM_SCHEMA_PAGE[locale];
  if (messages.contentAuthority?.premium) {
    messages.contentAuthority.premium = {
      ...messages.contentAuthority.premium,
      ...CONTENT_AUTHORITY_PREMIUM[locale],
    };
  }
  if (messages.contentAuthority?.freeTool) {
    messages.contentAuthority.freeTool = {
      ...messages.contentAuthority.freeTool,
      ...CONTENT_AUTHORITY_FREE[locale],
    };
  }
  writeFileSync(path, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
  console.log(`Patched messages/${locale}.json`);
}
