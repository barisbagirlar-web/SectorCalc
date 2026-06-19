import { Link } from "@/i18n/routing";
import { Lock } from "lucide-react";
import type { Tool } from "@/data/tools";

type ToolsIconTileGridProps = {
  readonly tools: readonly Tool[];
  readonly className?: string;
};

/** Text-based tool grid for icon-backed category pages — name + description, 3-4 columns. */
export function ToolsIconTileGrid({ tools, className = "" }: ToolsIconTileGridProps) {
  if (tools.length === 0) {
    return null;
  }

  return (
    <ul className={`grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
      {tools.map((tool) => {
        const isPremium = tool.tier === "premium";

        return (
          <li key={tool.slug} className="min-w-0">
            <Link
              href={tool.href}
              prefetch={false}
              className="group block text-premium-velvet hover:text-deep-navy"
            >
              <span className="flex items-start gap-2">
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold leading-tight transition-colors group-hover:underline">
                      {tool.name}
                    </span>
                    {isPremium ? (
                      <span className="inline-flex shrink-0 items-center gap-1 font-sans text-[9px] font-semibold uppercase tracking-wider text-sc-copper">
                        <Lock className="h-2.5 w-2.5" aria-hidden />
                        PRO
                      </span>
                    ) : null}
                  </span>
                  {tool.description || tool.shortDescription ? (
                    <span className="mt-0.5 block text-xs leading-relaxed text-body-charcoal">
                      {tool.description || tool.shortDescription}
                    </span>
                  ) : null}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
