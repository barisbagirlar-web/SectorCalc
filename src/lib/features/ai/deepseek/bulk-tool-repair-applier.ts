import fs from "node:fs";
import path from "node:path";
import type {
  BulkRepairDecision,
  BulkRepairPatchPlan,
  BulkRepairPatchType,
  BulkToolRepairItem,
} from "@/lib/features/ai/deepseek/bulk-tool-repair-types";

const ROOT = process.cwd();

export const DETERMINISTIC_SAFE_PATCH_TYPES = new Set<BulkRepairPatchType>([
  "guide_hide",
  "unit_fix",
  "i18n_fix",
  "validation_fix",
  "submit_handler",
  "contract_alignment",
]);

const FORBIDDEN_TARGET_PATTERNS = [
  /^\.env/i,
  /^functions\//,
  /^apps\/guide-/,
  /^public\/ai-/,
  /^next-env\.d\.ts$/,
  /stripe/i,
  /webhook/i,
  /billing/i,
  /firebase/i,
  /wrangler\.toml$/,
  /vercel\.json$/,
];

function isForbiddenTarget(targetFile: string): boolean {
  const normalized = targetFile.replace(/\\/g, "/");
  return FORBIDDEN_TARGET_PATTERNS.some((pattern) => pattern.test(normalized));
}

function isDeterministicSafePatch(patch: BulkRepairPatchPlan): boolean {
  if (!DETERMINISTIC_SAFE_PATCH_TYPES.has(patch.type)) {
    return false;
  }
  if (!patch.safeToApply) {
    return false;
  }
  if (patch.type === "contract_alignment") {
    return false;
  }
  if (patch.type === "submit_handler") {
    return false;
  }
  if (patch.targetFile && isForbiddenTarget(patch.targetFile)) {
    return false;
  }
  return true;
}

function isApplyEligibleDecision(decision: BulkRepairDecision, allowCandidate: boolean): boolean {
  if (decision === "auto_apply") {
    return true;
  }
  return allowCandidate && decision === "auto_apply_candidate";
}

export function filterDeterministicSafePatches(
  patches: readonly BulkRepairPatchPlan[],
): BulkRepairPatchPlan[] {
  return patches.filter(isDeterministicSafePatch);
}

export function prepareDeterministicFallbackItem(item: BulkToolRepairItem): BulkToolRepairItem | null {
  const safePatches = filterDeterministicSafePatches(item.patches);
  if (safePatches.length === 0) {
    return null;
  }
  if (item.riskLevel === "high" || item.riskLevel === "critical") {
    return null;
  }
  return {
    ...item,
    repairDecision: "auto_apply",
    patches: safePatches,
  };
}

export function prepareDeterministicFallbackBatch(
  items: readonly BulkToolRepairItem[],
): BulkToolRepairItem[] {
  return items
    .map(prepareDeterministicFallbackItem)
    .filter((item): item is BulkToolRepairItem => item !== null);
}

const UNIT_REPLACEMENTS: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /unit:\s*"h"/g, replacement: 'unit: "hours"' },
  { pattern: /unit:\s*'h'/g, replacement: "unit: 'hours'" },
  { pattern: /unit:\s*"\$\/h"/g, replacement: 'unit: "USD/hour"' },
  { pattern: /unit:\s*"\$"/g, replacement: 'unit: "USD"' },
  { pattern: /unit:\s*"kg\/m2"/g, replacement: 'unit: "kg/m²"' },
  { pattern: /unit:\s*"m2"/g, replacement: 'unit: "m²"' },
  { pattern: /unit:\s*"ha"/g, replacement: 'unit: "hectare"' },
  { pattern: /unit:\s*"liters"/g, replacement: 'unit: "L"' },
  { pattern: /unit:\s*"calls"/g, replacement: 'unit: "count"' },
];

function readJson(filePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, unknown>;
}

function writeJson(filePath: string, payload: Record<string, unknown>): void {
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function applyUnitFix(patch: BulkRepairPatchPlan): boolean {
  const absolute = path.join(ROOT, patch.targetFile);
  if (!fs.existsSync(absolute)) {
    return false;
  }
  let content = fs.readFileSync(absolute, "utf8");
  const before = content;
  for (const rule of UNIT_REPLACEMENTS) {
    content = content.replace(rule.pattern, rule.replacement);
  }
  if (content === before) {
    return false;
  }
  fs.writeFileSync(absolute, content, "utf8");
  return true;
}

function parseSchemaInputFields(
  schemaPath: string,
): Array<{ id: string; label: string; helper?: string }> {
  const absolute = path.join(ROOT, schemaPath);
  if (!fs.existsSync(absolute)) {
    return [];
  }
  const content = fs.readFileSync(absolute, "utf8");
  const inputsBlock = content.match(/inputs:\s*\[([\s\S]*?)\]\s*,\s*outputs:/);
  if (!inputsBlock) {
    return [];
  }
  const fields: Array<{ id: string; label: string; helper?: string }> = [];
  const inputBlocks = inputsBlock[1].matchAll(
    /\{\s*id:\s*"([^"]+)"[\s\S]*?label:\s*"([^"]+)"([\s\S]*?)\}/g,
  );
  for (const match of inputBlocks) {
    const id = match[1];
    const label = match[2];
    const helperMatch = match[3]?.match(/helper:\s*"([^"]+)"/);
    fields.push({ id, label, helper: helperMatch?.[1] });
  }
  return fields;
}

function toLocaleInputKey(inputId: string): string {
  return inputId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function applyI18nScaffoldFromSchema(patch: BulkRepairPatchPlan): boolean {
  const locale = patch.metadata?.locale;
  const targetSlug = patch.metadata?.targetSlug;
  const schemaPath = patch.metadata?.schemaPath;
  if (!locale || !targetSlug || !schemaPath || patch.metadata?.scaffoldFromSchema !== "true") {
    return false;
  }

  const absolute = path.join(ROOT, patch.targetFile);
  if (!fs.existsSync(absolute)) {
    return false;
  }

  const payload = readJson(absolute);
  const freeToolInputs = (payload.freeToolInputs ?? {}) as Record<string, unknown>;
  if (freeToolInputs[targetSlug]) {
    return false;
  }

  const fields = parseSchemaInputFields(schemaPath);
  if (fields.length === 0) {
    return false;
  }

  const entry: Record<string, { label: string; placeholder: string; helper: string }> = {};
  for (const field of fields) {
    const key = toLocaleInputKey(field.id);
    entry[key] = {
      label: field.label,
      placeholder: `Enter ${field.label.toLowerCase()}`,
      helper: field.helper ?? field.label,
    };
  }

  freeToolInputs[targetSlug] = entry;
  payload.freeToolInputs = freeToolInputs;
  writeJson(absolute, payload);
  return true;
}

function applyI18nAlias(patch: BulkRepairPatchPlan): boolean {
  const locale = patch.metadata?.locale;
  const targetSlug = patch.metadata?.targetSlug;
  const sourceSlug = patch.metadata?.sourceSlug;
  if (!locale || !targetSlug || !sourceSlug) {
    return false;
  }

  const absolute = path.join(ROOT, patch.targetFile);
  if (!fs.existsSync(absolute)) {
    return false;
  }

  const payload = readJson(absolute);
  const freeToolInputs = (payload.freeToolInputs ?? {}) as Record<string, unknown>;
  if (freeToolInputs[targetSlug]) {
    return false;
  }
  const source = freeToolInputs[sourceSlug];
  if (!source) {
    return false;
  }

  freeToolInputs[targetSlug] = JSON.parse(JSON.stringify(source));
  payload.freeToolInputs = freeToolInputs;
  writeJson(absolute, payload);
  return true;
}

function applyPremiumSchemaI18nEntry(patch: BulkRepairPatchPlan): boolean {
  const targetSlug = patch.metadata?.targetSlug;
  const sourceSchemaId = patch.metadata?.sourceSchemaId;
  if (!targetSlug || !sourceSchemaId) {
    return false;
  }

  const absolute = path.join(ROOT, "src/data/premium-schema-i18n.ts");
  if (!fs.existsSync(absolute)) {
    return false;
  }

  let content = fs.readFileSync(absolute, "utf8");
  if (new RegExp(`"${targetSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}":`).test(content)) {
    return false;
  }

  const sourceMatch = content.match(
    new RegExp(`"${sourceSchemaId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}":\\s*\\{[\\s\\S]*?\\},`),
  );
  if (!sourceMatch) {
    return false;
  }

  const cloned = sourceMatch[0].replace(`"${sourceSchemaId}"`, `"${targetSlug}"`);
  const anchor = "const TR_SCHEMAS: Record<string, LocalizedPremiumSchema> = {";
  if (!content.includes(anchor)) {
    return false;
  }

  content = content.replace(anchor, `${anchor}\n  ${cloned}`);
  fs.writeFileSync(absolute, content, "utf8");
  return true;
}

function parseSchemaInputKeys(schemaPath: string): string[] {
  const absolute = path.join(ROOT, schemaPath);
  if (!fs.existsSync(absolute)) {
    return [];
  }
  const content = fs.readFileSync(absolute, "utf8");
  const inputsBlock = content.match(/inputs:\s*\[([\s\S]*?)\]\s*,\s*outputs:/);
  if (!inputsBlock) {
    return [];
  }
  const keys: string[] = [];
  for (const match of inputsBlock[1].matchAll(/id:\s*"([^"]+)"/g)) {
    keys.push(match[1]);
  }
  return [...new Set(keys)];
}

function toPascalCase(slug: string): string {
  const parts = slug.split("-").filter(Boolean);
  const normalized = parts.map((part) => {
    if (/^\d+$/.test(part)) {
      return part;
    }
    return part.charAt(0).toUpperCase() + part.slice(1);
  });
  const joined = normalized.join("");
  return /^\d/.test(joined) ? `Tool${joined}` : joined;
}

function applyValidationScaffold(patch: BulkRepairPatchPlan): boolean {
  const schemaId = patch.metadata?.schemaId;
  const schemaPath = patch.metadata?.schemaPath;
  if (!schemaId) {
    return false;
  }

  const absolute = path.join(ROOT, patch.targetFile);
  if (fs.existsSync(absolute)) {
    return false;
  }

  const inputKeys = schemaPath ? parseSchemaInputKeys(schemaPath) : [];
  if (inputKeys.length === 0) {
    return false;
  }

  const typeName = `${toPascalCase(schemaId)}Inputs`;
  const resultType = `${toPascalCase(schemaId)}ValidationResult`;
  const keysConst = `${schemaId.replace(/-/g, "_").toUpperCase()}_INPUT_KEYS`;
  const fnName = `validate${toPascalCase(schemaId)}Inputs`;

  const fields = inputKeys.map((key) => `  ${key}: number;`).join("\n");
  const keyEntries = inputKeys.map((key) => `  "${key}",`).join("\n");
  const labelEntries = inputKeys
    .map((key) => `  ${key}: "${key}",`)
    .join("\n");
  const guards = inputKeys
    .map(
      (key) => `  if (!isValidNumber(inputs.${key})) {
    errors.push("${key} must be a finite number.");
  }`,
    )
    .join("\n\n");

  const content = `export type ${typeName} = {
${fields}
};

export type ${resultType} =
  | { ok: true; errors: []; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export const ${keysConst}: readonly (keyof ${typeName})[] = [
${keyEntries}
];

const INPUT_LABELS: Record<keyof ${typeName}, string> = {
${labelEntries}
};

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function ${fnName}(inputs: ${typeName}): ${resultType} {
  const errors: string[] = [];

  for (const key of ${keysConst}) {
    const value = inputs[key];
    if (value === undefined || value === null) {
      errors.push(\`\${INPUT_LABELS[key]} is required.\`);
    }
  }

${guards}

  if (errors.length > 0) {
    return { ok: false, errors, warnings: [] };
  }

  return { ok: true, errors: [], warnings: [] };
}
`;

  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content, "utf8");
  return true;
}

function applyGlobalSanityTestScaffold(patch: BulkRepairPatchPlan): boolean {
  const paidSlug = patch.metadata?.paidSlug;
  const schemaId = patch.metadata?.schemaId;
  const slug = patch.metadata?.slug;
  if (!paidSlug || !schemaId || !slug) {
    return false;
  }

  const absolute = path.join(ROOT, patch.targetFile);
  if (fs.existsSync(absolute)) {
    return false;
  }

  const content = `import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/features/formula-governance/contracts";
import { getPremiumCalculatorSchema } from "@/lib/features/premium-schema/schema-registry";

const SLUG = "${schemaId}";
const PAID_ROUTE_SLUG = "${paidSlug}";

describe("${schemaId} global sanity", () => {
  test("schema and contract resolve for paid route", () => {
    expect(getPremiumCalculatorSchema(SLUG)).toBeDefined();
    expect(getFormulaContractBySlug(SLUG)).toBeDefined();
    expect(PAID_ROUTE_SLUG).toBe("${slug}");
  });
});
`;

  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content, "utf8");
  return true;
}

function applyGuideHide(patch: BulkRepairPatchPlan): boolean {
  const slug = patch.metadata?.slug ?? patch.metadata?.targetSlug;
  if (!slug) {
    return false;
  }

  const blocklistPath = path.join(ROOT, "src/lib/tools/guide/tool-guide-blocklist.ts");
  if (!fs.existsSync(blocklistPath)) {
    return false;
  }

  let content = fs.readFileSync(blocklistPath, "utf8");
  const slugPattern = new RegExp(`"${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`);
  if (slugPattern.test(content)) {
    return false;
  }

  const arrayMatch = content.match(
    /export const GENERIC_GUIDE_BLOCKED_SLUGS: readonly string\[\] = \[([\s\S]*?)\];/,
  );
  if (!arrayMatch) {
    return false;
  }

  const existing = arrayMatch[1].trim();
  const insertion = existing.length > 0 ? `${existing}\n  "${slug}",` : `\n  "${slug}",`;
  content = content.replace(
    /export const GENERIC_GUIDE_BLOCKED_SLUGS: readonly string\[\] = \[([\s\S]*?)\];/,
    `export const GENERIC_GUIDE_BLOCKED_SLUGS: readonly string[] = [${insertion}\n];`,
  );
  fs.writeFileSync(blocklistPath, content, "utf8");
  return true;
}

function applyPaidRouteSlug(patch: BulkRepairPatchPlan): boolean {
  const paidSlug = patch.metadata?.paidSlug;
  if (!paidSlug) {
    return false;
  }

  if (patch.metadata?.scaffold === "true") {
    return applyGlobalSanityTestScaffold(patch);
  }

  const absolute = path.join(ROOT, patch.targetFile);
  if (!fs.existsSync(absolute)) {
    return false;
  }

  let content = fs.readFileSync(absolute, "utf8");
  if (content.includes("PAID_ROUTE_SLUG") || content.includes(`"${paidSlug}"`)) {
    return false;
  }

  const slugMatch = content.match(/^const SLUG = "([^"]+)";/m);
  if (!slugMatch) {
    return false;
  }

  content = content.replace(
    slugMatch[0],
    `${slugMatch[0]}\nconst PAID_ROUTE_SLUG = "${paidSlug}";`,
  );
  fs.writeFileSync(absolute, content, "utf8");
  return true;
}

export function applyBulkRepairItem(
  item: BulkToolRepairItem,
  options: { readonly allowCandidate?: boolean } = {},
): {
  applied: number;
  skipped: number;
} {
  const allowCandidate = options.allowCandidate ?? false;
  if (!isApplyEligibleDecision(item.repairDecision, allowCandidate)) {
    return { applied: 0, skipped: item.patches.length };
  }

  let applied = 0;
  let skipped = 0;

  for (const patch of item.patches) {
    if (!patch.safeToApply) {
      skipped += 1;
      continue;
    }
    if (patch.targetFile && isForbiddenTarget(patch.targetFile)) {
      skipped += 1;
      continue;
    }
    if (allowCandidate && !isDeterministicSafePatch(patch)) {
      skipped += 1;
      continue;
    }

    let ok = false;
    switch (patch.type) {
      case "unit_fix":
        ok = applyUnitFix(patch);
        break;
      case "i18n_fix":
        if (patch.targetFile.startsWith("messages/")) {
          ok =
            patch.metadata?.scaffoldFromSchema === "true"
              ? applyI18nScaffoldFromSchema(patch)
              : applyI18nAlias(patch);
        } else {
          ok = applyPremiumSchemaI18nEntry(patch);
        }
        break;
      case "validation_fix":
        ok = applyValidationScaffold(patch);
        break;
      case "route_wiring":
        ok = applyPaidRouteSlug(patch);
        break;
      case "guide_hide":
        ok = applyGuideHide({
          ...patch,
          metadata: {
            ...patch.metadata,
            slug: patch.metadata?.slug ?? patch.metadata?.targetSlug ?? item.slug,
            targetSlug: patch.metadata?.targetSlug ?? item.slug,
          },
        });
        break;
      default:
        ok = false;
        break;
    }

    if (ok) {
      applied += 1;
    } else {
      skipped += 1;
    }
  }

  return { applied, skipped };
}

export function applyBulkRepairBatch(
  items: BulkToolRepairItem[],
  options: { readonly allowCandidate?: boolean } = {},
): {
  patchedSlugs: string[];
  manualReview: string[];
  safeStateKept: string[];
} {
  const patchedSlugs: string[] = [];
  const manualReview: string[] = [];
  const safeStateKept: string[] = [];

  for (const item of items) {
    if (item.repairDecision === "manual_review") {
      manualReview.push(item.slug);
      continue;
    }
    if (item.repairDecision === "keep_safe_state" || item.repairDecision === "skip") {
      safeStateKept.push(item.slug);
      continue;
    }

    const result = applyBulkRepairItem(item, options);
    if (result.applied > 0) {
      patchedSlugs.push(item.slug);
    } else if (
      isApplyEligibleDecision(item.repairDecision, options.allowCandidate ?? false)
    ) {
      safeStateKept.push(item.slug);
    } else if (item.repairDecision === "auto_apply_candidate") {
      manualReview.push(item.slug);
    } else {
      safeStateKept.push(item.slug);
    }
  }

  return { patchedSlugs, manualReview, safeStateKept };
}
