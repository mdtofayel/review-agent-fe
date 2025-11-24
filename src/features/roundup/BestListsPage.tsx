// src/features/roundup/BestListsPage.tsx
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { API } from "../../api";
import type { BestListSummary, PostSummary } from "../../api/types";
import Layout from "../../components/Layout";

export function BestListsPage() {
  const [sp] = useSearchParams();
  const activeCategory = sp.get("category") || "";

  const {
    data: bestLists,
    isLoading: isLoadingBest,
    isError: isErrorBest,
    error: bestError,
  } = useQuery<BestListSummary[]>({
    queryKey: ["best-lists", activeCategory],
    queryFn: () => API.getBestLists(),
  });

  const {
    data: topPosts,
    isLoading: isLoadingTop,
    isError: isErrorTop,
  } = useQuery<PostSummary[]>({
    queryKey: ["top-posts"],
    queryFn: () => API.getTopPosts(),
  });

  const {
    data: latestReviews,
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
  } = useQuery<PostSummary[]>({
    queryKey: ["latest-reviews"],
    queryFn: () => API.getLatestReviews(),
  });

  return (
    <Layout>
      {/* breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">»</span>
        <span className="font-medium">Best lists</span>
      </nav>

      {/* header section */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-3">The best list</h1>
        <p className="text-base text-gray-700">
          ReviewHub best lists help you compare products. Each list collects
          editor tested picks and links to full reviews so you can decide with
          more confidence.
        </p>
        <p className="text-sm text-indigo-700 flex flex-wrap gap-x-4 gap-y-2 mt-4">
          <Link
            to="/best?category=tvs"
            className="underline underline-offset-2 hover:text-indigo-900"
          >
            Best TVs
          </Link>
          <Link
            to="/best?category=cameras"
            className="underline underline-offset-2 hover:text-indigo-900"
          >
            Best cameras
          </Link>
          <Link
            to="/best?category=computing"
            className="underline underline-offset-2 hover:text-indigo-900"
          >
            Best computing
          </Link>
          <Link
            to="/best?category=audio"
            className="underline underline-offset-2 hover:text-indigo-900"
          >
            Best audio
          </Link>
          <Link
            to="/best?category=gaming"
            className="underline underline-offset-2 hover:text-indigo-900"
          >
            Best gaming
          </Link>
          <Link
            to="/best?category=home-appliances"
            className="underline underline-offset-2 hover:text-indigo-900"
          >
            Best home appliances
          </Link>
        </p>
      </header>

      {(isLoadingBest || isLoadingTop || isLoadingReviews) && (
        <p className="text-sm text-gray-600">Loading best lists…</p>
      )}

      {isErrorBest && (
        <p className="text-sm text-red-600 mb-4">
          Could not load best lists.{" "}
          {bestError instanceof Error ? bestError.message : null}
        </p>
      )}
      {isErrorTop && (
        <p className="text-sm text-red-600 mb-2">
          Could not load top posts.
        </p>
      )}
      {isErrorReviews && (
        <p className="text-sm text-red-600 mb-2">
          Could not load latest reviews.
        </p>
      )}

      {/* main grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* left column best lists */}
         <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
    {(bestLists ?? []).map((item) => (
      <article
        key={item.id}
        className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col"
      >
        <Link to={`/roundups/${item.slug}`} className="block">
          <div className="relative">
            {item.heroImageUrl && (
              <img
                src={item.heroImageUrl}
                alt={item.title}
                className="w-full h-56 object-cover"
              />
            )}
            {item.label && (
              <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-600 text-white tracking-wide">
                {item.label.toUpperCase()}
              </span>
            )}
          </div>
        </Link>

        <div className="p-5 flex flex-col flex-1">
          <Link to={`/roundups/${item.slug}`}>
            <h2 className="text-lg font-semibold leading-snug mb-1">
              {item.title}
            </h2>
          </Link>
          <p className="text-xs text-gray-500 mb-2">
            {item.author} •{" "}
            {new Date(item.publishedAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-700">{item.summary}</p>
        </div>
      </article>
    ))}
  </div>

        {/* right sidebar */}
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
              <a className="px-3 py-2 rounded-lg border border-gray-200 text-center">
                Facebook
              </a>
              <a className="px-3 py-2 rounded-lg border border-gray-200 text-center">
                Instagram
              </a>
              <a className="px-3 py-2 rounded-lg border border-gray-200 text-center">
                YouTube
              </a>
              <a className="px-3 py-2 rounded-lg border border-gray-200 text-center">
                TikTok
              </a>
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
