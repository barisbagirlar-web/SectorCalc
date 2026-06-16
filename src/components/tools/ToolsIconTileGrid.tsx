import { Link } from "@/i18n/routing";
import { Lock } from "lucide-react";
import type { Tool } from "@/data/tools";
import { getCategoryCardIcon } from "@/lib/catalog/category-card-icons";
import { inferFreeTrafficCategory } from "@/lib/tools/free-traffic-catalog";

type ToolsIconTileGridProps = {
  readonly tools: readonly Tool[];
  readonly className?: string;
};

export function ToolsIconTileGrid({ tools, className = "" }: ToolsIconTileGridProps) {
  if (tools.length === 0) {
    return null;
  }

  return (
    <ul className={`grid grid-cols-2 gap-3 md:grid-cols-4 ${className}`}>
      {tools.map((tool) => {
        const Icon = getCategoryCardIcon(inferFreeTrafficCategory(tool.slug)).icon;
        const isPremium = tool.tier === "premium";

        return (
          <li key={tool.slug} className="min-w-0">
            <Link
              href={tool.href}
              prefetch={false}
              className="sc-tools-icon-tile group"
            >
              <Icon className="sc-tools-icon-tile__icon" strokeWidth={1.5} aria-hidden="true" />
              <span className="sc-tools-icon-tile__title">{tool.name}</span>
              {isPremium ? (
                <span className="sc-tools-icon-tile__badge">
                  <Lock className="h-2.5 w-2.5" aria-hidden="true" />
                  PRO
                </span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
