import { Link } from "@/i18n/routing";
import { ToolAlphaListExpandButton } from "@/components/tools/ToolAlphaListExpandButton";
import type { ToolListItem } from "@/lib/features/tools/getToolsByCategory";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ToolAlphaListProps {
  /** Tools to display (already filtered + sorted) */
  tools: readonly ToolListItem[];
  /** Locale for JSON-LD URL */
  locale: string;
  /** Category name for JSON-LD */
  categoryName?: string;
  /** Base domain for JSON-LD URLs */
  baseDomain?: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const EXPAND_THRESHOLD = 200;
const DEFAULT_DOMAIN = "https://www.sectorcalc.com";

// ─── Pure display component for tool items ──────────────────────────────────

function ToolListItems({ tools }: { tools: readonly ToolListItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-[10px] sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <div key={tool.slug} className="flex items-baseline gap-1.5 min-w-0">
          <span className="text-gray-400 shrink-0 select-none text-sm leading-5" aria-hidden="true">
            &bull;
          </span>
          <Link
            href={tool.href}
            className="text-sm leading-5 text-blue-700 hover:text-blue-800 hover:underline truncate"
          >
            {tool.title}
          </Link>
        </div>
      ))}
    </div>
  );
}

// ─── JSON-LD builder ────────────────────────────────────────────────────────

function buildItemListJsonLd(
  tools: readonly ToolListItem[],
  categoryName: string,
  locale: string,
  baseDomain: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: categoryName,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: tool.title,
      url: `${baseDomain}/${locale}${tool.href}`,
    })),
  };
}

// ─── Main component (server-safe) ───────────────────────────────────────────

export function ToolAlphaList({
  tools,
  locale,
  categoryName,
  baseDomain = DEFAULT_DOMAIN,
}: ToolAlphaListProps) {
  if (tools.length === 0) return null;

  const jsonLd = buildItemListJsonLd(tools, categoryName ?? "Araçlar", locale, baseDomain);
  const needsToggle = tools.length > EXPAND_THRESHOLD;

  return (
    <>
      {/* JSON‑LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="w-full">
        {needsToggle ? (
          <ToolAlphaListExpandButton total={tools.length}>
            <ToolListItems tools={tools} />
          </ToolAlphaListExpandButton>
        ) : (
          <ToolListItems tools={tools} />
        )}
      </div>
    </>
  );
}
