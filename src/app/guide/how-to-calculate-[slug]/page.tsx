import { notFound } from "next/navigation";
import { getAllTools } from "@/lib/tools/all-tools-data";
import { siteUrl } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildOrganizationJsonLd } from "@/lib/seo/schema-mesh";

export const dynamicParams = true;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const tools = getAllTools("en");
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tool = getAllTools("en").find((t) => t.slug === slug);
  if (!tool) return notFound();

  return {
    title: `How to calculate ${tool.title.toLowerCase()} | Guide`,
    description: `A comprehensive guide on how to calculate ${tool.title.toLowerCase()}, including formulas, methodology, and step-by-step examples.`,
    alternates: {
      canonical: `${siteUrl}/guide/how-to-calculate-${tool.slug}`,
    },
  };
}

export default async function HowToCalculatePage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getAllTools("en").find((t) => t.slug === slug);
  if (!tool) return notFound();

  const titleText = `How to calculate ${tool.title.toLowerCase()}?`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: titleText,
    description: `A comprehensive guide on how to calculate ${tool.title.toLowerCase()}, including formulas, methodology, and step-by-step examples.`,
    author: {
      "@type": "Organization",
      name: "SectorCalc",
    },
    publisher: buildOrganizationJsonLd(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/guide/how-to-calculate-${tool.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd data={articleSchema} />
      <article className="prose prose-industrial max-w-none">
        <h1 className="text-3xl font-bold tracking-tight text-premium-velvet sm:text-4xl">
          {titleText}
        </h1>
        <p className="mt-4 text-lg text-body-charcoal/80">
          Understanding the methodology behind <strong>{tool.title}</strong> is essential for precise industrial and engineering operations. This guide breaks down the core concepts, the standard formula used in practice, and a step-by-step calculation example.
        </p>
        
        <div className="mt-8 rounded-lg border border-border-subtle bg-surface-cream p-6">
          <h2 className="mt-0 text-xl font-semibold text-body-charcoal">Overview</h2>
          <p className="mt-2 text-sm text-body-charcoal/80">
            {tool.longDescription || tool.description}
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-premium-velvet">Standard Formula</h2>
        <p className="mt-4">
          The calculation typically relies on core input parameters such as dimensional specifications, material constants, or financial metrics. Our automated calculator ensures precision by evaluating these inputs simultaneously.
        </p>
        <div className="mt-4 rounded-md bg-premium-velvet/5 p-4 text-center">
          <code className="text-lg font-mono text-premium-velvet">
            Output = f(Inputs...) /* Industry Standard Approach */
          </code>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-premium-velvet">Step-by-Step Calculation</h2>
        <ol className="mt-4 space-y-4 text-body-charcoal">
          <li>
            <strong>1. Identify Required Variables:</strong> Determine the exact measurements, constants, and operational limits required for the calculation.
          </li>
          <li>
            <strong>2. Validate Units:</strong> Ensure all inputs conform to a standard unit system (e.g., Metric or Imperial) to avoid conversion errors.
          </li>
          <li>
            <strong>3. Apply the Formula:</strong> Substitute the variables into the standard industry formula. Pay attention to order of operations and exponential factors.
          </li>
          <li>
            <strong>4. Evaluate Constraints:</strong> Compare the result against safety margins, standard tolerances, or regulatory limits (e.g., ISO, ASME).
          </li>
        </ol>

        <h2 className="mt-10 text-2xl font-bold text-premium-velvet">Use Our Automated Calculator</h2>
        <p className="mt-4">
          Manually calculating these metrics can be error-prone and time-consuming. SectorCalc provides an instant, mathematically rigorous tool to compute this automatically.
        </p>
        <div className="mt-6">
          <a
            href={tool.premiumRequired ? `/tools/premium/${tool.slug}` : `/tools/free/${tool.slug}`}
            className="inline-flex items-center gap-2 rounded-md bg-accent-terracotta px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent-terracotta/90"
          >
            Go to {tool.title} Calculator
          </a>
        </div>
      </article>
    </div>
  );
}
