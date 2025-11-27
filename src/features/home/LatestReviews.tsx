// src/features/home/LatestReviews.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { API } from "../../api";
import type { PostSummary } from "../../api/types";

export default function LatestReviews() {
  const pageSize = 4;
  const [limit, setLimit] = useState(pageSize);

  const {
    data: posts,
    isLoading,
    isFetching,
  } = useQuery<PostSummary[]>({
    queryKey: ["latest-reviews", limit],
    queryFn: () => API.getLatestReviews(limit),
  });

  const items = posts ?? [];

  // show the button whenever we have at least one full row
  const canLoadMore = items.length >= pageSize;

  const handleLoadMore = () => {
    setLimit((prev) => prev + pageSize);
  };

  return (
    <section className="mt-12 bg-gradient-to-b from-blue-500 to-slate-800 py-12 px-4 rounded-xl">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-white mb-6 border-b border-white/30 pb-1">
          Latest Reviews
        </h2>

        {/* grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div
                key={i}
                className="aspect-video rounded-2xl bg-slate-600 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((post) => (
              <Link
                key={post.id}
                to={post.url}
                className="group block rounded-2xl overflow-hidden bg-slate-900/60"
              >
                <div className="relative aspect-video">
                  {post.thumbnailUrl ? (
                    <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-700" />
                  )}

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/70 to-transparent p-4">
                    <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-indigo-300">
                      {post.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/75">
                      {new Date(post.publishedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* load more button */}
        {canLoadMore && (
          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isFetching}
              className="px-8 py-3 rounded-full bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition flex items-center gap-2 disabled:opacity-60"
            >
              LOAD MORE
              <span className={isFetching ? "animate-spin" : ""}>⟳</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
