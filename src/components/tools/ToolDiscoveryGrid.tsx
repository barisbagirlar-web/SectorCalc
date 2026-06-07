import Link from "next/link";
import type { Tool } from "@/data/tools";
import { getIndustryBySlug, type IndustrySlug } from "@/data/industries";

type ToolDiscoveryCardProps = {
 tool: Tool;
};

export function ToolDiscoveryCard({ tool }: ToolDiscoveryCardProps) {
 const industry = getIndustryBySlug(tool.industrySlug as IndustrySlug);
 const isPremium = tool.tier === "premium";

 return (
 <Link
 href={tool.href}
 className="group flex h-full min-h-[120px] flex-col justify-between rounded-sm border border-border-subtle bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-deep-navy/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-navy/30 focus-visible:ring-offset-2"
 >
 <div className="min-w-0">
 <div className="flex flex-wrap items-center gap-2">
 <span
 className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ring-1 ${
 isPremium
 ? "bg-amber/15 text-amber ring-amber/25"
 : "bg-emerald/10 text-deep-navy ring-emerald/20"
 }`}
 >
 {isPremium ? "Premium" : "Free"}
 </span>
 {industry ? (
 <span className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
 {industry.name}
 </span>
 ) : null}
 </div>
 <h3 className="mt-3 break-words text-base font-bold leading-snug text-text-primary line-clamp-2 group-hover:text-deep-navy">
 {tool.name}
 </h3>
 <p className="mt-2 line-clamp-2 break-words text-sm leading-relaxed text-text-secondary">
 {tool.shortDescription}
 </p>
 </div>
 <span className="mt-4 text-sm font-semibold text-deep-navy transition group-hover:translate-x-0.5">
 Open tool →
 </span>
 </Link>
 );
}

type ToolDiscoveryGridProps = {
 tools: Tool[];
};

export function ToolDiscoveryGrid({ tools }: ToolDiscoveryGridProps) {
 if (tools.length === 0) {
 return null;
 }

 return (
 <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
 {tools.map((tool) => (
 <li key={tool.slug} className="min-w-0">
 <ToolDiscoveryCard tool={tool} />
 </li>
 ))}
 </ul>
 );
}
