#!/usr/bin/env npx tsx
/**
 * Sync smartForm.tools.* locale keys for all 27 premium analyzers.
 * Run: npx tsx scripts/sync-premium-smart-form-messages.ts
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { slugToSmartFormToolKey } from "../src/lib/smart-form/dynamic-form-types";
import { getPremiumSmartFormDefinition } from "../src/lib/smart-form/premium-smart-form-definitions";
import { PREMIUM_SMART_FORM_SCENARIO_CONFIG } from "../src/lib/smart-form/premium-smart-form-scenario-config";
import { SUPPORTED_LOCALES, ROOT_LOCALE } from "../src/lib/i18n/locale-config";
import { getPremiumToolContract } from "../src/lib/tools/premium-tool-contracts";
import { listPremiumContractSlugs } from "../src/lib/tools/premium-decision-engine";

const MESSAGES_DIR = join(process.cwd(), "messages");

type Locale = (typeof SUPPORTED_LOCALES)[number];

type ScenarioCopy = { readonly label: string; readonly description: string };

const SCENARIO_TRANSLATIONS: Record<
  string,
  Partial<Record<Locale, ScenarioCopy>>
> = {
  quick_quote_check: {
    tr: { label: "Hızlı teklif kontrolü", description: "Temel süre ve oran girdileriyle hızlı taban kontrolü." },
    de: { label: "Schnelle Angebotsprüfung", description: "Schneller Bodencheck mit Kernzeit- und Satz-Eingaben." },
    fr: { label: "Contrôle de devis rapide", description: "Contrôle rapide avec temps et taux principaux." },
    es: { label: "Revisión rápida de cotización", description: "Comprobación rápida con tiempo y tarifa base." },
  },
  detailed_margin_review: {
    tr: { label: "Detaylı marj incelemesi", description: "Takım ve malzeme dahil tam iş maliyeti." },
    de: { label: "Detaillierte Margenprüfung", description: "Voller Job-Kostenstack inkl. Werkzeug und Material." },
    fr: { label: "Revue de marge détaillée", description: "Coût complet incluant outillage et matière." },
    es: { label: "Revisión de margen detallada", description: "Coste completo con herramientas y material." },
  },
};

function translateScenario(
  scenarioId: string,
  en: ScenarioCopy,
  locale: Locale,
): ScenarioCopy {
  if (locale === ROOT_LOCALE) {
    return en;
  }
  const mapped = SCENARIO_TRANSLATIONS[scenarioId]?.[locale];
  if (mapped) {
    return mapped;
  }
  return en;
}

function buildToolsTree(locale: Locale): Record<string, unknown> {
  const tools: Record<string, unknown> = {};

  for (const slug of listPremiumContractSlugs()) {
    const toolKey = slugToSmartFormToolKey(slug);
    const config = PREMIUM_SMART_FORM_SCENARIO_CONFIG[slug];
    const contract = getPremiumToolContract(slug);
    const definition = getPremiumSmartFormDefinition(slug);
    if (!config || !contract || !definition) {
      throw new Error(`Missing data for ${slug}`);
    }

    const scenarios: Record<string, ScenarioCopy> = {};
    for (const scenario of config.scenarios) {
      const en: ScenarioCopy = {
        label: scenario.labelEn,
        description: scenario.descriptionEn,
      };
      scenarios[scenario.id] = translateScenario(scenario.id, en, locale);
    }

    const inputs: Record<string, { label: string; help: string }> = {};
    for (const input of contract.inputs) {
      inputs[input.key] = {
        label: input.label,
        help: input.helperText ?? input.label,
      };
    }

    tools[toolKey] = { scenarios, inputs };
  }

  return tools;
}

function loadMessages(locale: Locale): Record<string, unknown> {
  return JSON.parse(readFileSync(join(MESSAGES_DIR, `${locale}.json`), "utf8")) as Record<
    string,
    unknown
  >;
}

function main(): void {
  for (const locale of SUPPORTED_LOCALES) {
    const messages = loadMessages(locale);
    const smartForm = (messages.smartForm ?? {}) as Record<string, unknown>;
    smartForm.tools = buildToolsTree(locale);

    smartForm.compatibility = {
      missingContractField: locale === ROOT_LOCALE
        ? "This analyzer is missing a required contract input in Smart Form."
        : locale === "tr"
          ? "Bu analizörde zorunlu sözleşme girdisi Smart Form'da eksik."
          : locale === "ar"
            : locale === "de"
              ? "Ein erforderliches Vertragsfeld fehlt im Smart Form."
              : locale === "fr"
                ? "Une entrée de contrat requise manque dans le Smart Form."
                : "Falta una entrada de contrato requerida en Smart Form.",
      hiddenRequiredSimple:
        locale === ROOT_LOCALE
          ? "Switch to Advanced mode to enter all required contract fields."
          : locale === "tr"
            ? "Tüm zorunlu sözleşme alanları için Gelişmiş moda geçin."
            : locale === "ar"
              : locale === "de"
                ? "Wechseln Sie in den Erweitert-Modus für alle Pflichtfelder."
                : locale === "fr"
                  ? "Passez en mode Avancé pour saisir tous les champs requis."
                  : "Cambie a modo Avanzado para ingresar todos los campos requeridos.",
      missingRequired:
        locale === ROOT_LOCALE
          ? "Complete all required fields before running the analysis."
          : locale === "tr"
            ? "Analizi çalıştırmadan önce tüm zorunlu alanları doldurun."
            : locale === "ar"
              : locale === "de"
                ? "Füllen Sie alle Pflichtfelder aus, bevor Sie die Analyse starten."
                : locale === "fr"
                  ? "Complétez tous les champs requis avant de lancer l'analyse."
                  : "Complete todos los campos requeridos antes de ejecutar el análisis.",
      invalidInput:
        locale === ROOT_LOCALE
          ? "Fix invalid inputs before running the analysis."
          : locale === "tr"
            ? "Analizi çalıştırmadan önce geçersiz girdileri düzeltin."
            : locale === "ar"
              : locale === "de"
                ? "Korrigieren Sie ungültige Eingaben vor der Analyse."
                : locale === "fr"
                  ? "Corrigez les entrées invalides avant l'analyse."
                  : "Corrija entradas inválidas antes de ejecutar el análisis.",
    };

    messages.smartForm = smartForm;
    writeFileSync(join(MESSAGES_DIR, `${locale}.json`), `${JSON.stringify(messages, null, 2)}\n`);
    console.log(`Updated messages/${locale}.json smartForm.tools (${Object.keys(buildToolsTree(locale)).length} tools)`);
  }
}

main();
