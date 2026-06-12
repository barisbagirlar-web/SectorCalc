#!/usr/bin/env npx tsx
import fs from "node:fs";
import { assertFormulaDraftPolicy } from "@/lib/tool-activation/existing-formula-guard";
import type { ActivationDraft } from "@/lib/tool-activation/activation-types";
import {
  auditActivationTestCases,
  auditToolUnitConsistency,
} from "@/lib/tool-activation/tool-unit-consistency";

const draftFile = process.argv[2];

if (!draftFile) {
  console.error("Usage: npx tsx scripts/tool-activation/check-draft-gates.ts <draft.json>");
  process.exit(1);
}

const draft = JSON.parse(fs.readFileSync(draftFile, "utf8")) as ActivationDraft;
const violations = [
  ...assertFormulaDraftPolicy(draft.slug, draft),
  ...auditActivationTestCases(draft),
  ...auditToolUnitConsistency(draft).map((issue) => issue.message),
];

if (violations.length > 0) {
  console.error("Activation draft gate failures:");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log(`Activation draft gates passed for ${draft.slug}.`);
