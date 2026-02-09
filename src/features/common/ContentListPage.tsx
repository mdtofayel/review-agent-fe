// src/features/list/ContentListPage.tsx
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import ListPageLayout from "./ListPageLayout";
import Layout from "../../components/Layout";
import PageTemplate from "../../components/PageTemplate";
import ArticleSidebar from "../common/ArticleSidebar";
import ProductCard from "../../components/ProductCard";

import { API } from "../../api";
import type {
  BestListSummary,
  PostSummary,
  Page,
  Product,
} from "../../api/types";

export default function ContentListPage() {
  // section comes from "/:section", for example "reviews", "news", "deals"
  const { section = "best" } = useParams<{ section: string }>();

  // for reviews we use an optional category filter from the query string,
  // for example /reviews?category=cameras
  const [sp] = useSearchParams();
  const categorySlug = sp.get("category") || "";

  const isReviews = section === "reviews";

  // ---------------- reviews list query ----------------

  const page = 1;
  const size = 12;

  const {
    data: productPage,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useQuery<Page<Product>>({
    queryKey: ["reviews-list", { categorySlug, page, size }],
    queryFn: () =>
      API.searchProducts({
        page,
        size,
        category: categorySlug || undefined,
      }),
    enabled: isReviews,
  });

  // ---------------- existing list data (best lists, posts) ----------------
  // These are still used for /best, /deals, /news, etc.

  const {
    data: bestLists,
    isLoading: isLoadingBest,
    isError: isErrorBest,
    error: bestError,
  } = useQuery<BestListSummary[]>({
    queryKey: ["content-list", section],
    queryFn: () => API.getBestLists(),
    enabled: !isReviews, // no need when we are on the reviews section
  });

  const {
    data: topPosts,
    isLoading: isLoadingTop,
    isError: isErrorTop,
  } = useQuery<PostSummary[]>({
    queryKey: ["top-posts"],
    queryFn: () => API.getTopPosts(),
    enabled: !isReviews,
  });

  const {
    data: latestReviews,
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
  } = useQuery<PostSummary[]>({
    queryKey: ["latest-reviews"],
    queryFn: () => API.getLatestReviews(),
    enabled: !isReviews,
  });

  // ------------------------------------------------------------------
  //  A) SPECIAL CASE: /reviews  → single product review list
  // ------------------------------------------------------------------

  if (isReviews) {
    const title = categorySlug
      ? `${capitalize(categorySlug)} reviews`
      : "All reviews";

    const description = categorySlug
      ? `All single product reviews in the ${categorySlug} category.`
      : "Browse all of our latest single product reviews across phones, laptops, cameras and more.";

    return (
      <Layout>
        <PageTemplate sidebar={<ArticleSidebar />}>
          {/* header */}
          <header className="mb-6">
            <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          </header>

          {/* loading skeleton */}
          {isLoadingProducts && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 rounded-2xl bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* error state */}
          {isErrorProducts && !isLoadingProducts && (
            <p className="text-sm text-red-600">
              Reviews could not be loaded. Please try again later.
            </p>
          )}

          {/* empty state */}
          {productPage &&
            productPage.items.length === 0 &&
            !isLoadingProducts &&
            !isErrorProducts && (
              <p className="text-sm text-gray-700">
                No reviews found for this category yet.
              </p>
            )}

          {/* product grid */}
          {productPage && productPage.items.length > 0 && (
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {productPage.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </section>
          )}
        </PageTemplate>
      </Layout>
    );
  }

  // ------------------------------------------------------------------
  //  B) DEFAULT: /best, /deals, /news, /versus, /how-to …
  //      Keep your existing ListPageLayout behaviour
  // ------------------------------------------------------------------

  const pretty =
    section === "deals"
      ? "Deals"
      : section === "news"
      ? "Tech news"
      : section === "versus"
      ? "Versus"
      : section === "how-to"
      ? "How-to guides"
      : "Best lists";

  const description =
    section === "deals"
      ? "All our current deals and offers in one place."
      : section === "news"
      ? "Latest news and updates from the tech world."

      : "Our editor-tested best lists and roundups.";

  return (
    <ListPageLayout
    
      breadcrumbLabel={pretty}
      title={pretty}
      description={description}
      bestLists={bestLists ?? []}
      topPosts={topPosts ?? []}
      latestReviews={latestReviews ?? []}
      isLoadingBest={isLoadingBest}
      isErrorBest={isErrorBest}
      bestError={bestError}
      isLoadingTop={isLoadingTop}
      isLoadingReviews={isLoadingReviews}
      isErrorTop={isErrorTop}
      isErrorReviews={isErrorReviews}
    />
  );
}

// simple helper
function capitalize(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}
  