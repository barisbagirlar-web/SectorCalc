import { ORGANIZATION_TRUST } from "@/config/organization-trust";
import { TOOL_REFERENCE_CREATOR } from "@/config/tool-reference-creator";
import type { GeneratedToolSchema } from "@/lib/generated-tools/types";
import { absoluteImageUrl, absoluteLocalizedUrl, SITE_URL } from "@/lib/semantic/site-url";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";
import { translateCalculatorPhrase } from "@/lib/i18n/calculator-phrase-translate";

/**
 * Standard shipping details for digital products (free delivery).
 * Shipping rate is 0 (digital product), handling up to 1 business day,
 * transit 1–5 business days.
 */
const SHIPPING_DETAILS: JsonLdRecord = {
  "@type": "OfferShippingDetails",
  shippingRate: {
    "@type": "MonetaryAmount",
    value: "0",
    currency: "USD",
  },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: {
      "@type": "QuantitativeValue",
      minValue: 0,
      maxValue: 1,
      unitCode: "DAY",
    },
    transitTime: {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: 5,
      unitCode: "DAY",
    },
  },
} as const;

/**
 * Standard return policy: 14-day finite return window, free return by mail.
 */
const RETURN_POLICY: JsonLdRecord = {
  "@type": "MerchantReturnPolicy",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 14,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/FreeReturn",
} as const;

/** Default product image URL (logo used as product placeholder). */
export const PRODUCT_IMAGE_URL = absoluteImageUrl("/img/brand/sectorcalc-logo.svg");

export function buildGeneratedToolProductJsonLd(input: {
  readonly toolName: string;
  readonly description: string;
  readonly slug: string;
  readonly locale: string;
  readonly schema: GeneratedToolSchema;
}): JsonLdRecord {
  const pageUrl = absoluteLocalizedUrl(input.locale, `/tools/generated/${input.slug}`);
  const isFree = input.schema.premiumRequired !== true;

  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${pageUrl}#product`,
    name: input.toolName,
    description: input.description || input.schema.outputs.primary,
    image: PRODUCT_IMAGE_URL,
    url: pageUrl,
    brand: {
      "@type": "Brand",
      name: ORGANIZATION_TRUST.displayName,
      url: SITE_URL,
    },
    manufacturer: {
      "@type": "Organization",
      name: ORGANIZATION_TRUST.displayName,
      "@id": `${SITE_URL}/#organization`,
      url: SITE_URL,
      location: {
        "@type": "Place",
        name: `${ORGANIZATION_TRUST.address.addressLocality}, Turkey`,
      },
    },
    offers: {
      "@type": "Offer",
      price: isFree ? "0.00" : "19.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: pageUrl,
      shippingDetails: SHIPPING_DETAILS,
      hasMerchantReturnPolicy: RETURN_POLICY,
    },
    review: {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: TOOL_REFERENCE_CREATOR.name,
        url: TOOL_REFERENCE_CREATOR.profileUrl,
        affiliation: TOOL_REFERENCE_CREATOR.affiliation,
      },
      reviewBody:
        translateCalculatorPhrase(
          "Industrial calculation methodology reviewed for formula transparency and sector applicability.",
          input.locale,
        ),
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  }) as JsonLdRecord;
}
