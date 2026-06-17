"use client";

import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Info,
  MapPin,
  Plus,
  Save,
  Star,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import Link from "@/lib/navigation/next-link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AdminAuthBar } from "@/components/admin/AdminAuthPanel";
import { CaseStudyEditor } from "@/components/admin/CaseStudyEditor";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useAdminAuth } from "@/lib/admin/use-admin-auth";
import {
  getPublishedCaseStudyByAdminId,
  nextPublishedCaseStudyId,
} from "@/lib/case-studies/admin-case-studies";
import {
  caseStudyToFormValues,
  downloadCaseStudyDraftExport,
  emptyCaseStudyFormValues,
  formValuesToDraft,
  getCaseStudyDraftById,
  saveCaseStudyDraft,
  type CaseStudyFormValues,
} from "@/lib/case-studies/case-study-drafts";
import { buildCaseStudyJsonLd, computeCaseStudySeoPreview } from "@/lib/case-studies/case-study-seo";
import type { CaseStudyResult } from "@/lib/case-studies/types";

const fieldClass =
  "w-full min-h-[44px] rounded-lg border border-slate/25 bg-white px-3 text-sm text-deep-navy focus:border-sc-copper focus:outline-none focus:ring-2 focus:ring-sc-copper/20";

const sectionClass = "space-y-4 rounded-xl border border-slate/20 bg-white p-5 shadow-card";
const sectionTitleClass =
  "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary";

const buttonPrimaryClass =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-professional-blue px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50";

const buttonSecondaryClass =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-slate/25 bg-white px-4 text-sm font-semibold text-deep-navy transition-colors hover:border-sc-copper/40 hover:bg-off-white";

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
  const { loading: authLoading, isAdmin } = useAdminAuth();
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
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const seoPreview = useMemo(() => computeCaseStudySeoPreview(values), [values]);
  const schemaPreview = useMemo(() => {
    if (!values.title.trim()) {
      return null;
    }
    return buildCaseStudyJsonLd(formValuesToDraft(values), "en");
  }, [values]);

  const isPublishedEdit =
    mode === "edit" &&
    studyId !== undefined &&
    getPublishedCaseStudyByAdminId(studyId) !== undefined &&
    getCaseStudyDraftById(studyId) === undefined;

  const pageTitle = mode === "create" ? "Yeni Başarı Hikayesi" : "Başarı Hikayesini Düzenle";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
        ? "Taslak tarayıcıda kaydedildi ve JSON dışa aktarıldı. Yayına almak için repo dosyalarını güncelleyip deploy edin."
        : "Taslak tarayıcıda kaydedildi ve JSON dışa aktarıldı. Yayına almak için dosyayı repoya ekleyin.",
    );
    setSubmitting(false);

    if (mode === "create") {
      router.replace(`/admin/case-studies/${encodeURIComponent(draft.id ?? draft.slug)}/edit`);
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
        <form onSubmit={(event) => void handleSubmit(event)} className="mx-auto mt-6 max-w-5xl space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/admin/case-studies"
              className="inline-flex min-h-[44px] items-center gap-2 text-sm text-text-secondary transition hover:text-deep-navy"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Listeye Dön
            </Link>
            <span className="rounded-full bg-off-white px-3 py-1 font-mono text-xs text-text-secondary">
              {values.id}
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-deep-navy">{pageTitle}</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Tüm alanları doldurun. Kaydet ile taslak oluşturulur ve Schema.org JSON-LD içeren paket indirilir.
            </p>
          </div>

          {isPublishedEdit ? (
            <p className="rounded-lg border border-amber/25 bg-amber/5 px-4 py-3 text-sm text-deep-navy">
              Bu hikaye statik dosyalardan yayında. Kaydetme yalnızca tarayıcı taslağı oluşturur ve JSON dışa aktarır —
              public sayfa repo commit ve deploy sonrası güncellenir.
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
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-deep-navy">Yayın Tarihi</span>
                <div className="relative">
                  <Calendar
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
                    aria-hidden="true"
                  />
                  <input
                    type="date"
                    value={values.publishedAt}
                    onChange={(event) => setValues({ ...values, publishedAt: event.target.value })}
                    className={`${fieldClass} pl-10`}
                    required
                  />
                </div>
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-deep-navy">Okuma Süresi (dk)</span>
                <div className="relative">
                  <Clock
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
                    aria-hidden="true"
                  />
                  <input
                    type="number"
                    min={1}
                    value={values.readTime}
                    onChange={(event) => setValues({ ...values, readTime: event.target.value })}
                    className={`${fieldClass} pl-10`}
                  />
                </div>
              </label>
            </div>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-deep-navy">
                Başlık (H1) <span className="text-amber">*</span>
              </span>
              <input
                value={values.title}
                onChange={(event) => setValues({ ...values, title: event.target.value })}
                className={fieldClass}
                placeholder="Örn: CNC Atölyesi OEE'sini %18'den %61'e Çıkardı"
                required
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-deep-navy">Alt Başlık</span>
              <input
                value={values.subtitle}
                onChange={(event) => setValues({ ...values, subtitle: event.target.value })}
                className={fieldClass}
                placeholder="Kısa özet cümlesi…"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-deep-navy">Sektör</span>
              <input
                value={values.industry}
                onChange={(event) => setValues({ ...values, industry: event.target.value })}
                className={fieldClass}
                placeholder="Örn: Otomotiv Yan Sanayi"
              />
            </label>
          </section>

          <section className={sectionClass}>
            <h2 className={sectionTitleClass}>
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Konum ve Süre
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-deep-navy">Ülke</span>
                <input
                  value={values.country}
                  onChange={(event) => setValues({ ...values, country: event.target.value })}
                  className={fieldClass}
                  placeholder="Örn: Almanya"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-deep-navy">Şehir</span>
                <input
                  value={values.city}
                  onChange={(event) => setValues({ ...values, city: event.target.value })}
                  className={fieldClass}
                  placeholder="Örn: Stuttgart"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-deep-navy">Proje Süresi</span>
                <input
                  value={values.projectDuration}
                  onChange={(event) => setValues({ ...values, projectDuration: event.target.value })}
                  className={fieldClass}
                  placeholder="Örn: Ocak 2026 – Mayıs 2026"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-deep-navy">Tasarruf (€)</span>
                <div className="relative">
                  <DollarSign
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
                    aria-hidden="true"
                  />
                  <input
                    value={values.savingsEur}
                    onChange={(event) => setValues({ ...values, savingsEur: event.target.value })}
                    className={`${fieldClass} pl-10`}
                    inputMode="numeric"
                    placeholder="1.232.000"
                  />
                </div>
              </label>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className={sectionTitleClass}>
              <Tag className="h-4 w-4" aria-hidden="true" />
              Kullanılan Araçlar
            </h2>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-deep-navy">Slug&apos;lar (virgülle ayırın)</span>
              <input
                value={values.tools}
                onChange={(event) => setValues({ ...values, tools: event.target.value })}
                className={fieldClass}
                placeholder="oee-downtime-calculator, scrap-rate-optimizer"
              />
              <p className="text-xs text-text-secondary">Araç slug&apos;larını virgülle ayırarak yazın.</p>
            </label>
          </section>

          <section className={sectionClass}>
            <ImageUpload
              label="Kapak Görseli (URL)"
              value={values.coverImage}
              onChange={(coverImage) => setValues({ ...values, coverImage })}
              helpText="Statik dosya yolu girin. Örn: /img/case-studies/kapak.jpg"
            />
          </section>

          <section className={sectionClass}>
            <h2 className={sectionTitleClass}>
              <FileText className="h-4 w-4" aria-hidden="true" />
              Hikaye (Zorluk / Çözüm)
            </h2>
            <div className="space-y-4">
              <div>
                <p className="mb-1.5 text-sm font-medium text-deep-navy">Zorluk (Challenge)</p>
                <CaseStudyEditor
                  content={values.challenge}
                  onChange={(challenge) => setValues({ ...values, challenge })}
                  placeholder="Müşterinin karşılaştığı problemi ve verileri yazın…"
                />
              </div>
              <div>
                <p className="mb-1.5 text-sm font-medium text-deep-navy">Çözüm (Solution)</p>
                <CaseStudyEditor
                  content={values.solution}
                  onChange={(solution) => setValues({ ...values, solution })}
                  placeholder="Hangi modüller kullanıldı, hangi standartlar uygulandı?"
                />
              </div>
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
                  className="flex flex-col gap-3 rounded-lg border border-slate/15 bg-off-white p-3 sm:flex-row sm:items-center"
                >
                  <input
                    value={row.metric}
                    onChange={(event) =>
                      setValues({
                        ...values,
                        results: updateResultRow(values.results, index, "metric", event.target.value),
                      })
                    }
                    className={fieldClass}
                    placeholder="Metrik adı"
                  />
                  <input
                    value={row.before}
                    onChange={(event) =>
                      setValues({
                        ...values,
                        results: updateResultRow(values.results, index, "before", event.target.value),
                      })
                    }
                    className={`${fieldClass} sm:max-w-[8rem]`}
                    placeholder="Önce"
                  />
                  <input
                    value={row.after}
                    onChange={(event) =>
                      setValues({
                        ...values,
                        results: updateResultRow(values.results, index, "after", event.target.value),
                      })
                    }
                    className={`${fieldClass} sm:max-w-[8rem]`}
                    placeholder="Sonra"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (values.results.length <= 1) {
                        return;
                      }
                      setValues({
                        ...values,
                        results: values.results.filter((_, rowIndex) => rowIndex !== index),
                      });
                    }}
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
                onClick={() =>
                  setValues({
                    ...values,
                    results: [...values.results, { metric: "", before: "", after: "" }],
                  })
                }
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
              Müşteri Görüşü
            </h2>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-deep-navy">Söz</span>
              <textarea
                value={values.testimonialQuote}
                onChange={(event) => setValues({ ...values, testimonialQuote: event.target.value })}
                rows={3}
                className={`${fieldClass} min-h-[88px] py-2`}
                placeholder="Müşteri sözü…"
              />
            </label>
            <div className="grid gap-3 md:grid-cols-3">
              <input
                value={values.testimonialAuthor}
                onChange={(event) => setValues({ ...values, testimonialAuthor: event.target.value })}
                className={fieldClass}
                placeholder="Ad Soyad"
              />
              <input
                value={values.testimonialTitle}
                onChange={(event) => setValues({ ...values, testimonialTitle: event.target.value })}
                className={fieldClass}
                placeholder="Unvan"
              />
              <input
                value={values.testimonialCompany}
                onChange={(event) => setValues({ ...values, testimonialCompany: event.target.value })}
                className={fieldClass}
                placeholder="Şirket"
              />
            </div>
          </section>

          <section className="space-y-3 rounded-xl border border-slate/20 bg-off-white p-5">
            <h2 className={sectionTitleClass}>
              <Info className="h-4 w-4" aria-hidden="true" />
              SEO Bilgileri (Otomatik)
            </h2>
            <div className="space-y-1 text-sm text-deep-navy">
              <p>
                <span className="font-medium">Meta Title:</span> {seoPreview.metaTitle || "—"}
              </p>
              <p>
                <span className="font-medium">Meta Description:</span> {seoPreview.metaDescription || "—"}
              </p>
              <p>
                <span className="font-medium">Slug:</span> {seoPreview.slug || "—"}
              </p>
              <p>
                <span className="font-medium">Canonical:</span> {seoPreview.canonicalPath || "—"}
              </p>
            </div>
            <p className="text-xs text-text-secondary">
              Bu alanlar başlık, sektör ve tasarruf bilgisine göre otomatik oluşur.
            </p>
          </section>

          {schemaPreview ? (
            <section className="space-y-3 rounded-xl border border-slate/20 bg-white p-5">
              <h2 className={sectionTitleClass}>
                <Info className="h-4 w-4" aria-hidden="true" />
                Schema.org Önizleme (CaseStudy + Person + Organization)
              </h2>
              <pre className="max-h-64 overflow-auto rounded-lg bg-off-white p-3 text-xs text-deep-navy">
                {JSON.stringify(schemaPreview, null, 2)}
              </pre>
              <p className="text-xs text-text-secondary">
                JSON dışa aktarımında bu yapı dahil edilir. Yayında public sayfaya da JSON-LD olarak eklenir.
              </p>
            </section>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate/20 pt-4">
            <Link href="/admin/case-studies" className={buttonSecondaryClass}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Vazgeç
            </Link>
            <button type="submit" disabled={submitting} className={buttonPrimaryClass}>
              <Save className="h-4 w-4" aria-hidden="true" />
              {submitting ? "Kaydediliyor…" : "Taslağı Kaydet ve JSON Dışa Aktar"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
