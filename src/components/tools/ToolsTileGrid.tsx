import type { Tool } from "@/data/tools";
import { ToolTile } from "@/components/cards/ToolTile";

interface ToolsTileGridProps {
  tools: Tool[];
  onDark?: boolean;
  className?: string;
}

/** Dense Omni-style grid — mandatory wrapper for every tool catalog. */
export function ToolsTileGrid({ tools, onDark = false, className = "" }: ToolsTileGridProps) {
  if (tools.length === 0) return null;

  return (
    <ul
      className={`grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 ${className}`}
    >
      {tools.map((tool) => (
        <li key={tool.slug} className="min-w-0">
          <ToolTile tool={tool} onDark={onDark} />
        </li>
      ))}
    </ul>
  );
}
