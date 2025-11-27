import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { API } from "../../api";
import type { BestListSummary } from "../../api/types";

export default function OpinionSection() {
  const pageSize = 4;
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const { data, isLoading, isFetching } = useQuery<BestListSummary[]>({
    queryKey: ["opinion-best-lists"],
    queryFn: () => API.getBestLists(),
  });

  const items = data ?? [];
  const visibleItems = items.slice(0, visibleCount);
  const canLoadMore = visibleCount < items.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + pageSize);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 mt-12">
      {/* title */}
      <h2 className="text-2xl font-semibold mb-4 border-b border-gray-200 pb-1">
        Opinion
      </h2>

      {/* grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: pageSize }).map((_, i) => (
            <div
              key={i}
              className="aspect-video rounded-2xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleItems.map((item) => (
            <Link
              key={item.id}
              to={`/roundups/${item.slug}`}
              className="group block rounded-2xl overflow-hidden bg-black"
            >
              <div className="relative aspect-video">
                {item.heroImageUrl ? (
                  <img
                    src={item.heroImageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}

                {/* dark overlay with text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex flex-col justify-end">
                  <h3 className="text-base font-semibold text-white leading-snug group-hover:text-indigo-300">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-white/80">
                    {item.author}{" "}
                    <span className="mx-1">•</span>
                    {new Date(item.publishedAt).toLocaleDateString(undefined, {
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

      {/* load more */}
      {canLoadMore && (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isFetching}
            className="px-10 py-3 rounded-full bg-indigo-500 text-white text-sm font-semibold tracking-wide hover:bg-indigo-600 transition flex items-center gap-2 disabled:opacity-60"
          >
            LOAD MORE
            <span className={isFetching ? "animate-spin" : ""}>⟳</span>
          </button>
        </div>
      )}
    </section>
  );
}
