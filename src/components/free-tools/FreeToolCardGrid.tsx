"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────────────────────────────

type TFreeTools = {
  readonly heroTitle?: string;
  readonly heroSub?: string;
  readonly searchPlaceholder?: string;
  readonly badgeFree?: string;
  readonly badgePro?: string;
  readonly toolsCount?: string;
  readonly allSectors?: string;
  readonly showAll?: string;
  readonly noResults?: string;
  readonly proUpsellTitle?: string;
  readonly proUpsellBody?: string;
  readonly proUpsellCta?: string;
  readonly creditHint?: string;
};

type CardToolData = {
  readonly slug: string;
  readonly name: string;
  readonly href: string;
  readonly sectorKey: string;
  readonly premiumRequired: boolean;
};

type SectorTabItem = {
  readonly id: string;
  readonly label: string;
};

type FreeToolCardGridProps = {
  readonly tools: readonly CardToolData[];
  readonly sectorTabs: readonly SectorTabItem[];
  readonly t: TFreeTools;
  readonly dir?: "ltr" | "rtl";
};

// ─── Constants ──────────────────────────────────────────────────────────────────

const PAGE_SIZE = 30;
const UPSELL_EVERY = 12;

// ─── Upsell banner ──────────────────────────────────────────────────────────────

function UpsellBanner({ t }: { t: TFreeTools }) {
  return (
    <div className="col-span-full rounded-lg border border-amber-200/70 bg-amber-50/60 p-5 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-amber-800">
          {t.proUpsellTitle ?? "Need the full picture?"}
        </div>
        <div className="mt-0.5 text-xs text-amber-700/70 leading-relaxed">
          {t.proUpsellBody ?? "Pro tools include real parameter inputs, PDF export, and industrial standards."}
        </div>
      </div>
      <Link
        href="/pricing"
        className="shrink-0 rounded-md bg-amber-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-amber-700"
      >
        {t.proUpsellCta ?? "See pro tools \u2192"}
      </Link>
    </div>
  );
}

// ─── Tool card ──────────────────────────────────────────────────────────────────

function ToolCard({ tool, t, dir = "ltr" }: { tool: CardToolData; t: TFreeTools; dir?: "ltr" | "rtl" }) {
  // Pro tools gate to pricing page instead of the tool page
  const href = tool.premiumRequired ? "/pricing" : tool.href;

  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3.5 transition-colors hover:border-gray-300 hover:bg-gray-50/80"
    >
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium leading-snug text-gray-800 group-hover:text-gray-900">
          {tool.name}
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          {tool.premiumRequired ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
              <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              {t.badgePro ?? "Pro"}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
              {t.badgeFree ?? "Free"}
            </span>
          )}
          {tool.premiumRequired && (
            <span className="text-[10px] text-gray-400">{t.creditHint ?? "1 credit"}</span>
          )}
        </div>
      </div>
      <svg
        className={`h-4 w-4 shrink-0 text-gray-300 transition-all group-hover:text-gray-500 ${
          dir === "rtl" ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        {dir === "rtl" ? (
          <>
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </>
        ) : (
          <>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </>
        )}
      </svg>
    </Link>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

export function FreeToolCardGrid({ tools, sectorTabs, t, dir = "ltr" }: FreeToolCardGridProps) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    let list = tools;
    if (sector !== "all") {
      list = list.filter((tool) => tool.sectorKey === sector);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((tool) => tool.name.toLowerCase().includes(q));
    }
    return list;
  }, [tools, query, sector]);

  const visible = showAll ? filtered : filtered.slice(0, PAGE_SIZE);

  // Insert upsell banners every UPSELL_EVERY items in the visible list
  const itemsWithBanners = useMemo(() => {
    const result: ({ type: "tool"; tool: CardToolData } | { type: "upsell" })[] = [];
    visible.forEach((tool, i) => {
      result.push({ type: "tool" as const, tool });
      if ((i + 1) % UPSELL_EVERY === 0 && i < visible.length - 1) {
        result.push({ type: "upsell" as const });
      }
    });
    return result;
  }, [visible]);

  return (
    <div className="mx-auto max-w-7xl" dir={dir}>
      {/* ── Search ─────────────────────────────────────────────────────── */}
      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder={t.searchPlaceholder ?? "Search calculators..."}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowAll(false);
          }}
          className="w-full min-h-[44px] rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm transition-colors placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* ── Sector tabs ────────────────────────────────────────────────── */}
      <div className="mb-6 overflow-x-auto scrollbar-none">
        <div className="flex gap-2 min-w-0">
          <button
            onClick={() => { setSector("all"); setShowAll(false); }}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              sector === "all"
                ? "border-amber-500 bg-amber-500 text-white"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            {t.allSectors ?? "All"}
          </button>
          {sectorTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setSector(tab.id); setShowAll(false); }}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                sector === tab.id
                  ? "border-amber-500 bg-amber-500 text-white"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results count ──────────────────────────────────────────────── */}
      <div className="mb-4 text-xs text-gray-400">
        {filtered.length} {t.toolsCount ?? "tools"}
      </div>

      {/* ── Tool grid or empty ─────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-400">
          {t.noResults ?? "No tools found. Try a different search or sector."}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {itemsWithBanners.map((item, i) =>
              item.type === "upsell" ? (
                <UpsellBanner key={`upsell-${i}`} t={t} />
              ) : (
                <ToolCard key={item.tool.slug} tool={item.tool} t={t} dir={dir} />
              ),
            )}
          </div>

          {!showAll && filtered.length > PAGE_SIZE && (
            <button
              onClick={() => setShowAll(true)}
              className="mx-auto mt-8 block rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:border-amber-500 hover:text-amber-600"
            >
              {t.showAll ?? "Show all"} {filtered.length} {t.toolsCount ?? "tools"} &darr;
            </button>
          )}
        </>
      )}
    </div>
  );
}
