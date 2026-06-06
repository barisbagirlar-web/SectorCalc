import Link from "next/link";
import { SiteLogo } from "@/components/brand/SiteLogo";
import { SITE } from "@/config/site";

const FOOTER_GROUPS = [
  {
    title: "Product",
    links: [
      { label: "Free Checks", href: "/free-tools" },
      { label: "Premium Verdicts", href: "/premium-tools" },
      { label: "Sample Report", href: "/reports/sample-decision-report" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "For Consultants", href: "/for-consultants" },
      { label: "Contact", href: `mailto:${SITE.contactEmail}` },
      { label: "Security", href: "/privacy" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Refund Policy", href: "/terms" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer id="footer" className="dark:border-slate-700 dark:bg-slate-900">
      <div className="custom-works-container clearfix">
        <div className="container">
          <div className="footer-brand-block">
            <SiteLogo />
            <p className="footer-tagline">
              Sector-specific margin decision platform
            </p>
          </div>
          <nav className="footer-groups" aria-label="Footer">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title} className="footer-group">
                <p className="footer-group-title">{group.title}</p>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="flex-wrap footer-bottom">
            <div className="col">
              <div className="copyright">
                © {new Date().getFullYear()} {SITE.siteName}
              </div>
              <p className="footer-trust-note">
                Checkout secured by Stripe. Business data is not sold.
              </p>
              <div className="footer-bottom-links footer-bottom-links-box">
                {FOOTER_GROUPS.find((g) => g.title === "Legal")?.links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
