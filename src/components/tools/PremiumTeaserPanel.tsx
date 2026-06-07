"use client";

import Link from "next/link";
import type { ToolPremiumTeaser } from "@/data/tool-schema";
import { Badge } from "@/components/ui/Badge";
import {
 ANALYTICS_EVENTS,
 trackEvent,
} from "@/lib/analytics/events";

interface PremiumTeaserPanelProps {
 teaser: ToolPremiumTeaser;
 toolSlug?: string;
}

export function PremiumTeaserPanel({ teaser, toolSlug }: PremiumTeaserPanelProps) {
 const handleCtaClick = () => {
 trackEvent(ANALYTICS_EVENTS.unlock_clicked, {
 toolSlug,
 source: "free_tool_teaser",
 destination: teaser.ctaHref,
 });
 };

 return (
 <aside className="rounded-sm border border-amber/30 bg-premium-surface p-6 md:p-8">
 <Badge variant="premium" className="mb-4">
 Next layer
 </Badge>
 <h2 className="text-xl font-bold text-premium-velvet sm:text-2xl">{teaser.title}</h2>
 <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
 {teaser.text}
 </p>
 <Link
 href={teaser.ctaHref}
 onClick={handleCtaClick}
 className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-amber px-6 text-sm font-semibold text-text-primary transition-colors hover:bg-amber/90 sm:w-auto"
 >
 {teaser.ctaLabel}
 </Link>
 </aside>
 );
}
