#!/usr/bin/env node
/** Adds catalogExplorer.functionCategories + contentAuthority.premium bullets for de/fr/es/ar. */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const FUNCTION_CATEGORIES = {
  de: {
    "oee-productivity": {
      label: "OEE & Produktivität",
      description: "Rüstzeit, Taktzeit, Maschinensätze und Shopfloor-Durchsatz.",
    },
    "scrap-waste": {
      label: "Ausschuss, Verschwendung & Materialverlust",
      description: "Ausschussquote, Materialverlust, Ertragsverlust und Nacharbeit.",
    },
    "cost-margin": {
      label: "Kosten, Marge & Rentabilität",
      description: "Marge, Break-even, Stückkosten, Rezept- und Menügewinnprüfungen.",
    },
    "routing-logistics": {
      label: "Route, Logistik & Kraftstoff",
      description: "Routenkosten, Kraftstoff, Fracht, Volumengewicht und Liefermarge.",
    },
    "energy-carbon": {
      label: "Energie, CO₂ & Compliance",
      description: "kWh-Kosten, Spitzenlast, CO₂-Fußabdruck und Compliance-Risiko.",
    },
    "measurement-units": {
      label: "Messung, Kalibrierung & Einheiten",
      description: "Einheitenumrechnung, Toleranzabweichung, Kalibrierungsrisiko und Statistik.",
    },
    "finance-business": {
      label: "Finanzen & Unternehmen",
      description: "Kredite, Zinsen, MwSt., Personalkosten und Cashflow-Lücken.",
    },
    "construction-field": {
      label: "Bau & Baustellenkalkulation",
      description: "Beton, Dach, Farbe, Fliesen und Projektkostenschätzungen.",
    },
    "daily-practical": {
      label: "Alltags- & Praxisrechner",
      description: "Budget, Reise, Trinkgeld und Datumsrechner für den Alltag.",
    },
  },
  fr: {
    "oee-productivity": {
      label: "OEE et productivité",
      description: "Temps de réglage, temps de cycle, taux machine et débit atelier.",
    },
    "scrap-waste": {
      label: "Rebut, gaspillage et perte matière",
      description: "Taux de rebut, perte matière, perte de rendement et reprise.",
    },
    "cost-margin": {
      label: "Coût, marge et rentabilité",
      description: "Marge, seuil de rentabilité, coût unitaire et contrôles menu/recette.",
    },
    "routing-logistics": {
      label: "Route, logistique et carburant",
      description: "Coût de route, carburant, fret, volumétrie et marge livraison.",
    },
    "energy-carbon": {
      label: "Énergie, carbone et conformité",
      description: "Coût kWh, pointe, empreinte carbone et exposition conformité.",
    },
    "measurement-units": {
      label: "Mesure, étalonnage et unités",
      description: "Conversion d'unités, dérive de tolérance, risque d'étalonnage et statistiques.",
    },
    "finance-business": {
      label: "Finance et entreprise",
      description: "Prêts, intérêts, TVA, coût salarial et écarts de trésorerie.",
    },
    "construction-field": {
      label: "Construction et chantier",
      description: "Béton, toiture, peinture, carrelage et estimations de projet.",
    },
    "daily-practical": {
      label: "Calculatrices pratiques du quotidien",
      description: "Budget, voyage, pourboire et calculs de dates courants.",
    },
  },
  es: {
    "oee-productivity": {
      label: "OEE y productividad",
      description: "Tiempo de preparación, ciclo, tarifas de máquina y rendimiento en planta.",
    },
    "scrap-waste": {
      label: "Merma, desperdicio y pérdida de material",
      description: "Tasa de merma, desperdicio, pérdida de rendimiento y reproceso.",
    },
    "cost-margin": {
      label: "Coste, margen y rentabilidad",
      description: "Margen, punto de equilibrio, coste unitario y menú/receta.",
    },
    "routing-logistics": {
      label: "Ruta, logística y combustible",
      description: "Coste de ruta, combustible, flete, volumen y margen de entrega.",
    },
    "energy-carbon": {
      label: "Energía, carbono y cumplimiento",
      description: "Coste kWh, punta, huella de carbono y exposición normativa.",
    },
    "measurement-units": {
      label: "Medición, calibración y unidades",
      description: "Conversión de unidades, deriva de tolerancia, calibración y estadística.",
    },
    "finance-business": {
      label: "Finanzas y empresa",
      description: "Préstamos, interés, IVA, coste laboral y brechas de caja.",
    },
    "construction-field": {
      label: "Construcción y obra",
      description: "Hormigón, cubierta, pintura, baldosa y estimaciones de proyecto.",
    },
    "daily-practical": {
      label: "Calculadoras prácticas diarias",
      description: "Presupuesto, viaje, propina y calculadoras de fechas cotidianas.",
    },
  },
};

const PREMIUM_BULLETS = {
  de: {
    decidesBody:
      "Nutzen Sie diesen Rechner, wenn Sie entscheiden müssen, ob die Eingaben in akzeptablen Risikobändern liegen, welcher Treiber zuerst geprüft werden soll und ob Sie vor Wiederholung neu kalkulieren oder umplanen sollten.",
    reportBullet1: "Executive Summary mit Schwellenstatus",
    reportBullet2: "Aufschlüsselung versteckter Verlusttreiber",
    reportBullet3: "Empfohlene Maßnahmen und Annahmenhinweise",
    reportBullet4: "Exportfähiges PDF und CSV bei bezahltem Zugang",
  },
  fr: {
    decidesBody:
      "Utilisez ce calculateur pour décider si les entrées restent dans des bandes d'exposition acceptables, quel facteur investiguer en premier et s'il faut repricer ou replanifier avant de recommencer.",
    reportBullet1: "Résumé exécutif avec statut de seuil",
    reportBullet2: "Décomposition des facteurs de perte cachés",
    reportBullet3: "Actions suggérées et notes d'hypothèses",
    reportBullet4: "PDF et CSV exportables avec accès payant",
  },
  es: {
    decidesBody:
      "Use esta calculadora cuando deba decidir si las entradas están en bandas de exposición aceptables, qué factor investigar primero y si debe repricing o replanificar antes de repetir el trabajo.",
    reportBullet1: "Resumen ejecutivo con estado de umbral",
    reportBullet2: "Desglose de impulsores de pérdida ocultos",
    reportBullet3: "Acciones sugeridas y notas de supuestos",
    reportBullet4: "PDF y CSV exportables con acceso de pago",
  },
  ar: {
    decidesBody:
      "استخدم هذه الحاسبة عندما تحتاج إلى تقرير ما إذا كانت المدخلات ضمن نطاقات التعرض المقبولة، وأي عامل تفحصه أولاً، وهل تعيد التسعير أو إعادة الجدولة قبل تكرار العمل.",
    reportBullet1: "ملخص تنفيذي مع حالة العتبات",
    reportBullet2: "تفصيل عوامل الخسارة الخفية",
    reportBullet3: "إجراءات مقترحة وملاحظات الافتراضات",
    reportBullet4: "PDF وCSV جاهزان للتصدير مع الوصول المدفوع",
  },
};

for (const locale of ["de", "fr", "es"]) {
  const path = join(ROOT, "messages", `${locale}.json`);
  const data = JSON.parse(readFileSync(path, "utf8"));
  data.catalogExplorer.functionCategories = FUNCTION_CATEGORIES[locale];
  Object.assign(data.contentAuthority.premium, PREMIUM_BULLETS[locale]);
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Patched messages/${locale}.json`);
}

const arPath = join(ROOT, "messages", "ar.json");
const arData = JSON.parse(readFileSync(arPath, "utf8"));
Object.assign(arData.contentAuthority.premium, PREMIUM_BULLETS.ar);
writeFileSync(arPath, `${JSON.stringify(arData, null, 2)}\n`, "utf8");
console.log("Patched messages/ar.json");
