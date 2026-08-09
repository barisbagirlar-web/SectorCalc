export type PageRole =
  | 'home' | 'hub' | 'category' | 'tool' | 'service'
  | 'article' | 'research' | 'comparison' | 'product'
  | 'local' | 'legal';

export type IndexDirective = 'index' | 'noindex';

export type RichResultType =
  | 'Article' | 'BreadcrumbList' | 'Dataset' | 'Event'
  | 'JobPosting' | 'LocalBusiness' | 'Organization' | 'Product'
  | 'ProfilePage' | 'QAPage' | 'Recipe' | 'ReviewSnippet'
  | 'SoftwareApplication' | 'VideoObject' | 'None';

export interface SeoEntityRef {
  readonly id: string;
  readonly name: string;
  readonly type: 'Organization' | 'Person' | 'Product' | 'Service' | 'Concept';
  readonly sameAs: readonly string[];
  readonly wikidataQid?: string;
}

export interface ContentQualityContract {
  readonly userProblem: string;
  readonly decisionEnabled: string;
  readonly uniqueValueTypes: readonly (
    | 'firstPartyData' | 'calculator' | 'expertExperience'
    | 'methodology' | 'caseStudy' | 'comparison' | 'dataset' | 'template'
  )[];
  readonly evidenceRefs: readonly string[];
  readonly limitations: readonly string[];
  readonly lastHumanReviewAt: string;
}

export interface SeoPageRecord {
  readonly route: `/${string}` | '/';
  readonly locale: string;
  readonly role: PageRole;
  readonly indexDirective: IndexDirective;
  readonly canonicalRoute: `/${string}` | '/';
  readonly title: string;
  readonly metaDescription: string;
  readonly h1: string;
  readonly primaryIntent: string;
  readonly primaryEntityId: string;
  readonly secondaryEntityIds: readonly string[];
  readonly authorId?: string;
  readonly reviewerId?: string;
  readonly publishedAt?: string;
  readonly modifiedAt: string;
  readonly richResultTypes: readonly RichResultType[];
  readonly imageUrl?: string;
  readonly conversionEvent: string;
  readonly sourceRefs: readonly string[];
  readonly parentHubRoute?: `/${string}`;
  readonly relatedRoutes: readonly `/${string}`[];
  readonly qualityContract?: ContentQualityContract;
  readonly contentSourcePath?: string;
}
