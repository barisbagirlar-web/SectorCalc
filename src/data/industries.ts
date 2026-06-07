import {
 industryRegistry,
 type IndustryIcon,
 type IndustrySlug,
} from "@/lib/tools/industry-registry";
import { getRevenueToolBySector } from "@/lib/tools/revenue-tools";

export type { IndustrySlug, IndustryIcon };

export interface Industry {
 slug: IndustrySlug;
 name: string;
 shortDescription: string;
 description: string;
 businessPain: string;
 href: string;
 icon: IndustryIcon;
 accentColor: "blue" | "cyan" | "emerald" | "amber";
 category: string;
 freeToolSlugs: string[];
 premiumToolSlugs: string[];
 priority: number;
}

export const INDUSTRIES: Industry[] = industryRegistry.map((entry) => {
 const tool = getRevenueToolBySector(entry.slug);
 return {
 slug: entry.slug,
 name: entry.name,
 shortDescription: entry.description,
 description: entry.description,
 businessPain: entry.painStatement,
 href: `/industries/${entry.slug}`,
 icon: entry.icon,
 accentColor: entry.accentColor,
 category: entry.category,
 freeToolSlugs: tool ? [tool.freeSlug] : [],
 premiumToolSlugs: tool ? [tool.paidSlug] : [],
 priority: entry.priority,
 };
});

export function getIndustryBySlug(slug: IndustrySlug): Industry | undefined {
 return INDUSTRIES.find((industry) => industry.slug === slug);
}

export function getIndustryByHref(href: string): Industry | undefined {
 return INDUSTRIES.find((industry) => industry.href === href);
}
