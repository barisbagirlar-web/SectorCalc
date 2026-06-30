import {
  buildUtmHref,
  mergeAttributionContext,
  type AttributionContext,
} from "@/lib/analytics/attribution";
import {
  CAMPAIGN_CLUSTERS,
  getCampaignClusterById,
  type CampaignCluster,
} from "@/lib/campaigns/campaign-clusters";

export type CampaignCtaLink = {
  readonly clusterId: string;
  readonly label: string;
  readonly href: string;
  readonly ctaId: string;
};

function normalizeHref(href: string): string {
  return href.startsWith("/") ? href : `/${href}`;
}

export function getCampaignLandingLinks(): readonly CampaignCtaLink[] {
  return CAMPAIGN_CLUSTERS.map((cluster) => ({
    clusterId: cluster.id,
    label: cluster.name,
    href: normalizeHref(cluster.landingHref),
    ctaId: `campaign_landing_${cluster.id}`,
  }));
}

export function getPrimaryCampaignCtas(): readonly CampaignCtaLink[] {
  return CAMPAIGN_CLUSTERS.slice(0, 4).map((cluster) => ({
    clusterId: cluster.id,
    label: cluster.name,
    href: normalizeHref(cluster.landingHref),
    ctaId: `homepage_campaign_${cluster.id}`,
  }));
}

export function buildTrackedCtaHref(
  href: string,
  campaignId: string | undefined,
  source: string,
  medium: string,
  context?: Partial<AttributionContext>
): string {
  const cluster: CampaignCluster | undefined = campaignId
    ? getCampaignClusterById(campaignId)
    : undefined;

  const merged = mergeAttributionContext(context, {
    utmSource: source,
    utmMedium: medium,
    utmCampaign: cluster?.utmCampaign ?? campaignId,
  });

  return buildUtmHref(href, merged);
}

export function appendAttributionToNotes(
  notes: string,
  context: Partial<AttributionContext>
): string {
  const parts: string[] = [];
  if (context.utmSource) parts.push(`source=${context.utmSource}`);
  if (context.utmMedium) parts.push(`medium=${context.utmMedium}`);
  if (context.utmCampaign) parts.push(`campaign=${context.utmCampaign}`);
  if (context.referrer) parts.push(`referrer=${context.referrer}`);
  if (context.landingPath) parts.push(`landing=${context.landingPath}`);

  if (parts.length === 0) {
    return notes.trim();
  }

  const attributionBlock = `\n\n--- Attribution ---\n${parts.join(" | ")}`;
  const trimmedNotes = notes.trim();
  return trimmedNotes ? `${trimmedNotes}${attributionBlock}` : attributionBlock.trim();
}
