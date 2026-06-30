import type { Tool } from "@/data/tools";
import { ToolDiscoveryGrid } from "@/components/tools/ToolDiscoveryGrid";
import { groupToolsByCategory } from "@/lib/tools/tool-catalog";

type ToolCatalogByCategoryProps = {
 tools: Tool[];
 catalogVariant?: "default" | "premium";
};

export function ToolCatalogByCategory({ tools, catalogVariant = "default" }: ToolCatalogByCategoryProps) {
 const groups = groupToolsByCategory(tools);

 return (
 <div className="space-y-10">
 {groups.map((group) => (
 <section key={group.category}>
 <h2 className="sc-craft-headline text-xl sm:text-2xl">{group.label}</h2>
 <div className="mt-5">
 <ToolDiscoveryGrid tools={group.tools} catalogVariant={catalogVariant} />
 </div>
 </section>
 ))}
 </div>
 );
}
