import {
  getLeadPriorityLabel,
  getLeadStatusLabel,
  resolveLeadPriority,
  resolveLeadStatus,
} from "@/lib/leads/lead-pipeline";
import { getAttributionDistributionKey } from "@/lib/leads/source-attribution";
import type { LeadIntent, LeadPriority, LeadStatus } from "@/lib/leads/types";

export interface LeadDashboardCounts {
  total: number;
  newCount: number;
  hotCount: number;
  qualifiedCount: number;
  convertedCount: number;
  lostCount: number;
}

export interface DistributionItem {
  key: string;
  label: string;
  count: number;
}

export interface AttributionDistribution {
  top5: DistributionItem[];
  unknownCount: number;
  all: DistributionItem[];
}

export interface LeadDashboardStats {
  counts: LeadDashboardCounts;
  priority: DistributionItem[];
  status: DistributionItem[];
  attribution: AttributionDistribution;
}

const STATUS_ORDER: LeadStatus[] = [
  "new",
  "reviewed",
  "contacted",
  "qualified",
  "converted",
  "lost",
];

const PRIORITY_ORDER: LeadPriority[] = ["hot", "warm", "cold"];

const UNKNOWN_ATTRIBUTION_KEY = "Unknown";

function buildDistribution(
  leads: LeadIntent[],
  pickKey: (lead: LeadIntent) => string,
  pickLabel: (key: string) => string
): DistributionItem[] {
  const counts = new Map<string, number>();
  for (const lead of leads) {
    const key = pickKey(lead);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([key, count]) => ({
      key,
      label: pickLabel(key),
      count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function buildAttributionDistribution(leads: LeadIntent[]): AttributionDistribution {
  const all = buildDistribution(
    leads,
    getAttributionDistributionKey,
    (key) => key
  );

  const unknownCount =
    all.find((item) => item.key === UNKNOWN_ATTRIBUTION_KEY)?.count ?? 0;

  const top5 = all
    .filter((item) => item.key !== UNKNOWN_ATTRIBUTION_KEY)
    .slice(0, 5);

  return { top5, unknownCount, all };
}

export function computeLeadDashboardStats(leads: LeadIntent[]): LeadDashboardStats {
  let newCount = 0;
  let hotCount = 0;
  let qualifiedCount = 0;
  let convertedCount = 0;
  let lostCount = 0;

  const priorityCounts: Record<LeadPriority, number> = {
    hot: 0,
    warm: 0,
    cold: 0,
  };

  const statusCounts: Record<LeadStatus, number> = {
    new: 0,
    reviewed: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    lost: 0,
  };

  for (const lead of leads) {
    const status = resolveLeadStatus(lead);
    const priority = resolveLeadPriority(lead);

    statusCounts[status] += 1;
    priorityCounts[priority] += 1;

    if (status === "new") newCount += 1;
    if (status === "qualified") qualifiedCount += 1;
    if (status === "converted") convertedCount += 1;
    if (status === "lost") lostCount += 1;
    if (priority === "hot") hotCount += 1;
  }

  return {
    counts: {
      total: leads.length,
      newCount,
      hotCount,
      qualifiedCount,
      convertedCount,
      lostCount,
    },
    priority: PRIORITY_ORDER.map((key) => ({
      key,
      label: getLeadPriorityLabel(key),
      count: priorityCounts[key],
    })),
    status: STATUS_ORDER.map((key) => ({
      key,
      label: getLeadStatusLabel(key),
      count: statusCounts[key],
    })),
    attribution: buildAttributionDistribution(leads),
  };
}
