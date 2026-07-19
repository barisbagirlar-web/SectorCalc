"use client";

import { JsonLd } from "@/components/seo/JsonLd";
import { buildClaimReviewJsonLd } from "@/lib/features/semantic/build-claim-review-jsonld";

type ClaimReviewJsonLdProps = {
  readonly claimReviewed: string;
  readonly pageUrl: string;
  /** Verified rating only — never hardcode a self-awarded 5/5. */
  readonly ratingValue: number;
};

export function ClaimReviewJsonLd({
  claimReviewed,
  pageUrl,
  ratingValue,
}: ClaimReviewJsonLdProps) {
  return (
    <JsonLd data={buildClaimReviewJsonLd({ claimReviewed, pageUrl, ratingValue })} />
  );
}
