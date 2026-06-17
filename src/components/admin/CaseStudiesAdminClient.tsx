"use client";

import Link from "@/lib/navigation/next-link";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminAuthBar } from "@/components/admin/AdminAuthPanel";
import { useAdminAuth } from "@/lib/admin/use-admin-auth";
import { listPublishedAdminCaseStudies } from "@/lib/case-studies/admin-case-studies";
import {
  deleteCaseStudyDraft,
  listCaseStudyDrafts,
  type CaseStudyDraftRecord,
} from "@/lib/case-studies/case-study-drafts";
import type { AdminCaseStudyListItem } from "@/lib/case-studies/admin-case-studies";

const buttonPrimaryClass =
  "inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-professional-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-black";

const tableHeadClass = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary";
const tableCellClass = "px-4 py-3 text-sm text-deep-navy";

function SourceBadge({ source }: { source: AdminCaseStudyListItem["source"] }) {
  const label = source === "published" ? "Live" : "Draft";
  const className =
    source === "published"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-amber-200 bg-amber-50 text-amber-900";
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}

export function CaseStudiesAdminClient() {
  const { loading: authLoading, isAdmin } = useAdminAuth();
  const [drafts, setDrafts] = useState<CaseStudyDraftRecord[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const publishedRows = useMemo(() => listPublishedAdminCaseStudies(), [refreshKey]);

  const draftRows = useMemo<AdminCaseStudyListItem[]>(
    () =>
      drafts.map((draft) => ({
        id: draft.id ?? draft.slug,
        slug: draft.slug,
        title: draft.title || "(Untitled draft)",
        industry: draft.industry || "—",
        publishedAt: draft.publishedAt,
        source: "draft",
      })),
    [drafts],
  );

  const rows = useMemo(
    () =>
      [...publishedRows, ...draftRows].sort((a, b) =>
        b.publishedAt.localeCompare(a.publishedAt),
      ),
    [draftRows, publishedRows],
  );

  const reloadDrafts = useCallback(() => {
    setDrafts(listCaseStudyDrafts());
    setRefreshKey((value) => value + 1);
  }, []);

  useEffect(() => {
    reloadDrafts();
  }, [reloadDrafts]);

  const handleDeleteDraft = (id: string) => {
    if (!window.confirm("Delete this browser draft? Live published stories require a repo edit.")) {
      return;
    }
    deleteCaseStudyDraft(id);
    reloadDrafts();
  };

  if (authLoading) {
    return <p className="text-sm text-text-secondary">Checking admin access…</p>;
  }

  return (
    <div>
      <AdminAuthBar />

      {!isAdmin ? (
        <p className="mt-6 text-sm text-text-secondary">
          Sign in with an admin account to manage case study drafts.
        </p>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-text-secondary">
              Published stories are static build content. Drafts save in this browser and export JSON
              for commit to <code className="text-xs">data.ts</code> / locale files.
            </p>
            <Link href="/admin/case-studies/new" className={buttonPrimaryClass}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              New story
            </Link>
          </div>

          {rows.length === 0 ? (
            <div className="mt-6 rounded-sm border border-slate/20 bg-white p-12 text-center text-sm text-text-secondary shadow-card">
              No case studies yet. Create a draft to start authoring.
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-sm border border-slate/20 bg-white shadow-card">
              <table className="min-w-full divide-y divide-slate/15">
                <thead className="bg-off-white">
                  <tr>
                    <th className={tableHeadClass}>Title</th>
                    <th className={tableHeadClass}>Industry</th>
                    <th className={tableHeadClass}>Published</th>
                    <th className={tableHeadClass}>Status</th>
                    <th className={`${tableHeadClass} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate/10">
                  {rows.map((row) => (
                    <tr key={`${row.source}-${row.id}`} className="hover:bg-off-white/60">
                      <td className={tableCellClass}>
                        {row.source === "published" ? (
                          <Link
                            href={`/case-studies/${row.slug}`}
                            className="inline-flex items-center gap-1 font-medium text-professional-blue hover:underline"
                          >
                            {row.title}
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                        ) : (
                          <span className="font-medium">{row.title}</span>
                        )}
                      </td>
                      <td className={tableCellClass}>{row.industry}</td>
                      <td className={tableCellClass}>{row.publishedAt}</td>
                      <td className={tableCellClass}>
                        <SourceBadge source={row.source} />
                      </td>
                      <td className={`${tableCellClass} text-right`}>
                        <Link
                          href={`/admin/case-studies/${encodeURIComponent(row.id)}/edit`}
                          className="mr-3 inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-professional-blue hover:text-black"
                          aria-label={`Edit ${row.title}`}
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        {row.source === "draft" ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteDraft(row.id)}
                            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-red-600 hover:text-red-800"
                            aria-label={`Delete draft ${row.title}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
