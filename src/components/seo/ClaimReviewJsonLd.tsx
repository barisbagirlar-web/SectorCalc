"use client";

import { JsonLd } from "@/components/seo/JsonLd";
import { buildClaimReviewJsonLd } from "@/lib/semantic/build-claim-review-jsonld";

type ClaimReviewJsonLdProps = {
  readonly claimReviewed: string;
  readonly pageUrl: string;
};

export function ClaimReviewJsonLd({ claimReviewed, pageUrl }: ClaimReviewJsonLdProps) {
  return <JsonLd data={buildClaimReviewJsonLd({ claimReviewed, pageUrl })} />;
}
