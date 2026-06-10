import Link from "@/lib/navigation/next-link";

type PublicDemoCrossLinksProps = {
  readonly current: "investor-demo" | "pricing" | "operating-system";
};

const LINKS = [
  { id: "investor-demo" as const, href: "/investor-demo", label: "Investor demo" },
  { id: "pricing" as const, href: "/pricing", label: "Pricing & commercial model" },
  { id: "operating-system" as const, href: "/operating-system", label: "Operating system" },
] as const;

export function PublicDemoCrossLinks({ current }: PublicDemoCrossLinksProps) {
  const visible = LINKS.filter((link) => link.id !== current);

  return (
    <nav aria-label="Related platform pages" className="public-demo-cross-links border-t border-border-subtle pt-6">
      <span className="w-full text-xs font-semibold uppercase tracking-wide text-text-secondary sm:w-auto">
        Explore
      </span>
      {visible.map((link) => (
        <Link key={link.id} href={link.href}>
          {link.label} →
        </Link>
      ))}
      <Link href="/reports/sample-decision-report">Sample verdict report →</Link>
    </nav>
  );
}
