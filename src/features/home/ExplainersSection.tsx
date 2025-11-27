import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { API } from "../../api";
import type { BestListSummary } from "../../api/types";

export default function ExplainersSection() {
  const { data, isLoading } = useQuery<BestListSummary[]>({
    queryKey: ["explainers-best-lists"],
    queryFn: () => API.getBestLists(),
  });

  const lists = data ?? [];

  if (isLoading || lists.length === 0) {
    return null;
  }

  // take first six items for the Explainers grid
  const items = lists.slice(0, 6);

  return (
    <section className="max-w-6xl mx-auto px-4 mt-12">
      {/* heading row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Explainers</h2>
        <Link
          to="/best"
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100"
        >
          See All
          <span aria-hidden="true">›</span>
        </Link>
      </div>

      {/* cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/roundups/${item.slug}`}
            className="group block rounded-2xl overflow-hidden bg-black"
          >
            <div className="relative aspect-[4/3]">
              {item.heroImageUrl ? (
                <img
                  src={item.heroImageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-gray-300" />
              )}

              {/* overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-transparent p-4 flex flex-col justify-end">
                {/* label badge */}
                {item.label && (
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white mb-2">
                    {item.label}
                  </span>
                )}

                {/* title */}
                <h3 className="text-base font-semibold text-white leading-snug line-clamp-3 group-hover:text-indigo-300">
                  {item.title}
                </h3>

                {/* author and date */}
                <p className="mt-2 text-xs text-white/80">
                  {item.author}
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
    </section>
  );
}
