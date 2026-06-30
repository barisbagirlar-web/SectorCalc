import Link from "@/lib/ui-shared/navigation/next-link";
import {
  getFreeToolsHref,
  getPremiumToolsHref,
  getPricingHref,
  getReportsHref,
} from "@/lib/features/tools/tool-links";

type AccountQuickActionsProps = {
  isActive: boolean;
  reportCount: number;
};

const ACTIONS = [
  {
    id: "premium",
    label: "Premium analyzers",
    description: "Loss & verdict reports",
    href: (isActive: boolean) => (isActive ? getPremiumToolsHref() : getPricingHref()),
    emphasis: true,
  },
  {
    id: "free",
    label: "Free calculators",
    description: "Quick sector checks",
    href: () => getFreeToolsHref(),
    emphasis: false,
  },
  {
    id: "reports",
    label: "Saved reports",
    description: "Verdict history",
    href: () => getReportsHref(),
    emphasis: false,
  },
  {
    id: "industries",
    label: "Industry packs",
    description: "Browse by sector",
    href: () => "/industries",
    emphasis: false,
  },
] as const;

export function AccountQuickActions({ isActive, reportCount }: AccountQuickActionsProps) {
  return (
    <nav className="sc-account-hub__quick-actions" aria-label="Account shortcuts">
      <ul className="sc-account-hub__quick-grid">
        {ACTIONS.map((action) => (
          <li key={action.id}>
            <Link
              href={action.href(isActive)}
              className={`sc-account-hub__quick-tile${
                action.emphasis && !isActive ? " sc-account-hub__quick-tile--upsell" : ""
              }${action.emphasis && isActive ? " sc-account-hub__quick-tile--pro" : ""}`}
            >
              <span className="sc-account-hub__quick-label">{action.label}</span>
              <span className="sc-account-hub__quick-desc">
                {action.id === "reports" && reportCount > 0
                  ? `${reportCount} saved`
                  : action.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
