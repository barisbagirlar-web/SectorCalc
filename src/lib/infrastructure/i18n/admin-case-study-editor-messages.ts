import {
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/lib/infrastructure/i18n/locale-config";

export type AdminCaseStudyEditorMessages = {
  readonly checkingSession: string;
  readonly pageTitle: string;
  readonly pageSubtitle: string;
  readonly backToList: string;
  readonly storyLabel: string;
  readonly storyPlaceholder: string;
  readonly parseButton: string;
  readonly parsing: string;
  readonly advancedEditor: string;
  readonly parseHint: string;
  readonly parsedSectionTitle: string;
  readonly fieldTitle: string;
  readonly fieldIndustry: string;
  readonly fieldCountry: string;
  readonly fieldCity: string;
  readonly fieldChallenge: string;
  readonly fieldSolution: string;
  readonly fieldResults: string;
  readonly metricName: string;
  readonly metricBefore: string;
  readonly metricAfter: string;
  readonly removeMetric: string;
  readonly addMetric: string;
  readonly fieldTestimonial: string;
  readonly testimonialPlaceholder: string;
  readonly publishButton: string;
  readonly publishing: string;
  readonly sourceLocaleLabel: string;
  readonly errorEmptyStory: string;
  readonly errorTitleRequired: string;
  readonly errorSession: string;
  readonly errorParseFailed: string;
  readonly errorConnection: string;
  readonly errorPublishFailed: string;
  readonly successParsed: string;
  readonly successPublished: string;
  readonly apiError: {
    readonly TEXT_TOO_SHORT: string;
    readonly TEXT_TOO_LONG: string;
    readonly PARSE_FAILED: string;
    readonly MISSING_API_KEY: string;
    readonly UNAUTHORIZED: string;
    readonly TRANSLATION_FAILED: string;
  };
};

const EN: AdminCaseStudyEditorMessages = {
  checkingSession: "Checking session…",
  pageTitle: "New success story",
  pageSubtitle: "Paste your story in one box - AI fills the fields automatically.",
  backToList: "Back to list",
  storyLabel: "Write your story (AI will parse it)",
  storyPlaceholder: `Example:
OEE was 18% at a CNC shop.
Setup time was 45 minutes; scrap rate was 8%.
SectorCalc OEE Downtime Calculator and SMED Changeover Optimizer were used.
Result: OEE rose to 61%, setup dropped to 12 minutes, scrap fell to 3%.
Annual savings: €850,000.
Customer: Ali Yilmaz, Production Manager, Izmir CNC Workshop`,
  parseButton: "Transform story",
  parsing: "Parsing…",
  advancedEditor: "Advanced editor",
  parseHint: "AI extracts challenge, solution, results, and metrics automatically.",
  parsedSectionTitle: "AI-filled fields (edit if needed)",
  fieldTitle: "Title",
  fieldIndustry: "Industry",
  fieldCountry: "Country",
  fieldCity: "City",
  fieldChallenge: "Challenge",
  fieldSolution: "Solution",
  fieldResults: "Results (metrics)",
  metricName: "Metric name",
  metricBefore: "Before",
  metricAfter: "After",
  removeMetric: "Remove metric row",
  addMetric: "Add metric",
  fieldTestimonial: "Customer quote",
  testimonialPlaceholder: "Customer quote…",
  publishButton: "Publish",
  publishing: "Publishing (6 locales)…",
  sourceLocaleLabel: "Story language",
  errorEmptyStory: "Please enter your story.",
  errorTitleRequired: "Title is required.",
  errorSession: "Admin session not found. Please sign in again.",
  errorParseFailed: "Could not parse the story.",
  errorConnection: "Connection error. Please try again.",
  errorPublishFailed: "Could not publish.",
  successParsed: "Story parsed. Edit fields if needed, then publish.",
  successPublished: "Success story published in all 6 locales.",
  apiError: {
    TEXT_TOO_SHORT: "Story is too short. Enter at least 20 characters.",
    TEXT_TOO_LONG: "Story is too long.",
    PARSE_FAILED: "Story could not be parsed. Please try again.",
    MISSING_API_KEY: "DeepSeek API key is not configured.",
    UNAUTHORIZED: "Unauthorized.",
    TRANSLATION_FAILED: "Could not translate to all locales.",
  },
};

const TR: AdminCaseStudyEditorMessages = {
  checkingSession: "Oturum kontrol ediliyor…",
  pageTitle: "Yeni basari hikayesi",
  pageSubtitle: "Hikayeni tek kutuya yapistir; AI alanlari otomatik doldursun.",
  backToList: "Listeye don",
  storyLabel: "Hikayeni yaz (AI otomatik ayristiracak)",
  storyPlaceholder: `Ornek:
A CNC workshop had OEE at 18%.
Setup time was 45 minutes, scrap rate was 8%.
SectorCalc OEE Downtime Calculator and SMED Changeover Optimizer were used.
Result: OEE rose to 61%, setup reduced to 12 minutes, scrap dropped to 3%.
Annual savings reached 850,000 USD.
Customer: Ali Yilmaz, Production Manager, Izmir CNC Workshop`,
  parseButton: "Hikayeyi Donustur",
  parsing: "Ayristiriliyor…",
  advancedEditor: "Gelismis editor",
  parseHint: "AI; Challenge, Solution, Results ve metrikleri otomatik cikarir.",
  parsedSectionTitle: "AI tarafindan doldurulan alanlar (istersen duzelt)",
  fieldTitle: "Baslik",
  fieldIndustry: "Sektor",
  fieldCountry: "Ulke",
  fieldCity: "Sehir",
  fieldChallenge: "Zorluk (Challenge)",
  fieldSolution: "Cozum (Solution)",
  fieldResults: "Sonuclar (Metrikler)",
  metricName: "Metrik adi",
  metricBefore: "Once",
  metricAfter: "Sonra",
  removeMetric: "Metrik satirini sil",
  addMetric: "Metrik ekle",
  fieldTestimonial: "Musteri gorusu",
  testimonialPlaceholder: "Musteri sozu…",
  publishButton: "Yayinla",
  publishing: "Yayinlaniyor (6 dil)…",
  sourceLocaleLabel: "Hikaye dili",
  errorEmptyStory: "Lutfen hikayeyi yazin.",
  errorTitleRequired: "Baslik zorunludur.",
  errorSession: "Manager oturumu bulunamadi. Lutfen tekrar giris yapin.",
  errorParseFailed: "Hikaye ayristirilamadi.",
  errorConnection: "Baglanti hatasi. Lutfen tekrar deneyin.",
  errorPublishFailed: "Yayinlanamadi.",
  successParsed: "Hikaye ayristirildi. Gerekirse duzenleyip yayinlayin.",
  successPublished: "Basari hikayesi 6 dilde yayinlandi.",
  apiError: {
    TEXT_TOO_SHORT: "Hikaye cok kisa. En az 20 karakter girin.",
    TEXT_TOO_LONG: "Hikaye cok uzun.",
    PARSE_FAILED: "Hikaye ayristirilamadi. Lutfen tekrar deneyin.",
    MISSING_API_KEY: "DeepSeek API anahtari yapilandirilmamis.",
    UNAUTHORIZED: "Yetkisiz erisim.",
    TRANSLATION_FAILED: "Tum dillere ceviri yapilamadi.",
  },
};

const DE: AdminCaseStudyEditorMessages = {
  checkingSession: "Sitzung wird gepruft…",
  pageTitle: "Neue Erfolgsgeschichte",
  pageSubtitle: "Geschichte in ein Feld einfugen - KI fullt die Felder automatisch aus.",
  backToList: "Zur Liste",
  storyLabel: "Geschichte schreiben (KI parst automatisch)",
  storyPlaceholder: EN.storyPlaceholder,
  parseButton: "Geschichte umwandeln",
  parsing: "Wird analysiert…",
  advancedEditor: "Erweiterter Editor",
  parseHint: "KI extrahiert Challenge, Solution, Results und Kennzahlen.",
  parsedSectionTitle: "KI-ausgefullte Felder (bei Bedarf bearbeiten)",
  fieldTitle: "Titel",
  fieldIndustry: "Branche",
  fieldCountry: "Land",
  fieldCity: "Stadt",
  fieldChallenge: "Herausforderung",
  fieldSolution: "Losung",
  fieldResults: "Ergebnisse (Kennzahlen)",
  metricName: "Kennzahl",
  metricBefore: "Vorher",
  metricAfter: "Nachher",
  removeMetric: "Kennzahlzeile entfernen",
  addMetric: "Kennzahl hinzufugen",
  fieldTestimonial: "Kundenzitat",
  testimonialPlaceholder: "Kundenzitat…",
  publishButton: "Veroffentlichen",
  publishing: "Veroffentlichen (6 Sprachen)…",
  sourceLocaleLabel: "Sprache der Geschichte",
  errorEmptyStory: "Bitte geben Sie die Geschichte ein.",
  errorTitleRequired: "Titel ist erforderlich.",
  errorSession: "Admin-Sitzung nicht gefunden. Bitte erneut anmelden.",
  errorParseFailed: "Geschichte konnte nicht analysiert werden.",
  errorConnection: "Verbindungsfehler. Bitte erneut versuchen.",
  errorPublishFailed: "Veroffentlichung fehlgeschlagen.",
  successParsed: "Geschichte analysiert. Bei Bedarf bearbeiten und veroffentlichen.",
  successPublished: "Erfolgsgeschichte in allen 6 Sprachen veroffentlicht.",
  apiError: {
    TEXT_TOO_SHORT: "Geschichte zu kurz. Mindestens 20 Zeichen.",
    TEXT_TOO_LONG: "Geschichte zu lang.",
    PARSE_FAILED: "Geschichte konnte nicht analysiert werden.",
    MISSING_API_KEY: "DeepSeek API-Schlussel nicht konfiguriert.",
    UNAUTHORIZED: "Nicht autorisiert.",
    TRANSLATION_FAILED: "Ubersetzung in alle Sprachen fehlgeschlagen.",
  },
};

const FR: AdminCaseStudyEditorMessages = {
  checkingSession: "Vérification de la session…",
  pageTitle: "Nouvelle success story",
  pageSubtitle: "Collez votre récit dans une zone - l'IA remplit les champs automatiquement.",
  backToList: "Retour à la liste",
  storyLabel: "Écrivez votre récit (l'IA l'analyse)",
  storyPlaceholder: EN.storyPlaceholder,
  parseButton: "Transformer le récit",
  parsing: "Analyse en cours…",
  advancedEditor: "Éditeur avancé",
  parseHint: "L'IA extrait challenge, solution, résultats et métriques.",
  parsedSectionTitle: "Champs remplis par l'IA (modifiables)",
  fieldTitle: "Titre",
  fieldIndustry: "Secteur",
  fieldCountry: "Pays",
  fieldCity: "Ville",
  fieldChallenge: "Défi",
  fieldSolution: "Solution",
  fieldResults: "Résultats (métriques)",
  metricName: "Métrique",
  metricBefore: "Avant",
  metricAfter: "Après",
  removeMetric: "Supprimer la ligne métrique",
  addMetric: "Ajouter une métrique",
  fieldTestimonial: "Témoignage client",
  testimonialPlaceholder: "Citation client…",
  publishButton: "Publier",
  publishing: "Publication (6 langues)…",
  sourceLocaleLabel: "Langue du récit",
  errorEmptyStory: "Veuillez saisir le récit.",
  errorTitleRequired: "Le titre est obligatoire.",
  errorSession: "Session admin introuvable. Reconnectez-vous.",
  errorParseFailed: "Impossible d'analyser le récit.",
  errorConnection: "Erreur de connexion. Réessayez.",
  errorPublishFailed: "Publication impossible.",
  successParsed: "Récit analysé. Modifiez si besoin, puis publiez.",
  successPublished: "Success story publiée dans les 6 langues.",
  apiError: {
    TEXT_TOO_SHORT: "Récit trop court. Au moins 20 caractères.",
    TEXT_TOO_LONG: "Récit trop long.",
    PARSE_FAILED: "Analyse du récit impossible.",
    MISSING_API_KEY: "Clé API DeepSeek non configurée.",
    UNAUTHORIZED: "Non autorisé.",
    TRANSLATION_FAILED: "Traduction vers toutes les langues impossible.",
  },
};

const ES: AdminCaseStudyEditorMessages = {
  checkingSession: "Comprobando sesión…",
  pageTitle: "Nueva historia de éxito",
  pageSubtitle: "Pega tu historia en un cuadro - la IA rellena los campos automáticamente.",
  backToList: "Volver a la lista",
  storyLabel: "Escribe tu historia (la IA la analiza)",
  storyPlaceholder: EN.storyPlaceholder,
  parseButton: "Transformar historia",
  parsing: "Analizando…",
  advancedEditor: "Editor avanzado",
  parseHint: "La IA extrae reto, solución, resultados y métricas.",
  parsedSectionTitle: "Campos rellenados por IA (editable)",
  fieldTitle: "Título",
  fieldIndustry: "Sector",
  fieldCountry: "País",
  fieldCity: "Ciudad",
  fieldChallenge: "Reto",
  fieldSolution: "Solución",
  fieldResults: "Resultados (métricas)",
  metricName: "Métrica",
  metricBefore: "Antes",
  metricAfter: "Después",
  removeMetric: "Eliminar fila de métrica",
  addMetric: "Añadir métrica",
  fieldTestimonial: "Testimonio del cliente",
  testimonialPlaceholder: "Cita del cliente…",
  publishButton: "Publicar",
  publishing: "Publicando (6 idiomas)…",
  sourceLocaleLabel: "Idioma de la historia",
  errorEmptyStory: "Introduce la historia.",
  errorTitleRequired: "El título es obligatorio.",
  errorSession: "Sesión de admin no encontrada. Inicia sesión de nuevo.",
  errorParseFailed: "No se pudo analizar la historia.",
  errorConnection: "Error de conexión. Inténtalo de nuevo.",
  errorPublishFailed: "No se pudo publicar.",
  successParsed: "Historia analizada. Edita si hace falta y publica.",
  successPublished: "Historia de éxito publicada en los 6 idiomas.",
  apiError: {
    TEXT_TOO_SHORT: "Historia demasiado corta. Mínimo 20 caracteres.",
    TEXT_TOO_LONG: "Historia demasiado larga.",
    PARSE_FAILED: "No se pudo analizar la historia.",
    MISSING_API_KEY: "Clave API DeepSeek no configurada.",
    UNAUTHORIZED: "No autorizado.",
    TRANSLATION_FAILED: "No se pudo traducir a todos los idiomas.",
  },
};

const AR: AdminCaseStudyEditorMessages = {
  checkingSession: "جارٍ التحقق من الجلسة…",
  pageTitle: "قصة نجاح جديدة",
  pageSubtitle: "الصق قصتك في مربع واحد - الذكاء الاصطناعي يملأ الحقول تلقائياً.",
  backToList: "العودة إلى القائمة",
  storyLabel: "اكتب قصتك (الذكاء الاصطناعي يحلّلها)",
  storyPlaceholder: EN.storyPlaceholder,
  parseButton: "تحويل القصة",
  parsing: "جارٍ التحليل…",
  advancedEditor: "محرر متقدم",
  parseHint: "يستخرج الذكاء الاصطناعي التحدي والحل والنتائج والمقاييس.",
  parsedSectionTitle: "حقول مملوءة بالذكاء الاصطناعي (يمكن التعديل)",
  fieldTitle: "العنوان",
  fieldIndustry: "القطاع",
  fieldCountry: "البلد",
  fieldCity: "المدينة",
  fieldChallenge: "التحدي",
  fieldSolution: "الحل",
  fieldResults: "النتائج (المقاييس)",
  metricName: "اسم المقياس",
  metricBefore: "قبل",
  metricAfter: "بعد",
  removeMetric: "حذف صف المقياس",
  addMetric: "إضافة مقياس",
  fieldTestimonial: "شهادة العميل",
  testimonialPlaceholder: "اقتباس العميل…",
  publishButton: "نشر",
  publishing: "جارٍ النشر (6 لغات)…",
  sourceLocaleLabel: "لغة القصة",
  errorEmptyStory: "يرجى إدخال القصة.",
  errorTitleRequired: "العنوان مطلوب.",
  errorSession: "لم يتم العثور على جلسة المسؤول. سجّل الدخول مجدداً.",
  errorParseFailed: "تعذّر تحليل القصة.",
  errorConnection: "خطأ في الاتصال. حاول مرة أخرى.",
  errorPublishFailed: "تعذّر النشر.",
  successParsed: "تم تحليل القصة. عدّل إن لزم ثم انشر.",
  successPublished: "تم نشر قصة النجاح بجميع اللغات الست.",
  apiError: {
    TEXT_TOO_SHORT: "القصة قصيرة جداً. 20 حرفاً على الأقل.",
    TEXT_TOO_LONG: "القصة طويلة جداً.",
    PARSE_FAILED: "تعذّر تحليل القصة.",
    MISSING_API_KEY: "مفتاح DeepSeek API غير مُعد.",
    UNAUTHORIZED: "غير مصرّح.",
    TRANSLATION_FAILED: "تعذّرت الترجمة إلى جميع اللغات.",
  },
};

export const ADMIN_CASE_STUDY_EDITOR_MESSAGES: Record<
  SupportedLocale,
  AdminCaseStudyEditorMessages
> = {
  en: EN,
};

export function getAdminCaseStudyEditorMessages(locale: string): AdminCaseStudyEditorMessages {
  if (isSupportedLocale(locale)) {
    return ADMIN_CASE_STUDY_EDITOR_MESSAGES[locale];
  }
  return ADMIN_CASE_STUDY_EDITOR_MESSAGES.en;
}

export function listAdminCaseStudyEditorLocales(): readonly SupportedLocale[] {
  return SUPPORTED_LOCALES;
}

export type AdminCaseStudyApiErrorCode = keyof AdminCaseStudyEditorMessages["apiError"];

export function isAdminCaseStudyApiErrorCode(value: string): value is AdminCaseStudyApiErrorCode {
  return value in ADMIN_CASE_STUDY_EDITOR_MESSAGES.en.apiError;
}
