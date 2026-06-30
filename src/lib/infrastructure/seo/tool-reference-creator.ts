import {
  academicReferences,
  DEFAULT_TOOL_CREATOR_MR_ID,
  getAcademicReferenceByMRId,
} from "@/lib/infrastructure/seo/academic-references";

export type ToolCreatorProfile = {
  readonly name: string;
  readonly url: string;
  readonly affiliation: string;
  readonly mathSciNetUrl: string;
  readonly mrId: number;
  readonly orcidUrl: string | null;
};

export function getToolCreator(_toolName?: string): ToolCreatorProfile {
  const defaultCreator = getAcademicReferenceByMRId(DEFAULT_TOOL_CREATOR_MR_ID);

  return {
    name: defaultCreator?.name ?? "Prof. Dr. Neela Nataraj",
    url: defaultCreator?.profileUrl ?? "https://www.math.iitb.ac.in/~neela/",
    affiliation: defaultCreator?.affiliation ?? "Indian Institute of Technology Bombay",
    mathSciNetUrl:
      defaultCreator?.mathSciNetUrl ??
      "https://mathscinet.ams.org/mathscinet/MRAuthorID/613458",
    mrId: defaultCreator?.mrId ?? DEFAULT_TOOL_CREATOR_MR_ID,
    orcidUrl: null,
  };
}

export function getAllAcademicReferences(): readonly typeof academicReferences[number][] {
  return academicReferences;
}
