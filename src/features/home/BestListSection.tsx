import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { API } from "../../api";
import type { BestListSummary } from "../../api/types";

export default function BestListSection() {
  const { data, isLoading } = useQuery<BestListSummary[]>({
    queryKey: ["best-lists-home"],
    queryFn: () => API.getBestLists(),
  });

  const lists = data ?? [];

  if (isLoading || lists.length === 0) {
    return null;
  }

  const featured = lists[0];
  const others = lists.slice(1, 7); // up to six items for the grid

  // split others into two columns
  const leftColumn = others.filter((_, idx) => idx % 2 === 0);
  const rightColumn = others.filter((_, idx) => idx % 2 === 1);

  return (
    <section className="max-w-6xl mx-auto px-4 mt-12">
      {/* heading row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">The Best List</h2>
        <Link
          to="/best"
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100"
        >
          See All
          <span aria-hidden="true">›</span>
        </Link>
      </div>

      {/* featured row */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Link
          to={`/roundups/${featured.slug}`}
          className="group block rounded-2xl overflow-hidden border border-gray-200 bg-white"
        >
          <div className="relative h-full">
            <div className="aspect-[16/11]">
              {featured.heroImageUrl ? (
                <img
                  src={featured.heroImageUrl}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>

            {/* badge */}
            {featured.label && (
              <span className="absolute left-4 bottom-4 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white">
                {featured.label}
              </span>
            )}
          </div>
        </Link>

        {/* featured text */}
        <div className="flex flex-col justify-center">
          <Link
            to={`/roundups/${featured.slug}`}
            className="group inline-block"
          >
            <h3 className="text-xl md:text-2xl font-semibold leading-snug group-hover:text-indigo-700">
              {featured.title}
            </h3>
          </Link>
          <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
            <span>{featured.author}</span>
            <span>•</span>
            <span>
              {new Date(featured.publishedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <p className="mt-3 text-sm text-gray-700 line-clamp-3">
            {featured.summary}
          </p>
          <Link
            to={`/roundups/${featured.slug}`}
            className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Read More
          </Link>
        </div>
      </div>

      {/* grid with the other best lists */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {leftColumn.map((item) => (
            <BestListRow key={item.id} item={item} />
          ))}
        </div>
        <div className="space-y-4">
          {rightColumn.map((item) => (
            <BestListRow key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

type RowProps = {
  item: BestListSummary;
};

function BestListRow({ item }: RowProps) {
  return (
    <Link
      to={`/roundups/${item.slug}`}
      className="group flex gap-4 rounded-xl hover:bg-gray-50 p-2 -m-2"
    >
      <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200">
        {item.heroImageUrl ? (
          <img
            src={item.heroImageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>
      <div className="min-w-0">
        <h4 className="text-sm font-semibold leading-snug group-hover:text-indigo-700">
          {item.title}
        </h4>
        <div className="mt-1 text-xs text-gray-500">
          {item.author}
          <span className="mx-1">•</span>
          {new Date(item.publishedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </Link>
  );
}
