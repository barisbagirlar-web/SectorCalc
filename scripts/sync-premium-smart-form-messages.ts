#!/usr/bin/env npx tsx
/**
 * Sync smartForm.tools.* locale keys for all premium analyzers.
 * Run: npx tsx scripts/sync-premium-smart-form-messages.ts
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { slugToSmartFormToolKey } from "../src/lib/smart-form/dynamic-form-types";
import { getPremiumSmartFormDefinition } from "../src/lib/smart-form/premium-smart-form-definitions";
import { PREMIUM_SMART_FORM_SCENARIO_CONFIG } from "../src/lib/smart-form/premium-smart-form-scenario-config";
import { SUPPORTED_LOCALES } from "../src/lib/i18n/locale-config";
import { getPremiumToolContract } from "../src/lib/tools/premium-tool-contracts";
import { listPremiumContractSlugs } from "../src/lib/tools/premium-decision-engine";

const MESSAGES_DIR = join(process.cwd(), "messages");

type Locale = (typeof SUPPORTED_LOCALES)[number];

type ScenarioCopy = { readonly label: string; readonly description: string };

function buildToolsTree(): Record<string, unknown> {
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
      scenarios[scenario.id] = {
        label: scenario.labelEn,
        description: scenario.descriptionEn,
      };
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
    smartForm.tools = buildToolsTree();

    smartForm.compatibility = {
      missingContractField: "This analyzer is missing a required contract input in Smart Form.",
      hiddenRequiredSimple: "Switch to Advanced mode to enter all required contract fields.",
      missingRequired: "Complete all required fields before running the analysis.",
      invalidInput: "Fix invalid inputs before running the analysis.",
    };

    messages.smartForm = smartForm;
    writeFileSync(join(MESSAGES_DIR, `${locale}.json`), `${JSON.stringify(messages, null, 2)}\n`);
    console.log(`Updated messages/${locale}.json smartForm.tools (${Object.keys(buildToolsTree()).length} tools)`);
  }
}

main();
