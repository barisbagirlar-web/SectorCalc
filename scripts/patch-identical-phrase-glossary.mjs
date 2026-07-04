#!/usr/bin/env node
/**
 * Adds calculator-word-glossary entries for phrases that remain EN-identical in de/fr/es/ar.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const TARGET = join(ROOT, "archive/migration-only/scripts/data/calculator-word-glossary.json");
const LOCALES = ["tr", "de", "fr", "es", "ar"];

const PHRASES = {
  "Wall surface": {
    de: "Wandfläche",
    fr: "Surface murale",
    es: "Superficie de muro",
    ar: "سطح الجدار",
  },
  "Starting amount": {
    de: "Anfangsbetrag",
    fr: "Montant initial",
    es: "Importe inicial",
    ar: "المبلغ الابتدائي",
  },
  "Time horizon": {
    de: "Zeithorizont",
    fr: "Horizon temporel",
    es: "Horizonte temporal",
    ar: "الأفق الزمني",
  },
  "Return amount": {
    de: "Ertragsbetrag",
    fr: "Montant de rendement",
    es: "Importe de rendimiento",
    ar: "مبلغ العائد",
  },
  "Compounding frequency": {
    de: "Zinseszinsfrequenz",
    fr: "Fréquence de capitalisation",
    es: "Frecuencia de capitalización",
    ar: "تكرار الفائدة المركبة",
  },
  "Source scale": {
    de: "Quellskala",
    fr: "Échelle source",
    es: "Escala de origen",
    ar: "مقياس المصدر",
  },
  "Expected Value": {
    tr: "Expected değer",
    de: "Erwartungswert",
    fr: "Valeur attendue",
    es: "Valor esperado",
    ar: "القيمة المتوقعة",
  },
  "Expected Resale value": {
    tr: "Expected yeniden satış değeri",
    de: "Erwarteter Wiederverkaufswert",
    fr: "Valeur de revente attendue",
    es: "Valor de reventa esperado",
    ar: "قيمة إعادة البيع المتوقعة",
  },
  "Expected annual rent growth": {
    tr: "Expected yıllık rent artışı",
    de: "Erwartetes jährliches Mietwachstum",
    fr: "Croissance annuelle attendue du loyer",
    es: "Crecimiento anual esperado del alquiler",
    ar: "النمو السنوي المتوقع للإيجار",
  },
  "Expected Annual Growth Rate": {
    tr: "Expected yıllık büyüme ratioı",
    de: "Erwartete jährliche Wachstumsrate",
    fr: "Taux de croissance annuel attendu",
    es: "Tasa de crecimiento anual esperada",
    ar: "معدل النمو السنوي المتوقع",
  },
  "Expected Future Tax Rate in Retirement": {
    tr: "Emeklilikte expected future tax ratioı",
    de: "Erwarteter Steuersatz im Ruhestand",
    fr: "Taux d'imposition futur attendu à la retraite",
    es: "Tasa impositiva futura esperada en la jubilación",
    ar: "معدل الضريبة المتوقع في التقاعد",
  },
  "Source scale": {
    tr: "Resource ölçeği",
    de: "Quellskala",
    fr: "Échelle source",
    es: "Escala de origen",
    ar: "مقياس المصدر",
  },
  "Initial investment": {
    tr: "Başlangıç yatırımı",
    de: "Anfangsinvestition",
    fr: "Investissement initial",
    es: "Inversión inicial",
    ar: "الاستثمار الأولي",
  },
  "Monthly gross": {
    tr: "Aylık brüt",
    de: "Monatlich brutto",
    fr: "Brut mensuel",
    es: "Bruto mensual",
    ar: "الإجمالي الشهري",
  },
  "Expected resale": {
    tr: "Expected yeniden satış",
    de: "Erwarteter Wiederverkauf",
    fr: "Revente attendue",
    es: "Reventa esperada",
    ar: "إعادة البيع المتوقعة",
  },
  "Expected yearly rent growth": {
    tr: "Expected yıllık rent artışı",
    de: "Erwartetes jährliches Mietwachstum",
    fr: "Croissance annuelle attendue du loyer",
    es: "Crecimiento anual esperado del alquiler",
    ar: "النمو السنوي المتوقع للإيجار",
  },
  "Expected yield": {
    tr: "Expected efficiency",
    de: "Erwarteter Ertrag",
    fr: "Rendement attendu",
    es: "Rendimiento esperado",
    ar: "المحصول المتوقع",
  },
  "Expected proportion": {
    tr: "Expected ratio",
    de: "Erwarteter Anteil",
    fr: "Proportion attendue",
    es: "Proporción esperada",
    ar: "النسبة المتوقعة",
  },
  "Available hours": {
    tr: "Useılabilir saat",
    de: "Verfügbare Stunden",
    fr: "Heures disponibles",
    es: "Horas disponibles",
    ar: "الساعات المتاحة",
  },
  "Input material": {
    tr: "Input material",
    de: "Eingangsmaterial",
    fr: "Matière entrante",
    es: "Material de entrada",
    ar: "مادة الإدخال",
  },
  "Fuel input": {
    tr: "Yakıt input",
    de: "Brennstoffeingabe",
    fr: "Entrée de combustible",
    es: "Entrada de combustible",
    ar: "مدخل الوقود",
  },
  "External Operations Percentage": {
    tr: "Harici Operasyon Yüzdesi",
    de: "Anteil externer Vorgänge",
    fr: "Pourcentage d'opérations externes",
    es: "Porcentaje de operaciones externas",
    ar: "نسبة العمليات الخارجية",
  },
  "Waste Motion Factor": {
    tr: "Atık Hareket Faktörü",
    de: "Verschwendungsfaktor Bewegung",
    fr: "Facteur de mouvement gaspillé",
    es: "Factor de movimiento desperdiciado",
    ar: "عامل الحركة المهدرة",
  },
  "Reduction Percentage": {
    tr: "İyileştirme Yüzdesi",
    de: "Reduktionsprozentsatz",
    fr: "Pourcentage de réduction",
    es: "Porcentaje de reducción",
    ar: "نسبة التخفيض",
  },
  "Nondeductible Contributions": {
    de: "Nicht abzugsfähige Beiträge",
    fr: "Contributions non déductibles",
    es: "Contribuciones no deducibles",
    ar: "مساهمات غير قابلة للخصم",
  },
  "Deferral Periods": {
    de: "Aufschubperioden",
    fr: "Périodes de report",
    es: "Períodos de aplazamiento",
    ar: "فترات التأجيل",
  },
  "Marital Deduction": {
    de: "Ehegattenabzug",
    fr: "Déduction conjugale",
    es: "Deducción marital",
    ar: "خصم الزوجية",
  },
  "Charitable Deduction": {
    de: "Spendenabzug",
    fr: "Déduction caritative",
    es: "Deducción caritativa",
    ar: "خصم خيري",
  },
  "Additional Surcharge (%)": {
    de: "Zusätzlicher Zuschlag (%)",
    fr: "Supplément additionnel (%)",
    es: "Recargo adicional (%)",
    ar: "رسوم إضافية (%)",
  },
  "Account Balance ($)": {
    de: "Kontostand ($)",
    fr: "Solde du compte ($)",
    es: "Saldo de la cuenta ($)",
    ar: "رصيد الحساب ($)",
  },
  "Spousal Allowance": {
    de: "Ehegattenfreibetrag",
    fr: "Abattement conjugal",
    es: "Asignación conyugal",
    ar: "بدل الزوج",
  },
  "Deductible ($)": {
    de: "Abzugsfähig ($)",
    fr: "Déductible ($)",
    es: "Deducible ($)",
    ar: "قابل للخصم ($)",
  },
  "Initial Coinsurance (%)": {
    de: "Anfängliche Kostenbeteiligung (%)",
    fr: "Coassurance initiale (%)",
    es: "Coseguro inicial (%)",
    ar: "التأمين المشترك الأولي (%)",
  },
  "Catastrophic Copay ($)": {
    de: "Katastrophale Zuzahlung ($)",
    fr: "Quote-part catastrophique ($)",
    es: "Copago catastrófico ($)",
    ar: "الدفع المشترك الكارثي ($)",
  },
  "Full Retirement Age": {
    de: "Volles Rentenalter",
    fr: "Âge de la retraite à taux plein",
    es: "Edad de jubilación plena",
    ar: "سن التقاعد الكامل",
  },
  "Claiming Age": {
    de: "Beantragungsalter",
    fr: "Âge de demande",
    es: "Edad de solicitud",
    ar: "عمر المطالبة",
  },
  "Spouse's Age Relative to Full Retirement Age (FRA)": {
    de: "Alter des Ehepartners relativ zum vollen Rentenalter (FRA)",
    fr: "Âge du conjoint par rapport à l'âge de la retraite à taux plein (FRA)",
    es: "Edad del cónyuge respecto a la edad de jubilación plena (FRA)",
    ar: "عمر الزوج بالنسبة لسن التقاعد الكامل (FRA)",
  },
  "Spouse's Own Retirement Benefit": {
    de: "Eigener Rentenanspruch des Ehepartners",
    fr: "Prestation de retraite propre du conjoint",
    es: "Beneficio de jubilación propio del cónyuge",
    ar: "مزايا تقاعد الزوج الخاصة",
  },
  "Deceased Worker's AIME": {
    de: "AIME des verstorbenen Arbeitnehmers",
    fr: "AIME du travailleur décédé",
    es: "AIME del trabajador fallecido",
    ar: "AIME العامل المتوفى",
  },
  "Duty-Free Allowance": {
    de: "Zollfreier Freibetrag",
    fr: "Franchise hors taxes",
    es: "Franquicia libre de impuestos",
    ar: "بدل الإعفاء الجمركي",
  },
  "Additional Duties": {
    de: "Zusätzliche Abgaben",
    fr: "Droits supplémentaires",
    es: "Aranceles adicionales",
    ar: "رسوم إضافية",
  },
  Volume: {
    de: "Volumen",
    fr: "Volume",
    es: "Volumen",
    ar: "الحجم",
  },
};

const data = JSON.parse(readFileSync(TARGET, "utf8"));
let changed = 0;

for (const [phrase, locales] of Object.entries(PHRASES)) {
  for (const locale of LOCALES) {
    data[locale] ??= {};
    const value = locales[locale];
    if (value && data[locale][phrase] !== value) {
      data[locale][phrase] = value;
      changed += 1;
    }
  }
}

writeFileSync(TARGET, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`patch-identical-phrase-glossary: changed=${changed}`);
