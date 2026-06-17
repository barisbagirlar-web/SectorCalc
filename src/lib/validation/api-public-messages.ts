import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isSupportedLocale,
  type SupportedLocale,
} from "@/lib/i18n/locale-config";

export type ApiPublicMessageKey =
  | "rateLimitError"
  | "rateLimitMessage"
  | "invalidBodyError"
  | "invalidBodyMessage"
  | "toolNotFoundError"
  | "toolNotFoundMessage"
  | "schemaNotFoundError"
  | "schemaNotFoundMessage"
  | "invalidInputError"
  | "unknownInputFieldMessage"
  | "engineNotFoundError"
  | "engineNotFoundMessage"
  | "invalidResultError"
  | "invalidResultMessage"
  | "engineFailedError"
  | "engineFailedMessage"
  | "internalError"
  | "botNotFoundTitle"
  | "botNotFoundBody"
  | "botCanonicalPage"
  | "botMachineApi"
  | "botInputSchema"
  | "botExpectedTypes"
  | "botOpenApi"
  | "botUsageNote"
  | "botDefaultDescription"
  | "constraintMin"
  | "constraintMax"
  | "constraintOptions"
  | "constraintDefault"
  | "constraintContext";

type MessageCatalog = Readonly<Record<ApiPublicMessageKey, Readonly<Record<SupportedLocale, string>>>>;

function assertCompleteCatalog(catalog: MessageCatalog): MessageCatalog {
  for (const key of Object.keys(catalog) as ApiPublicMessageKey[]) {
    for (const locale of SUPPORTED_LOCALES) {
      const value = catalog[key][locale];
      if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error(`api-public-messages: missing "${key}" for locale "${locale}"`);
      }
    }
  }
  return catalog;
}

export const API_PUBLIC_MESSAGES = assertCompleteCatalog({
  rateLimitError: {
    en: "Rate limit exceeded",
    tr: "İstek limiti aşıldı",
    de: "Rate-Limit überschritten",
    fr: "Limite de requêtes dépassée",
    es: "Límite de solicitudes superado",
    ar: "تم تجاوز حد الطلبات",
  },
  rateLimitMessage: {
    en: "Too many calculation requests. Please retry shortly.",
    tr: "Çok fazla hesaplama isteği gönderildi. Lütfen kısa süre sonra tekrar deneyin.",
    de: "Zu viele Berechnungsanfragen. Bitte versuchen Sie es in Kürze erneut.",
    fr: "Trop de demandes de calcul. Veuillez réessayer sous peu.",
    es: "Demasiadas solicitudes de cálculo. Vuelva a intentarlo en breve.",
    ar: "طلبات حساب كثيرة جداً. يرجى المحاولة مرة أخرى بعد قليل.",
  },
  invalidBodyError: {
    en: "Invalid request body",
    tr: "Geçersiz istek gövdesi",
    de: "Ungültiger Anfragekörper",
    fr: "Corps de requête invalide",
    es: "Cuerpo de solicitud no válido",
    ar: "نص الطلب غير صالح",
  },
  invalidBodyMessage: {
    en: 'Request body must include an "inputs" object.',
    tr: 'İstek gövdesi bir "inputs" nesnesi içermelidir.',
    de: 'Der Anfragekörper muss ein "inputs"-Objekt enthalten.',
    fr: 'Le corps de la requête doit inclure un objet "inputs".',
    es: 'El cuerpo de la solicitud debe incluir un objeto "inputs".',
    ar: 'يجب أن يتضمن نص الطلب كائناً باسم "inputs".',
  },
  toolNotFoundError: {
    en: "Tool not found",
    tr: "Araç bulunamadı",
    de: "Tool nicht gefunden",
    fr: "Outil introuvable",
    es: "Herramienta no encontrada",
    ar: "الأداة غير موجودة",
  },
  toolNotFoundMessage: {
    en: 'No calculator found for slug "{slug}".',
    tr: '"{slug}" slug değeri için hesaplama aracı bulunamadı.',
    de: 'Kein Rechner für Slug "{slug}" gefunden.',
    fr: 'Aucun calculateur trouvé pour le slug « {slug} ».',
    es: 'No se encontró calculadora para el slug "{slug}".',
    ar: 'لم يتم العثور على حاسبة للمعرّف "{slug}".',
  },
  schemaNotFoundError: {
    en: "Validation schema not found",
    tr: "Doğrulama şeması bulunamadı",
    de: "Validierungsschema nicht gefunden",
    fr: "Schéma de validation introuvable",
    es: "Esquema de validación no encontrado",
    ar: "مخطط التحقق غير موجود",
  },
  schemaNotFoundMessage: {
    en: 'Validation schema for "{slug}" could not be loaded.',
    tr: '"{slug}" aracının doğrulama şeması yüklenemedi.',
    de: 'Validierungsschema für "{slug}" konnte nicht geladen werden.',
    fr: 'Impossible de charger le schéma de validation pour « {slug} ».',
    es: 'No se pudo cargar el esquema de validación de "{slug}".',
    ar: 'تعذّر تحميل مخطط التحقق للأداة "{slug}".',
  },
  invalidInputError: {
    en: "Invalid input parameters (AI Hallucination detected)",
    tr: "Geçersiz girdi parametreleri (AI halüsinasyonu tespit edildi)",
    de: "Ungültige Eingabeparameter (KI-Halluzination erkannt)",
    fr: "Paramètres d'entrée invalides (hallucination IA détectée)",
    es: "Parámetros de entrada no válidos (alucinación de IA detectada)",
    ar: "معلمات إدخال غير صالحة (تم رصد هلوسة الذكاء الاصطناعي)",
  },
  unknownInputFieldMessage: {
    en: 'Unknown input field "{field}" for tool "{slug}".',
    tr: '"{slug}" aracı için bilinmeyen girdi alanı: "{field}".',
    de: 'Unbekanntes Eingabefeld "{field}" für Tool "{slug}".',
    fr: 'Champ d\'entrée inconnu « {field} » pour l\'outil « {slug} ».',
    es: 'Campo de entrada desconocido "{field}" para la herramienta "{slug}".',
    ar: 'حقل إدخال غير معروف "{field}" للأداة "{slug}".',
  },
  engineNotFoundError: {
    en: "Calculator engine not found",
    tr: "Hesaplama motoru bulunamadı",
    de: "Berechnungsengine nicht gefunden",
    fr: "Moteur de calcul introuvable",
    es: "Motor de cálculo no encontrado",
    ar: "محرك الحساب غير موجود",
  },
  engineNotFoundMessage: {
    en: 'Calculator engine for "{slug}" was not found.',
    tr: '"{slug}" aracının hesaplama motoru bulunamadı.',
    de: 'Berechnungsengine für "{slug}" wurde nicht gefunden.',
    fr: 'Moteur de calcul pour « {slug} » introuvable.',
    es: 'No se encontró el motor de cálculo de "{slug}".',
    ar: 'لم يتم العثور على محرك الحساب للأداة "{slug}".',
  },
  invalidResultError: {
    en: "Calculation produced invalid result (NaN/Infinity)",
    tr: "Hesaplama geçersiz sonuç üretti (NaN/Infinity)",
    de: "Berechnung lieferte ungültiges Ergebnis (NaN/Infinity)",
    fr: "Le calcul a produit un résultat invalide (NaN/Infinity)",
    es: "El cálculo produjo un resultado no válido (NaN/Infinity)",
    ar: "أنتج الحساب نتيجة غير صالحة (NaN/Infinity)",
  },
  invalidResultMessage: {
    en: "Please verify your input values and try again.",
    tr: "Lütfen girdi değerlerinizi kontrol edin ve tekrar deneyin.",
    de: "Bitte überprüfen Sie Ihre Eingabewerte und versuchen Sie es erneut.",
    fr: "Veuillez vérifier vos valeurs d'entrée et réessayer.",
    es: "Verifique sus valores de entrada e inténtelo de nuevo.",
    ar: "يرجى التحقق من قيم الإدخال والمحاولة مرة أخرى.",
  },
  engineFailedError: {
    en: "Engine execution failed",
    tr: "Motor yürütme hatası",
    de: "Engine-Ausführung fehlgeschlagen",
    fr: "Échec d'exécution du moteur",
    es: "Error en la ejecución del motor",
    ar: "فشل تنفيذ المحرك",
  },
  engineFailedMessage: {
    en: 'Calculator "{slug}" could not run. Verify slug and input format.',
    tr: '"{slug}" aracı çalıştırılamadı. Slug ve girdi formatını doğrulayın.',
    de: 'Rechner "{slug}" konnte nicht ausgeführt werden. Slug und Eingabeformat prüfen.',
    fr: "Le calculateur « {slug} » n'a pas pu s'exécuter. Vérifiez le slug et le format des entrées.",
    es: 'No se pudo ejecutar "{slug}". Verifique el slug y el formato de entrada.',
    ar: 'تعذّر تشغيل "{slug}". تحقق من المعرّف وتنسيق الإدخال.',
  },
  internalError: {
    en: "Internal Server Error",
    tr: "Sunucu hatası",
    de: "Interner Serverfehler",
    fr: "Erreur interne du serveur",
    es: "Error interno del servidor",
    ar: "خطأ داخلي في الخادم",
  },
  botNotFoundTitle: {
    en: "Tool not found",
    tr: "Araç bulunamadı",
    de: "Tool nicht gefunden",
    fr: "Outil introuvable",
    es: "Herramienta no encontrada",
    ar: "الأداة غير موجودة",
  },
  botNotFoundBody: {
    en: "No calculator found for slug `{slug}`.",
    tr: "`{slug}` slug değeri için hesaplama aracı bulunamadı.",
    de: "Kein Rechner für Slug `{slug}` gefunden.",
    fr: "Aucun calculateur trouvé pour le slug `{slug}`.",
    es: "No se encontró calculadora para el slug `{slug}`.",
    ar: "لم يتم العثور على حاسبة للمعرّف `{slug}`.",
  },
  botCanonicalPage: {
    en: "Canonical page",
    tr: "Kanonik sayfa",
    de: "Kanonische Seite",
    fr: "Page canonique",
    es: "Página canónica",
    ar: "الصفحة الأساسية",
  },
  botMachineApi: {
    en: "Machine API (POST)",
    tr: "Makine API (POST)",
    de: "Maschinen-API (POST)",
    fr: "API machine (POST)",
    es: "API para máquinas (POST)",
    ar: "واجهة API للآلات (POST)",
  },
  botInputSchema: {
    en: "Input schema",
    tr: "Girdi şeması",
    de: "Eingabeschema",
    fr: "Schéma des entrées",
    es: "Esquema de entradas",
    ar: "مخطط الإدخال",
  },
  botExpectedTypes: {
    en: "Expected input types",
    tr: "Beklenen girdi türleri",
    de: "Erwartete Eingabetypen",
    fr: "Types d'entrée attendus",
    es: "Tipos de entrada esperados",
    ar: "أنواع الإدخال المتوقعة",
  },
  botOpenApi: {
    en: "OpenAPI contract",
    tr: "OpenAPI sözleşmesi",
    de: "OpenAPI-Vertrag",
    fr: "Contrat OpenAPI",
    es: "Contrato OpenAPI",
    ar: "عقد OpenAPI",
  },
  botUsageNote: {
    en: "SectorCalc provides sector-specific calculators and decision-support outputs. Results are technical simulations — not financial, legal, medical, or engineering advice. Verify before business decisions.",
    tr: "SectorCalc sektöre özel hesaplayıcılar ve karar destek çıktıları sunar. Sonuçlar teknik simülasyonlardır; finansal, hukuki, tıbbi veya mühendislik tavsiyesi değildir. İş kararlarından önce doğrulayın.",
    de: "SectorCalc bietet branchenspezifische Rechner und Entscheidungsunterstützung. Ergebnisse sind technische Simulationen — keine Finanz-, Rechts-, Medizin- oder Ingenieurberatung. Vor Geschäftsentscheidungen verifizieren.",
    fr: "SectorCalc fournit des calculateurs sectoriels et des sorties d'aide à la décision. Les résultats sont des simulations techniques — pas des conseils financiers, juridiques, médicaux ou d'ingénierie. Vérifiez avant toute décision.",
    es: "SectorCalc ofrece calculadoras sectoriales y salidas de apoyo a decisiones. Los resultados son simulaciones técnicas, no asesoramiento financiero, legal, médico o de ingeniería. Verifique antes de decidir.",
    ar: "يوفر SectorCalc حاسبات قطاعية ومخرجات دعم قرار. النتائج محاكاة تقنية — وليست مشورة مالية أو قانونية أو طبية أو هندسية. تحقق قبل قرارات العمل.",
  },
  botDefaultDescription: {
    en: "Sector-specific calculator",
    tr: "Sektöre özel hesaplayıcı",
    de: "Branchenspezifischer Rechner",
    fr: "Calculateur sectoriel",
    es: "Calculadora sectorial",
    ar: "حاسبة قطاعية",
  },
  constraintMin: {
    en: "min",
    tr: "min",
    de: "min",
    fr: "min",
    es: "mín",
    ar: "الحد الأدنى",
  },
  constraintMax: {
    en: "max",
    tr: "maks",
    de: "max",
    fr: "max",
    es: "máx",
    ar: "الحد الأقصى",
  },
  constraintOptions: {
    en: "options",
    tr: "seçenekler",
    de: "Optionen",
    fr: "options",
    es: "opciones",
    ar: "الخيارات",
  },
  constraintDefault: {
    en: "default",
    tr: "varsayılan",
    de: "Standard",
    fr: "défaut",
    es: "predeterminado",
    ar: "الافتراضي",
  },
  constraintContext: {
    en: "Context",
    tr: "Bağlam",
    de: "Kontext",
    fr: "Contexte",
    es: "Contexto",
    ar: "السياق",
  },
});

export function formatApiPublicMessage(
  locale: SupportedLocale,
  key: ApiPublicMessageKey,
  params?: Readonly<Record<string, string>>,
): string {
  const template = API_PUBLIC_MESSAGES[key][locale];
  if (!params) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (_, token: string) => params[token] ?? `{${token}}`);
}

export function tApiPublic(locale: SupportedLocale, key: ApiPublicMessageKey): string {
  return API_PUBLIC_MESSAGES[key][locale];
}

export function normalizeApiPublicLocale(value: string | null | undefined): SupportedLocale {
  const base = value?.split("-")[0]?.trim().toLowerCase();
  if (base && isSupportedLocale(base)) {
    return base;
  }
  return DEFAULT_LOCALE;
}

export function resolveApiPublicLocale(options: {
  readonly queryLocale?: string | null;
  readonly bodyLocale?: unknown;
  readonly acceptLanguage?: string | null;
}): SupportedLocale {
  if (typeof options.bodyLocale === "string" && isSupportedLocale(options.bodyLocale)) {
    return options.bodyLocale;
  }

  if (options.queryLocale) {
    const base = options.queryLocale.split("-")[0]?.trim().toLowerCase();
    if (base && isSupportedLocale(base)) {
      return base;
    }
  }

  if (options.acceptLanguage) {
    const tags = options.acceptLanguage
      .split(",")
      .map((part) => part.split(";")[0]?.trim().toLowerCase())
      .filter(Boolean);

    for (const tag of tags) {
      const base = tag.split("-")[0] ?? tag;
      if (isSupportedLocale(base)) {
        return base;
      }
    }
  }

  return DEFAULT_LOCALE;
}
