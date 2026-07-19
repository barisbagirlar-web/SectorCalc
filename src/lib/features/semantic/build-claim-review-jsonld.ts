import { ORGANIZATION_TRUST } from "@/config/organization-trust";
import { SITE_URL } from "@/lib/features/semantic/site-url";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/infrastructure/seo/schema-mesh";

/**
 * ClaimReview JSON-LD builder.
 *
 * ratingValue is REQUIRED as an explicit caller-supplied input. A hardcoded
 * self-rating (e.g. ratingValue: 5) is forbidden — that would fabricate an
 * AggregateRating-class spam signal. Callers that lack a verified rating must
 * omit ClaimReview entirely rather than invent one.
 */
export function buildClaimReviewJsonLd(input: {
  readonly claimReviewed: string;
  readonly pageUrl: string;
  readonly ratingValue: number;
  readonly bestRating?: number;
  readonly worstRating?: number;
}): JsonLdRecord {
  const bestRating = input.bestRating ?? 5;
  const worstRating = input.worstRating ?? 1;

  if (
    !Number.isFinite(input.ratingValue) ||
    input.ratingValue < worstRating ||
    input.ratingValue > bestRating
  ) {
    throw new Error(
      `buildClaimReviewJsonLd: ratingValue=${String(input.ratingValue)} is outside [${worstRating}, ${bestRating}]`,
    );
  }

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
      ratingValue: input.ratingValue,
      bestRating,
      worstRating,
    },
  }) as JsonLdRecord;
}
