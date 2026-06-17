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
  readonly id?: string;
  readonly slug: string;
  readonly title: string;
  readonly subtitle: string;
  readonly industry: string;
  readonly country?: string;
  readonly city?: string;
  readonly projectDuration?: string;
  readonly savingsEur?: number;
  readonly tools: readonly string[];
  readonly challenge: string;
  readonly solution: string;
  readonly results: readonly CaseStudyResult[];
  readonly testimonial?: CaseStudyTestimonial;
  readonly coverImage?: string;
  readonly images?: readonly string[];
  readonly publishedAt: string;
  readonly updatedAt?: string;
  readonly readTime: number;
  readonly author?: {
    readonly name: string;
    readonly linkedin: string;
  };
  readonly technicalReview?: {
    readonly reviewer: string;
    readonly mathSciNetId: string;
  };
  readonly seo?: {
    readonly metaTitle?: string;
    readonly metaDescription?: string;
  };
};

export type PublishedCaseStudyBase = Pick<
  CaseStudy,
  | "slug"
  | "tools"
  | "publishedAt"
  | "readTime"
  | "coverImage"
  | "id"
  | "country"
  | "city"
  | "projectDuration"
  | "savingsEur"
>;

export type PublishedCaseStudyLocaleContent = Omit<
  CaseStudy,
  "slug" | "tools" | "publishedAt" | "readTime" | "coverImage"
>;
