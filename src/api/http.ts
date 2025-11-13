import axios from "axios";
import type {
  Page,
  Product,
  SearchParams,
  RoundupArticle,
  ScrapeJob,
  JobLog,
  JobStatus,
} from "./types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  timeout: 15000,
});

// ------------- products from backend -------------

export async function getFeaturedProducts(limit = 12): Promise<Product[]> {
  const { data } = await api.get<Product[]>("/api/products/random", {
    params: { limit },
  });
  return data;
}

export async function searchProducts(params: SearchParams): Promise<Page<Product>> {
  const {
    page = 1,
    size = 12,
    q,
    category,
    sort = "relevance",
    minRating,
    priceMin,
    priceMax,
  } = params;

  // front end uses page starting at one
  const serverPage = page - 1;

  const { data } = await api.get<Page<Product>>("/api/products", {
    params: {
      q,
      category,
      sort,
      page: serverPage,
      size,
      minRating,
      priceMin,
      priceMax,
    },
  });

  // map server page (zero indexed) back to front end style
  return {
    ...data,
    page: data.page + 1,
  };
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const { data } = await api.get<Product>(`/api/products/${slug}`);
  return data;
}

export async function getCategories(): Promise<string[]> {
  const { data } = await api.get<string[]>("/api/categories");
  return data;
}

// ---------- roundups and jobs stay as you already had ----------

export async function getRoundupArticle(slug: string): Promise<RoundupArticle> {
  const { data } = await api.get<RoundupArticle>(`/api/roundups/${slug}`);
  return data;
}

export async function createScrapeJob(payload: {
  keyword: string;
  market?: string;
  depth?: number;
}) {
  const { data } = await api.post<ScrapeJob>("/api/scrape-jobs", payload);
  return data;
}

export async function listScrapeJobs(params: {
  page?: number;
  size?: number;
  status?: JobStatus;
}) {
  const { page = 0, size = 10, status } = params;
  const { data } =
    await api.get<{ items: ScrapeJob[]; page: number; size: number; total: number }>(
      "/api/scrape-jobs",
      { params: { page, size, status } }
    );
  return data;
}

export async function getScrapeJob(id: string) {
  const { data } = await api.get<ScrapeJob>(`/api/scrape-jobs/${id}`);
  return data;
}

export async function getJobLogs(id: string, after?: string) {
  const { data } = await api.get<JobLog[]>(`/api/scrape-jobs/${id}/logs`, {
    params: { after },
  });
  return data;
}
