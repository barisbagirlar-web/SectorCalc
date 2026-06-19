import { Lock } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Tool } from "@/data/tools";

interface ToolTileProps {
  tool: Tool;
  onDark?: boolean;
}

/** Text-based tool list item — name + description, no box. */
export function ToolTile({ tool, onDark = false }: ToolTileProps) {
  const isPremium = tool.tier === "premium";

  return (
    <Link
      href={tool.href}
      prefetch={false}
      className={`group block ${
        onDark ? "text-white/90 hover:text-white" : "text-premium-velvet hover:text-deep-navy"
      }`}
    >
      <span className="flex items-start gap-2">
        <span className="flex-1 min-w-0">
          <span className="flex items-center gap-1.5">
            <span className="text-sm font-semibold leading-tight transition-colors group-hover:underline">
              {tool.name}
            </span>
            {isPremium ? (
              <span
                className={`inline-flex shrink-0 items-center gap-1 font-sans text-[9px] font-semibold uppercase tracking-wider ${
                  onDark ? "text-white/60" : "text-sc-copper"
                }`}
              >
                <Lock className="h-2.5 w-2.5" aria-hidden />
                PRO
              </span>
            ) : null}
          </span>
          {tool.description || tool.shortDescription ? (
            <span
              className={`mt-0.5 block text-xs leading-relaxed ${
                onDark ? "text-white/60" : "text-body-charcoal"
              }`}
            >
              {tool.description || tool.shortDescription}
            </span>
          ) : null}
        </span>
      </span>
    </Link>
  );
}
