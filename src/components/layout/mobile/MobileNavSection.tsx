"use client";

import type { ReactNode } from "react";
import { useRef, useState, useEffect } from "react";

interface MobileNavSectionProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
  id: string;
}

export function MobileNavSection({
  icon,
  label,
  children,
  defaultOpen = false,
  id,
}: MobileNavSectionProps) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const bodyRef = useRef<HTMLDivElement>(null);

  const sectionId = `mnav-section-${id}`;
  const bodyId = `mnav-body-${id}`;

  useEffect(() => {
    if (defaultOpen && bodyRef.current) {
      bodyRef.current.style.maxHeight = `${bodyRef.current.scrollHeight}px`;
    }
  }, [defaultOpen]);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (bodyRef.current) {
      if (next) {
        bodyRef.current.style.maxHeight = `${bodyRef.current.scrollHeight}px`;
      } else {
        bodyRef.current.style.maxHeight = "0";
      }
    }
  };

  return (
    <div className="sc-mnav-section">
      <button
        className="sc-mnav-section-trigger"
        onClick={toggle}
        aria-expanded={expanded}
        aria-controls={bodyId}
        id={sectionId}
        type="button"
      >
        <span className="sc-mnav-section-icon">{icon}</span>
        <span className="sc-mnav-section-label">{label}</span>
        <svg
          className="sc-mnav-section-chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        ref={bodyRef}
        id={bodyId}
        role="region"
        aria-labelledby={sectionId}
        className={`sc-mnav-section-body${expanded ? " expanded" : ""}`}
      >
        <div className="sc-mnav-section-inner">{children}</div>
      </div>
    </div>
  );
}
