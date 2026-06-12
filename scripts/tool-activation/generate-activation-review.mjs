#!/usr/bin/env node
import fs from "node:fs";
import {
  REVIEWS_DIR,
  SCAN_REPORT_PATH,
  draftPath,
  reviewPath,
} from "./lib/activation-paths.mjs";

const CHECKLIST = `## Human Review Checklist

- [ ] Tool slug doğru
- [ ] Mevcut formül korunuyor
- [ ] Input birimleri mantıklı
- [ ] Formula expression math.js formatında
- [ ] Test case beklenen çıktıları makul
- [ ] Risk notları okundu
- [ ] Production apply için onay veriyorum
`;

function parseArgs(argv) {
  const slugIndex = argv.indexOf("--slug");
  if (slugIndex === -1 || !argv[slugIndex + 1]) {
    console.error("Usage: node scripts/tool-activation/generate-activation-review.mjs --slug <tool-slug>");
    process.exit(1);
  }

  return argv[slugIndex + 1];
}

function main() {
  const slug = parseArgs(process.argv.slice(2));

  if (!fs.existsSync(SCAN_REPORT_PATH)) {
    throw new Error(`Scan report missing. Run scan-tools-for-activation first: ${SCAN_REPORT_PATH}`);
  }

  const draftFile = draftPath(slug);
  if (!fs.existsSync(draftFile)) {
    throw new Error(`Draft missing: ${draftFile}`);
  }

  const scan = JSON.parse(fs.readFileSync(SCAN_REPORT_PATH, "utf8"));
  const draft = JSON.parse(fs.readFileSync(draftFile, "utf8"));

  fs.mkdirSync(REVIEWS_DIR, { recursive: true });

  const applyCommand = [
    "TOOL_ACTIVATION_REFERENCE_SLUG=" + slug,
    "npm run apply:tool-activation -- --slug",
    slug,
  ].join(" ");

  const markdown = [
    "# Tool Activation Review",
    "",
    `- Selected reference slug: \`${scan.selectedReferenceSlug}\``,
    `- Review slug: \`${slug}\``,
    `- Selected because: ${scan.selectedReferenceReason}`,
    `- Active route: ${scan.referenceHasActiveRoute ? "yes" : "no"}`,
    `- FormulaContract present: ${scan.referenceHasFormulaContract ? "yes" : "no"}`,
    `- Existing formula preserved in draft: ${draft.formulaAction === "preserve-existing" ? "yes" : "no"}`,
    `- Draft formulaAction: \`${draft.formulaAction}\``,
    `- Risk level: \`${draft.riskLevel}\``,
    `- Test cases: ${draft.testCases?.length ?? 0}`,
    "",
    CHECKLIST,
    "",
    "## Apply Command (manual only — do not auto-run)",
    "",
    "```bash",
    applyCommand,
    "```",
    "",
    "## Notes",
    "",
    "- Apply command is shown for human review only.",
    "- Production source is not modified automatically in the first activation lock.",
    "- Deterministic gates must pass before any production apply decision.",
    "",
  ].join("\n");

  const output = reviewPath(slug);
  fs.writeFileSync(output, markdown, "utf8");

  console.log(`Review report written: ${output}`);
  console.log("Apply command (manual only):");
  console.log(applyCommand);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
