"use client";

import { useState, type ReactNode } from "react";

/**
 * Client-only expand/collapse wrapper for large tool lists.
 * Only renders when tools exceed EXPAND_THRESHOLD.
 */
export function ToolAlphaListExpandButton({
  children,
  total,
}: {
  children: ReactNode;
  total: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      {/* children is the tool list; we control visibility via CSS */}
      <div
        className={
          expanded ? "" : "max-h-[720px] overflow-hidden relative"
        }
      >
        {children}

        {!expanded && (
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-3 text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline transition-colors"
        aria-expanded={expanded}
      >
        {expanded
          ? `Gizle`
          : `Tümünü Göster (${total} araç)`}
      </button>
    </div>
  );
}
