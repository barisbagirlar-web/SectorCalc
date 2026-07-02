"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "@/lib/ui-shared/navigation/next-link";
import { useTranslations } from "@/lib/i18n-stub";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { AdminAuthBar } from "@/components/admin/AdminAuthPanel";
import { useAdminAuth } from "@/lib/features/admin/use-admin-auth";
import {
  listToolFeedbackForAdmin,
  updateToolFeedbackStatus,
  type ToolFeedbackListFilters,
} from "@/lib/features/feedback/feedback-service";
import {
  FEEDBACK_KINDS,
  FEEDBACK_SEVERITIES,
  FEEDBACK_STATUSES,
  type FeedbackKind,
  type FeedbackSeverity,
  type FeedbackStatus,
  type ToolFeedbackDocument,
} from "@/lib/features/feedback/types";
import { formatLocalDateTime } from "@/lib/core/format/datetime";
import { isFirebaseConfigured } from "@/lib/infrastructure/firebase/client";
import { getLoginHref } from "@/lib/features/tools/tool-links";

const selectClass =
  "min-h-[44px] w-full rounded-lg border border-slate/25 bg-white px-3 text-sm text-deep-navy focus:border-professional-blue focus:outline-none focus:ring-2 focus:ring-professional-blue/20 sm:w-auto";

function statusBadgeClass(status: FeedbackStatus): string {
  if (status === "accepted" || status === "implemented") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (status === "rejected" || status === "closed") {
    return "border-slate-200 bg-slate-50 text-slate-700";
  }
  if (status === "in_review" || status === "triaged") {
    return "border-amber-200 bg-amber-50 text-amber-900";
  }
  return "border-blue-200 bg-blue-50 text-blue-900";
}

function severityBadgeClass(severity: FeedbackSeverity): string {
  if (severity === "critical" || severity === "high") {
    return "border-red-200 bg-red-50 text-red-800";
  }
  if (severity === "medium") {
    return "border-amber-200 bg-amber-50 text-amber-900";
  }
  return "border-slate-200 bg-slate-50 text-slate-700";
}

export function AccountFeedbackQueueClient() {
  const t = useTranslations("feedback");
  const { loading: authLoading, isAdmin, user } = useAdminAuth();
  const [items, setItems] = useState<ToolFeedbackDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<ToolFeedbackListFilters>({
    kind: "",
    locale: "",
    toolSlug: "",
    severity: "",
    status: "",
  });

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  const loadItems = useCallback(async () => {
    if (!isAdmin) {
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const next = await listToolFeedbackForAdmin(filters);
      setItems(next);
      if (selectedId && !next.some((item) => item.id === selectedId)) {
        setSelectedId(null);
      }
    } catch {
      setLoadError(t("error.submitFailed"));
    } finally {
      setLoading(false);
    }
  }, [filters, isAdmin, selectedId, t]);

  useEffect(() => {
    if (isAdmin) {
      void loadItems();
    }
  }, [isAdmin, loadItems]);

  const handleStatusChange = async (feedbackId: string, status: FeedbackStatus) => {
    try {
      const ok = await updateToolFeedbackStatus(feedbackId, status);
      if (!ok) {
        setLoadError(t("error.submitFailed"));
        return;
      }
      setItems((current) =>
        current.map((item) =>
          item.id === feedbackId
            ? { ...item, status, updatedAt: new Date().toISOString() }
            : item,
        ),
      );
    } catch {
      setLoadError(t("error.submitFailed"));
    }
  };

  if (authLoading) {
    return (
      <PageLayout>
        <Container size="wide" className="py-8">
          <p className="text-sm text-body-charcoal">{t("admin.loading")}</p>
        </Container>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <Container size="wide" className="py-8">
          <div className="sc-account-hub__guest-card max-w-lg rounded-xl border border-slate/20 bg-off-white p-6">
            <h1 className="text-lg font-semibold text-deep-navy">{t("admin.title")}</h1>
            <p className="mt-2 text-sm text-body-charcoal">{t("admin.signInRequired")}</p>
            <Link href={getLoginHref("/account/feedback")} className="sc-cta-primary mt-4 inline-flex min-h-[44px] items-center px-5 text-sm">
              {t("admin.signInCta")}
            </Link>
          </div>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="sc-feedback-admin py-6 sm:py-8">
        <Container size="wide" className="min-w-0">
          <AdminAuthBar />
          <header className="mt-6">
            <h1 className="text-xl font-semibold text-deep-navy sm:text-2xl">{t("admin.title")}</h1>
            <p className="mt-1 text-sm text-body-charcoal">{t("admin.subtitle")}</p>
          </header>

          {!isAdmin ? (
            <p className="mt-6 text-sm text-body-charcoal">{t("admin.adminOnly")}</p>
          ) : (
            <>
              {!isFirebaseConfigured ? (
                <p className="mt-4 text-sm text-amber-800">{t("admin.firebaseMissing")}</p>
              ) : null}

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <label className="block text-xs font-medium text-deep-navy">
                  {t("admin.filters.kind")}
                  <select
                    className={`${selectClass} mt-1`}
                    value={filters.kind ?? ""}
                    onChange={(event) =>
                      setFilters((prev) => ({
                        ...prev,
                        kind: event.target.value as FeedbackKind | "",
                      }))
                    }
                  >
                    <option value="">{t("admin.filters.all")}</option>
                    {FEEDBACK_KINDS.map((kind) => (
                      <option key={kind} value={kind}>
                        {t(`kind.${kind}`)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-medium text-deep-navy">
                  {t("admin.filters.locale")}
                  <input
                    type="text"
                    className={`${selectClass} mt-1`}
                    value={filters.locale ?? ""}
                    onChange={(event) =>
                      setFilters((prev) => ({ ...prev, locale: event.target.value }))
                    }
                    placeholder="en"
                  />
                </label>
                <label className="block text-xs font-medium text-deep-navy">
                  {t("admin.filters.tool")}
                  <input
                    type="text"
                    className={`${selectClass} mt-1`}
                    value={filters.toolSlug ?? ""}
                    onChange={(event) =>
                      setFilters((prev) => ({ ...prev, toolSlug: event.target.value }))
                    }
                  />
                </label>
                <label className="block text-xs font-medium text-deep-navy">
                  {t("admin.filters.severity")}
                  <select
                    className={`${selectClass} mt-1`}
                    value={filters.severity ?? ""}
                    onChange={(event) =>
                      setFilters((prev) => ({
                        ...prev,
                        severity: event.target.value as FeedbackSeverity | "",
                      }))
                    }
                  >
                    <option value="">{t("admin.filters.all")}</option>
                    {FEEDBACK_SEVERITIES.map((severity) => (
                      <option key={severity} value={severity}>
                        {t(`admin.severity.${severity}`)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-medium text-deep-navy">
                  {t("admin.filters.status")}
                  <select
                    className={`${selectClass} mt-1`}
                    value={filters.status ?? ""}
                    onChange={(event) =>
                      setFilters((prev) => ({
                        ...prev,
                        status: event.target.value as FeedbackStatus | "",
                      }))
                    }
                  >
                    <option value="">{t("admin.filters.all")}</option>
                    {FEEDBACK_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {t(`admin.status.${status}`)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void loadItems()}
                  disabled={loading}
                  className="min-h-[44px] rounded-lg border border-slate/25 bg-white px-4 text-sm font-medium text-deep-navy hover:bg-off-white disabled:opacity-60"
                >
                  {loading ? t("admin.refreshing") : t("admin.refresh")}
                </button>
              </div>

              {loadError ? <p className="mt-4 text-sm text-soft-red">{loadError}</p> : null}

              {items.length === 0 && !loading ? (
                <p className="mt-6 text-sm text-body-charcoal">{t("admin.empty")}</p>
              ) : (
                <div className="mt-6 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <ul className="min-w-0 space-y-2">
                    {items.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedId(item.id)}
                          className={[
                            "w-full rounded-lg border p-3 text-left transition-colors",
                            selectedId === item.id
                              ? "border-professional-blue bg-white"
                              : "border-slate/20 bg-white hover:border-professional-blue/30",
                          ].join(" ")}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusBadgeClass(item.status)}`}
                            >
                              {t(`admin.status.${item.status}`)}
                            </span>
                            <span
                              className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${severityBadgeClass(item.severity)}`}
                            >
                              {t(`admin.severity.${item.severity}`)}
                            </span>
                          </div>
                          <p className="mt-2 text-xs font-medium text-deep-navy">
                            {t(`kind.${item.kind}`)} · {item.toolSlug}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs text-body-charcoal">{item.message}</p>
                          <p className="mt-2 text-[11px] text-body-charcoal">
                            {item.locale} · {formatLocalDateTime(item.createdAt)}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>

                  {selectedItem ? (
                    <article className="min-w-0 rounded-lg border border-slate/20 bg-white p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusBadgeClass(selectedItem.status)}`}
                        >
                          {t(`admin.status.${selectedItem.status}`)}
                        </span>
                        <span className="text-xs text-body-charcoal">{selectedItem.id}</span>
                      </div>
                      <h2 className="mt-3 text-sm font-semibold text-deep-navy">
                        {t(`kind.${selectedItem.kind}`)}
                      </h2>
                      <p className="mt-1 text-xs text-body-charcoal">
                        {selectedItem.toolSlug} · {selectedItem.locale} · {selectedItem.routePath}
                      </p>
                      <p className="mt-3 whitespace-pre-wrap text-sm text-body-charcoal">
                        {selectedItem.message}
                      </p>
                      {selectedItem.sectorContext ? (
                        <p className="mt-3 text-xs text-body-charcoal">
                          <span className="font-medium text-deep-navy">{t("sectorContext.label")}: </span>
                          {selectedItem.sectorContext}
                        </p>
                      ) : null}
                      {selectedItem.suggestedFormulaChange ? (
                        <p className="mt-2 whitespace-pre-wrap text-xs text-body-charcoal">
                          <span className="font-medium text-deep-navy">
                            {t("suggestedFormulaChange.label")}:{" "}
                          </span>
                          {selectedItem.suggestedFormulaChange}
                        </p>
                      ) : null}
                      <label className="mt-4 block text-xs font-medium text-deep-navy">
                        {t("admin.updateStatus")}
                        <select
                          className={`${selectClass} mt-1 w-full`}
                          value={selectedItem.status}
                          onChange={(event) =>
                            void handleStatusChange(
                              selectedItem.id,
                              event.target.value as FeedbackStatus,
                            )
                          }
                        >
                          {FEEDBACK_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {t(`admin.status.${status}`)}
                            </option>
                          ))}
                        </select>
                      </label>
                    </article>
                  ) : (
                    <div className="hidden rounded-lg border border-dashed border-slate/25 bg-off-white/50 p-6 lg:block">
                      <p className="text-sm text-body-charcoal">{t("admin.selectItem")}</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </Container>
      </div>
    </PageLayout>
  );
}
