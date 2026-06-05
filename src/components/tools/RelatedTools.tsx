import { getToolBySlug } from "@/data/tools";
import type { ToolSlug } from "@/data/tools";
import { ToolsTileGrid } from "@/components/tools/ToolsTileGrid";

interface RelatedToolsProps {
  relatedToolIds: ToolSlug[];
  currentSlug: ToolSlug;
}

export function RelatedTools({ relatedToolIds, currentSlug }: RelatedToolsProps) {
  const related = relatedToolIds
    .filter((id) => id !== currentSlug)
    .map((id) => getToolBySlug(id))
    .filter((tool): tool is NonNullable<typeof tool> => tool !== undefined);

  if (related.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-bold text-deep-navy">Related tools</h2>
      <div className="mt-4">
        <ToolsTileGrid tools={related} />
      </div>
    </section>
  );
}
