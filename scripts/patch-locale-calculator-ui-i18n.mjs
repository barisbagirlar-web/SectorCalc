#!/usr/bin/env node
/**
 * Patches calculator-critical UI strings to TR-level parity across all locales.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

const SMART_FORM = {
  en: {
    mode: { simple: "Simple", advanced: "Advanced" },
    actions: {
      calculate: "Run calculation",
      fixMissing: "Complete required fields",
      showAdvanced: "Show advanced fields",
      hideAdvanced: "Hide advanced fields",
    },
    validation: {
      required: "This field is required.",
      invalidNumber: "Enter a valid number.",
      min: "Value must be at least {min}.",
      max: "Value must be at most {max}.",
      missingInputs:
        "{count, plural, one {# required field is missing} other {# required fields are missing}}",
      invalidCombination: "These inputs cannot produce a valid calculation.",
    },
    scenario: { label: "Job scenario", placeholder: "Select scenario" },
    notices: {
      requiredInputReason: "Each field maps to a verified contract input for this calculator.",
      calculationBlocked: "Complete required fields before running the calculation.",
      validatedInputSet: "Input set ready — run calculation when values are confirmed.",
    },
  },
  tr: {
    mode: { simple: "Basit", advanced: "Gelişmiş" },
    actions: {
      calculate: "Hesaplamayı çalıştır",
      fixMissing: "Zorunlu alanları tamamla",
      showAdvanced: "Gelişmiş alanları göster",
      hideAdvanced: "Gelişmiş alanları gizle",
    },
    validation: {
      required: "Bu area zorunludur.",
      invalidNumber: "Geçerli bir sayı girin.",
      min: "Değer en az {min} olmalı.",
      max: "Değer en fazla {max} olmalı.",
      missingInputs: "{count, plural, one {# zorunlu area eksik} other {# zorunlu area eksik}}",
      invalidCombination: "Bu girdiler geçerli bir calculation üretemez.",
    },
    scenario: { label: "İş senaryosu", placeholder: "Scenario seçin" },
    notices: {
      requiredInputReason: "Her area bu hesaplayıcının doğrulanmış sözleşme girdisine profitşılık gelir.",
      calculationBlocked: "Hesaplamayı çalıştırmadan önce zorunlu alanları tamamlayın.",
      validatedInputSet: "Input seti hazır — değerler onaylandığında hesaplamayı çalıştırın.",
    },
  },
  de: {
    mode: { simple: "Einfach", advanced: "Erweitert" },
    actions: {
      calculate: "Berechnung starten",
      fixMissing: "Pflichtfelder ausfüllen",
      showAdvanced: "Erweiterte Felder anzeigen",
      hideAdvanced: "Erweiterte Felder ausblenden",
    },
    validation: {
      required: "Dieses Feld ist erforderlich.",
      invalidNumber: "Geben Sie eine gültige Zahl ein.",
      min: "Der Wert muss mindestens {min} sein.",
      max: "Der Wert darf höchstens {max} sein.",
      missingInputs: "{count, plural, one {# Pflichtfeld fehlt} other {# Pflichtfelder fehlen}}",
      invalidCombination: "Diese Eingaben können keine gültige Berechnung erzeugen.",
    },
    scenario: { label: "Auftragsszenario", placeholder: "Szenario auswählen" },
    notices: {
      requiredInputReason: "Jedes Feld entspricht einer verifizierten Vertragseingabe für diesen Rechner.",
      calculationBlocked: "Füllen Sie die Pflichtfelder aus, bevor Sie die Berechnung starten.",
      validatedInputSet: "Eingabesatz bereit — starten Sie die Berechnung nach Bestätigung der Werte.",
    },
  },
  fr: {
    mode: { simple: "Simple", advanced: "Avancé" },
    actions: {
      calculate: "Lancer le calcul",
      fixMissing: "Compléter les champs obligatoires",
      showAdvanced: "Afficher les champs avancés",
      hideAdvanced: "Masquer les champs avancés",
    },
    validation: {
      required: "Ce champ est obligatoire.",
      invalidNumber: "Saisissez un nombre valide.",
      min: "La valeur doit être au moins {min}.",
      max: "La valeur doit être au plus {max}.",
      missingInputs:
        "{count, plural, one {# champ obligatoire manquant} other {# champs obligatoires manquants}}",
      invalidCombination: "Ces entrées ne peuvent pas produire un calcul valide.",
    },
    scenario: { label: "Scénario de chantier", placeholder: "Sélectionner un scénario" },
    notices: {
      requiredInputReason: "Chaque champ correspond à une entrée de contrat vérifiée pour ce calculateur.",
      calculationBlocked: "Complétez les champs obligatoires avant de lancer le calcul.",
      validatedInputSet: "Jeu d'entrées prêt — lancez le calcul une fois les valeurs confirmées.",
    },
  },
  es: {
    mode: { simple: "Simple", advanced: "Avanzado" },
    actions: {
      calculate: "Ejecutar cálculo",
      fixMissing: "Completar campos obligatorios",
      showAdvanced: "Mostrar campos avanzados",
      hideAdvanced: "Ocultar campos avanzados",
    },
    validation: {
      required: "Este campo es obligatorio.",
      invalidNumber: "Introduzca un número válido.",
      min: "El valor debe ser al menos {min}.",
      max: "El valor debe ser como máximo {max}.",
      missingInputs:
        "{count, plural, one {Falta # campo obligatorio} other {Faltan # campos obligatorios}}",
      invalidCombination: "Estas entradas no pueden producir un cálculo válido.",
    },
    scenario: { label: "Escenario del trabajo", placeholder: "Seleccionar escenario" },
    notices: {
      requiredInputReason: "Cada campo corresponde a una entrada de contrato verificada para esta calculadora.",
      calculationBlocked: "Complete los campos obligatorios antes de ejecutar el cálculo.",
      validatedInputSet: "Conjunto de entradas listo — ejecute el cálculo cuando confirme los valores.",
    },
  },
  ar: {
    actions: {
    },
    validation: {
      missingInputs:
    },
    notices: {
    },
  },
};

const CALCULATOR = {
  en: {
    calculate: "Calculate now",
    awaiting: "Enter values to see your result",
    validationRequired: "Please select a value.",
    validationNumber: "Enter a valid number.",
  },
  tr: {
    calculate: "Calculate",
    awaiting: "Result görmek için değerleri girin",
    validationRequired: "Lütfen bir değer seçin.",
    validationNumber: "Geçerli bir sayı girin.",
  },
  de: {
    calculate: "Jetzt berechnen",
    awaiting: "Werte eingeben, um das Ergebnis zu sehen",
    validationRequired: "Bitte einen Wert wählen.",
    validationNumber: "Gültige Zahl eingeben.",
  },
  fr: {
    calculate: "Calculer",
    awaiting: "Saisissez des valeurs pour voir le résultat",
    validationRequired: "Veuillez sélectionner une valeur.",
    validationNumber: "Saisissez un nombre valide.",
  },
  es: {
    calculate: "Calcular",
    awaiting: "Introduzca valores para ver el resultado",
    validationRequired: "Seleccione un valor.",
    validationNumber: "Introduzca un número válido.",
  },
  ar: {
  },
};

const CATALOG_VALIDATION = {
  en: {
    required: "Please select a value.",
    number: "Enter a valid number.",
    min: "Must be at least {min}.",
    max: "Must be at most {max}.",
  },
  tr: {
    required: "Lütfen bir değer seçin.",
    number: "Geçerli bir sayı girin.",
    min: "En az {min} olmalı.",
    max: "En fazla {max} olmalı.",
  },
  de: {
    required: "Bitte einen Wert wählen.",
    number: "Gültige Zahl eingeben.",
    min: "Muss mindestens {min} sein.",
    max: "Darf höchstens {max} sein.",
  },
  fr: {
    required: "Veuillez sélectionner une valeur.",
    number: "Saisissez un nombre valide.",
    min: "Doit être au moins {min}.",
    max: "Doit être au plus {max}.",
  },
  es: {
    required: "Seleccione un valor.",
    number: "Introduzca un número válido.",
    min: "Debe ser al menos {min}.",
    max: "Debe ser como máximo {max}.",
  },
  ar: {
  },
};

for (const locale of LOCALES) {
  const path = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(path, "utf8"));
  messages.smartForm = {
    ...messages.smartForm,
    ...SMART_FORM[locale],
    mode: { ...messages.smartForm?.mode, ...SMART_FORM[locale].mode },
    actions: { ...messages.smartForm?.actions, ...SMART_FORM[locale].actions },
    validation: SMART_FORM[locale].validation,
    scenario: SMART_FORM[locale].scenario,
    notices: SMART_FORM[locale].notices,
  };
  messages.calculator = { ...messages.calculator, ...CALCULATOR[locale] };
  if (messages.catalogExplorer?.freeTools) {
    messages.catalogExplorer.freeTools.validation = CATALOG_VALIDATION[locale];
  }
  writeFileSync(path, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
  console.log(`Patched calculator UI → messages/${locale}.json`);
}
