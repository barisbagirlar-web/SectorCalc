import Link from "next/link";
import { getToolBySlug } from "@/data/tools";
import type { ToolSlug } from "@/data/tools";
import { getToolHref } from "@/lib/tools/paths";
import { Badge } from "@/components/ui/Badge";

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
      <h2 className="text-xl font-bold text-deep-navy">Related tools</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {related.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={getToolHref(tool.tier, tool.slug)}
              className="flex flex-col rounded-xl border border-slate/20 bg-white p-5 shadow-card transition-shadow hover:shadow-lg min-h-[44px]"
            >
              <div className="flex items-center gap-2">
                <Badge variant={tool.tier === "free" ? "free" : "premium"}>
                  {tool.tier}
                </Badge>
                {tool.comingSoon && <Badge variant="muted">Coming soon</Badge>}
              </div>
              <span className="mt-3 font-semibold text-deep-navy">{tool.name}</span>
              <span className="mt-1 text-sm text-slate">{tool.shortDescription}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
