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

// ---- Roundup article types ----
export type FAQ = { q: string; a_md: string };

export type RoundupProduct = Product & {
  rank: number;                   // 1..N
  blurb?: string;                 // one-line “why we picked it”
  verdict?: string;               // short verdict for mini-review
};

export type RoundupArticle = {
  slug: string;                   // /best/:slug
  title: string;
  intro_md: string;               // 1) Introduction (MD)
  products: RoundupProduct[];     // 2) Top list + 3) Mini-reviews
  buying_guide_md: string;        // 4) Buying guidelines (MD)
  faqs: FAQ[];                    // 5) FAQs
  conclusion_md: string;          // 6) Conclusion (MD)
  updatedAt: string;              // ISO
  seo?: { metaTitle?: string; metaDescription?: string };
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
