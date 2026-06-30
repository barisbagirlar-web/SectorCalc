import { getLocalizedToolBySlug } from "@/data/tools";
import type { ToolSlug } from "@/data/tools";
import { ToolsTileGrid } from "@/components/tools/ToolsTileGrid";

interface RelatedToolsProps {
 relatedToolIds: ToolSlug[];
 currentSlug: ToolSlug;
 locale: string;
}

export function RelatedTools({ relatedToolIds, currentSlug, locale }: RelatedToolsProps) {
 const related = relatedToolIds
 .filter((id) => id !== currentSlug)
 .map((id) => getLocalizedToolBySlug(id, locale))
 .filter((tool): tool is NonNullable<typeof tool> => tool !== undefined);

 if (related.length === 0) return null;

 return (
 <section>
 <h2 className="text-lg font-bold text-text-primary">Related tools</h2>
 <div className="mt-4">
 <ToolsTileGrid tools={related} />
 </div>
 </section>
 );
}
