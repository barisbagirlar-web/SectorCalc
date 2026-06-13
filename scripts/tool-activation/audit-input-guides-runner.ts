import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  evaluateInputGuideDecision,
  wouldLegacyGenericGuideRender,
} from "../../src/lib/tool-guides/input-guide-policy";
import { evaluateToolGuidePolicy } from "../../src/lib/tools/guide/tool-guide-policy";
import type { ToolGuideAuditDecision } from "../../src/lib/tools/guide/tool-guide-types";
import {
  listPremiumPilotGuideSlugs,
  listToolGuideSpecSlugs,
} from "../../src/lib/tool-guides/premium-input-guide-specs";
import { resolveToolFormInputKeys } from "../../src/lib/tool-guides/resolve-tool-form-input-keys";
import { listShapeDimensionGuideSlugs } from "../../src/lib/tool-guides/shape-dimension-guide-meta";
import { ERT_PROBLEM_SLUG } from "../../src/lib/tools/runtime-trust-engine";
import { listAllPremiumToolRouteSlugs } from "../../src/lib/tools/free-traffic-routes";
import { getPremiumRevenueRouteSlugs } from "../../src/lib/tools/revenue-tools";
import { listPremiumSchemaSlugs } from "../../src/lib/premium-schema/schemas/index";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const REPORT_PATH = path.join(ROOT, "scripts/.cache/input-guide-audit-report.json");

const P81_SHAPE_SLUGS = listShapeDimensionGuideSlugs();
const PILOT_SLUGS = listPremiumPilotGuideSlugs();

type AuditItem = {
  slug: string;
  status: string;
  decision: ToolGuideAuditDecision;
  shouldRender: boolean;
  guideEligible: boolean;
  guideType?: string;
  findings: string[];
  hasGuideSpec: boolean;
  hasInputMap: boolean;
  isGenericFallback: boolean;
  legacyGenericWouldRender: boolean;
  localeKeysPresent: boolean;
  arRtlRisk: boolean;
};

function collectSlugs(): string[] {
  const slugs = new Set<string>([
    ...listAllPremiumToolRouteSlugs(),
    ...getPremiumRevenueRouteSlugs(),
    ...listPremiumSchemaSlugs(),
    ERT_PROBLEM_SLUG,
  ]);
  return [...slugs].sort((a, b) => a.localeCompare(b));
}

function main(): void {
  const slugs = collectSlugs();
  const specSlugs = new Set(listToolGuideSpecSlugs());
  const items: AuditItem[] = [];
  const failures: string[] = [];

  for (const slug of slugs) {
    const keys = resolveToolFormInputKeys(slug);
    const decision = evaluateInputGuideDecision(slug, keys);
    const policy = evaluateToolGuidePolicy(slug, keys);
    const legacyGeneric = keys.length > 0 && wouldLegacyGenericGuideRender(slug, keys);
    const localeKeysPresent = Boolean(
      policy.guideType &&
        (decision.spec?.titleKey || decision.spec?.descriptionKey),
    );
    const arRtlRisk =
      slug !== ERT_PROBLEM_SLUG &&
      policy.hasGuideSpec &&
      !localeKeysPresent &&
      legacyGeneric;

    items.push({
      slug,
      status: decision.status,
      decision: policy.decision,
      shouldRender: policy.guideEligible,
      guideEligible: policy.guideEligible,
      guideType: decision.guideType,
      findings: [...policy.findings],
      hasGuideSpec: policy.hasGuideSpec,
      hasInputMap: policy.hasInputMap,
      isGenericFallback: policy.isGenericFallback,
      legacyGenericWouldRender: legacyGeneric,
      localeKeysPresent,
      arRtlRisk,
    });
  }

  const renderableGuides = items.filter((item) => item.shouldRender).length;
  const hiddenNoSpec = items.filter((item) => item.decision === "needs_spec").length;
  const blockedGeneric = items.filter((item) => item.decision === "generic_blocked").length;
  const manualDesignReview = items.filter(
    (item) => item.decision === "manual_design_review",
  ).length;
  const inputKeyMismatch = items.filter((item) =>
    item.findings.includes("input_key_mismatch"),
  ).length;

  const problem = items.find((item) => item.slug === ERT_PROBLEM_SLUG);
  if (!problem) {
    failures.push(`${ERT_PROBLEM_SLUG}: missing from audit set`);
  } else if (problem.shouldRender) {
    failures.push(`${ERT_PROBLEM_SLUG}: guide must be hidden`);
  } else if (problem.legacyGenericWouldRender && !problem.findings.includes("generic_fallback_detected")) {
    failures.push(`${ERT_PROBLEM_SLUG}: legacy generic not flagged`);
  }

  for (const slug of P81_SHAPE_SLUGS) {
    const keys = resolveToolFormInputKeys(slug);
    const decision = evaluateInputGuideDecision(slug, keys);
    if (!decision.shouldRender) {
      failures.push(
        `P81 regression: ${slug} guide not renderable → ${decision.findings.join(", ")}`,
      );
    }
  }

  for (const slug of PILOT_SLUGS) {
    const keys = resolveToolFormInputKeys(slug);
    const decision = evaluateInputGuideDecision(slug, keys);
    if (!decision.shouldRender) {
      failures.push(`Pilot guide not renderable: ${slug} → ${decision.findings.join(", ")}`);
    }
  }

  const genericRendered = items.filter(
    (item) => item.shouldRender && item.legacyGenericWouldRender && !specSlugs.has(item.slug),
  );
  if (genericRendered.length > 0) {
    failures.push(
      `Generic fallback would render for: ${genericRendered.map((item) => item.slug).join(", ")}`,
    );
  }

  const mismatchRendered = items.filter(
    (item) => item.shouldRender && item.findings.includes("input_key_mismatch"),
  );
  if (mismatchRendered.length > 0) {
    failures.push(
      `Input key mismatch rendered for: ${mismatchRendered.map((item) => item.slug).join(", ")}`,
    );
  }

  const report = {
    generatedAt: new Date().toISOString(),
    totalChecked: items.length,
    withGuideSpec: items.filter((item) => specSlugs.has(item.slug)).length,
    renderableGuides,
    hiddenNoSpec,
    blockedGeneric,
    manualDesignReview,
    inputKeyMismatch,
    decisions: {
      eligible: items.filter((item) => item.decision === "eligible").length,
      hide_guide: items.filter((item) => item.decision === "hide_guide").length,
      needs_spec: hiddenNoSpec,
      generic_blocked: blockedGeneric,
      manual_design_review: manualDesignReview,
    },
    items,
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  const risky = items
    .filter((item) => item.legacyGenericWouldRender && !item.shouldRender)
    .slice(0, 15);

  if (failures.length > 0) {
    console.error("audit:input-guides FAIL");
    for (const failure of failures) {
      console.error(` - ${failure}`);
    }
    process.exit(1);
  }

  console.log("audit:input-guides PASS");
  console.log(`totalChecked: ${report.totalChecked}`);
  console.log(`withGuideSpec: ${report.withGuideSpec}`);
  console.log(`renderable: ${renderableGuides}`);
  console.log(`hidden: ${hiddenNoSpec}`);
  console.log(`blocked: ${blockedGeneric}`);
  console.log(`manualDesignReview: ${manualDesignReview}`);
  console.log(`inputKeyMismatch: ${inputKeyMismatch}`);
  console.log(`output: ${path.relative(ROOT, REPORT_PATH)}`);
  console.log("\nTop risky guide surfaces (legacy generic blocked):");
  for (const item of risky) {
    console.log(` - ${item.slug} → ${item.findings.join(", ")}`);
  }
  if (problem) {
    console.log("\nProblem slug guide status:");
    console.log(
      ` ${ERT_PROBLEM_SLUG} → shouldRender=${problem.shouldRender}, findings=${problem.findings.join(", ")}`,
    );
  }
}

main();
