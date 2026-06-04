import { SITE } from "@/config/site";

/** @deprecated Prefer SITE.contactEmail / SITE.privacyEmail */
export const CONTACT_EMAILS = {
  hello: SITE.contactEmail,
  privacy: SITE.privacyEmail,
} as const;
