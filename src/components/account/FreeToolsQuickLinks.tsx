import Link from "@/lib/ui-shared/navigation/next-link";
import { revenueTools } from "@/lib/features/tools/revenue-tools";
import { getFreeToolHref } from "@/lib/features/tools/tool-links";

export function FreeToolsQuickLinks() {
 return (
 <section className="min-w-0 rounded-sm border border-border-subtle bg-white p-6 shadow-card">
 <h2 className="text-lg font-bold text-text-primary">Free quick calculators</h2>
 <p className="mt-1 text-sm text-text-secondary">
 Directional checks before you run a premium verdict calculator.
 </p>
 <ul className="mt-4 divide-y divide-slate/10">
 {revenueTools.map((tool) => (
 <li key={tool.freeSlug}>
 <Link
 href={getFreeToolHref(tool)}
 className="flex min-h-[44px] items-center py-3 text-sm font-semibold text-text-primary transition-colors hover:text-deep-navy"
 >
 {tool.freeTitle}
 </Link>
 </li>
 ))}
 </ul>
 </section>
 );
}
