import { SITE } from "@/config/site";

export function OrganizationJsonLd() {
  const payload = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.siteName,
    url: SITE.url,
    description: SITE.defaultDescription,
    contactPoint: {
      "@type": "ContactPoint",
      email: SITE.contactEmail,
      contactType: "customer service",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

export function WebApplicationJsonLd() {
  const payload = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE.siteName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "0",
      highPrice: "49",
      priceCurrency: "USD",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
