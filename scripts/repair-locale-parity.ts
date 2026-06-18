/**
 * Fix locale parity gaps by restructuring locale JSON to match en.json structure.
 *
 * Changes per locale:
 *   1. Move flat verify.glossaryUi keys under verify.glossaryUi.{key}
 *   2. Add unitSuffix to generatedTool.premiumForm
 *   3. Add voteCorrect/IncorrectMessage + unitSuffix to generatedTool.freeForm
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

type MessageTree = Record<string, unknown>;

const LOCALES = ["tr", "de", "fr", "es", "ar"];
const ROOT = process.cwd();

function main(): void {
  const en = JSON.parse(readFileSync(join(ROOT, "messages", "en.json"), "utf8")) as MessageTree;

  // Keys that belong inside verify.glossaryUi (from en.json verify.glossaryUi)
  const glossaryUiKeys = new Set(
    Object.keys((en.verify as MessageTree)?.glossaryUi as MessageTree ?? {}),
  );

  // Values to add from en.json
  const enGeneratedTool = en.generatedTool as MessageTree;
  const premiumFormDefaults = enGeneratedTool?.premiumForm as MessageTree ?? {};
  const freeFormDefaults = enGeneratedTool?.freeForm as MessageTree ?? {};

  let totalChanged = 0;

  for (const locale of LOCALES) {
    const filePath = join(ROOT, "messages", `${locale}.json`);
    if (!existsSync(filePath)) {
      console.log(`${locale}: file not found, skipping`);
      continue;
    }

    const orig = readFileSync(filePath, "utf8");
    const messages = JSON.parse(orig) as MessageTree;
    let changed = false;

    // ── 1. Restructure verify.glossaryUi ──
    // Locale files have glossaryUi at TOP level instead of under verify
    const verify = messages["verify"] as MessageTree | undefined;
    const topGlossaryUi = messages["glossaryUi"] as MessageTree | undefined;
    if (verify && topGlossaryUi && !verify["glossaryUi"]) {
      verify["glossaryUi"] = topGlossaryUi;
      delete messages["glossaryUi"];
      // Remove any flat keys from verify that are now in glossaryUi
      for (const key of Object.keys(topGlossaryUi)) {
        if (key in verify) {
          delete verify[key];
        }
      }
      changed = true;
      console.log(`${locale}: moved top-level glossaryUi (${Object.keys(topGlossaryUi).length} keys) under verify.glossaryUi`);
    }

    // ── 2. Fix generatedTool ──
    const gt = messages["generatedTool"] as MessageTree | undefined;
    if (gt) {
      // premiumForm.unitSuffix
      const pf = gt["premiumForm"] as MessageTree | undefined;
      if (pf && typeof pf["unitSuffix"] !== "string") {
        pf["unitSuffix"] = premiumFormDefaults["unitSuffix"] ?? "{label} unit";
        changed = true;
        console.log(`${locale}: added premiumForm.unitSuffix`);
      }

      // freeForm.voteCorrectMessage, voteIncorrectMessage, unitSuffix
      const ff = gt["freeForm"] as MessageTree | undefined;
      if (ff) {
        for (const key of ["voteCorrectMessage", "voteIncorrectMessage", "unitSuffix"] as const) {
          if (typeof ff[key] !== "string") {
            ff[key] = freeFormDefaults[key] ?? key;
            changed = true;
          }
        }
        if (changed) {
          console.log(`${locale}: added missing freeForm vote/unit keys`);
        }
      }
    }

    if (changed) {
      writeFileSync(filePath, JSON.stringify(messages, null, 2) + "\n", "utf8");
      totalChanged += 1;
      console.log(`${locale}: written`);
    } else {
      console.log(`${locale}: no changes needed`);
    }
  }

  console.log(`\nDone: ${totalChanged}/${LOCALES.length} locale files updated`);
}

main();
