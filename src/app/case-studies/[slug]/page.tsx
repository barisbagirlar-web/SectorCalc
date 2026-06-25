/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-nocheck
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { CaseStudyDetail } from "@/components/case-studies/CaseStudyDetail";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import {
  getCaseStudyBySlug,
  listCaseStudySlugs,
} from "@/lib/case-studies/case-study-registry";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const slugs = listCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const entry = getCaseStudyBySlug(slug);
  
  if (!entry) {
    return createPageMetadata({ title: "Case Study", path: "/case-studies", locale: "en" });
  }
  
  return createPageMetadata({
    title: entry.seoTitle || entry.title,
    description: entry.seoDescription || entry.problem,
    path: `/case-studies/${entry.slug}`,
    locale: "en",
  });
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const entry = getCaseStudyBySlug(slug);
  if (!entry) {
    notFound();
  }

  // Google FAQ Page JSON-LD schema matching locale question formats
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": locale === "tr" ? `${entry.title} Nedir?` : `What is ${entry.title}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": entry.whatIsIt
        }
      },
      {
        "@type": "Question",
        "name": locale === "tr" ? "Nasıl Hesaplanır?" : "How is it calculated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": entry.howIsItCalculated
        }
      },
      {
        "@type": "Question",
        "name": locale === "tr" ? "Neden Önemlidir / Faydaları Nelerdir?" : "Why does it matter / What are the benefits?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": entry.whyItMatters
        }
      }
    ]
  };

  return (
    <PageLayout>
      {/* Inject FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <section className="sc-craft-section overflow-x-hidden bg-white py-8 md:py-12">
        <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0 max-w-4xl">
          <CaseStudyDetail entry={entry} locale={locale} />
        </Container>
      </section>
    </PageLayout>
  );
}
