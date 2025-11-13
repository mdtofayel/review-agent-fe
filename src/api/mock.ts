// src/api/mock.ts
import type {
  Page,
  Product,
  SearchParams,
  RoundupArticle,
  RoundupProduct,
  ScrapeJob,
  JobLog,
  JobStatus,
} from "./types";
import { MOCK_PRODUCTS } from "../mocks/data";

/* ---------------------------------- utils --------------------------------- */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function cryptoRand(): string {
  // Prefer Web Crypto; fall back to Math.random
  try {
    const a = new Uint32Array(2);
    crypto.getRandomValues(a);
    return [...a].map((n) => n.toString(36)).join("").slice(0, 10);
  } catch {
    return Math.random().toString(36).slice(2, 12);
  }
}

/* -------------------------- product / search mocks ------------------------- */

export async function getFeaturedProducts(limit = 12): Promise<Product[]> {
  await sleep(300);
  return [...MOCK_PRODUCTS]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export async function searchProducts(
  params: SearchParams
): Promise<Page<Product>> {
  await sleep(300);
  const {
    q = "",
    category,
    sort = "relevance",
    page = 1,
    size = 12,
    minRating,
    priceMin,
    priceMax,
  } = params;

  let items = MOCK_PRODUCTS.filter(
    (p) =>
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.brand?.toLowerCase().includes(q.toLowerCase())
  );

  if (category) items = items.filter((p) => p.category === category);
  if (minRating) items = items.filter((p) => p.rating >= minRating);
  if (priceMin != null) items = items.filter((p) => (p.price ?? 0) >= priceMin);
  if (priceMax != null) items = items.filter((p) => (p.price ?? 0) <= priceMax);

  const sorters: Record<string, (a: Product, b: Product) => number> = {
    relevance: (a, b) => (b.votes ?? 0) - (a.votes ?? 0),
    rating_desc: (a, b) => b.rating - a.rating,
    newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
    price_asc: (a, b) => (a.price ?? 0) - (b.price ?? 0),
    price_desc: (a, b) => (b.price ?? 0) - (a.price ?? 0),
  };
  items.sort(sorters[sort]);

  const start = (page - 1) * size;
  const paged = items.slice(start, start + size);
  return { items: paged, page, size, total: items.length };
}

export async function getProductBySlug(slug: string): Promise<Product> {
  await sleep(200);
  const p = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!p) throw new Error("Not Found");
  return p;
}

export async function getCategories(): Promise<string[]> {
  await sleep(100);
  return ["Phones", "Laptops", "Audio", "Wearables"];
}

/* ---------------------------- roundup article mock ---------------------------- */

function selectTop(n: number): RoundupProduct[] {
  const top = [...MOCK_PRODUCTS]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, n)
    .map((p, i) => ({
      ...p,
      rank: i + 1,
      blurb:
        i === 0
          ? "Best overall balance of features and value."
          : i === 1
          ? "Great performance at a mid-range price."
          : "Solid pick for most buyers.",
      verdict: "A dependable choice with strong fundamentals.",
    }));
  return top;
}

export async function getRoundupArticle(
  slug: string
): Promise<RoundupArticle> {
  await sleep(200);
  return {
    slug,
    title: "Best Sample Gadgets (2025)",
    intro_md:
      "Looking for the **best gadgets** right now? We tested dozens and picked the top options for most people. " +
      "Below you’ll find our short list, mini-reviews, and a buying guide.",
    products: selectTop(6),
    buying_guide_md:
      "### How to choose\n- **Budget:** Set a realistic budget.\n- **Priorities:** Battery, display, features.\n- **Warranty:** Prefer 2 years where possible.",
    faqs: [
      {
        q: "How did you test?",
        a_md:
          "We run battery, build, and daily-use tests for at least one week per device.",
      },
      {
        q: "How often is this list updated?",
        a_md: "Monthly or when a standout model launches.",
      },
    ],
    conclusion_md:
      "If you want the safest bet, choose our **Best Overall** pick. Tight budget? The **Best Value** pick delivers most of the experience for less.",
    updatedAt: new Date().toISOString(),
    seo: {
      metaTitle: "Best Sample Gadgets (2025) • ReviewHub",
      metaDescription: "Top picks, mini-reviews, buying guide, and FAQs.",
    },
    category: "Roundups",
  };
}

/* ------------------------------- jobs + logs -------------------------------- */

let JOBS: ScrapeJob[] = [];
let LOGS: Record<string, JobLog[]> = {};

function pushLog(id: string, level: JobLog["level"], message: string) {
  const entry: JobLog = { ts: new Date().toISOString(), level, message };
  (LOGS[id] ||= []).push(entry);
}

export async function createScrapeJob(payload: {
  keyword: string;
  market?: string;
  depth?: number;
}): Promise<ScrapeJob> {
  await sleep(200);
  const id = cryptoRand();
  const job: ScrapeJob = {
    id,
    keyword: payload.keyword,
    market: payload.market,
    depth: payload.depth ?? 20,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };
  JOBS.unshift(job);
  LOGS[id] = [];

  // Simulate async pipeline
  setTimeout(() => {
    job.status = "RUNNING";
    job.startedAt = new Date().toISOString();
    pushLog(id, "INFO", `Scraper started for "${job.keyword}"`);

    setTimeout(() => {
      pushLog(id, "INFO", "Fetched 24 pages (polite crawl)");
      pushLog(id, "INFO", "Found 18 candidates");
      pushLog(id, "INFO", "Normalizing and deduping…");

      setTimeout(() => {
        pushLog(id, "INFO", "SEO agent generated titles/descriptions");
        pushLog(id, "INFO", "Review agent wrote summaries");
        job.status = "SUCCEEDED";
        job.endedAt = new Date().toISOString();
        pushLog(id, "INFO", "Pipeline completed");
      }, 1200);
    }, 1000);
  }, 600);

  return job;
}

export async function listScrapeJobs(params: {
  page?: number;
  size?: number;
  status?: JobStatus;
}): Promise<{ items: ScrapeJob[]; page: number; size: number; total: number }> {
  await sleep(150);
  const page = params.page ?? 1;
  const size = params.size ?? 10;
  let items = [...JOBS];
  if (params.status) items = items.filter((j) => j.status === params.status);
  const start = (page - 1) * size;
  return { items: items.slice(start, start + size), page, size, total: items.length };
}

export async function getScrapeJob(id: string): Promise<ScrapeJob> {
  await sleep(120);
  const job = JOBS.find((j) => j.id === id);
  if (!job) throw new Error("Not Found");
  return job;
}

export async function getJobLogs(id: string, after?: string): Promise<JobLog[]> {
  await sleep(120);
  const arr = LOGS[id] || [];
  if (!after) return arr;
  return arr.filter((l) => l.ts > after);
}
