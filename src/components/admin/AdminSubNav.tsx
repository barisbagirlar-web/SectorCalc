"use client";

import Link from "@/lib/ui-shared/navigation/next-link";
import { usePathname } from "next/navigation";
import { AdminLocaleSwitcher } from "@/lib/features/admin/admin-locale-context";

const NAV_ITEMS = [
  { href: "/admin/case-studies", label: "Case Studies" },
  { href: "/admin/tickets", label: "Support Tickets" },
  { href: "/admin/leads", label: "Lead Intents" },
  { href: "/admin/kpi", label: "Live KPI Review" },
  { href: "/admin/benchmarks", label: "Benchmark Data" },
  { href: "/admin/schema-generator", label: "Schema Generator" },
] as const;

const linkClass = (active: boolean): string =>
  [
    "inline-flex min-h-[44px] items-center rounded-lg border px-4 text-sm font-semibold transition-colors",
    active
      ? "border-professional-blue bg-professional-blue text-white"
      : "border-slate/25 bg-white text-deep-navy hover:border-professional-blue/40 hover:bg-off-white",
  ].join(" ");

export function AdminSubNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mb-6 flex flex-wrap items-center justify-between gap-2"
      aria-label="Admin navigation"
    >
      <div className="flex flex-wrap gap-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={linkClass(pathname !== null && (pathname === item.href || pathname.startsWith(item.href + "/")))}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <AdminLocaleSwitcher />
    </nav>
  );
}
