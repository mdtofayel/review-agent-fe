import axios from "axios";
import type {
  Page,
  Product,
  SearchParams,
  RoundupArticle,
  ScrapeJob,
  JobLog,
  JobStatus,
  RawProduct,
  NavCategory,PostSummary,BestListSummary,DealArticle,
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


export async function getRawProductsForJob(id: string): Promise<RawProduct[]> {
  const { data } = await api.get<RawProduct[]>(`/api/scrape-jobs/${id}/raw-products`);
  return data;
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
});
// already used by Navbar
export async function getNav(): Promise<NavCategory[]> {
  const res = await client.get<NavCategory[]>("/api/admin/nav");
  return res.data;
}

export async function createNavCategory(payload: {
  name: string;
  slug: string;
  path?: string | null;
  icon?: string | null;
  parentId?: number | null;
  visible?: boolean;
}): Promise<NavCategory> {
  const res = await client.post<NavCategory>("/api/admin/nav", payload);
  return res.data;
}

export async function updateNavCategory(
  id: number,
  payload: {
    name?: string;
    slug?: string;
    path?: string | null;
    icon?: string | null;
    parentId?: number | null;
    visible?: boolean;
  }
): Promise<NavCategory> {
  const res = await client.put<NavCategory>(`/api/admin/nav/${id}`, payload);
  return res.data;
}

export async function deleteNavCategory(id: number): Promise<void> {
  await client.delete(`/api/admin/nav/${id}`);
}
// http.ts

export async function getBestLists(): Promise<BestListSummary[]> {
  const res = await api.get<BestListSummary[]>("/api/best-lists");
  return res.data;
}

export async function getTopPosts(): Promise<PostSummary[]> {
  const res = await api.get<PostSummary[]>("/api/posts/top");
  return res.data;
}

export async function getLatestReviews(limit = 8): Promise<PostSummary[]> {
  const res = await api.get<PostSummary[]>("/api/reviews/latest", {
    params: { limit },
  });
  return res.data;
}

export async function getFeaturedDeal(): Promise<DealArticle> {
  const res = await api.get<DealArticle>("/api/deals/featured");
  return res.data;
}

export async function getDealBySlug(slug: string): Promise<DealArticle> {
  const res = await api.get<DealArticle>(`/api/deals/${slug}`);
  return res.data;
}
