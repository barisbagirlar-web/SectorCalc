import { TOOL_REFERENCE_CREATOR } from "@/config/tool-reference-creator";

/** E-E-A-T head links for calculator reference creator (ORCID rel=me when verified). */
export function AuthorAuthorityHeadLinks() {
  if (!TOOL_REFERENCE_CREATOR.orcidUrl) {
    return null;
  }

  return <link rel="me" href={TOOL_REFERENCE_CREATOR.orcidUrl} />;
}
