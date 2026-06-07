import type { Tool } from "@/data/tools";
import { ToolTile } from "@/components/cards/ToolTile";

interface ToolCardProps {
 tool: Tool;
 onDark?: boolean;
}

/**
 * @deprecated Use `ToolTile` inside `ToolsTileGrid` for all tool listings.
 */
export function ToolCard({ tool, onDark = false }: ToolCardProps) {
 return <ToolTile tool={tool} onDark={onDark} />;
}
