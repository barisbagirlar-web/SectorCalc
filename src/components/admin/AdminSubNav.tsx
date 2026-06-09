"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin/leads", label: "Lead Intents" },
  { href: "/admin/kpi", label: "Live KPI Review" },
  { href: "/admin/benchmarks", label: "Benchmark Data" },
  { href: "/admin/schema-generator", label: "Schema Generator" },
] as const;

const linkClass = (active: boolean): string =>
  [
    "inline-flex min-h-[44px] items-center rounded-lg border px-4 text-sm font-semibold transition-colors",
    active
      ? "border-ink-black bg-ink-black text-white"
      : "border-slate/25 bg-white text-ink-black hover:border-ink-black/40 hover:bg-off-white",
  ].join(" ");

export function AdminSubNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mb-6 flex flex-wrap gap-2"
      aria-label="Admin navigation"
    >
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={linkClass(pathname === item.href)}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
