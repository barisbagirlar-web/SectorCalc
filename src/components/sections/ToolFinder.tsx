"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ToolsTileGrid } from "@/components/tools/ToolsTileGrid";
import { INDUSTRIES } from "@/data/industries";
import { ALL_TOOLS } from "@/data/tools";
import type { IndustrySlug } from "@/data/industries";
import { TOOL_FINDER_PROBLEMS } from "@/data/tool-finder-problems";

export function ToolFinder() {
 const t = useTranslations("toolFinder");
 const [query, setQuery] = useState("");
 const [industryFilter, setIndustryFilter] = useState<IndustrySlug | "all">(
 "all"
 );
 const [problemFilter, setProblemFilter] = useState<string | "all">("all");
 const formStartedRef = useRef(false);

 const results = useMemo(() => {
 const q = query.trim().toLowerCase();
 const problem = TOOL_FINDER_PROBLEMS.find((p) => p.id === problemFilter);
 const problemSlugs = problem?.toolSlugs;

 return ALL_TOOLS.filter((tool) => {
 const matchesIndustry =
 industryFilter === "all" || tool.industrySlug === industryFilter;
 const matchesProblem =
 problemFilter === "all" ||
 (problemSlugs?.includes(tool.slug) ?? false);
 const matchesQuery =
 !q ||
 tool.name.toLowerCase().includes(q) ||
 tool.shortDescription.toLowerCase().includes(q) ||
 tool.industrySlug.includes(q);
 return matchesIndustry && matchesProblem && matchesQuery;
 });
 }, [query, industryFilter, problemFilter]);

 const handleSearchFocus = () => {
 if (!formStartedRef.current) {
 formStartedRef.current = true;
 import("@/lib/infrastructure/analytics/events").then(({ trackEvent, ANALYTICS_EVENTS }) => {
 trackEvent(ANALYTICS_EVENTS.form_started, { surface: "tool_finder" });
 });
 }
 };

 useEffect(() => {
 if (problemFilter !== "all") {
 const el = document.getElementById("tool-finder-results");
 el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
 }
 }, [problemFilter]);

 const chipBase =
 "min-h-[44px] rounded-md px-4 text-sm font-medium transition-colors";

 return (
 <section
 className="overflow-x-hidden border-b border-border-subtle bg-white py-16 md:py-24 lg:py-28"
 id="tool-finder"
 >
 <Container size="wide" className="min-w-0">
 <SectionHeader
 eyebrow={t("eyebrow")}
 title={t("title")}
 subtitle={t("subtitle")}
 align="center"
 />

 <div className="mx-auto max-w-3xl space-y-8">
 <div>
 <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
 {t("decisionFocus")}
 </p>
 <div className="flex flex-wrap justify-center gap-2">
 <button
 type="button"
 onClick={() => setProblemFilter("all")}
 className={`${chipBase} ${
 problemFilter === "all"
 ? "bg-deep-navy text-white"
 : "border border-border-subtle bg-white text-text-secondary hover:border-slate/30"
 }`}
 >
 {t("all")}
 </button>
 {TOOL_FINDER_PROBLEMS.map((problem) => (
 <button
 key={problem.id}
 type="button"
 onClick={() => setProblemFilter(problem.id)}
 title={problem.description}
 className={`${chipBase} ${
 problemFilter === problem.id
 ? "bg-deep-navy text-white"
 : "border border-border-subtle bg-white text-text-secondary hover:border-slate/30"
 }`}
 >
 {problem.label}
 </button>
 ))}
 </div>
 </div>

 <div>
 <label htmlFor="tool-search" className="sr-only">
 {t("searchLabel")}
 </label>
 <input
 id="tool-search"
 type="search"
 placeholder={t("searchPlaceholder")}
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 onFocus={handleSearchFocus}
 className="w-full min-h-[48px] rounded-lg border border-border-subtle bg-bg-subtle px-4 text-text-primary placeholder:text-placeholder focus:border-deep-navy focus:outline-none focus:ring-2 focus:ring-accent-teal/15"
 />
 </div>

 <div>
 <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
 {t("industry")}
 </p>
 <div className="flex flex-wrap justify-center gap-2">
 <button
 type="button"
 onClick={() => setIndustryFilter("all")}
 className={`${chipBase} ${
 industryFilter === "all"
 ? "bg-accent-teal text-white"
 : "border border-border-subtle bg-white text-text-secondary"
 }`}
 >
 {t("allIndustries")}
 </button>
 {INDUSTRIES.map((industry) => (
 <button
 key={industry.slug}
 type="button"
 onClick={() => setIndustryFilter(industry.slug)}
 className={`${chipBase} ${
 industryFilter === industry.slug
 ? "bg-accent-teal text-white"
 : "border border-border-subtle bg-white text-text-secondary"
 }`}
 >
 {industry.name}
 </button>
 ))}
 </div>
 </div>
 </div>

 <div id="tool-finder-results" className="mt-12">
 {results.length === 0 ? (
 <p className="rounded-sm border border-dashed border-slate/25 bg-bg-subtle py-14 text-center text-text-secondary">
 {t("emptyResults")}
 </p>
 ) : (
 <ToolsTileGrid tools={results} />
 )}
 </div>
 </Container>
 </section>
 );
}
