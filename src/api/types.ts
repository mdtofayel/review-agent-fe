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
  rating: number;                 // 0..5
  votes?: number;
  highlight?: string;
  badges?: string[];              // e.g. ["Best Value"]
  specs?: Record<string, string | number>;
  review?: {
    summary: string;
    pros: string[];
    cons: string[];
    body_md: string;
    author?: string;
    updatedAt?: string;           // ISO
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  createdAt: string;              // ISO
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
  question: string;
  answer: string;
};

// -------- Seo type (matches backend Seo record) --------
export type Seo = {
  title?: string;
  description?: string;
};

// -------- Roundup product --------
export type RoundupProduct = {
  id: string;
  slug: string;
  title: string;
  brand?: string;
  price?: number;
  currency?: string;
  image?: string;
  rating?: number;
  votes?: number;
  rank: number;
  blurb?: string;
  verdict?: string;
};

// -------- Main Roundup Article --------
export type RoundupArticle = {
  slug: string;
  title: string;

  intro_md?: string;
  buying_guide_md?: string;
  conclusion_md?: string;

  products: RoundupProduct[];
  faqs?: Faq[];

  updated_at?: string;

  seo?: Seo;
  category?: string;
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

