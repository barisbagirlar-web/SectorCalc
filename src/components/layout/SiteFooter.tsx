import Link from "next/link";
import { SITE } from "@/config/site";

const FOOTER_GROUPS = [
  {
    title: "Tools",
    links: [
      { label: "Free Tools", href: "/free-tools" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "All Industries", href: "/industries" },
      { label: "Construction", href: "/industries/construction" },
      { label: "Cleaning", href: "/industries/cleaning" },
      { label: "Restaurant", href: "/industries/restaurant" },
      { label: "E-commerce", href: "/industries/ecommerce" },
      { label: "CNC & Manufacturing", href: "/industries/cnc-manufacturing" },
    ],
  },
  {
    title: "Reports",
    links: [{ label: "Sample Decision Report", href: "/reports/sample-decision-report" }],
  },
  {
    title: "Company",
    links: [
      { label: "For Consultants", href: "/for-consultants" },
      { label: "Login", href: "/login" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer id="footer">
      <div className="custom-works-container clearfix">
        <div className="container">
          <p className="footer-tagline">
            {SITE.siteName} is an English-first sector calculation and decision-report platform
            for business cost, margin, capacity and pricing decisions.
          </p>
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
