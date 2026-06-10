import Link from "@/lib/navigation/next-link";
import { ScIcon } from "@/components/icons/ScIcon";
import { UI_ICON } from "@/lib/icons/icon-registry";
import type { RevenueTool } from "@/lib/tools/revenue-tools";
import { getToolHref } from "@/lib/tools/paths";

interface FreeToolUpgradePanelProps {
 revenue: RevenueTool;
}

export function FreeToolUpgradePanel({ revenue }: FreeToolUpgradePanelProps) {
 return (
 <aside className="rounded-sm border border-amber/25 bg-amber/5 p-5 sm:p-6">
 <p className="text-xs font-semibold uppercase tracking-wider text-amber">
 Not included in free check
 </p>
 <ul className="mt-3 space-y-2">
 {revenue.freeMissingFactors.map((factor) => (
 <li key={factor} className="flex gap-2 text-sm text-text-primary">
 <ScIcon icon={UI_ICON.exclude} size="compact" className="mt-0.5 text-amber" />
 {factor}
 </li>
 ))}
 </ul>
 <Link
 href={getToolHref("premium", revenue.paidSlug)}
 className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-deep-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-black"
 >
 {revenue.premiumCtaLabel}
 </Link>
 </aside>
 );
}
