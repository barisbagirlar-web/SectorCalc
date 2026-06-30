import { ORGANIZATION_TRUST } from "@/config/organization-trust";
import { SITE_URL } from "@/lib/features/semantic/site-url";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/infrastructure/seo/schema-mesh";

export function buildClaimReviewJsonLd(input: {
  readonly claimReviewed: string;
  readonly pageUrl: string;
}): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "ClaimReview",
    claimReviewed: input.claimReviewed,
    url: input.pageUrl,
    author: {
      "@type": "Organization",
      name: ORGANIZATION_TRUST.displayName,
      url: SITE_URL,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: 5,
      bestRating: 5,
      worstRating: 1,
    },
  }) as JsonLdRecord;
}
