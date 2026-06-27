#!/usr/bin/env node
/**
 * Builds complete DE/FR/ES/AR field-label map from catalog + glossaries.
 * Target: TR-level parity — no meaningful EN-identical labels.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const ROOT = join(import.meta.dirname, "..");
const OUT = join(ROOT, "scripts/data/calculator-field-labels-i18n.json");

const CATALOG_PATHS = [
  "src/lib/tools/free-traffic-catalog.generated.json",
  "src/lib/tools/roadmap-free-batch1-catalog.generated.json",
  "src/lib/tools/roadmap-free-batch2-catalog.generated.json",
];

const WORD_GLOSSARY = JSON.parse(
  readFileSync(join(ROOT, "scripts/data/calculator-word-glossary.json"), "utf8"),
);
const EXPAND = JSON.parse(
  readFileSync(join(ROOT, "scripts/data/calculator-glossary-expand.json"), "utf8"),
);
const PHRASE_GLOSSARY = JSON.parse(
  readFileSync(join(ROOT, "src/data/calculator-phrase-glossary.json"), "utf8"),
);

const TARGET_LOCALES = ["de", "fr", "es", "ar"];

function loadPremiumSchemaLabels() {
  try {
    const raw = execSync("npx tsx scripts/export-premium-schema-inputs.ts", {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "inherit"],
    });
    const tools = JSON.parse(raw);
    const labels = new Set();
    for (const tool of tools) {
      for (const input of tool.inputs ?? []) {
        if (input.label?.trim()) {
          labels.add(input.label.trim());
        }
      }
    }
    return labels;
  } catch {
    return new Set();
  }
}

function loadCatalogLabels() {
  const labels = new Set();
  for (const rel of CATALOG_PATHS) {
    const tools = JSON.parse(readFileSync(join(ROOT, rel), "utf8"));
    for (const tool of tools) {
      for (const input of tool.inputs ?? []) {
        if (input.label?.trim()) {
          labels.add(input.label.trim());
        }
      }
    }
  }
  for (const label of loadPremiumSchemaLabels()) {
    labels.add(label);
  }
  return [...labels].sort();
}

function sortedEntries(locale) {
  const merged = {
    ...(EXPAND[locale] ?? {}),
    ...(WORD_GLOSSARY[locale] ?? {}),
    ...(PHRASE_GLOSSARY[locale] ?? {}),
  };
  return Object.entries(merged).sort((a, b) => b[0].length - a[0].length);
}

function composePhrase(phrase, locale) {
  if (!phrase || locale === "en") {
    return phrase;
  }
  const merged = {
    ...(EXPAND[locale] ?? {}),
    ...(WORD_GLOSSARY[locale] ?? {}),
    ...(PHRASE_GLOSSARY[locale] ?? {}),
  };
  if (merged[phrase]) {
    return merged[phrase];
  }
  let result = phrase;
  for (const [en, localized] of sortedEntries(locale)) {
    const pattern = /^\w+$/.test(en)
      ? "\\b" + en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b"
      : en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(pattern, "gi");
    result = result.replace(re, localized);
  }
  return result === phrase ? null : result;
}

const INTERNATIONAL_COGNATES = new Set([
  "A",
  "B",
  "C",
  "DPMO",
  "OEE",
  "kg/m",
  "Minimum",
  "Maximum",
  "Million",
  "Radius",
  "Volume",
  "Transport",
  "Divisor",
  "Population",
  "Performance",
  "Distance",
  "Factor",
  "Minutes",
  "Module",
  "Base",
  "Material",
  "Total",
  "Favorable",
  "Proportion",
  "Dosage",
  "Portions",
  "Inspection",
]);

function isTechnicalToken(label) {
  return (
    /^[A-Z0-9²³%/.\-]+$/.test(label) ||
    label.length <= 2 ||
    INTERNATIONAL_COGNATES.has(label)
  );
}

/** Manual overrides for labels word-compose cannot split reliably. */
const MANUAL_OVERRIDES = {
  de: {
    "Access factor": "Zugangsfaktor",
    "Actual": "Istwert",
    "Age factor": "Altersfaktor",
    "Allowable stress": "Zulässige Spannung",
    "Attenuation": "Dämpfung",
    "Base A": "Basis A",
    "Base B": "Basis B",
    "Battery capacity": "Batteriekapazität",
    "Beam capacity": "Tragfähigkeit",
    "Bill": "Rechnung",
    "Capacity factor": "Kapazitätsfaktor",
    "Constant": "Konstante",
    "Cows": "Kühe",
    "Deflection": "Durchbiegung",
    "Denominator": "Nenner",
    "Document count": "Dokumentanzahl",
    "Dosage": "Dosierung",
    "Down payment": "Anzahlung",
    "Drill factor": "Bohrfaktor",
    "Efficiency": "Wirkungsgrad",
    "Emission factor": "Emissionsfaktor",
    "Emissions": "Emissionen",
    "Engine displacement": "Hubraum",
    "FX move": "Wechselkursbewegung",
    "Factor": "Faktor",
    "Favorable": "Günstig",
    "Feed": "Vorschub",
    "Feed/tooth": "Vorschub/Zahn",
    "Fill time": "Füllzeit",
    "Fine amount": "Bußgeldbetrag",
    "Fixed fee": "Fixgebühr",
    "Fixed monthly": "Fix monatlich",
    "Foreign exposure": "Währungsexposition",
    "Frequency": "Frequenz",
    "Gross amount": "Bruttobetrag",
    "Gross wage": "Bruttolohn",
    "Head": "Kopf",
    "Headcount": "Mitarbeiterzahl",
    "Heat load": "Wärmelast",
    "Home appreciation": "Immobilienwertsteigerung",
    "Income": "Einkommen",
    "Initial investment": "Anfangsinvestition",
    "Input qty": "Eingangsmenge",
    "Investment return": "Investitionsrendite",
    "Item 1": "Posten 1",
    "Item 2": "Posten 2",
    "Item 3": "Posten 3",
    "Item 4": "Posten 4",
    "Item 5": "Posten 5",
    "Layers": "Schichten",
    "Lines": "Zeilen",
    "Load": "Last",
    "Lodging": "Unterkunft",
    "Margin error": "Margenfehler",
    "Maximum": "Maximum",
    "Mean": "Mittelwert",
    "Measured resistance": "Gemessener Widerstand",
    "Million": "Million",
    "Minimum": "Minimum",
    "Minutes": "Minuten",
    "Module": "Modul",
    "Monthly fee": "Monatsgebühr",
    "Monthly km": "Monatliche km",
    "Monthly saving": "Monatliche Ersparnis",
    "Months": "Monate",
    "Numerator": "Zähler",
    "Occupant load": "Personenlast",
    "Other": "Sonstiges",
    "Package A": "Paket A",
    "Package B": "Paket B",
    "Page yield": "Seitenertrag",
    "Pallet count": "Palettenanzahl",
    "Pallets": "Paletten",
    "Panel output": "Modulausgang",
    "Parts": "Teile",
    "Payload capacity": "Nutzlast",
    "Peak load": "Spitzenlast",
    "Pierce time": "Durchdringungszeit",
    "Pierces": "Durchdringungen",
    "Pitch": "Steigung",
    "Population": "Population",
    "Post spacing": "Pfostenabstand",
    "Post-process": "Nachbearbeitung",
    "Preload force": "Vorspannkraft",
    "Process mean": "Prozessmittelwert",
    "Proportion": "Anteil",
    "Purchase": "Kauf",
    "Quality": "Qualität",
    "Quote A": "Angebot A",
    "Quote B": "Angebot B",
    "Recycling revenue": "Recyclingerlös",
    "Resale": "Weiterverkauf",
    "Return multiple": "Renditemultiplikator",
    "Roof span": "Spannweite",
    "Safety factor": "Sicherheitsfaktor",
    "Scrap units": "Ausschusseinheiten",
    "Severity factor": "Schweregradfaktor",
    "Shear capacity": "Schertragfähigkeit",
    "Shelf count": "Regalanzahl",
    "Shipments": "Sendungen",
    "Source level": "Quellpegel",
    "Start day #": "Starttag #",
    "Start hour": "Startstunde",
    "Start minute": "Startminute",
    "Std dev": "Std.abw.",
    "Stops": "Stopps",
    "Taxable income": "Steuerpflichtiges Einkommen",
    "Thread count": "Gewindeanzahl",
    "Torque": "Drehmoment",
    "Total": "Gesamt",
    "Total lumens": "Gesamtlumen",
    "Total units": "Gesamteinheiten",
    "Usage": "Nutzung",
    "Utilities": "Nebenkosten",
    "Variable/hr": "Variabel/Std.",
    "Voltage": "Spannung",
    "Water fee": "Wassergebühr",
    "Yield": "Ertrag",
    "Yield/cow": "Ertrag/Kuh",
    "Z score": "Z-Wert",
    Base: "Basis",
    Material: "Werkstoff",
    Radius: "Radius",
    Transport: "Transport",
    "kg/m": "kg/m",
    Divisor: "Divisor",
    Transport: "Transport",
    Population: "Population",
    Minimum: "Minimum",
    Maximum: "Maximum",
    Radius: "Radius",
    Million: "Million",
  },
  fr: {
    "Access factor": "Facteur d'accès",
    Actual: "Réel",
    "Age factor": "Facteur d'âge",
    "Allowable stress": "Contrainte admissible",
    Attenuation: "Atténuation",
    "Base A": "Base A",
    "Base B": "Base B",
    "Battery capacity": "Capacité batterie",
    "Beam capacity": "Capacité de poutre",
    Bill: "Facture",
    "Capacity factor": "Facteur de capacité",
    Constant: "Constante",
    Cows: "Vaches",
    Deflection: "Flèche",
    Denominator: "Dénominateur",
    "Document count": "Nombre de documents",
    Dosage: "Dosage",
    "Down payment": "Acompte",
    "Drill factor": "Facteur de perçage",
    Efficiency: "Efficacité",
    "Emission factor": "Facteur d'émission",
    Emissions: "Émissions",
    "Engine displacement": "Cylindrée",
    "FX move": "Mouvement de change",
    Factor: "Facteur",
    Favorable: "Favorable",
    Feed: "Avance",
    "Feed/tooth": "Avance/dent",
    "Fill time": "Temps de remplissage",
    "Fine amount": "Montant de l'amende",
    "Fixed fee": "Frais fixes",
    "Fixed monthly": "Fixe mensuel",
    "Foreign exposure": "Exposition de change",
    Frequency: "Fréquence",
    "Gross amount": "Montant brut",
    "Gross wage": "Salaire brut",
    Head: "Tête",
    Headcount: "Effectif",
    "Heat load": "Charge thermique",
    "Home appreciation": "Plus-value immobilière",
    Income: "Revenu",
    "Initial investment": "Investissement initial",
    "Input qty": "Qté entrée",
    "Investment return": "Rendement investissement",
    "Item 1": "Poste 1",
    "Item 2": "Poste 2",
    "Item 3": "Poste 3",
    "Item 4": "Poste 4",
    "Item 5": "Poste 5",
    Layers: "Couches",
    Lines: "Lignes",
    Load: "Charge",
    Lodging: "Hébergement",
    "Margin error": "Erreur de marge",
    Maximum: "Maximum",
    Mean: "Moyenne",
    "Measured resistance": "Résistance mesurée",
    Million: "Million",
    Minimum: "Minimum",
    Minutes: "Minutes",
    Module: "Module",
    "Monthly fee": "Frais mensuels",
    "Monthly km": "Km mensuels",
    "Monthly saving": "Épargne mensuelle",
    Months: "Mois",
    Numerator: "Numérateur",
    "Occupant load": "Charge d'occupation",
    Other: "Autre",
    "Package A": "Forfait A",
    "Package B": "Forfait B",
    "Page yield": "Rendement page",
    "Pallet count": "Nombre de palettes",
    Pallets: "Palettes",
    "Panel output": "Sortie panneau",
    Parts: "Pièces",
    "Payload capacity": "Capacité utile",
    "Peak load": "Charge de pointe",
    "Pierce time": "Temps de perçage",
    Pierces: "Perçages",
    Pitch: "Pente",
    Population: "Population",
    "Post spacing": "Entraxe des poteaux",
    "Post-process": "Post-traitement",
    "Preload force": "Force de précharge",
    "Process mean": "Moyenne process",
    Proportion: "Proportion",
    Purchase: "Achat",
    Quality: "Qualité",
    "Quote A": "Devis A",
    "Quote B": "Devis B",
    "Recycling revenue": "Revenu recyclage",
    Resale: "Revente",
    "Return multiple": "Multiple de rendement",
    "Roof span": "Portée toit",
    "Safety factor": "Facteur de sécurité",
    "Scrap units": "Unités rebut",
    "Severity factor": "Facteur de gravité",
    "Shear capacity": "Capacité cisaillement",
    "Shelf count": "Nombre d'étagères",
    Shipments: "Expéditions",
    "Source level": "Niveau source",
    "Start day #": "Jour début #",
    "Start hour": "Heure début",
    "Start minute": "Minute début",
    "Std dev": "Écart-type",
    Stops: "Arrêts",
    "Taxable income": "Revenu imposable",
    "Thread count": "Nombre de filets",
    Torque: "Couple",
    Total: "Total",
    "Total lumens": "Lumens totaux",
    "Total units": "Unités totales",
    Usage: "Utilisation",
    Utilities: "Services publics",
    "Variable/hr": "Variable/h",
    Voltage: "Tension",
    "Water fee": "Frais d'eau",
    Yield: "Rendement",
    "Yield/cow": "Rendement/vache",
    "Z score": "Score Z",
    Base: "Base",
    Material: "Matériau",
    Radius: "Rayon",
    Transport: "Transport",
    "kg/m": "kg/m",
    Volume: "Volume",
    Coverage: "Couverture",
    "Pitch factor": "Facteur de pente",
    "Total rise": "Hauteur totale",
    Contingency: "Contingence",
    "Loan amount": "Montant du prêt",
    "Compounds/yr": "Composés/an",
    Discount: "Remise",
    Gain: "Bénéfice",
    "Gross salary": "Salaire brut",
    "Employer load": "Charges patronales",
    "Monthly income": "Revenu mensuel",
    "Cycle time": "Temps de cycle",
    Machining: "Usinage",
    "Load/unload": "Chargement/déchargement",
    Inspection: "Inspection",
    "Cut speed": "Vitesse de coupe",
    Performance: "Performance",
    Distance: "Distance",
    Dosage: "Dosage",
    Portions: "Portions",
    "End hour": "Heure de fin",
    "End minute": "Minute de fin",
    "End day #": "Jour de fin #",
    "Clamp force": "Force de serrage",
    "Base amount": "Montant de base",
    "Daily units": "Unités journalières",
    "Base fine": "Amende de base",
    "Bending moment": "Moment de flexion",
    "Control factor": "Facteur de contrôle",
    Minimum: "Minimum",
    Maximum: "Maximum",
    Base: "Base",
    Minutes: "Minutes",
    Module: "Module",
    "Base A": "Base A",
    "Base B": "Base B",
    Million: "Million",
    Population: "Population",
    Proportion: "Proportion",
    Total: "Total",
    Favorable: "Favorable",
    Transport: "Transport",
    Factor: "Facteur",
    Divisor: "Diviseur",
    Material: "Matériau",
  },
  es: {
    "Access factor": "Factor de acceso",
    Actual: "Real",
    "Age factor": "Factor de edad",
    "Allowable stress": "Esfuerzo admisible",
    Attenuation: "Atenuación",
    "Base A": "Base A",
    "Base B": "Base B",
    "Battery capacity": "Capacidad de batería",
    "Beam capacity": "Capacidad de viga",
    Bill: "Factura",
    "Capacity factor": "Factor de capacidad",
    Constant: "Constante",
    Cows: "Vacas",
    Deflection: "Deflexión",
    Denominator: "Denominador",
    "Document count": "Número de documentos",
    Dosage: "Dosificación",
    "Down payment": "Pago inicial",
    "Drill factor": "Factor de taladrado",
    Efficiency: "Eficiencia",
    "Emission factor": "Factor de emisión",
    Emissions: "Emisiones",
    "Engine displacement": "Cilindrada",
    "FX move": "Movimiento cambiario",
    Factor: "Factor",
    Favorable: "Favorable",
    Feed: "Avance",
    "Feed/tooth": "Avance/diente",
    "Fill time": "Tiempo de llenado",
    "Fine amount": "Importe de multa",
    "Fixed fee": "Tarifa fija",
    "Fixed monthly": "Fijo mensual",
    "Foreign exposure": "Exposición cambiaria",
    Frequency: "Frecuencia",
    "Gross amount": "Importe bruto",
    "Gross wage": "Salario bruto",
    Head: "Cabeza",
    Headcount: "Plantilla",
    "Heat load": "Carga térmica",
    "Home appreciation": "Revalorización vivienda",
    Income: "Ingresos",
    "Initial investment": "Inversión inicial",
    "Input qty": "Cant. entrada",
    "Investment return": "Retorno inversión",
    "Item 1": "Partida 1",
    "Item 2": "Partida 2",
    "Item 3": "Partida 3",
    "Item 4": "Partida 4",
    "Item 5": "Partida 5",
    Layers: "Capas",
    Lines: "Líneas",
    Load: "Carga",
    Lodging: "Alojamiento",
    "Margin error": "Error de margen",
    Maximum: "Máximo",
    Mean: "Media",
    "Measured resistance": "Resistencia medida",
    Million: "Millón",
    Minimum: "Mínimo",
    Minutes: "Minutos",
    Module: "Módulo",
    "Monthly fee": "Cuota mensual",
    "Monthly km": "Km mensuales",
    "Monthly saving": "Ahorro mensual",
    Months: "Meses",
    Numerator: "Numerador",
    "Occupant load": "Carga de ocupación",
    Other: "Otro",
    "Package A": "Paquete A",
    "Package B": "Paquete B",
    "Page yield": "Rendimiento por página",
    "Pallet count": "Número de palets",
    Pallets: "Palets",
    "Panel output": "Salida del panel",
    Parts: "Piezas",
    "Payload capacity": "Capacidad de carga",
    "Peak load": "Carga pico",
    "Pierce time": "Tiempo de perforación",
    Pierces: "Perforaciones",
    Pitch: "Pendiente",
    Population: "Población",
    "Post spacing": "Separación de postes",
    "Post-process": "Postproceso",
    "Preload force": "Fuerza de precarga",
    "Process mean": "Media del proceso",
    Proportion: "Proporción",
    Purchase: "Compra",
    Quality: "Calidad",
    "Quote A": "Cotización A",
    "Quote B": "Cotización B",
    "Recycling revenue": "Ingresos por reciclaje",
    Resale: "Reventa",
    "Return multiple": "Múltiplo de retorno",
    "Roof span": "Luz del techo",
    "Safety factor": "Factor de seguridad",
    "Scrap units": "Unidades de desecho",
    "Severity factor": "Factor de severidad",
    "Shear capacity": "Capacidad de corte",
    "Shelf count": "Número de estantes",
    Shipments: "Envíos",
    "Source level": "Nivel de origen",
    "Start day #": "Día inicio #",
    "Start hour": "Hora inicio",
    "Start minute": "Minuto inicio",
    "Std dev": "Desv. est.",
    Stops: "Paradas",
    "Taxable income": "Ingreso gravable",
    "Thread count": "Número de roscas",
    Torque: "Par",
    Total: "Total",
    "Total lumens": "Lúmenes totales",
    "Total units": "Unidades totales",
    Usage: "Uso",
    Utilities: "Servicios",
    "Variable/hr": "Variable/h",
    Voltage: "Voltaje",
    "Water fee": "Tarifa de agua",
    Yield: "Rendimiento",
    "Yield/cow": "Rendimiento/vaca",
    "Z score": "Puntuación Z",
    Base: "Base",
    Material: "Material",
    Radius: "Radio",
    Transport: "Transporte",
    "kg/m": "kg/m",
    Coverage: "Cobertura",
    "Pitch factor": "Factor de pendiente",
    "Total rise": "Altura total",
    Contingency: "Contingencia",
    "Loan amount": "Importe del préstamo",
    "Compounds/yr": "Compuestos/año",
    Discount: "Descuento",
    Gain: "Ganancia",
    "Gross salary": "Salario bruto",
    "Employer load": "Carga patronal",
    "Monthly income": "Ingreso mensual",
    "Cycle time": "Tiempo de ciclo",
    Machining: "Mecanizado",
    "Load/unload": "Carga/descarga",
    Inspection: "Inspección",
    Material: "Material",
    "Cut speed": "Velocidad de corte",
    Factor: "Factor",
    Divisor: "Divisor",
    "End hour": "Hora de fin",
    "End minute": "Minuto de fin",
    "End day #": "Día de fin #",
    Favorable: "Favorable",
    Total: "Total",
    "Clamp force": "Fuerza de sujeción",
    "Base amount": "Importe base",
    Base: "Base",
    "Base A": "Base A",
    "Base B": "Base B",
    "Daily units": "Unidades diarias",
    "Base fine": "Multa base",
    "Bending moment": "Momento flector",
    "Control factor": "Factor de control",
  },
  ar: {
  },
};

const labels = loadCatalogLabels();
const output = Object.fromEntries(TARGET_LOCALES.map((l) => [l, {}]));

for (const locale of TARGET_LOCALES) {
  let unresolved = 0;
  for (const label of labels) {
    if (isTechnicalToken(label)) {
      output[locale][label] = label;
      continue;
    }
    const manual = MANUAL_OVERRIDES[locale]?.[label];
    if (manual) {
      output[locale][label] = manual;
      continue;
    }
    const composed = composePhrase(label, locale);
    if (composed) {
      output[locale][label] = composed;
      continue;
    }
    unresolved += 1;
    output[locale][label] = label;
  }
  console.log(`${locale}: mapped ${labels.length - unresolved}/${labels.length} (${unresolved} unresolved)`);
}

writeFileSync(OUT, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`Wrote ${OUT}`);
