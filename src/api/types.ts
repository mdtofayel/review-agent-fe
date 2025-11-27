export type RawProduct = {
  id: number;
  jobId: string;
  url: string;
  title: string;
  priceRaw: string | null;
  ratingRaw: string | null;
  reviewsRaw: string | null;
  availability: string | null;
  descriptionBullets: string | null;
  longDescription: string | null;
  technicalDetailsJson: string | null;
  categoryGuess: string | null;
  imageUrl: string | null;
  createdAt: string;
  processed: boolean;
};


// Shared API types for FE

export type Product = {
  id: string;
  slug: string;
  title: string;
  brand?: string;
  price?: number;
  currency?: string;
  image: string;
  rating: number;
  votes?: number;
  highlight?: string;
  badges?: string[];
  specs?: Record<string, string | number>;
  review?: {
    summary: string;
    pros: string[];
    cons: string[];
    body_md: string;
    author?: string;
    updatedAt?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };

  // new: zero, one or many marketplace offers
  offers?: {
    id?: string;
    merchant: string;          // for example "amazon.de"
    priceText?: string;        // for example "899,00 €"
    label?: string;            // button text, for example "Check price"
    url?: string;              // outbound link to merchant
  }[];

  createdAt: string;
  category?: string;
};


export type Page<T> = { items: T[]; page: number; size: number; total: number };

export type SearchParams = {
  q?: string;
  category?: string;
  sort?: "relevance" | "rating_desc" | "newest" | "price_asc" | "price_desc";
  page?: number;
  size?: number;
  minRating?: number;
  priceMin?: number;
  priceMax?: number;
};

// -------- FAQ type (matches backend Faq record) --------
export type Faq = {
  q: string;
  a_md: string;
};

// -------- Seo type (matches backend Seo record) --------
export type Seo = {
  title?: string;
  description?: string;
};

// -------- Roundup product (matches RoundupArticle.RoundupProduct record) --------
export type RoundupProduct = {
  id: string;
  slug: string;
  rank: number;
  title: string;
  brand?: string;
  price?: number;
  currency?: string;
  image?: string;
  rating?: number;
  votes?: number;
  snippet?: string;
  verdict?: string;
  pros?: string[];
  cons?: string[];
  affiliateLinks?: Record<string, string>; // label -> url
  reviewSlug?: string;                     // slug for full review page
};

// -------- Main Roundup Article (matches backend RoundupArticle record) --------
export type RoundupArticle = {
  slug: string;
  title: string;
  subtitle?: string;
  heroImageUrl?: string;
  author?: string;
  publishedAt: string;      // Instant as ISO
  lastUpdatedAt?: string;   // Instant as ISO

  introMd?: string;
  products: RoundupProduct[];

  buyingGuideMd?: string;
  testingMethodMd?: string;
  faqs?: Faq[];

  conclusionMd?: string;
  seo?: Seo;
  category?: string;
  testData?: TestMetricRow[];
  fullSpecs?: FullSpecRow[];
};
export type FullSpecRow = {
  label: string;
  values: Record<string, string>;
};
export type TestMetricRow = {
  label: string;
  values: Record<string, string | number>;
};

export type JobStatus = 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';

export type ScrapeJob = {
  id: string;
  keyword: string;
  market?: string;
  depth?: number;
  status: JobStatus;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  errorMsg?: string;
};

export type JobLog = {
  ts: string; // ISO
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
};
export type NavCategory = {
  id: number;
  name: string;
  slug: string;
  path?: string | null;
  icon?: string | null;
  visible?: boolean;
  orderIndex?: number | null;
  parentId?: number | null;
  children?: NavCategory[];
};
// src/api/types.ts
export type BestListSummary = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  heroImageUrl: string | null;
  label: string | null; // for example PHONES, GAMING
  author: string;
  publishedAt: string;
};

export type PostSummary = {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string | null;
  publishedAt: string;
};

export type DealProduct = {
  id: string;
  title: string;
  imageUrl: string;
  merchant: string;      // for example "amazon.de"
  priceLabel: string;    // for example "CHECK PRICE"
  targetUrl: string;     // outbound link
};

export interface DealArticle {
  slug: string;
  title: string;
  label?: string;
  heroImageUrl: string;
  author?: string;
  publishedAt?: string;
  introMd?: string;
  bodyMd?: string;

  // already there:
  seo?: Seo;

  // new optional fields for tag and navigation
  tag?: string;
  prevTitle?: string;
  prevSlug?: string;
  nextTitle?: string;
  nextSlug?: string;
}

