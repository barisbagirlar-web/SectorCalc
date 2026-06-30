/**
 * Campaign cluster revenue intent scoring for weekly review.
 * V1: accepts in-memory event records; no Firestore dependency.
 */

import {
  getRecommendedRevenueAction,
  getRevenueIntentLevel,
  scoreRevenueIntent,
  type RevenueEventRecord,
} from "@/lib/infrastructure/analytics/revenue-funnel";
import type { CampaignCluster } from "@/lib/features/campaigns/campaign-clusters";

export type CampaignRevenueScore = {
  readonly campaignId: string;
  readonly clusterName: string;
  readonly totalEvents: number;
  readonly revenueIntentScore: number;
  readonly level: "cold" | "warm" | "hot";
  readonly topAction: string;
};

function filterClusterEvents(
  cluster: CampaignCluster,
  events: readonly RevenueEventRecord[],
): RevenueEventRecord[] {
  return events.filter((event) => event.campaignId === cluster.utmCampaign);
}

export function buildCampaignRevenueScore(
  cluster: CampaignCluster,
  events: readonly RevenueEventRecord[],
): CampaignRevenueScore {
  const matched = filterClusterEvents(cluster, events);
  const summary = scoreRevenueIntent(matched);

  return {
    campaignId: cluster.utmCampaign,
    clusterName: cluster.name,
    totalEvents: matched.length,
    revenueIntentScore: summary.totalScore,
    level: summary.level,
    topAction: getRecommendedRevenueAction(summary),
  };
}

export function rankCampaignsByRevenueIntent(
  clusters: readonly CampaignCluster[],
  events: readonly RevenueEventRecord[],
): CampaignRevenueScore[] {
  if (events.length === 0) {
    return clusters.map((cluster) => buildCampaignRevenueScore(cluster, []));
  }

  return [...clusters]
    .map((cluster) => buildCampaignRevenueScore(cluster, events))
    .sort((a, b) => {
      if (b.revenueIntentScore !== a.revenueIntentScore) {
        return b.revenueIntentScore - a.revenueIntentScore;
      }
      return a.clusterName.localeCompare(b.clusterName);
    });
}

export function getTopCampaignAction(score: CampaignRevenueScore): string {
  if (score.totalEvents === 0) {
    return "No attributed events yet — verify UTM campaign tags on cluster landing links.";
  }
  return score.topAction;
}

export function isCampaignScoreActionable(score: CampaignRevenueScore): boolean {
  return score.level !== "cold" || score.totalEvents > 0;
}
