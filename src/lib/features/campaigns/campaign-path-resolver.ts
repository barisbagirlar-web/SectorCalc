/**
 * Infer campaign cluster from landing/tool paths when utm_campaign is absent.
 */

import { CAMPAIGN_CLUSTERS, type CampaignCluster } from "@/lib/features/campaigns/campaign-clusters";

function normalizePath(path: string): string {
  const withoutQuery = path.split("?")[0] ?? path;
  const trimmed = withoutQuery.replace(/\/$/, "");
  return trimmed.length > 0 ? trimmed : "/";
}

function pathEquals(left: string, right: string): boolean {
  return normalizePath(left) === normalizePath(right);
}

function pathInCluster(cluster: CampaignCluster, pagePath: string): boolean {
  const normalized = normalizePath(pagePath);

  if (pathEquals(normalized, cluster.landingHref)) {
    return true;
  }

  for (const href of cluster.freeToolHrefs) {
    if (pathEquals(normalized, href)) {
      return true;
    }
  }

  for (const href of cluster.premiumAnalyzerHrefs) {
    if (pathEquals(normalized, href)) {
      return true;
    }
  }

  return false;
}

export function resolveCampaignIdForPath(pagePath: string): string | undefined {
  const normalized = normalizePath(pagePath);
  const cluster = CAMPAIGN_CLUSTERS.find((item) => pathInCluster(item, normalized));
  return cluster?.utmCampaign;
}

export function resolveCampaignClusterForPath(pagePath: string): CampaignCluster | undefined {
  const normalized = normalizePath(pagePath);
  return CAMPAIGN_CLUSTERS.find((item) => pathInCluster(item, normalized));
}
