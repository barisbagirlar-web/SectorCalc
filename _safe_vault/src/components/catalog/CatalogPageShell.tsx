"use client";

/**
 * SectorCalc — Catalog Page Shell (search + sector boxes + expandable columns)
 * Applies to /pro-tools, /free-tools, /industries.
 *
 * Design:
 *   Paper #F0EEE6 · Surface #FAF9F5 · Ink #1A1915 · Accent #BD5D3A
 *   Serif display · Sans body · Mono counts
 */

import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { getTaxonomySectorIcon } from "@/lib/catalog/taxonomy-sector-icon-map";
import type { TaxonomySectorCard } from "@/lib/tools/build-taxonomy-sector-cards";
import type { ToolListItem } from "@/lib/tools/getToolsByCategory";

// ─── Props ──────────────────────────────────────────────────────────────────

type CatalogPageShellProps = {
  readonly tools: readonly ToolListItem[];
  readonly sectors: readonly TaxonomySectorCard[];
  readonly title: string;
  readonly subtitle: string;
  readonly searchPlaceholder: string;
  readonly categoryTitle: string;
  readonly freeToolsHref?: string;
  readonly proToolsHref?: string;
};

// ─── Helper ──────────────────────────────────────────────────────────────────

/** Sector IDs that should appear in the grid (in this order, all others after). */
const PINNED_SECTORS = [
  "makine",
  "metal",
  "enerji",
  "lojistik",
  "bilisim",
  "finans",
] as const;

/** Sort sectors: pinned first, then by count desc. */
function sortSectors(
  cards: readonly TaxonomySectorCard[],
): TaxonomySectorCard[] {
  const pinned = new Set<string>(PINNED_SECTORS);
  return [...cards].sort((a, b) => {
    const aPinned = pinned.has(a.sector.id) ? 0 : 1;
    const bPinned = pinned.has(b.sector.id) ? 0 : 1;
    if (aPinned !== bPinned) return aPinned - bPinned;
    return b.count - a.count;
  });
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CatalogPageShell({
  tools,
  sectors,
  title,
  subtitle,
  searchPlaceholder,
  categoryTitle,
  freeToolsHref,
  proToolsHref,
}: CatalogPageShellProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("all");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const searching = query.trim().length > 0;

  // Build tool map for counts
  const counts = useMemo(() => {
    const m: Record<string, number> = { all: tools.length };
    for (const tool of tools) {
      m[tool.sectorKey] = (m[tool.sectorKey] || 0) + 1;
    }
    return m;
  }, [tools]);

  // Filter tools
  const visibleTools = useMemo(() => {
    let list = tools;
    if (!searching && active !== "all") {
      list = list.filter((t) => t.sectorKey === active);
    }
    if (searching) {
      const q = query.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => a.title.localeCompare(b.title));
  }, [query, active, searching, tools]);

  // Column count
  const colCount = visibleTools.length <= 8 ? 1 : visibleTools.length <= 24 ? 2 : 3;

  // Active sector label
  const activeCard = searching
    ? null
    : sectors.find((s) => s.sector.id === active);
  const activeName = activeCard?.label ?? (active === "all" ? "All" : active);

  // Sorted sectors (exclude "all" and 0-count from grid)
  const sortedSectors = useMemo(() => sortSectors(sectors), [sectors]);
  const gridSectors = sortedSectors.filter(
    (s) => s.sector.id !== "all" && s.count >= 1,
  );

  return (
    <>
      <style>{`
        .cc{
          --paper:#F0EEE6;--surface:#FAF9F5;--surface-h:#F5F3EC;
          --ink:#1A1915;--ink-soft:#56544D;--ink-faint:#8C8A80;
          --accent:#BD5D3A;--accent-dk:#9E4B2D;
          --line:rgba(26,25,21,0.10);--line-soft:rgba(26,25,21,0.06);
          --serif:'Tiempos Headline','Georgia','Times New Roman',serif;
          --sans:'DM Sans','SF Pro Text',-apple-system,BlinkMacSystemFont,sans-serif;
          --mono:'SF Mono','JetBrains Mono',ui-monospace,monospace;
        }
        .cc *,.cc *::before,.cc *::after{box-sizing:border-box;margin:0;padding:0;}
        .cc-shell{max-width:1180px;margin:0 auto;padding:0 32px;}

        .cc-hero{padding:60px 0 28px;max-width:680px;}
        .cc-kick{font-size:13px;color:var(--accent);font-weight:500;margin-bottom:18px;text-transform:uppercase;letter-spacing:0.05em;}
        .cc-h1{font-family:var(--serif);font-size:clamp(32px,4.5vw,46px);font-weight:400;line-height:1.1;letter-spacing:-0.02em;color:var(--ink);}
        .cc-lede{margin-top:18px;font-size:16px;line-height:1.6;color:var(--ink-soft);max-width:540px;}

        /* Search */
        .cc-search{position:relative;margin:8px 0 36px;}
        .cc-search input{width:100%;height:64px;padding:0 24px 0 56px;background:var(--surface);border:1px solid var(--line);border-radius:14px;font-size:17px;color:var(--ink);font-family:var(--sans);outline:none;transition:border-color .15s,background .15s;}
        .cc-search input::placeholder{color:var(--ink-faint);}
        .cc-search input:focus{border-color:var(--accent);background:#fff;}
        .cc-search .si{position:absolute;top:50%;transform:translateY(-50%);width:22px;height:22px;color:var(--ink-faint);pointer-events:none;}
        .cc-search .si.l{left:22px;}

        .cc-eyebrow{font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-faint);font-weight:500;margin-bottom:16px;}

        /* Sector boxes grid */
        .cc-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
        @media(max-width:960px){.cc-grid{grid-template-columns:repeat(3,1fr);}}
        @media(max-width:720px){.cc-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:480px){.cc-grid{grid-template-columns:1fr;}}

        .cc-box{
          background:var(--surface);border:1px solid var(--line);border-radius:14px;
          padding:26px 22px 22px;cursor:pointer;text-align:center;
          display:flex;flex-direction:column;align-items:center;gap:0;
          transition:border-color .15s,background .15s,transform .1s;
          min-height:184px;
          -webkit-appearance:none;appearance:none;font-family:inherit;width:100%;
        }
        .cc-box:hover{border-color:var(--accent);background:var(--surface-h);}
        .cc-box.active{border-color:var(--accent);border-width:1.5px;background:#fff;}
        .cc-box-icon{width:42px;height:42px;color:var(--accent);margin-bottom:16px;}
        .cc-box-name{font-size:16px;font-weight:600;color:var(--ink);line-height:1.25;margin-bottom:8px;}
        .cc-box-count{font-size:14px;color:var(--ink-soft);font-variant-numeric:tabular-nums;margin-bottom:12px;}
        .cc-box-roles{font-size:12px;color:var(--ink-faint);line-height:1.45;}

        /* Expanded tool list */
        .cc-results{margin-top:36px;padding-top:28px;border-top:1px solid var(--line);}
        .cc-results-head{display:flex;align-items:baseline;gap:12px;margin-bottom:22px;}
        .cc-results-title{font-family:var(--serif);font-size:24px;font-weight:400;letter-spacing:-0.01em;color:var(--ink);}
        .cc-results-count{font-size:14px;color:var(--ink-faint);font-variant-numeric:tabular-nums;}

        .cc-cols{column-gap:40px;}
        .cc-cols.c1{column-count:1;}
        .cc-cols.c2{column-count:2;}
        .cc-cols.c3{column-count:3;}
        @media(max-width:960px){.cc-cols.c3{column-count:2;}}
        @media(max-width:600px){.cc-cols.c2,.cc-cols.c3{column-count:1;}}

        .cc-link{
          display:flex;align-items:baseline;gap:9px;
          break-inside:avoid;padding:9px 0;
          text-decoration:none;line-height:1.4;
        }
        .cc-link .bullet{color:var(--ink-faint);font-size:12px;line-height:1.5;flex-shrink:0;}
        .cc-link .ltext{font-size:15px;color:var(--accent);transition:color .12s;}
        .cc-link:hover .ltext{color:var(--accent-dk);text-decoration:underline;text-underline-offset:2px;}

        .cc-empty{padding:48px 0;color:var(--ink-faint);font-size:15px;}

        .cc-foot{border-top:1px solid var(--line);margin-top:48px;padding:36px 0 64px;max-width:560px;}
        .cc-foot p{font-size:15px;color:var(--ink-soft);line-height:1.7;}
        .cc-foot a{color:var(--accent);text-decoration:underline;text-underline-offset:2px;}
        .cc-foot a:hover{color:var(--accent-dk);}
      `}</style>

      <div className="cc">
        <div className="cc-shell">
          <header className="cc-hero">
            <div className="cc-kick">{title}</div>
            <h1 className="cc-h1">{subtitle}</h1>
          </header>

          {/* Search */}
          <div className="cc-search">
            <svg
              className="si l"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchRef}
              type="search"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Sector boxes — hidden while searching */}
          {!searching && (
            <>
              <div className="cc-eyebrow">{categoryTitle}</div>
              <div className="cc-grid">
                {gridSectors.map((card) => {
                  const Icon = getTaxonomySectorIcon(card.sector.id);
                  return (
                    <button
                      key={card.sector.id}
                      className={`cc-box${active === card.sector.id ? " active" : ""}`}
                      onClick={() => setActive(card.sector.id)}
                      type="button"
                    >
                      <Icon className="cc-box-icon" aria-hidden="true" />
                      <div className="cc-box-name">{card.label}</div>
                      <div className="cc-box-count">{card.countLabel}</div>
                      {card.professionLabels.length > 0 && (
                        <div className="cc-box-roles">
                          {card.professionLabels.slice(0, 3).join(" · ")}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Expanded tool list */}
          <div className="cc-results">
            <div className="cc-results-head">
              <h2 className="cc-results-title">
                {searching ? `“${query}”` : activeName}
              </h2>
              <span className="cc-results-count">
                {visibleTools.length} tools
              </span>
            </div>

            {visibleTools.length === 0 ? (
              <div className="cc-empty">
                No calculations match. Try a different term.
              </div>
            ) : (
              <div className={`cc-cols c${colCount}`}>
                {visibleTools.map((tool) => (
                  <Link key={tool.slug} href={tool.href} className="cc-link">
                    <span className="bullet">●</span>
                    <span className="ltext">{tool.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {(() => {
            const fh = freeToolsHref;
            const ph = proToolsHref;
            if (!fh && !ph) return null;
            return (
              <footer className="cc-foot">
                <p>
                  {fh && ph ? (
                    <>
                      Free tools cover the same formulas without parameter depth
                      or PDF export. Start there if you&apos;re exploring —{" "}
                      <Link href={fh}>browse free tools</Link>, or{" "}
                      <Link href={ph}>explore pro tools</Link>.
                    </>
                  ) : ph ? (
                    <>
                      Need deeper analysis?{" "}
                      <Link href={ph}>Explore pro tools</Link> with PDF export
                      and full parameter control.
                    </>
                  ) : (
                    <>
                      Free tools cover the same formulas without parameter depth
                      or PDF export. Start there if you&apos;re exploring —{" "}
                      <Link href={fh as string}>browse free tools</Link>.
                    </>
                  )}
                </p>
              </footer>
            );
          })()}
        </div>
      </div>
    </>
  );
}
