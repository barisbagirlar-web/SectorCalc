export type AcademicCitation = {
  readonly id: string;
  readonly authors: string;
  readonly year: number;
  readonly title: string;
  readonly publisher: string;
  readonly doiUrl: string;
};

/** Canonical academic references cited across industrial calculator pages. */
export const INDUSTRIAL_ACADEMIC_CITATIONS: readonly AcademicCitation[] = [
  {
    id: "schilders-industrial-mathematics",
    authors: "Schilders, W.",
    year: 2018,
    title: "Industrial Mathematics",
    publisher: "Springer",
    doiUrl: "https://doi.org/10.1007/978-3-319-75538-0",
  },
  {
    id: "ockendon-applied-mathematics",
    authors: "Ockendon, J.",
    year: 2003,
    title: "Applied Mathematics",
    publisher: "SIAM",
    doiUrl: "https://doi.org/10.1137/1.9780898719631",
  },
] as const;
