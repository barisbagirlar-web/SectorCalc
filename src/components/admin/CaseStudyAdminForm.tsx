"use client";

import {
  ArrowLeft,
  FileText,
  MapPin,
  Plus,
  Rocket,
  Save,
  Star,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import Link from "@/lib/navigation/next-link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AdminAuthBar } from "@/components/admin/AdminAuthPanel";
import { useAdminAuth } from "@/lib/admin/use-admin-auth";
import {
  getPublishedCaseStudyByAdminId,
  nextPublishedCaseStudyId,
} from "@/lib/case-studies/admin-case-studies";
import { isLikelyFirestoreDocumentId } from "@/lib/case-studies/case-study-id-utils";
import {
  caseStudyToFormValues,
  downloadCaseStudyDraftExport,
  emptyCaseStudyFormValues,
  formValuesToDraft,
  getCaseStudyDraftById,
  saveCaseStudyDraft,
  type CaseStudyFormValues,
} from "@/lib/case-studies/case-study-drafts";
import type { CaseStudy, CaseStudyResult } from "@/lib/case-studies/types";

const fieldClass =
  "w-full min-h-[44px] rounded-lg border border-slate/25 bg-white px-3 py-2 text-sm text-deep-navy focus:border-sc-copper focus:outline-none focus:ring-2 focus:ring-sc-copper/20";

const sectionClass = "space-y-4 rounded-xl border border-slate/20 bg-white p-6";
const sectionTitleClass =
  "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary";

type CaseStudyAdminFormProps = {
  readonly studyId?: string;
  readonly mode: "create" | "edit";
};

function updateResultRow(
  results: CaseStudyResult[],
  index: number,
  field: keyof CaseStudyResult,
  value: string,
): CaseStudyResult[] {
  return results.map((row, rowIndex) =>
    rowIndex === index ? { ...row, [field]: value } : row,
  );
}

export function CaseStudyAdminForm({ studyId, mode }: CaseStudyAdminFormProps) {
  const router = useRouter();
  const { loading: authLoading, isAdmin, getIdToken } = useAdminAuth();
  const initialId = useMemo(
    () => studyId ?? nextPublishedCaseStudyId(),
    [studyId],
  );

  const initialValues = useMemo(() => {
    if (studyId) {
      const draft = getCaseStudyDraftById(studyId);
      if (draft) {
        return caseStudyToFormValues(draft);
      }
      const published = getPublishedCaseStudyByAdminId(studyId);
      if (published) {
        return caseStudyToFormValues(published);
      }
    }
    return emptyCaseStudyFormValues(initialId);
  }, [initialId, studyId]);

  const [values, setValues] = useState<CaseStudyFormValues>(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [firestoreLoaded, setFirestoreLoaded] = useState(false);

  const isPublishedEdit =
    mode === "edit" &&
    studyId !== undefined &&
    getPublishedCaseStudyByAdminId(studyId) !== undefined &&
    getCaseStudyDraftById(studyId) === undefined;

  const isFirestoreEdit =
    mode === "edit" &&
    studyId !== undefined &&
    isLikelyFirestoreDocumentId(studyId) &&
    !isPublishedEdit;

  useEffect(() => {
    if (!isAdmin || !studyId || !isFirestoreEdit || firestoreLoaded) {
      return;
    }

    void (async () => {
      const token = await getIdToken();
      if (!token) {
        return;
      }

      try {
        const response = await fetch(`/api/admin/case-studies/${encodeURIComponent(studyId)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          return;
        }
        const payload = (await response.json()) as CaseStudy;
        setValues(caseStudyToFormValues(payload));
        setFirestoreLoaded(true);
      } catch (loadError) {
        console.error("Failed to load Firestore case study:", loadError);
      }
    })();
  }, [firestoreLoaded, getIdToken, isAdmin, isFirestoreEdit, studyId]);

  const pageTitle = mode === "create" ? "Yeni Başarı Hikayesi" : "Başarı Hikayesini Düzenle";

  const update = <K extends keyof CaseStudyFormValues>(field: K, value: CaseStudyFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const addResult = () => {
    setValues((prev) => ({
      ...prev,
      results: [...prev.results, { metric: "", before: "", after: "" }],
    }));
  };

  const removeResult = (index: number) => {
    setValues((prev) => {
      if (prev.results.length <= 1) {
        return prev;
      }
      return {
        ...prev,
        results: prev.results.filter((_, rowIndex) => rowIndex !== index),
      };
    });
  };

  const handleSave = () => {
    setSubmitting(true);
    setError(null);
    setMessage(null);

    if (!values.title.trim()) {
      setError("Başlık zorunludur.");
      setSubmitting(false);
      return;
    }

    const draft = formValuesToDraft(values);
    saveCaseStudyDraft(draft);
    downloadCaseStudyDraftExport(draft);
    setMessage(
      isPublishedEdit
        ? "Taslak kaydedildi ve JSON indirildi. Yayına almak için repo dosyalarını güncelleyip deploy edin."
        : "Taslak kaydedildi ve JSON indirildi. Yayına almak için dosyayı repoya ekleyin.",
    );
    setSubmitting(false);

    if (mode === "create") {
      router.replace(`/admin/case-studies/${encodeURIComponent(draft.id ?? draft.slug)}/edit`);
    }
  };

  const handlePublish = async () => {
    if (!values.title.trim()) {
      setError("Başlık zorunludur.");
      return;
    }

    setPublishing(true);
    setError(null);
    setMessage(null);

    try {
      const token = await getIdToken(true);
      if (!token) {
        setError("Yönetici oturumu bulunamadı. Lütfen tekrar giriş yapın.");
        return;
      }

      const isUpdate = mode === "edit" && studyId && (isFirestoreEdit || isLikelyFirestoreDocumentId(studyId));
      const endpoint = isUpdate
        ? `/api/admin/case-studies/${encodeURIComponent(studyId ?? "")}`
        : "/api/admin/case-studies";
      const method = isUpdate ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "Yayınlanamadı.");
        return;
      }

      saveCaseStudyDraft(formValuesToDraft(values));
      setMessage("Başarı hikayesi Firestore'a yayınlandı. Public sayfa en geç 60 saniye içinde güncellenir.");
      router.push("/admin/case-studies");
    } catch (publishError) {
      console.error("Publish error:", publishError);
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setPublishing(false);
    }
  };

  if (authLoading) {
    return <p className="text-sm text-text-secondary">Yönetici erişimi kontrol ediliyor…</p>;
  }

  return (
    <div>
      <AdminAuthBar />

      {!isAdmin ? (
        <p className="mt-6 text-sm text-text-secondary">
          Başarı hikayesi taslaklarını düzenlemek için yönetici hesabıyla giriş yapın.
        </p>
      ) : (
        <div className="mx-auto mt-6 max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-deep-navy">{pageTitle}</h1>
            <div className="flex flex-wrap items-center gap-4">
              {mode === "create" ? (
                <Link
                  href="/admin/case-studies/new"
                  className="text-sm font-medium text-sc-copper transition hover:text-deep-navy"
                >
                  Basit editör
                </Link>
              ) : null}
              <Link
                href="/admin/case-studies"
                className="inline-flex min-h-[44px] items-center gap-1 text-sm text-text-secondary transition hover:text-deep-navy"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Listeye Dön
              </Link>
            </div>
          </div>

          <p className="text-sm text-text-secondary">
            Tüm alanları doldurun. Kaydet ile tarayıcı taslağı ve JSON paketi oluşturulur; Yayınla ile
            Firestore&apos;a yazılır ve public sayfa ISR ile güncellenir.
          </p>

          {isPublishedEdit ? (
            <p className="rounded-lg border border-amber/25 bg-amber/5 px-4 py-3 text-sm text-deep-navy">
              Bu hikaye statik dosyalardan yayında. Kaydetme yalnızca tarayıcı taslağı oluşturur ve
              JSON dışa aktarır.
            </p>
          ) : null}

          {error ? (
            <p className="text-sm font-medium text-amber" role="alert">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="text-sm font-medium text-emerald-700" role="status">
              {message}
            </p>
          ) : null}

          <section className={sectionClass}>
            <h2 className={sectionTitleClass}>
              <FileText className="h-4 w-4" aria-hidden="true" />
              Kimlik ve Künye
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-sm font-medium text-deep-navy">Yayın Tarihi</span>
                <input
                  type="date"
                  value={values.publishedAt}
                  onChange={(event) => update("publishedAt", event.target.value)}
                  className={fieldClass}
                  required
                />
              </label>
              <label className="block space-y-1">
                <span className="text-sm font-medium text-deep-navy">Okuma Süresi (dk)</span>
                <input
                  type="number"
                  min={1}
                  value={values.readTime}
                  onChange={(event) => update("readTime", event.target.value)}
                  className={fieldClass}
                />
              </label>
            </div>
            <label className="mt-4 block space-y-1">
              <span className="text-sm font-medium text-deep-navy">Başlık (H1) *</span>
              <input
                type="text"
                value={values.title}
                onChange={(event) => update("title", event.target.value)}
                placeholder="Örn: CNC Atölyesi OEE'sini %18'den %61'e Çıkardı"
                className={fieldClass}
                required
              />
            </label>
            <label className="mt-4 block space-y-1">
              <span className="text-sm font-medium text-deep-navy">Alt Başlık</span>
              <input
                type="text"
                value={values.subtitle}
                onChange={(event) => update("subtitle", event.target.value)}
                placeholder="Kısa özet cümlesi…"
                className={fieldClass}
              />
            </label>
            <label className="mt-4 block space-y-1">
              <span className="text-sm font-medium text-deep-navy">Sektör</span>
              <input
                type="text"
                value={values.industry}
                onChange={(event) => update("industry", event.target.value)}
                placeholder="Örn: Otomotiv Yan Sanayi"
                className={fieldClass}
              />
            </label>
          </section>

          <section className={sectionClass}>
            <h2 className={sectionTitleClass}>
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Konum ve Süre
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-sm font-medium text-deep-navy">Ülke</span>
                <input
                  type="text"
                  value={values.country}
                  onChange={(event) => update("country", event.target.value)}
                  placeholder="Örn: Almanya"
                  className={fieldClass}
                />
              </label>
              <label className="block space-y-1">
                <span className="text-sm font-medium text-deep-navy">Şehir</span>
                <input
                  type="text"
                  value={values.city}
                  onChange={(event) => update("city", event.target.value)}
                  placeholder="Örn: Stuttgart"
                  className={fieldClass}
                />
              </label>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-sm font-medium text-deep-navy">Proje Süresi</span>
                <input
                  type="text"
                  value={values.projectDuration}
                  onChange={(event) => update("projectDuration", event.target.value)}
                  placeholder="Örn: Ocak 2026 – Mayıs 2026"
                  className={fieldClass}
                />
              </label>
              <label className="block space-y-1">
                <span className="text-sm font-medium text-deep-navy">Tasarruf (€)</span>
                <input
                  type="text"
                  value={values.savingsEur}
                  onChange={(event) => update("savingsEur", event.target.value)}
                  placeholder="1.232.000"
                  className={fieldClass}
                  inputMode="numeric"
                />
              </label>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className={sectionTitleClass}>
              <Tag className="h-4 w-4" aria-hidden="true" />
              Kullanılan Araçlar
            </h2>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-deep-navy">Slug&apos;lar (virgülle ayırın)</span>
              <input
                type="text"
                value={values.tools}
                onChange={(event) => update("tools", event.target.value)}
                placeholder="oee-downtime-calculator, scrap-rate-optimizer"
                className={fieldClass}
              />
              <p className="text-xs text-text-secondary">Araç slug&apos;larını virgülle ayırarak yazın.</p>
            </label>
            <label className="mt-4 block space-y-1">
              <span className="text-sm font-medium text-deep-navy">Kapak Görseli (URL)</span>
              <input
                type="text"
                value={values.coverImage}
                onChange={(event) => update("coverImage", event.target.value)}
                placeholder="/img/case-studies/ornek-kapak.jpg"
                className={fieldClass}
              />
              <p className="text-xs text-text-secondary">
                Statik dosya yolu girin. Örn: /img/case-studies/kapak.jpg
              </p>
            </label>
          </section>

          <section className={sectionClass}>
            <h2 className={sectionTitleClass}>
              <FileText className="h-4 w-4" aria-hidden="true" />
              Hikaye (Zorluk / Çözüm)
            </h2>
            <div className="space-y-4">
              <label className="block space-y-1">
                <span className="text-sm font-medium text-deep-navy">Zorluk (Challenge)</span>
                <textarea
                  value={values.challenge}
                  onChange={(event) => update("challenge", event.target.value)}
                  rows={4}
                  placeholder="Müşterinin karşılaştığı problemi yazın..."
                  className={`${fieldClass} min-h-[120px] resize-y`}
                />
              </label>
              <label className="block space-y-1">
                <span className="text-sm font-medium text-deep-navy">Çözüm (Solution)</span>
                <textarea
                  value={values.solution}
                  onChange={(event) => update("solution", event.target.value)}
                  rows={4}
                  placeholder="Hangi modüller kullanıldı, hangi standartlar uygulandı?"
                  className={`${fieldClass} min-h-[120px] resize-y`}
                />
              </label>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className={sectionTitleClass}>
              <Star className="h-4 w-4" aria-hidden="true" />
              Sonuçlar (Metrikler)
            </h2>
            <div className="space-y-3">
              {values.results.map((row, index) => (
                <div
                  key={`result-${index}`}
                  className="flex flex-col gap-3 rounded-lg border border-slate/15 bg-off-white p-2 sm:flex-row sm:items-center"
                >
                  <input
                    type="text"
                    value={row.metric}
                    onChange={(event) =>
                      setValues((prev) => ({
                        ...prev,
                        results: updateResultRow(prev.results, index, "metric", event.target.value),
                      }))
                    }
                    placeholder="Metrik adı"
                    className={`${fieldClass} flex-1`}
                  />
                  <input
                    type="text"
                    value={row.before}
                    onChange={(event) =>
                      setValues((prev) => ({
                        ...prev,
                        results: updateResultRow(prev.results, index, "before", event.target.value),
                      }))
                    }
                    placeholder="Önce"
                    className={`${fieldClass} sm:w-24`}
                  />
                  <input
                    type="text"
                    value={row.after}
                    onChange={(event) =>
                      setValues((prev) => ({
                        ...prev,
                        results: updateResultRow(prev.results, index, "after", event.target.value),
                      }))
                    }
                    placeholder="Sonra"
                    className={`${fieldClass} sm:w-24`}
                  />
                  <button
                    type="button"
                    onClick={() => removeResult(index)}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-amber transition hover:text-deep-navy disabled:opacity-40"
                    disabled={values.results.length <= 1}
                    aria-label="Metrik satırını sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addResult}
                className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-sc-copper transition hover:text-deep-navy"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Metrik Ekle
              </button>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className={sectionTitleClass}>
              <Users className="h-4 w-4" aria-hidden="true" />
              Müşteri Görüşü (Opsiyonel)
            </h2>
            <div className="space-y-3">
              <textarea
                value={values.testimonialQuote}
                onChange={(event) => update("testimonialQuote", event.target.value)}
                placeholder="Müşteri sözü..."
                rows={2}
                className={`${fieldClass} min-h-[80px] resize-y`}
              />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <input
                  type="text"
                  value={values.testimonialAuthor}
                  onChange={(event) => update("testimonialAuthor", event.target.value)}
                  placeholder="Ad Soyad"
                  className={fieldClass}
                />
                <input
                  type="text"
                  value={values.testimonialTitle}
                  onChange={(event) => update("testimonialTitle", event.target.value)}
                  placeholder="Unvan"
                  className={fieldClass}
                />
                <input
                  type="text"
                  value={values.testimonialCompany}
                  onChange={(event) => update("testimonialCompany", event.target.value)}
                  placeholder="Şirket"
                  className={fieldClass}
                />
              </div>
            </div>
          </section>

          <div className="flex flex-wrap justify-end gap-4 border-t border-slate/20 pt-6">
            <Link
              href="/admin/case-studies"
              className="inline-flex min-h-[44px] items-center px-6 text-sm text-text-secondary transition hover:text-deep-navy"
            >
              Vazgeç
            </Link>
            <button
              type="button"
              onClick={handleSave}
              disabled={submitting || publishing}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate/25 bg-white px-6 text-sm font-semibold text-deep-navy shadow-sm transition hover:bg-off-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              {submitting ? "Kaydediliyor…" : "Kaydet & JSON İndir"}
            </button>
            <button
              type="button"
              onClick={() => void handlePublish()}
              disabled={submitting || publishing}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-emerald-700 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Rocket className="h-4 w-4" aria-hidden="true" />
              {publishing ? "Yayınlanıyor…" : "Yayınla"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
