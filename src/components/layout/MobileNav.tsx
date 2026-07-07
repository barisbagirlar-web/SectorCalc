"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

type NavGroup = {
  id: string;
  label: string;
  items: { label: string; href: string }[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    id: "products",
    label: "Products",
    items: [
      { label: "Free Tools", href: "/free-tools" },
      { label: "Pro Tools", href: "/pricing" },
      { label: "Engineering Diagnostics", href: "/engineering-diagnostics" },
    ],
  },
  {
    id: "industries",
    label: "Industries",
    items: [], // placeholder
  },
  {
    id: "resources",
    label: "Resources",
    items: [], // placeholder
  },
];

export function MobileNav() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <nav className="mobile-nav" role="navigation">
      {NAV_GROUPS.map((g) => (
        <div key={g.id} className="nav-row-group">
          <button
            className="nav-row"
            aria-expanded={openId === g.id}
            onClick={() => setOpenId(openId === g.id ? null : g.id)}
          >
            <span>{g.label}</span>
            <ChevronDown
              size={18}
              style={{
                transform: openId === g.id ? "rotate(180deg)" : "none",
                transition: "transform 150ms ease",
              }}
            />
          </button>
          {openId === g.id && (
            <div className="nav-subrow-list">
              {g.items.map((item) => (
                <a key={item.href} href={item.href} className="nav-subrow">
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
      <a href="/pricing" className="nav-row nav-row--plain">
        Pricing
      </a>
      <div className="nav-cta-block">
        <a href="/signup" className="btn-primary">
          Get started
        </a>
        <a href="/signin" className="btn-secondary">
          Sign in
        </a>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .mobile-nav { font-family: Inter, sans-serif; }
        .nav-row {
          display: flex; justify-content: space-between; align-items: center;
          min-height: 48px;
          padding: 0 16px;
          font-family: Inter, sans-serif;
          border-bottom: 1px solid rgba(26,25,21,0.08);
          background: transparent; width: 100%; cursor: pointer;
          color: var(--sc-text, #1a1915); font-size: 15px;
        }
        .nav-row--plain {
          text-decoration: none; color: var(--sc-text, #1a1915);
        }
        .nav-subrow-list {
          padding-left: 16px;
          background: rgba(26,25,21,0.02);
        }
        .nav-subrow {
          display: block; min-height: 44px; line-height: 44px;
          padding-left: 16px; font-size: 15px;
          text-decoration: none; color: var(--sc-muted, #696764);
        }
        .nav-cta-block {
          display: flex; flex-direction: column; gap: 8px; padding: 16px;
        }
        .nav-cta-block .btn-primary,
        .nav-cta-block .btn-secondary {
          display: flex; align-items: center; justify-content: center;
          min-height: 48px; padding: 12px 16px; font-size: 15px;
          font-weight: 600; border-radius: 8px; text-decoration: none;
        }
        .nav-cta-block .btn-primary {
          background: var(--sc-copper, #bd5d3a); color: #fff; border: none;
        }
        .nav-cta-block .btn-secondary {
          background: transparent; color: var(--sc-text, #1a1915);
          border: 1px solid var(--sc-border, rgba(26,25,21,0.10));
        }
      `,
        }}
      />
    </nav>
  );
}
