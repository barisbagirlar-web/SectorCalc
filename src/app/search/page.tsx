import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { searchTools, type SearchResult } from "@/lib/features/tools/build-search-index";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const q = sp.q?.trim();
  return createPageMetadata({
    title: q ? `Search results for "${q}" | SectorCalc` : "Search tools | SectorCalc",
    description: q
      ? `Find industrial calculators, pro tools, and sector resources matching "${q}".`
      : "Search SectorCalc for free and pro industrial calculators, engineering diagnostics, and decision tools.",
    path: "/search",
    locale: "en",
  });
}

function SearchResultCard({ item }: { item: SearchResult }) {
  const typeLabel =
    item.type === "free" ? "Free" : item.type === "pro" ? "Pro" : "Industry";
  const typeClass =
    item.type === "free"
      ? "sc-search-badge-free"
      : item.type === "pro"
        ? "sc-search-badge-pro"
        : "sc-search-badge-industry";

  return (
    <Link href={item.href} className="sc-search-card" prefetch={false}>
      <div className="sc-search-card-body">
        <div className="sc-search-card-header">
          <span className={`sc-search-badge ${typeClass}`}>{typeLabel}</span>
          <h3 className="sc-search-card-title">{item.label}</h3>
        </div>
        <p className="sc-search-card-desc">{item.description}</p>
      </div>
      <svg className="sc-search-card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </Link>
  );
}

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const results = q ? searchTools(q) : [];

  return (
    <PageLayout>
      <div className="sc-search-page">
        <div className="sc-search-page-inner">
          <form action="/search" method="GET" role="search" className="sc-search-form">
            <div className="sc-search-field">
              <svg className="sc-search-field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search tools, industries, topics..."
                className="sc-search-field-input"
                autoFocus
                aria-label="Search tools"
              />
              <button type="submit" className="sc-search-submit" aria-label="Search">
                Search
              </button>
            </div>
          </form>

          {q && (
            <div className="sc-search-meta">
              {results.length === 0
                ? `No results found for "${q}". Try a different search term.`
                : `${results.length} result${results.length !== 1 ? "s" : ""} for "${q}"`}
            </div>
          )}

          {results.length > 0 && (
            <div className="sc-search-results">
              {results.map((item, i) => (
                <SearchResultCard key={`${item.type}-${item.href}-${i}`} item={item} />
              ))}
            </div>
          )}

          {!q && (
            <div className="sc-search-empty">
              <h2>Search SectorCalc</h2>
              <p>
                Find free and pro industrial calculators, engineering diagnostics, and decision tools
                across machining, manufacturing, energy, logistics, quality, finance, and more.
              </p>
              <div className="sc-search-suggestions">
                <span className="sc-search-suggestions-label">Popular searches:</span>
                <div className="sc-search-suggestions-list">
                  {["oee", "break-even", "welding cost", "machine hour rate", "cnc cost", "downtime", "carbon footprint"].map((term) => (
                    <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className="sc-search-suggestion" prefetch={false}>
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .sc-search-page{background:var(--sc-bg,#F0EEE6);min-height:60vh;padding:48px 24px;}
        .sc-search-page-inner{max-width:720px;margin:0 auto;}
        .sc-search-form{margin-bottom:24px;}
        .sc-search-field{display:flex;align-items:center;gap:8px;background:var(--sc-surface,#FAF9F5);border:1px solid var(--sc-border,rgba(26,25,21,0.10));border-radius:12px;padding:4px 4px 4px 14px;transition:border-color .15s;}
        .sc-search-field:focus-within{border-color:var(--sc-accent,#A34D2E);}
        .sc-search-field-icon{flex-shrink:0;color:var(--sc-muted,#696764);}
        .sc-search-field-input{flex:1;border:none;background:transparent;padding:12px 4px;font-size:16px;color:var(--sc-text,#1A1915);outline:none;font-family:inherit;min-height:48px;}
        .sc-search-field-input::placeholder{color:var(--sc-muted,#696764);}
        .sc-search-submit{display:inline-flex;align-items:center;justify-content:center;padding:10px 20px;background:var(--sc-accent,#A34D2E);color:#fff;font-size:14px;font-weight:600;border:none;border-radius:8px;cursor:pointer;min-height:44px;transition:background .12s;white-space:nowrap;font-family:inherit;}
        .sc-search-submit:hover{background:var(--sc-copper-hover,#8B3E22);}
        .sc-search-meta{font-size:14px;color:var(--sc-muted,#696764);margin-bottom:20px;}
        .sc-search-results{display:flex;flex-direction:column;gap:6px;}
        .sc-search-card{display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--sc-surface,#FAF9F5);border:1px solid var(--sc-border,rgba(26,25,21,0.10));border-radius:10px;text-decoration:none;transition:border-color .12s,background .12s;}
        .sc-search-card:hover{border-color:var(--sc-accent,#A34D2E);background:var(--sc-surface-strong,#fff);}
        .sc-search-card-body{flex:1;min-width:0;}
        .sc-search-card-header{display:flex;align-items:center;gap:8px;margin-bottom:4px;}
        .sc-search-card-title{font-size:15px;font-weight:600;color:var(--sc-text,#1A1915);margin:0;font-family:var(--font-heading,Georgia,serif);}
        .sc-search-card-desc{font-size:13px;color:var(--sc-muted,#696764);line-height:1.5;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
        .sc-search-card-arrow{flex-shrink:0;color:var(--sc-muted,#696764);transition:color .12s,transform .12s;}
        .sc-search-card:hover .sc-search-card-arrow{color:var(--sc-accent,#A34D2E);transform:translateX(2px);}
        .sc-search-badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.03em;flex-shrink:0;}
        .sc-search-badge-free{background:#e0f2e0;color:#166534;}
        .sc-search-badge-pro{background:#f5e6dc;color:#A34D2E;}
        .sc-search-badge-industry{background:#e0e7f2;color:#1e40af;}
        .sc-search-empty{text-align:center;padding:48px 16px;}
        .sc-search-empty h2{font-size:22px;font-weight:600;color:var(--sc-text,#1A1915);margin:0 0 8px;font-family:var(--font-heading,Georgia,serif);}
        .sc-search-empty p{font-size:15px;color:var(--sc-muted,#696764);line-height:1.6;max-width:480px;margin:0 auto 32px;}
        .sc-search-suggestions{display:flex;flex-direction:column;align-items:center;gap:12px;}
        .sc-search-suggestions-label{font-size:13px;color:var(--sc-muted,#696764);text-transform:uppercase;letter-spacing:.04em;font-weight:500;}
        .sc-search-suggestions-list{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;}
        .sc-search-suggestion{display:inline-flex;padding:8px 16px;background:var(--sc-surface,#FAF9F5);border:1px solid var(--sc-border,rgba(26,25,21,0.10));border-radius:20px;font-size:13px;color:var(--sc-text,#1A1915);text-decoration:none;transition:border-color .12s,background .12s;min-height:36px;align-items:center;}
        .sc-search-suggestion:hover{border-color:var(--sc-accent,#A34D2E);background:var(--sc-surface-strong,#fff);}
        @media(max-width:640px){
          .sc-search-page{padding:24px 16px;}
          .sc-search-submit{padding:10px 14px;font-size:13px;}
          .sc-search-card{padding:12px 14px;}
        }
      `}</style>
    </PageLayout>
  );
}
