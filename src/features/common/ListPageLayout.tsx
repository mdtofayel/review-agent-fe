// src/features/common/ListPageLayout.tsx
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { API } from "../../api";
import type { PostSummary } from "../../api/types";



type ListPageLayoutProps = {
  breadcrumbLabel: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function ListPageLayout({
  breadcrumbLabel,
  title,
  description,
  children,
}: ListPageLayoutProps) {
  const {
    data: topPosts,
    isLoading: loadingTop,
    isError: errorTop,
  } = useQuery<PostSummary[]>({
    queryKey: ["top-posts"],
    queryFn: () => API.getTopPosts(),
  });

  const {
    data: latestReviews,
    isLoading: loadingReviews,
    isError: errorReviews,
  } = useQuery<PostSummary[]>({
    queryKey: ["latest-reviews"],
    queryFn: () => API.getLatestReviews(),
  });

  return (
    <Layout>
      <nav className="text-sm text-gray-600 mb-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">»</span>
        <span className="font-medium">{breadcrumbLabel}</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-3">{title}</h1>
        <p className="text-base text-gray-700">{description}</p>
      </header>

      {(loadingTop || loadingReviews) && (
        <p className="text-sm text-gray-600 mb-4">Loading sidebar content…</p>
      )}
      {errorTop && (
        <p className="text-sm text-red-600 mb-2">Could not load top posts.</p>
      )}
      {errorReviews && (
        <p className="text-sm text-red-600 mb-2">
          Could not load latest reviews.
        </p>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2">{children}</div>

        <aside className="space-y-8">
          {topPosts && topPosts.length > 0 && (
            <section>
              <h3 className="text-base font-semibold mb-3 border-b border-gray-200 pb-2">
                Top posts
              </h3>
              <div className="space-y-4">
                {topPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={post.url}
                    className="flex gap-3 group"
                  >
                    {post.thumbnailUrl && (
                      <img
                        src={post.thumbnailUrl}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium leading-snug group-hover:text-indigo-700">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="text-base font-semibold mb-3 border-b border-gray-200 pb-2">
              Stay in touch
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <button className="px-3 py-2 rounded-lg border border-gray-200 text-center">
                Facebook
              </button>
              <button className="px-3 py-2 rounded-lg border border-gray-200 text-center">
                Instagram
              </button>
              <button className="px-3 py-2 rounded-lg border border-gray-200 text-center">
                YouTube
              </button>
              <button className="px-3 py-2 rounded-lg border border-gray-200 text-center">
                TikTok
              </button>
            </div>
          </section>

          {latestReviews && latestReviews.length > 0 && (
            <section>
              <h3 className="text-base font-semibold mb-3 border-b border-gray-200 pb-2">
                Latest reviews
              </h3>
              <div className="space-y-4">
                {latestReviews.map((post) => (
                  <Link
                    key={post.id}
                    to={post.url}
                    className="flex gap-3 group"
                  >
                    {post.thumbnailUrl && (
                      <img
                        src={post.thumbnailUrl}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium leading-snug group-hover:text-indigo-700">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </aside>
      </section>
    </Layout>
  );
}
