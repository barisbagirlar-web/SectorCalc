/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-nocheck
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import Link  from "next/link";
import { createPageMetadata } from "@/lib/metadata";
import { AUTHORITY_GUIDES } from "@/lib/content/authority-guides";
import { getAuthorityGuideRoutePath } from "@/lib/content/authority-links";

type PageProps = { params: Promise<{ locale: string }> };

const T = {
  en: {
    eyebrow: "RESOURCES",
    title: "Engineering Guides & Reference Manuals",
    subtitle: "Step-by-step methodologies, formula breakdowns, and industrial calculations for operational decisions.",
    viewGuide: "Read Guide →",
    metaTitle: "Engineering Guides & Reference Manuals | SectorCalc",
    metaDescription: "Step-by-step methodologies, formula breakdowns, and industrial calculations for operational decisions.",
  },
  tr: {
    eyebrow: "KAYNAKLAR",
    title: "Mühendislik Kılavuzları ve Referans El Kitapları",
    subtitle: "Operasyonel kararlar için adım adım metodolojiler, formül açıklamaları ve endüstriyel hesaplamalar.",
    viewGuide: "Kılavuzu Oku →",
    metaTitle: "Mühendislik Kılavuzları ve El Kitapları | SectorCalc",
    metaDescription: "Operasyonel kararlar için adım adım metodolojiler, formül açıklamaları ve endüstriyel hesaplamalar.",
  },
  de: {
    eyebrow: "RESSOURCEN",
    title: "Technische Leitfäden & Handbücher",
    subtitle: "Schritt-für-Schritt-Methoden, Formelaufschlüsselungen und industrielle Berechnungen für betriebliche Entscheidungen.",
    viewGuide: "Leitfaden lesen →",
    metaTitle: "Technische Leitfäden & Handbücher | SectorCalc",
    metaDescription: "Schritt-für-Schritt-Methoden, Formelaufschlüsselungen und industrielle Berechnungen für betriebliche Entscheidungen.",
  },
  fr: {
    eyebrow: "RESSOURCES",
    title: "Guides d'ingénierie et manuels de référence",
    subtitle: "Méthodologies étape par étape, ventilations de formules et calculs industriels pour les décisions opérationnelles.",
    viewGuide: "Lire le guide →",
    metaTitle: "Guides d'ingénierie et manuels de référence | SectorCalc",
    metaDescription: "Méthodologies étape par étape, ventilations de formules et calculs industriels pour les décisions opérationnelles.",
  },
  es: {
    eyebrow: "RECURSOS",
    title: "Guías de ingeniería y manuales de referencia",
    subtitle: "Metodologías paso a paso, desglose de fórmulas y cálculos industriales para decisiones operativas.",
    viewGuide: "Leer guía →",
    metaTitle: "Guías de ingeniería y manuales de referencia | SectorCalc",
    metaDescription: "Metodologías paso a paso, desglose de fórmulas y cálculos industriales para decisiones operativas.",
  },
  ar: {
    eyebrow: "الموارد",
    title: "الأدلة الهندسية والكتيبات المرجعية",
    subtitle: "منهجيات خطوة بخطوة، وتحليلات الصيغ، والحسابات الصناعية للقرارات التشغيلية.",
    viewGuide: "اقرأ الدليل ←",
    metaTitle: "الأدلة الهندسية والكتيبات المرجعية | SectorCalc",
    metaDescription: "منهجيات خطوة بخطوة، وتحليلات الصيغ، والحسابات الصناعية للقرارات التشغيلية.",
  }
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = T[locale as keyof typeof T] || T.en;

  return createPageMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: "/guides",
    locale: locale as "en",
  });
}

export default async function GuidesIndexPage({ params }: PageProps) {
  const locale = "en";
  
  const t = T[locale as keyof typeof T] || T.en;

  return (
    <PageLayout>
      {/* Hero Section styled as an Academic Registry Header */}
      <section className="sc-craft-section sc-craft-section--white sc-craft-section--border bg-white border-b border-slate-200 py-12 md:py-16">
        <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
          <div className="border-l-4 border-[#BD5D3A] pl-6 py-2">
            <p className="text-xs font-mono uppercase tracking-widest text-[#BD5D3A] mb-1">{t.eyebrow}</p>
            <h1 className="sc-craft-headline font-serif text-3xl md:text-4xl text-navy font-bold leading-tight">
              {t.title}
            </h1>
            <p className="sc-craft-lead max-w-3xl mt-3 text-sm text-body-charcoal/80 leading-relaxed font-sans">
              {t.subtitle}
            </p>
          </div>
        </Container>
      </section>

      {/* Guides Grid Section */}
      <section className="sc-craft-section sc-craft-section--alt overflow-x-hidden bg-slate-50 py-12 md:py-16">
        <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
          <div className="grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AUTHORITY_GUIDES.map((guide) => {
              const categoryLabel = guide.category.replace("-", " ").toUpperCase();
              return (
                <article
                  key={guide.slug}
                  className="flex flex-col justify-between rounded-sm border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-[#BD5D3A]/40"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-semibold tracking-wider text-[#BD5D3A]">
                        {categoryLabel}
                      </span>
                    </div>
                    <h2 className="mt-3 text-lg font-serif font-bold text-navy leading-snug">
                      {guide.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-body-charcoal/80 font-sans">
                      {guide.seoDescription}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-[10px] text-slate-400 font-mono">ID: {guide.slug}</span>
                    <Link
                      href={getAuthorityGuideRoutePath(guide.slug)}
                      className="text-xs font-semibold text-[#BD5D3A] hover:underline"
                    >
                      {t.viewGuide}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
