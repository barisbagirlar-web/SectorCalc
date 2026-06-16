#!/usr/bin/env node
/**
 * Builds scripts/data/residual-field-label-locale.json for phrases that stay
 * EN-identical after glossary passes (deterministic pattern + manual overrides).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const BUNDLE_PATH = join(ROOT, "src/data/free-tool-inputs-i18n.generated.json");
const OUT_PATH = join(ROOT, "scripts/data/residual-field-label-locale.json");
const LOCALES = ["tr", "de", "fr", "es", "ar"];

const MANUAL = {
  "Source unit": {
    tr: "Kaynak birimi",
    de: "Quelleinheit",
    fr: "Unité source",
    es: "Unidad de origen",
    ar: "وحدة المصدر",
  },
  "Amount to convert": {
    de: "Umzurechnender Betrag",
    fr: "Montant à convertir",
    es: "Importe a convertir",
    ar: "المبلغ المراد تحويله",
  },
  "Step riser": {
    tr: "Basamak yükseltisi",
    de: "Stufenhöhe",
    fr: "Hauteur de marche",
    es: "Contrahuella",
    ar: "ارتفاع الدرجة",
  },
  "Step tread": {
    tr: "Basamak çıkıntısı",
    de: "Stufentiefe",
    fr: "Giron de marche",
    es: "Huella de escalón",
    ar: "عرض الدرجة",
  },
  "Life Expectancy": {
    tr: "Yaşam beklentisi",
    de: "Lebenserwartung",
    fr: "Espérance de vie",
    es: "Esperanza de vida",
    ar: "متوسط العمر المتوقع",
  },
  "Other Charges": {
    tr: "Diğer masraflar",
    de: "Sonstige Gebühren",
    fr: "Autres frais",
    es: "Otros cargos",
    ar: "رسوم أخرى",
  },
  Volume: {
    tr: "Hacim",
    de: "Volumen",
    fr: "Volume",
    es: "Volumen",
    ar: "الحجم",
  },
  Tariff: {
    tr: "Tarife",
    de: "Tarif",
    fr: "Tarif",
    es: "Arancel",
    ar: "التعريفة",
  },
  Hotels: { tr: "Oteller", de: "Hotels", fr: "Hôtels", es: "Hoteles", ar: "فنادق" },
  Meals: { tr: "Yemekler", de: "Mahlzeiten", fr: "Repas", es: "Comidas", ar: "وجبات" },
  Housing: { tr: "Konut", de: "Wohnen", fr: "Logement", es: "Vivienda", ar: "السكن" },
  Groceries: { tr: "Market", de: "Lebensmittel", fr: "Courses", es: "Comestibles", ar: "بقالة" },
  Commute: { tr: "İşe gidiş", de: "Pendeln", fr: "Trajet domicile-travail", es: "Desplazamiento", ar: "التنقل" },
  Bills: { tr: "Faturalar", de: "Rechnungen", fr: "Factures", es: "Facturas", ar: "فواتير" },
  Miscellaneous: {
    tr: "Muhtelif",
    de: "Sonstiges",
    fr: "Divers",
    es: "Varios",
    ar: "متفرقات",
  },
  "Savings goal": {
    tr: "Tasarruf hedefi",
    de: "Sparziel",
    fr: "Objectif d'épargne",
    es: "Meta de ahorro",
    ar: "هدف الادخار",
  },
  "Nominal APR": {
    tr: "Nominal yıllık oran",
    de: "Nominaler effektiver Jahreszins",
    fr: "TAEG nominal",
    es: "TAE nominal",
    ar: "المعدل السنوي الاسمي",
  },
  "Nominal dimension": {
    tr: "Nominal boyut",
    de: "Nennmaß",
    fr: "Dimension nominale",
    es: "Dimensión nominal",
    ar: "البعد الاسمي",
  },
  "Thermal transmittance": {
    tr: "Isı geçirgenliği",
    de: "Wärmedurchgangskoeffizient",
    fr: "Transmittance thermique",
    es: "Transmitancia térmica",
    ar: "النفاذية الحرارية",
  },
  "Breakage allowance": {
    tr: "Kırılma payı",
    de: "Bruchzuschlag",
    fr: "Marge de casse",
    es: "Margen de rotura",
    ar: "بدل الكسر",
  },
  "Pierce operations": {
    tr: "Delme işlemleri",
    de: "Einstechvorgänge",
    fr: "Opérations de perçage",
    es: "Operaciones de perforación",
    ar: "عمليات الثقب",
  },
  "Overhead allocated": {
    tr: "Tahsis edilen genel gider",
    de: "Zugerechnete Gemeinkosten",
    fr: "Frais généraux imputés",
    es: "Gastos generales asignados",
    ar: "المصاريف العامة المخصصة",
  },
  "Overhead to cover": {
    tr: "Karşılanacak genel gider",
    de: "Zu deckende Gemeinkosten",
    fr: "Frais généraux à couvrir",
    es: "Gastos generales a cubrir",
    ar: "المصاريف العامة المطلوب تغطيتها",
  },
  "Percentage to apply": {
    tr: "Uygulanacak yüzde",
    de: "Anzuwendender Prozentsatz",
    fr: "Pourcentage à appliquer",
    es: "Porcentaje a aplicar",
    ar: "النسبة المطبقة",
  },
  "Inside minus outside": {
    tr: "İç eksi dış",
    de: "Innen minus außen",
    fr: "Intérieur moins extérieur",
    es: "Interior menos exterior",
    ar: "الداخل ناقص الخارج",
  },
  "Gas, tips, abrasives": {
    tr: "Gaz, uçlar, aşındırıcılar",
    de: "Gas, Spitzen, Schleifmittel",
    fr: "Gaz, embouts, abrasifs",
    es: "Gas, puntas, abrasivos",
    ar: "غاز، رؤوس، مواد كاشطة",
  },
  "Installed DC kW": {
    tr: "Kurulu DC kW",
    de: "Installierte DC-kW",
    fr: "kW CC installés",
    es: "kW CC instalados",
    ar: "كيلوواط تيار مستمر المثبتة",
  },
  "Road fees": {
    tr: "Yol ücretleri",
    de: "Straßengebühren",
    fr: "Frais routiers",
    es: "Peajes",
    ar: "رسوم الطرق",
  },
  Expected: {
    tr: "Beklenen",
    de: "Erwarteter",
    fr: "Attendu",
    es: "Esperado",
    ar: "المتوقع",
  },
  "Modified Adjusted Gross Income (MAGI)": {
    tr: "Değiştirilmiş Brüt Gelir (MAGI)",
    de: "Modifiziertes bereinigtes Bruttoeinkommen (MAGI)",
    fr: "Revenu brut ajusté modifié (MAGI)",
    es: "Ingreso bruto ajustado modificado (MAGI)",
    ar: "إجمالي الدخل المعدل (MAGI)",
  },
  "IRA Balance ($)": {
    tr: "IRA bakiyesi ($)",
    de: "IRA-Saldo ($)",
    fr: "Solde IRA ($)",
    es: "Saldo IRA ($)",
    ar: "رصيد IRA ($)",
  },
  "Standard Part B Premium": {
    tr: "Standart B Bölümü primi",
    de: "Standard-Teil-B-Prämie",
    fr: "Prime standard Partie B",
    es: "Prima estándar Parte B",
    ar: "قسط الجزء B القياسي",
  },
  "Standard Part D Premium": {
    tr: "Standart D Bölümü primi",
    de: "Standard-Teil-D-Prämie",
    fr: "Prime standard Partie D",
    es: "Prima estándar Parte D",
    ar: "قسط الجزء D القياسي",
  },
};

const ORDINAL_ITEMS = {
  tr: ["İlk", "İkinci", "Üçüncü", "Dördüncü", "Beşinci"],
  de: ["Erster", "Zweiter", "Dritter", "Vierter", "Fünfter"],
  fr: ["Premier", "Deuxième", "Troisième", "Quatrième", "Cinquième"],
  es: ["Primer", "Segundo", "Tercer", "Cuarto", "Quinto"],
  ar: ["الأول", "الثاني", "الثالث", "الرابع", "الخامس"],
};

const ORDINAL_AXIS = {
  tr: ["Birinci", "İkinci", "Üçüncü", "Dördüncü", "Beşinci"],
  de: ["Erste", "Zweite", "Dritte", "Vierte", "Fünfte"],
  fr: ["Premier", "Deuxième", "Troisième", "Quatrième", "Cinquième"],
  es: ["Primera", "Segunda", "Tercera", "Cuarta", "Quinta"],
  ar: ["الأول", "الثاني", "الثالث", "الرابع", "الخامس"],
};

function patternLocale(phrase, locale) {
  const itemMatch = phrase.match(/^(First|Second|Third|Fourth|Fifth) item$/i);
  if (itemMatch) {
    const idx = ["first", "second", "third", "fourth", "fifth"].indexOf(itemMatch[1].toLowerCase());
    const ord = ORDINAL_ITEMS[locale][idx];
    if (locale === "tr") return `${ord} öğe`;
    if (locale === "de") return `${ord} Eintrag`;
    if (locale === "fr") return `${ord} élément`;
    if (locale === "es") return `${ord} elemento`;
    if (locale === "ar") return `${ord} بند`;
  }

  const axisMatch = phrase.match(/^(First|Second|Third|Fourth|Fifth) ([xy])$/i);
  if (axisMatch) {
    const idx = ["first", "second", "third", "fourth", "fifth"].indexOf(axisMatch[1].toLowerCase());
    const ord = ORDINAL_AXIS[locale][idx];
    const axis = axisMatch[2].toLowerCase();
    if (locale === "tr") return `${ord} ${axis}`;
    if (locale === "de") return `${ord} ${axis.toUpperCase()}`;
    if (locale === "fr") return `${ord} ${axis}`;
    if (locale === "es") return `${ord} ${axis}`;
    if (locale === "ar") return `${axis} ${ord}`;
  }

  return null;
}

const bundle = JSON.parse(readFileSync(BUNDLE_PATH, "utf8"));
const phrases = new Set();
for (const fields of Object.values(bundle.en ?? {})) {
  for (const copy of Object.values(fields ?? {})) {
    for (const part of ["label", "helper", "placeholder"]) {
      const value = copy?.[part];
      if (typeof value === "string" && value.trim()) {
        phrases.add(value.trim());
      }
    }
  }
}

const out = Object.fromEntries(LOCALES.map((locale) => [locale, {}]));

for (const phrase of phrases) {
  for (const locale of LOCALES) {
    if (MANUAL[phrase]?.[locale]) {
      out[locale][phrase] = MANUAL[phrase][locale];
      continue;
    }

    const patterned = patternLocale(phrase, locale);
    if (patterned) {
      out[locale][phrase] = patterned;
    }
  }
}

const existing = existsSync(OUT_PATH) ? JSON.parse(readFileSync(OUT_PATH, "utf8")) : {};
for (const locale of LOCALES) {
  out[locale] = { ...(existing[locale] ?? {}), ...out[locale] };
}

writeFileSync(OUT_PATH, `${JSON.stringify(out, null, 2)}\n`, "utf8");
let count = 0;
for (const locale of LOCALES) {
  count += Object.keys(out[locale]).length;
}
console.log(`build-residual-field-label-locale: entries=${count}`);
