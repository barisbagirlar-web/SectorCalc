import Link from "next/link";
import { revenueTools } from "@/lib/tools/revenue-tools";
import { getFreeToolHref } from "@/lib/tools/tool-links";

export function FreeToolsQuickLinks() {
  return (
    <section className="min-w-0 rounded-xl border border-border-subtle bg-white p-6 shadow-card">
      <h2 className="text-lg font-bold text-text-primary">Free quick calculators</h2>
      <p className="mt-1 text-sm text-slate">
        Directional checks before you run a premium verdict analyzer.
      </p>
      <ul className="mt-4 divide-y divide-slate/10">
        {revenueTools.map((tool) => (
          <li key={tool.freeSlug}>
            <Link
              href={getFreeToolHref(tool)}
              className="flex min-h-[44px] items-center py-3 text-sm font-semibold text-text-primary transition-colors hover:text-accent-teal"
            >
              {tool.freeTitle}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
