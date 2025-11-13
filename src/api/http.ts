import axios from "axios";
import type { Page, Product, SearchParams, RoundupArticle, ScrapeJob, JobLog, JobStatus } from "./types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  timeout: 15000,
});

export async function getFeaturedProducts(limit = 12): Promise<Product[]> {
  const { data } = await api.get<Product[]>("/api/products/random", { params: { limit } });
  return data;
}

export async function searchProducts(params: SearchParams): Promise<Page<Product>> {
  const { data } = await api.get<Page<Product>>("/api/products", { params });
  return data;
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const { data } = await api.get<Product>(`/api/products/${slug}`);
  return data;
}

export async function getCategories(): Promise<string[]> {
  const { data } = await api.get<string[]>("/api/categories");
  return data;
}

// ---- Roundup articles ----
export async function getRoundupArticle(slug: string): Promise<RoundupArticle> {
  const { data } = await api.get<RoundupArticle>(`/api/roundups/${slug}`);
  return data;
}
// create job
export async function createScrapeJob(payload: { keyword: string; market?: string; depth?: number }) {
  const { data } = await api.post<ScrapeJob>('/api/scrape-jobs', payload);
  return data;
}

// list jobs
export async function listScrapeJobs(params: { page?: number; size?: number; status?: JobStatus }) {
  const { data } = await api.get<{ items: ScrapeJob[]; page: number; size: number; total: number }>('/api/scrape-jobs', { params });
  return data;
}

// job detail
export async function getScrapeJob(id: string) {
  const { data } = await api.get<ScrapeJob>(`/api/scrape-jobs/${id}`);
  return data;
}

// job logs (polling fallback; backend can also WebSocket)
export async function getJobLogs(id: string, after?: string) {
  const { data } = await api.get<JobLog[]>(`/api/scrape-jobs/${id}/logs`, { params: { after } });
  return data;
}