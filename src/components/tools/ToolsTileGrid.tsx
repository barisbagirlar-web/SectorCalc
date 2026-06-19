import type { Tool } from "@/data/tools";
import { ToolTile } from "@/components/cards/ToolTile";

interface ToolsTileGridProps {
 tools: readonly Tool[];
 onDark?: boolean;
 className?: string;
}

/** Text-based tool grid — 3-4 equal columns, symmetric, with descriptions. */
export function ToolsTileGrid({ tools, onDark = false, className = "" }: ToolsTileGridProps) {
 if (tools.length === 0) return null;

 return (
 <ul
   className={`grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
 >
 {tools.map((tool) => (
   <li key={tool.slug} className="min-w-0">
     <ToolTile tool={tool} onDark={onDark} />
   </li>
 ))}
 </ul>
 );
}
