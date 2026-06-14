export type TrustTraceCoverageTrace = {
  readonly slug?: string;
  readonly status: "not_wired" | "needs_review" | "fail" | "pass";
  readonly wired?: boolean;
  readonly detail: string;
  readonly covered?: number;
  readonly total?: number;
};
