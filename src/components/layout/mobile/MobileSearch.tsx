"use client";

import { useRef, useEffect } from "react";

interface MobileSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (query: string) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  autoFocus?: boolean;
}

export function MobileSearch({
  value,
  onChange,
  onSubmit,
  inputRef: externalRef,
  autoFocus = false,
}: MobileSearchProps) {
  const defaultRef = useRef<HTMLInputElement>(null);
  const inputRef = externalRef || defaultRef;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      // Delay focus to allow animation to settle
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [autoFocus, inputRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      onSubmit(trimmed);
    }
  };

  return (
    <div className="sc-mnav-search">
      <form
        className="sc-mnav-search-form"
        onSubmit={handleSubmit}
        role="search"
      >
        <input
          ref={inputRef}
          type="search"
          className="sc-mnav-search-input"
          placeholder="Search tools, industries, and resources..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search tools, industries, and resources"
          autoComplete="off"
          enterKeyHint="search"
        />
        <button
          type="submit"
          className="sc-mnav-search-btn"
          aria-label="Submit search"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>
    </div>
  );
}
