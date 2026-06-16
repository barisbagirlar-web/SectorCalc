export type CaseStudyResult = {
  readonly metric: string;
  readonly before: string;
  readonly after: string;
};

export type CaseStudyTestimonial = {
  readonly quote: string;
  readonly author: string;
  readonly title: string;
  readonly company: string;
};

/** Published success-story case study (composite illustrative scenario). */
export type CaseStudy = {
  readonly slug: string;
  readonly title: string;
  readonly subtitle: string;
  readonly industry: string;
  readonly tools: readonly string[];
  readonly challenge: string;
  readonly solution: string;
  readonly results: readonly CaseStudyResult[];
  readonly testimonial?: CaseStudyTestimonial;
  readonly coverImage?: string;
  readonly publishedAt: string;
  readonly readTime: number;
};

export type PublishedCaseStudyBase = Pick<
  CaseStudy,
  "slug" | "tools" | "publishedAt" | "readTime" | "coverImage"
>;

export type PublishedCaseStudyLocaleContent = Omit<
  CaseStudy,
  "slug" | "tools" | "publishedAt" | "readTime" | "coverImage"
>;
