import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateRuntimeTrust } from "../../src/lib/tools/runtime-trust-engine";
import { hasFormulaSourceAudit } from "../../src/lib/formula-governance/formula-source-audit-registry";
import { listAllPremiumToolRouteSlugs } from "../../src/lib/tools/free-traffic-routes";
import { getPremiumRevenueRouteSlugs } from "../../src/lib/tools/revenue-tools";
import { listPremiumSchemaSlugs } from "../../src/lib/premium-schema/schemas/index";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const REPORT_PATH = path.join(ROOT, "scripts/.cache/runtime-trust-engine-report.json");

type AuditItem = {
  slug: string;
  route: string;
  tier: string;
  locale: string;
  status: "ready" | "review" | "blocked";
  formulaGateEligible: boolean;
  paymentEligible: boolean;
  calculationEligible: boolean;
  findings: string[];
  recommendedAction: string;
};

function collectSlugs(): string[] {
  const slugs = new Set<string>([
    ...listAllPremiumToolRouteSlugs(),
    ...getPremiumRevenueRouteSlugs(),
    ...listPremiumSchemaSlugs(),
  ]);
  return [...slugs].sort((a, b) => a.localeCompare(b));
}

function main(): void {
  const slugs = collectSlugs();
  const items: AuditItem[] = [];

  for (const slug of slugs) {
    const decision = evaluateRuntimeTrust({
      slug,
      locale: "tr",
      surface: "premium",
      premiumSurfaceUsesFreeCopy: false,
    });
    items.push({
      slug,
      route: decision.route,
      tier: decision.tier,
      locale: decision.locale,
      status: decision.status,
      formulaGateEligible: decision.formulaGateEligible,
      paymentEligible: decision.paymentEligible,
      calculationEligible: decision.calculationEligible,
      findings: [...decision.findings],
      recommendedAction: decision.recommendedAction,
    });
  }

  const falseBadgeRegistry = items.filter(
    (item) => hasFormulaSourceAudit(item.slug) && !item.formulaGateEligible,
  );

  const report = {
    generatedAt: new Date().toISOString(),
    totalChecked: items.length,
    ready: items.filter((item) => item.status === "ready").length,
    review: items.filter((item) => item.status === "review").length,
    blocked: items.filter((item) => item.status === "blocked").length,
    formulaGateEligible: items.filter((item) => item.formulaGateEligible).length,
    paymentEligible: items.filter((item) => item.paymentEligible).length,
    falseBadgeWouldHaveShown: falseBadgeRegistry.length,
    items,
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  const risky = items.filter((item) => !item.formulaGateEligible).slice(0, 20);
  const problem = items.find((item) => item.slug === "abonelik-yazilim-cloud-yillik-maliyet-hesabi");

  console.log("audit:runtime-trust-engine phase 2 PASS");
  console.log(`totalChecked: ${report.totalChecked}`);
  console.log(`ready: ${report.ready}`);
  console.log(`review: ${report.review}`);
  console.log(`blocked: ${report.blocked}`);
  console.log(`formulaGateEligible: ${report.formulaGateEligible}`);
  console.log(`paymentEligible: ${report.paymentEligible}`);
  console.log(`falseBadgeWouldHaveShown: ${report.falseBadgeWouldHaveShown}`);
  console.log(`output: ${path.relative(ROOT, REPORT_PATH)}`);
  console.log("\nTop risky tools:");
  for (const item of risky) {
    console.log(` - ${item.slug} (${item.tier}) ${item.status} → ${item.findings.join(", ")}`);
  }
  if (problem) {
    console.log("\nProblem slug:");
    console.log(
      ` abonelik-yazilim-cloud-yillik-maliyet-hesabi → ${problem.status}, formulaGateEligible=${problem.formulaGateEligible}, paymentEligible=${problem.paymentEligible}, findings=${problem.findings.join(", ")}`,
    );
  }
  if (falseBadgeRegistry.length > 0) {
    console.log("\nRegistry audit but trust-ineligible (badge blocked):");
    for (const item of falseBadgeRegistry.slice(0, 10)) {
      console.log(` - ${item.slug}`);
    }
  }
}

main();
