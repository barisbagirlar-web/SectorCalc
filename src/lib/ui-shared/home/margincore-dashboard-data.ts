import type { IndustrySlug } from "@/lib/features/tools/industry-registry";
import { getRevenueToolBySector } from "@/lib/features/tools/revenue-tools";
import { getFreeToolHref, getPremiumToolHref } from "@/lib/features/tools/tool-links";

export type DashboardSectorGroupId = "industry" | "construction" | "logistics";

export type DashboardSectorGroup = {
  id: DashboardSectorGroupId;
  slugs: readonly IndustrySlug[];
};

export const DASHBOARD_SECTOR_GROUPS: readonly DashboardSectorGroup[] = [
  {
    id: "industry",
    slugs: [
      "cnc-manufacturing",
      "welding-fabrication",
      "sheet-metal",
      "3d-printing-service",
    ],
  },
  {
    id: "construction",
    slugs: ["construction", "roofing", "hvac", "plumbing"],
  },
  {
    id: "logistics",
    slugs: ["logistics-transport"],
  },
] as const;

export type ExecutiveSectorRow = {
  slug: IndustrySlug;
  sectorName: string;
  freeTool: string;
  premiumTool: string;
  summary: string;
  freeHref: string;
  premiumHref: string;
};

export type ActivityRow = {
  id: string;
  sector: string;
  verdict: string;
  updatedAt: string;
  status: "complete" | "pending" | "sample";
};

export function buildExecutiveSectorRows(
  slugs: readonly IndustrySlug[],
  getSectorName: (slug: IndustrySlug) => string
): ExecutiveSectorRow[] {
  const rows: ExecutiveSectorRow[] = [];

  for (const slug of slugs) {
    const tool = getRevenueToolBySector(slug);
    if (!tool) {
      continue;
    }

    rows.push({
      slug,
      sectorName: getSectorName(slug),
      freeTool: tool.freeTitle,
      premiumTool: tool.paidTitle,
      summary: tool.painStatement,
      freeHref: getFreeToolHref(tool),
      premiumHref: getPremiumToolHref(tool),
    });
  }

  return rows;
}

export const ACTIVITY_PLACEHOLDER_ROWS: readonly ActivityRow[] = [
  {
    id: "RPT-2026-0142",
    sector: "CNC Manufacturing",
    verdict: "REPRICE — P90 buffer exceeded",
    updatedAt: "2026-06-04T09:14:00Z",
    status: "sample",
  },
  {
    id: "RPT-2026-0138",
    sector: "Construction",
    verdict: "ACCEPT WITH CAUTION",
    updatedAt: "2026-06-03T16:42:00Z",
    status: "sample",
  },
  {
    id: "RPT-2026-0131",
    sector: "Logistics & Transport",
    verdict: "MARGIN WATCH — desi variance",
    updatedAt: "2026-06-02T11:08:00Z",
    status: "sample",
  },
  {
    id: "—",
    sector: "—",
    verdict: "Sign in to load saved reports",
    updatedAt: "",
    status: "pending",
  },
] as const;
