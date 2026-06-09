#!/usr/bin/env npx tsx
/**
 * Campaign cluster + UTM wiring audit — Phase 4 (launch tracking gate).
 */

import { CAMPAIGN_CLUSTERS, buildCampaignUrl } from "../src/lib/campaigns/campaign-clusters";
import { buildTrackedCtaHref } from "../src/lib/campaigns/campaign-links";
import { resolveCampaignIdForPath } from "../src/lib/campaigns/campaign-path-resolver";
import { SUPPORTED_LOCALES } from "../src/lib/i18n/locale-config";
import { addLocaleToPath } from "../src/lib/i18n/locale-routing";
import { industryRegistry } from "../src/lib/tools/industry-registry";
import { PROGRAMMATIC_SEO_PAGES } from "../src/lib/seo/programmatic-seo-pages";

const BASE_URL = process.env.CAMPAIGN_QA_BASE_URL ?? "https://sectorcalc.com";
const RUN_SMOKE = process.env.CAMPAIGN_QA_SMOKE === "1";

type AuditIssue = { level: "error" | "warn"; message: string };

const issues: AuditIssue[] = [];

function record(level: AuditIssue["level"], message: string): void {
  issues.push({ level, message });
}

function assertLandingHrefExists(href: string): void {
  if (href.startsWith("/seo/")) {
    const slug = href.replace("/seo/", "");
    const page = PROGRAMMATIC_SEO_PAGES.find((item) => item.slug === slug);
    if (!page) {
      record("error", `Missing programmatic SEO page for landing ${href}`);
    }
    return;
  }

  if (href.startsWith("/industries/")) {
    const slug = href.replace("/industries/", "");
    const industry = industryRegistry.find((item) => item.slug === slug);
    if (!industry) {
      record("error", `Missing industry registry entry for landing ${href}`);
    }
    return;
  }

  record("error", `Unsupported landing href pattern: ${href}`);
}

async function smokePath(path: string): Promise<void> {
  const url = `${BASE_URL.replace(/\/$/, "")}${path}`;
  try {
    const response = await fetch(url, { redirect: "follow" });
    if (!response.ok) {
      record("error", `Smoke failed ${url} → HTTP ${response.status}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    record("error", `Smoke fetch error ${url}: ${message}`);
  }
}

function runStaticAudit(): void {
  if (CAMPAIGN_CLUSTERS.length !== 8) {
    record("error", `Expected 8 campaign clusters, found ${CAMPAIGN_CLUSTERS.length}`);
  }

  const campaignIds = new Set<string>();
  for (const cluster of CAMPAIGN_CLUSTERS) {
    if (campaignIds.has(cluster.utmCampaign)) {
      record("error", `Duplicate utm_campaign: ${cluster.utmCampaign}`);
    }
    campaignIds.add(cluster.utmCampaign);

    if (cluster.id !== cluster.utmCampaign) {
      record("warn", `Cluster id differs from utm_campaign for ${cluster.id}`);
    }

    assertLandingHrefExists(cluster.landingHref);

    const landingResolved = resolveCampaignIdForPath(cluster.landingHref);
    if (landingResolved !== cluster.utmCampaign) {
      record(
        "error",
        `Path resolver mismatch on landing ${cluster.landingHref}: expected ${cluster.utmCampaign}, got ${landingResolved ?? "undefined"}`,
      );
    }

    for (const href of cluster.freeToolHrefs) {
      const resolved = resolveCampaignIdForPath(href);
      if (resolved !== cluster.utmCampaign) {
        record(
          "error",
          `Path resolver mismatch on free tool ${href}: expected ${cluster.utmCampaign}, got ${resolved ?? "undefined"}`,
        );
      }
    }

    for (const href of cluster.premiumAnalyzerHrefs) {
      const resolved = resolveCampaignIdForPath(href);
      if (resolved !== cluster.utmCampaign) {
        record(
          "error",
          `Path resolver mismatch on premium tool ${href}: expected ${cluster.utmCampaign}, got ${resolved ?? "undefined"}`,
        );
      }
    }

    const sampleUrl = buildCampaignUrl(cluster.landingHref, cluster.id, "linkedin", "social");
    if (!sampleUrl.includes("utm_campaign=")) {
      record("error", `buildCampaignUrl missing utm_campaign for ${cluster.id}`);
    }

    const trackedPricing = buildTrackedCtaHref(
      cluster.pricingHref,
      cluster.utmCampaign,
      "seo_hub",
      "pricing",
    );
    if (!trackedPricing.includes(`utm_campaign=${cluster.utmCampaign}`)) {
      record("error", `buildTrackedCtaHref missing campaign for ${cluster.id} pricing CTA`);
    }
  }
}

async function main(): Promise<void> {
  runStaticAudit();

  if (RUN_SMOKE) {
    for (const locale of SUPPORTED_LOCALES) {
      for (const cluster of CAMPAIGN_CLUSTERS) {
        await smokePath(addLocaleToPath(cluster.landingHref, locale));
      }
    }
  }

  const errors = issues.filter((item) => item.level === "error");
  const warnings = issues.filter((item) => item.level === "warn");

  console.log("Campaign / UTM audit");
  console.log(`Clusters: ${CAMPAIGN_CLUSTERS.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  if (RUN_SMOKE) {
    console.log(`Smoke base: ${BASE_URL}`);
  }

  for (const issue of issues) {
    console.log(`${issue.level.toUpperCase()}: ${issue.message}`);
  }

  if (errors.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
