import type { Tool } from "@/data/tools";
import { ToolDiscoveryGrid } from "@/components/tools/ToolDiscoveryGrid";
import { groupToolsByCategory } from "@/lib/tools/tool-catalog";

type ToolCatalogByCategoryProps = {
  tools: Tool[];
};

export function ToolCatalogByCategory({ tools }: ToolCatalogByCategoryProps) {
  const groups = groupToolsByCategory(tools);

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section key={group.category}>
          <h2 className="text-xl font-bold text-text-primary">{group.label}</h2>
          <div className="mt-6">
            <ToolDiscoveryGrid tools={group.tools} />
          </div>
        </section>
      ))}
    </div>
  );
}
