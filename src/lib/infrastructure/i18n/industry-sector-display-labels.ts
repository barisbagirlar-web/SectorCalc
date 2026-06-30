import type { IndustrySlug } from "@/lib/features/tools/industry-registry";
import { industryRegistry } from "@/lib/features/tools/industry-registry";
import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";
import { SUPPORTED_LOCALES } from "@/lib/infrastructure/i18n/locale-config";

type LocaleLabelMap = Readonly<Record<SupportedLocale, string>>;

function buildEnglishIndustryLabels(): Record<IndustrySlug, string> {
  const labels = {} as Record<IndustrySlug, string>;
  for (const entry of industryRegistry) {
    labels[entry.slug] = entry.name;
  }
  return labels;
}

const EN_INDUSTRY_LABELS = buildEnglishIndustryLabels();

/** Localized display names for all 27 industry sector slugs (6 locales). */
export const INDUSTRY_SECTOR_DISPLAY_LABELS: Readonly<
  Record<IndustrySlug, LocaleLabelMap>
> = {
  "cnc-manufacturing": {
    en: EN_INDUSTRY_LABELS["cnc-manufacturing"],
    tr: "CNC / İmalat",
    de: "CNC / Fertigung",
    fr: "CNC / Fabrication",
    es: "CNC / Fabricación",
    ar: "CNC / التصنيع",
  },
  construction: {
    en: EN_INDUSTRY_LABELS.construction,
    tr: "İnşaat",
    de: "Bauwesen",
    fr: "Construction",
    es: "Construcción",
    ar: "البناء",
  },
  cleaning: {
    en: EN_INDUSTRY_LABELS.cleaning,
    tr: "Temizlik",
    de: "Reinigung",
    fr: "Nettoyage",
    es: "Limpieza",
    ar: "التنظيف",
  },
  restaurant: {
    en: EN_INDUSTRY_LABELS.restaurant,
    tr: "Restoran",
    de: "Gastronomie",
    fr: "Restauration",
    es: "Restauración",
    ar: "المطاعم",
  },
  ecommerce: {
    en: EN_INDUSTRY_LABELS.ecommerce,
    tr: "E-ticaret",
    de: "E-Commerce",
    fr: "Commerce en ligne",
    es: "Comercio electrónico",
    ar: "التجارة الإلكترونية",
  },
  "welding-fabrication": {
    en: EN_INDUSTRY_LABELS["welding-fabrication"],
    tr: "Kaynak & Fabrikasyon",
    de: "Schweißen & Fertigung",
    fr: "Soudure et fabrication",
    es: "Soldadura y fabricación",
    ar: "اللحام والتصنيع",
  },
  hvac: {
    en: EN_INDUSTRY_LABELS.hvac,
    tr: "HVAC",
    de: "HLK",
    fr: "CVC",
    es: "HVAC",
    ar: "تكييف HVAC",
  },
  "electrical-contracting": {
    en: EN_INDUSTRY_LABELS["electrical-contracting"],
    tr: "Elektrik Taahhüt",
    de: "Elektroinstallation",
    fr: "Électricité",
    es: "Electricidad",
    ar: "المقاولات الكهربائية",
  },
  "landscaping-lawn-care": {
    en: EN_INDUSTRY_LABELS["landscaping-lawn-care"],
    tr: "Peyzaj & Bahçe",
    de: "Landschaftsbau",
    fr: "Aménagement paysager",
    es: "Paisajismo",
    ar: "تنسيق الحدائق",
  },
  "auto-repair-shop": {
    en: EN_INDUSTRY_LABELS["auto-repair-shop"],
    tr: "Oto Tamir",
    de: "Autowerkstatt",
    fr: "Garage auto",
    es: "Taller mecánico",
    ar: "ورشة السيارات",
  },
  "printing-signage": {
    en: EN_INDUSTRY_LABELS["printing-signage"],
    tr: "Baskı & Tabela",
    de: "Druck & Beschilderung",
    fr: "Impression et signalétique",
    es: "Impresión y rotulación",
    ar: "الطباعة واللافتات",
  },
  plumbing: {
    en: EN_INDUSTRY_LABELS.plumbing,
    tr: "Tesisat",
    de: "Sanitär",
    fr: "Plomberie",
    es: "Fontanería",
    ar: "السباكة",
  },
  "carpentry-millwork": {
    en: EN_INDUSTRY_LABELS["carpentry-millwork"],
    tr: "Marangozluk",
    de: "Schreinerei",
    fr: "Menuiserie",
    es: "Carpintería",
    ar: "النجارة",
  },
  roofing: {
    en: EN_INDUSTRY_LABELS.roofing,
    tr: "Çatı",
    de: "Dachdecker",
    fr: "Couverture",
    es: "Cubiertas",
    ar: "الأسقف",
  },
  painting: {
    en: EN_INDUSTRY_LABELS.painting,
    tr: "Boyama",
    de: "Malerarbeiten",
    fr: "Peinture",
    es: "Pintura",
    ar: "الدهان",
  },
  "sheet-metal": {
    en: EN_INDUSTRY_LABELS["sheet-metal"],
    tr: "Sac Metal",
    de: "Blechbearbeitung",
    fr: "Tôlerie",
    es: "Chapa metálica",
    ar: "الصفائح المعدنية",
  },
  "3d-printing-service": {
    en: EN_INDUSTRY_LABELS["3d-printing-service"],
    tr: "3B Baskı",
    de: "3D-Druck",
    fr: "Impression 3D",
    es: "Impresión 3D",
    ar: "الطباعة ثلاثية الأبعاد",
  },
  "logistics-transport": {
    en: EN_INDUSTRY_LABELS["logistics-transport"],
    tr: "Lojistik & Taşıma",
    de: "Logistik & Transport",
    fr: "Logistique et transport",
    es: "Logística y transporte",
    ar: "اللوجستيات والنقل",
  },
  "agriculture-crops": {
    en: EN_INDUSTRY_LABELS["agriculture-crops"],
    tr: "Tarım / Mahsul",
    de: "Landwirtschaft / Ernte",
    fr: "Agriculture / cultures",
    es: "Agricultura / cultivos",
    ar: "الزراعة / المحاصيل",
  },
  "agriculture-irrigation": {
    en: EN_INDUSTRY_LABELS["agriculture-irrigation"],
    tr: "Sulama",
    de: "Bewässerung",
    fr: "Irrigation",
    es: "Riego",
    ar: "الري",
  },
  "agriculture-feed": {
    en: EN_INDUSTRY_LABELS["agriculture-feed"],
    tr: "Yem & Besleme",
    de: "Futtermittel",
    fr: "Alimentation animale",
    es: "Piensos",
    ar: "الأعلاف",
  },
  "agriculture-dairy": {
    en: EN_INDUSTRY_LABELS["agriculture-dairy"],
    tr: "Süt & Süt Ürünleri",
    de: "Milchwirtschaft",
    fr: "Produits laitiers",
    es: "Lácteos",
    ar: "الألبان",
  },
  "energy-consumption": {
    en: EN_INDUSTRY_LABELS["energy-consumption"],
    tr: "Enerji Tüketimi",
    de: "Energieverbrauch",
    fr: "Consommation d'énergie",
    es: "Consumo energético",
    ar: "استهلاك الطاقة",
  },
  "energy-carbon": {
    en: EN_INDUSTRY_LABELS["energy-carbon"],
    tr: "Enerji & Karbon",
    de: "Energie & CO₂",
    fr: "Énergie et carbone",
    es: "Energía y carbono",
    ar: "الطاقة والكربون",
  },
  "daily-renovation": {
    en: EN_INDUSTRY_LABELS["daily-renovation"],
    tr: "Günlük / Tadilat",
    de: "Alltag / Renovierung",
    fr: "Quotidien / rénovation",
    es: "Vida diaria / reformas",
    ar: "الحياة اليومية / التجديد",
  },
  "daily-fuel": {
    en: EN_INDUSTRY_LABELS["daily-fuel"],
    tr: "Yakıt",
    de: "Kraftstoff",
    fr: "Carburant",
    es: "Combustible",
    ar: "الوقود",
  },
  "daily-meals": {
    en: EN_INDUSTRY_LABELS["daily-meals"],
    tr: "Yemek & Mutfak",
    de: "Mahlzeiten",
    fr: "Repas",
    es: "Comidas",
    ar: "الوجبات",
  },
};

export function resolveIndustrySectorDisplayLabel(slug: string, locale: string): string | null {
  const labels = INDUSTRY_SECTOR_DISPLAY_LABELS[slug as IndustrySlug];
  if (!labels) {
    return null;
  }
  const normalized = locale.toLowerCase() as SupportedLocale;
  if (SUPPORTED_LOCALES.includes(normalized)) {
    return labels[normalized];
  }
  return labels.en;
}
