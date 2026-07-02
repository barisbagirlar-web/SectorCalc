"use client";

import type { ReactNode } from "react";
import type { Tool } from "@/data/tools";
import type { FreeToolCategorySlug } from "@/lib/features/free-tools/free-tool-categories";
import {
  resolveFreeToolCategoryIcon,
  resolveFreeToolCategoryTagline,
  resolveFreeToolCategoryTitle,
  resolveFreeToolCategoryField,
  resolveFreeToolCategoryDomain,
  resolveFreeToolCategorySocialPurpose,
} from "@/lib/features/free-tools/free-tool-categories";
import { ToolsTileGrid } from "@/components/tools/ToolsTileGrid";
import { FreeToolCategoryIcon } from "./FreeToolCategoryIcon";

type FreeToolCategorySectionProps = {
  readonly slug: FreeToolCategorySlug;
  readonly tools: readonly Tool[];
  readonly locale: string;
  readonly totalTools: number;
};

/** Premium-style category section - line icon + title + tagline + field/domain/purpose badges + tool grid. */
export function FreeToolCategorySection({
  slug,
  tools,
  locale,
  totalTools,
}: FreeToolCategorySectionProps) {
  if (tools.length === 0) return null;

  const title = resolveFreeToolCategoryTitle(slug, locale);
  const tagline = resolveFreeToolCategoryTagline(slug, locale);
  const field = resolveFreeToolCategoryField(slug, locale);
  const domain = resolveFreeToolCategoryDomain(slug, locale);
  const socialPurpose = resolveFreeToolCategorySocialPurpose(slug, locale);
  const iconKey = resolveFreeToolCategoryIcon(slug);

  return (
    <section className="mb-12" data-category-slug={slug}>
      {/* Category header - premium line-art SVG symbol */}
      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-copper/30 bg-white">
          <FreeToolCategoryIcon iconKey={iconKey} className="h-6 w-6 text-copper" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-gray-900">
            {title}
          </h2>
          {tagline ? (
            <p className="text-sm text-gray-500">{tagline}</p>
          ) : null}
        </div>
        <span className="ml-auto shrink-0 text-xs font-medium text-gray-400">
          {tools.length}/{totalTools}
        </span>
      </div>

      {/* Field · Domain · Social Purpose badges */}
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
        {field ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-sc-copper/20 bg-sc-copper/5 px-2.5 py-0.5 font-medium text-sc-copper">
            {field}
          </span>
        ) : null}
        {domain ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 font-medium text-blue-700">
            {domain}
          </span>
        ) : null}
        {socialPurpose ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700">
            {socialPurpose}
          </span>
        ) : null}
      </div>

      {/* Decorative line */}
      <div className="mb-4 h-px w-full bg-gradient-to-r from-copper/40 via-gray-200 to-transparent" />

      {/* Tool grid */}
      <ToolsTileGrid tools={tools} />
    </section>
  );
}

// ─── Category group wrapper ─────────────────────────────────────────────────

type FreeToolsCategoryGroupProps = {
  readonly children: ReactNode;
};

/** Wrapper for all category sections. Provides aria landmark and spacing. */
export function FreeToolsCategoryGroup({ children }: FreeToolsCategoryGroupProps) {
  return (
    <div className="space-y-2" role="list" aria-label="Tool categories">
      {children}
    </div>
  );
}
