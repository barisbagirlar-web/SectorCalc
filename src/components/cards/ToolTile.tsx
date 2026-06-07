import { Lock } from "lucide-react";
import Link from "next/link";
import type { Tool } from "@/data/tools";

interface ToolTileProps {
  tool: Tool;
  onDark?: boolean;
}

/** Compact tool cell — utility: title only; intelligence: Lock + PRO */
export function ToolTile({ tool, onDark = false }: ToolTileProps) {
  const isPremium = tool.tier === "premium";

  return (
    <Link
      href={tool.href}
      className={`group flex h-full min-h-[44px] items-center justify-between gap-2 border border-technical-gray bg-white p-2 transition-colors ${
        onDark
          ? "text-white hover:text-white/85"
          : "text-premium-velvet hover:bg-industrial-matte"
      }`}
    >
      <span className="truncate font-sans text-xs font-semibold">{tool.name}</span>
      {isPremium ? (
        <span
          className={`inline-flex shrink-0 items-center gap-1 font-sans text-[9px] font-semibold uppercase tracking-wider ${
            onDark ? "text-white/75" : "text-body-charcoal"
          }`}
        >
          <Lock className="h-2.5 w-2.5" aria-hidden />
          PRO
        </span>
      ) : null}
    </Link>
  );
}
