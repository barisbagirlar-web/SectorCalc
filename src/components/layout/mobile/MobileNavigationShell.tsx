"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BRAND_ASSETS } from "@/config/brand";
import { MobileSearch } from "./MobileSearch";
import { MobileNavSection } from "./MobileNavSection";
import { MobileNavItem } from "./MobileNavItem";
import { MobileCTA } from "./MobileCTA";

interface IndustryGroup {
  slug: string;
  href: string;
  label: string;
  count: number;
}

interface MobileNavigationShellProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  freeToolsCount: number;
  proToolsCount: number;
  industryGroups?: IndustryGroup[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const DEFAULT_INDUSTRY_GROUPS: IndustryGroup[] = [
  { slug: "cnc-manufacturing", href: "/industries/cnc-manufacturing", label: "Manufacturing", count: 40 },
  { slug: "construction", href: "/industries/construction", label: "Construction", count: 28 },
  { slug: "energy-consumption", href: "/industries/energy-consumption", label: "Energy", count: 16 },
  { slug: "hvac", href: "/industries/hvac", label: "Mechanical & HVAC", count: 48 },
  { slug: "electrical-contracting", href: "/industries/electrical-contracting", label: "Electrical & Power", count: 16 },
  { slug: "logistics-transport", href: "/industries/logistics-transport", label: "Logistics", count: 17 },
  { slug: "welding-fabrication", href: "/industries/welding-fabrication", label: "Welding & Fabrication", count: 22 },
  { slug: "agriculture-crops", href: "/industries/agriculture-crops", label: "Agriculture", count: 12 },
  { slug: "3d-printing-service", href: "/industries/3d-printing-service", label: "3D Printing", count: 8 },
];

export function MobileNavigationShell({
  isOpen,
  onClose,
  isAuthenticated,
  freeToolsCount,
  proToolsCount,
  industryGroups = DEFAULT_INDUSTRY_GROUPS,
  searchQuery,
  onSearchChange,
}: MobileNavigationShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("sc-mnav-locked");
      previousFocusRef.current = document.activeElement as HTMLElement;
    } else {
      document.body.classList.remove("sc-mnav-locked");
      // Return focus to the element that opened the menu
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
    return () => {
      document.body.classList.remove("sc-mnav-locked");
    };
  }, [isOpen]);

  // Keyboard handler: Escape to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      // Trap focus within drawer
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Close on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleSearchSubmit = useCallback(
    (query: string) => {
      router.push(`/free-tools?q=${encodeURIComponent(query)}`);
      onClose();
    },
    [router, onClose]
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const isPricingActive = pathname === "/pricing";

  return (
    <>
      {/* Overlay backdrop */}
      <div
        className={`sc-mnav-overlay${isOpen ? " open" : ""}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={`sc-mnav sc-mnav-drawer${isOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!isOpen}
      >
        {/* Header: logo + close */}
        <div className="sc-mnav-header">
          <Link
            href="/"
            className="sc-mnav-logo"
            onClick={handleClose}
            aria-label="SectorCalc home"
            tabIndex={isOpen ? 0 : -1}
          >
            <img
              src={BRAND_ASSETS.logo.headerDefault}
              alt="SectorCalc"
              className="sc-mnav-logo-img"
            />
          </Link>
          <button
            className="sc-mnav-close"
            onClick={handleClose}
            aria-label="Close navigation menu"
            tabIndex={isOpen ? 0 : -1}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <MobileSearch
          value={searchQuery}
          onChange={onSearchChange}
          onSubmit={handleSearchSubmit}
          inputRef={searchInputRef}
          autoFocus={isOpen}
        />

        {/* Scrollable body */}
        <div className="sc-mnav-body">
          {/* ── Products Section ── */}
          <MobileNavSection
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20V10" />
                <path d="M18 20V4" />
                <path d="M6 20v-4" />
              </svg>
            }
            label="Products"
            id="products"
          >
            <MobileNavItem
              href="/free-tools"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20V10" />
                  <path d="M18 20V4" />
                  <path d="M6 20v-4" />
                </svg>
              }
              title="Free tools"
              description="Essential tools for quick calculations"
              badge={freeToolsCount}
              onClick={handleClose}
              showArrow
            />
            <MobileNavItem
              href="/pro-tools"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
              title="Pro tools"
              description="Advanced tools for professionals"
              badge={proToolsCount}
              onClick={handleClose}
              showArrow
            />
            <MobileNavItem
              href="/engineering-diagnostics"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              }
              title="Engineering Diagnostics"
              description="Solve complex engineering challenges"
              onClick={handleClose}
              showArrow
            />
          </MobileNavSection>

          {/* ── Industries Section ── */}
          <MobileNavSection
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            }
            label="Industries"
            id="industries"
          >
            <div className="sc-mnav-industry-grid">
              {industryGroups.map((ind) => (
                <Link
                  key={ind.slug}
                  href={ind.href}
                  className="sc-mnav-industry-item"
                  onClick={handleClose}
                >
                  <svg className="sc-mnav-industry-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  <span className="sc-mnav-industry-item-label">{ind.label}</span>
                  <span className="sc-mnav-industry-item-count">{ind.count}</span>
                </Link>
              ))}
            </div>
            <MobileNavItem
              href="/industries"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              }
              title="All industries"
              description="Browse all 18 sectors"
              onClick={handleClose}
              showArrow
            />
          </MobileNavSection>

          {/* ── Pricing Section ── */}
          <MobileNavSection
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
            label="Pricing"
            id="pricing"
          >
            <div className="sc-mnav-pricing-grid">
              <Link
                href="/pricing"
                className="sc-mnav-pricing-item"
                onClick={handleClose}
              >
                <svg className="sc-mnav-pricing-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="sc-mnav-pricing-item-label">Pricing overview</span>
              </Link>
              <Link
                href="/pricing"
                className="sc-mnav-pricing-item"
                onClick={handleClose}
              >
                <svg className="sc-mnav-pricing-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span className="sc-mnav-pricing-item-label">Credits</span>
              </Link>
              <Link
                href="/pricing"
                className="sc-mnav-pricing-item"
                onClick={handleClose}
              >
                <svg className="sc-mnav-pricing-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                <span className="sc-mnav-pricing-item-label">How access works</span>
              </Link>
              <Link
                href="/pricing"
                className="sc-mnav-pricing-item"
                onClick={handleClose}
              >
                <svg className="sc-mnav-pricing-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 3 21 3 21 8" />
                  <line x1="4" y1="20" x2="21" y2="3" />
                  <polyline points="21 16 21 21 16 21" />
                  <line x1="15" y1="15" x2="21" y2="21" />
                  <line x1="4" y1="4" x2="9" y2="9" />
                </svg>
                <span className="sc-mnav-pricing-item-label">Compare free vs pro</span>
              </Link>
            </div>
            <Link
              href="/pricing"
              className="sc-mnav-pricing-cta"
              onClick={handleClose}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              View pricing
            </Link>
          </MobileNavSection>

          {/* ── Resources Section ── */}
          <MobileNavSection
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            }
            label="Resources"
            id="resources"
          >
            <MobileNavItem
              href="/case-studies"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              }
              title="Case Studies"
              description="Methods & case studies"
              onClick={handleClose}
              showArrow
            />
            <MobileNavItem
              href="/calculators/fmea-rpn"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              }
              title="FMEA RPN Calculator"
              description="Failure Mode & Effects Analysis"
              onClick={handleClose}
              showArrow
            />
            <MobileNavItem
              href="/guides"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              }
              title="Guides"
              description="Engineering guides & docs"
              onClick={handleClose}
              showArrow
            />
            <MobileNavItem
              href="/methodology"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              }
              title="Help / FAQ"
              description="About methodology & support"
              onClick={handleClose}
              showArrow
            />
            <MobileNavItem
              href="/about-us"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
              title="About methodology"
              description="Our approach & standards"
              onClick={handleClose}
              showArrow
            />
          </MobileNavSection>

          {/* Pricing plain link (always visible at bottom) */}
          <Link
            href="/pricing"
            className="sc-mnav-plain-link"
            onClick={handleClose}
          >
            <svg className="sc-mnav-plain-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span className="sc-mnav-plain-link-label">Pricing</span>
            {isPricingActive && (
              <svg className="sc-mnav-plain-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </Link>
        </div>

        {/* CTA block */}
        <MobileCTA isAuthenticated={isAuthenticated} onClose={handleClose} />
      </div>
    </>
  );
}
