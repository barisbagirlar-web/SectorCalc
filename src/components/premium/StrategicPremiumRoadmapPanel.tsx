"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { getPremiumRoadmapCopy } from "@/data/premium-roadmap-i18n";
import type { StrategicPremiumRoadmapCard } from "@/lib/catalog/strategic-premium-roadmap";

type PhaseFilter = "all" | "1" | "2" | "3" | "4";
type StatusFilter = "all" | "live" | "planned";

interface StrategicPremiumRoadmapPanelProps {
  items: readonly StrategicPremiumRoadmapCard[];
}

const chipBase =
  "inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-sm border px-3 text-sm font-medium transition-colors";
const chipActive = "border-sc-copper bg-sc-copper text-white";
const chipIdle =
  "border-technical-gray bg-white text-premium-velvet hover:border-sc-copper/40 hover:bg-industrial-matte";

function matchesPhase(item: StrategicPremiumRoadmapCard, phase: PhaseFilter): boolean {
  if (phase === "all") return true;
  return item.phase === Number(phase);
}

function matchesStatus(item: StrategicPremiumRoadmapCard, status: StatusFilter): boolean {
  if (status === "all") return true;
  return item.status === status;
}

export function StrategicPremiumRoadmapPanel({ items }: StrategicPremiumRoadmapPanelProps) {
  const locale = useLocale();
  const copy = getPremiumRoadmapCopy(locale);
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(
    () =>
      items.filter(
        (item) => matchesPhase(item, phaseFilter) && matchesStatus(item, statusFilter),
      ),
    [items, phaseFilter, statusFilter],
  );

  const phaseOptions: { id: PhaseFilter; label: string }[] = [
    { id: "all", label: copy.phaseAll },
    { id: "1", label: copy.phase1 },
    { id: "2", label: copy.phase2 },
    { id: "3", label: copy.phase3 },
    { id: "4", label: copy.phase4 },
  ];

  const statusOptions: { id: StatusFilter; label: string }[] = [
    { id: "all", label: copy.statusAll },
    { id: "live", label: copy.statusLive },
    { id: "planned", label: copy.statusPlanned },
  ];

  return (
    <div className="min-w-0 space-y-6">
      <div className="space-y-2">
        <p className="sc-pro-eyebrow">{copy.eyebrow}</p>
        <h2 className="sc-craft-headline text-xl sm:text-2xl">{copy.title}</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-body-charcoal">{copy.subtitle}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-body-charcoal">
            {copy.phaseFilterLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {phaseOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setPhaseFilter(option.id)}
                className={`${chipBase} ${phaseFilter === option.id ? chipActive : chipIdle}`}
                aria-pressed={phaseFilter === option.id}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-body-charcoal">
            {copy.statusFilterLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setStatusFilter(option.id)}
                className={`${chipBase} ${statusFilter === option.id ? chipActive : chipIdle}`}
                aria-pressed={statusFilter === option.id}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-sm border border-dashed border-technical-gray bg-industrial-matte px-4 py-10 text-center text-sm text-body-charcoal">
          {copy.noResults}
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <li key={item.id} className="min-w-0">
              <article className="flex h-full flex-col border border-technical-gray bg-white p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-sm bg-industrial-matte px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-body-charcoal">
                    {copy.phaseBadge(item.phase)}
                  </span>
                  <span className="rounded-sm border border-technical-gray px-2 py-0.5 font-mono text-[11px] font-semibold text-premium-velvet">
                    {copy.scoreLabel(item.score.toFixed(1))}
                  </span>
                  <span
                    className={`rounded-sm px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                      item.status === "live"
                        ? "bg-safe-green/10 text-safe-green"
                        : "bg-warn-amber/10 text-warn-amber"
                    }`}
                  >
                    {item.status === "live" ? copy.statusLive : copy.statusPlanned}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-base font-semibold leading-snug text-premium-velvet">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-body-charcoal">
                  {item.shortDescription}
                </p>
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-body-charcoal">
                  {copy.categories[item.categoryId] ?? item.categoryId}
                </p>

                <div className="mt-4">
                  {item.href ? (
                    <Link
                      href={item.href}
                      prefetch={false}
                      className="inline-flex min-h-[44px] w-full items-center justify-center rounded-sm bg-sc-copper px-4 text-sm font-semibold text-white transition-colors hover:bg-sc-copper-hover"
                    >
                      {copy.ctaOpen}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className="inline-flex min-h-[44px] w-full cursor-not-allowed items-center justify-center rounded-sm border border-technical-gray bg-industrial-matte px-4 text-sm font-semibold text-body-charcoal"
                    >
                      {copy.ctaComingSoon}
                    </button>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
