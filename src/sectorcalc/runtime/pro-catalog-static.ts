// SectorCalc — Static PRO Catalog (compile-time, zero runtime fs)
//
// WHY THIS EXISTS
// The /pro-tools listing page previously called getAllProToolSchemas(),
// which scans schema directories with fs.readdirSync at runtime. Inside the
// deployed Firebase Cloud Function bundle those directories are not
// guaranteed to exist at the paths the scan probes, which made the live
// listing render "0 tools" while every detail page (which does not depend
// on a directory scan) kept working. Root cause class: runtime filesystem
// layout is deployment-dependent; static imports are not.
//
// DESIGN (invariants)
// - SSOT: each schema JSON below IS the source; nothing is duplicated here.
//   ACTIVE_PRO_TOOL_SLUGS remains the single activation authority.
// - COMPILE-TIME: webpack inlines every JSON import into the server bundle.
//   A missing/renamed schema file fails `next build`, never production.
// - DEFENSIVE: module-load assertions guarantee (a) every active slug has a
//   statically imported schema and (b) each schema's embedded tool_key
//   matches its slug (same identity discipline as assertToolSchemaIdentity).
//   A violation throws loudly at build/prerender — no silent empty catalog.
//
// MAINTENANCE RULE
// Activating a new PRO tool = add its slug to ACTIVE_PRO_TOOL_SLUGS *and*
// add its schema import to STATIC_PRO_SCHEMAS in the same PR. The assertion
// below turns forgetting the second step into a hard build failure.

import "server-only";
import { ACTIVE_PRO_TOOL_SLUGS } from "@/sectorcalc/runtime/active-tool-allowlist";

// Baris PRO V5.3.1 — Batch 1
import breakEvenSurvivalCash from "@/sectorcalc/schemas/pro-v531/break-even-survival-cash-calculator.schema.json";
import machineHourlyRate from "@/sectorcalc/schemas/pro-v531/machine-hourly-rate-proof-report.schema.json";
import lossMakingJobDetector from "@/sectorcalc/schemas/pro-v531/loss-making-job-detector.schema.json";
import receivablesCostPaymentTerm from "@/sectorcalc/schemas/pro-v531/receivables-cost-payment-term-addendum.schema.json";
import setupTimeReductionRoiSmed from "@/sectorcalc/schemas/pro-v531/setup-time-reduction-roi-smed.schema.json";
import productSkuMarginRanker from "@/sectorcalc/schemas/pro-v531/product-sku-margin-ranker.schema.json";
import trueEmployeeCostStatement from "@/sectorcalc/schemas/pro-v531/true-employee-cost-statement.schema.json";
import jobQuoteBuilderProPack from "@/sectorcalc/schemas/pro-v531/job-quote-builder-pro-pack.schema.json";
import machineInvestmentBuyLeaseKeep from "@/sectorcalc/schemas/pro-v531/machine-investment-feasibility-buy-lease-keep.schema.json";
import capitalEquipmentNpvIrr from "@/sectorcalc/schemas/pro-v531/capital-equipment-investment-appraisal-npv-irr.schema.json";
// Baris PRO V5.3.1 — Batch 2
import customerSkuProfitabilityForensics from "@/sectorcalc/schemas/pro-v531/customer-sku-profitability-forensics.schema.json";
import downtimeScrapLossStatement from "@/sectorcalc/schemas/pro-v531/downtime-scrap-loss-statement.schema.json";
import oeeLossMonetization from "@/sectorcalc/schemas/pro-v531/oee-loss-monetization-improvement-business-case.schema.json";
import scrapReworkCostTracker from "@/sectorcalc/schemas/pro-v531/scrap-rework-cost-tracker.schema.json";
import outsourceVsInHouseAnalyzer from "@/sectorcalc/schemas/pro-v531/outsource-vs-in-house-analyzer.schema.json";
import plantWideShopRateAudit from "@/sectorcalc/schemas/pro-v531/plant-wide-shop-rate-cost-structure-audit.schema.json";
import fxCommodityPassThroughPricer from "@/sectorcalc/schemas/pro-v531/fx-commodity-pass-through-pricer.schema.json";
import energyEfficiencyGrantPack from "@/sectorcalc/schemas/pro-v531/energy-efficiency-grant-incentive-feasibility-pack.schema.json";
import motorCompressorReplacementRoi from "@/sectorcalc/schemas/pro-v531/motor-compressor-replacement-roi.schema.json";
import weldProcedureCostSuite from "@/sectorcalc/schemas/pro-v531/weld-procedure-cost-consumable-estimation-suite.schema.json";

interface StaticProSchemaHead {
  tool_key: string;
  tool_name: string;
}

// Only the catalog-relevant head fields are typed; the imported JSON objects
// carry the full schema but the listing consumes nothing beyond these two.
const STATIC_PRO_SCHEMAS: readonly StaticProSchemaHead[] = [
  breakEvenSurvivalCash,
  machineHourlyRate,
  lossMakingJobDetector,
  receivablesCostPaymentTerm,
  setupTimeReductionRoiSmed,
  productSkuMarginRanker,
  trueEmployeeCostStatement,
  jobQuoteBuilderProPack,
  machineInvestmentBuyLeaseKeep,
  capitalEquipmentNpvIrr,
  customerSkuProfitabilityForensics,
  downtimeScrapLossStatement,
  oeeLossMonetization,
  scrapReworkCostTracker,
  outsourceVsInHouseAnalyzer,
  plantWideShopRateAudit,
  fxCommodityPassThroughPricer,
  energyEfficiencyGrantPack,
  motorCompressorReplacementRoi,
  weldProcedureCostSuite,
] as const;

export interface ProCatalogEntry {
  toolKey: string;
  toolName: string;
}

const CATALOG_BY_KEY: ReadonlyMap<string, ProCatalogEntry> = (() => {
  const map = new Map<string, ProCatalogEntry>();
  for (const s of STATIC_PRO_SCHEMAS) {
    if (!s.tool_key || !s.tool_name) {
      throw new Error(
        `pro-catalog-static: schema missing tool_key/tool_name (got key=${String(
          s.tool_key,
        )})`,
      );
    }
    if (map.has(s.tool_key)) {
      throw new Error(`pro-catalog-static: duplicate tool_key ${s.tool_key}`);
    }
    map.set(s.tool_key, { toolKey: s.tool_key, toolName: s.tool_name });
  }
  // Identity + coverage assertion: every ACTIVE pro slug must be present.
  const missing = ACTIVE_PRO_TOOL_SLUGS.filter((slug) => !map.has(slug));
  if (missing.length > 0) {
    throw new Error(
      `pro-catalog-static: ${missing.length} active PRO slug(s) have no statically imported schema: ${missing.join(
        ", ",
      )}. Add the import(s) to STATIC_PRO_SCHEMAS.`,
    );
  }
  return map;
})();

/**
 * Compile-time PRO catalog for listing surfaces.
 * Returns exactly the ACTIVE_PRO_TOOL_SLUGS set, in allowlist order,
 * with display names sourced from each tool's own schema JSON (SSOT).
 * Never touches the filesystem at runtime; cannot silently return [].
 */
export function getStaticProCatalog(): ProCatalogEntry[] {
  return ACTIVE_PRO_TOOL_SLUGS.map((slug) => {
    const entry = CATALOG_BY_KEY.get(slug);
    // Unreachable given the module-load assertion; kept for I7 explicit-fail.
    if (!entry) {
      throw new Error(`pro-catalog-static: no catalog entry for ${slug}`);
    }
    return entry;
  });
}
