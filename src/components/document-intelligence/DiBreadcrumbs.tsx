/**
 * Document Intelligence — Breadcrumb Navigation
 *
 * Reusable component for consistent breadcrumb structure across DI pages.
 * Follows Home > Document Intelligence > ... hierarchy.
 */

import Link from "next/link";

const MUTED = "#696764";
const ACCENT = "#BD5D3A";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function DiBreadcrumbs({ segments }: { segments: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: "0.5rem" }}>
      <ol
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "0.35rem",
          listStyle: "none",
          margin: 0,
          padding: 0,
          fontSize: "0.8rem",
          color: MUTED,
        }}
      >
        <li>
          <Link
            href="/"
            style={{ color: MUTED, textDecoration: "none" }}
          >
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        {segments.map((item, idx) => {
          const isLast = idx === segments.length - 1;
          return (
            <li key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <span aria-hidden="true" style={{ color: MUTED }}>/</span>
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  style={{ color: MUTED, textDecoration: "none" }}
                >
                  {item.label}
                </Link>
              ) : (
                <span style={{ color: isLast ? ACCENT : MUTED, fontWeight: isLast ? 600 : 400 }}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
