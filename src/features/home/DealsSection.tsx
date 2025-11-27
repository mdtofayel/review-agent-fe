// src/features/home/DealsSection.tsx
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { API } from "../../api";
import type { DealArticle, PostSummary } from "../../api/types";

export default function DealsSection() {
  // main featured deal for the big card on the left
  const { data: featuredDeal } = useQuery<DealArticle>({
    queryKey: ["featured-deal-home"],
    queryFn: () => API.getFeaturedDeal(),
    retry: false,
  });

  // use latest reviews as smaller deal tiles
  const { data: smallDeals } = useQuery<PostSummary[]>({
    queryKey: ["deal-grid-items"],
    queryFn: () => API.getLatestReviews(),
  });

  if (!featuredDeal) {
    return null;
  }

  // only four items on the right, two by two
  const gridItems = (smallDeals ?? []).slice(0, 4);

  return (
    <section className="max-w-6xl mx-auto px-4 mt-12">
      {/* heading */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Deals</h2>
        <div className="flex-grow border-t border-gray-300" />
      </div>

      {/* main layout: 1 big left, 4 small right */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* big hero, span two columns on desktop */}
        <Link
          to={`/deals/${featuredDeal.slug}`}
          className="group block rounded-2xl overflow-hidden bg-white border border-gray-200 md:col-span-2"
        >
          <div className="w-full overflow-hidden">
            {/* aspect keeps the hero like in the screenshot */}
            <div className="aspect-[16/9]">
              <img
                src={featuredDeal.heroImageUrl}
                alt={featuredDeal.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold group-hover:text-indigo-700">
              {featuredDeal.title}
            </h3>

            {/* author and date */}
            <p className="mt-2 text-xs text-gray-500">
              {featuredDeal.author}{" "}
              {featuredDeal.publishedAt && (
                <>
                  <span className="mx-1">•</span>
                  {new Date(featuredDeal.publishedAt).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </>
              )}
            </p>

            {/* short intro under hero */}
            {featuredDeal.introMd && (
              <p className="mt-3 text-sm text-gray-700 line-clamp-2">
                {featuredDeal.introMd.replace(/[#*_`]/g, "")}
              </p>
            )}
          </div>
        </Link>

        {/* right side: four smaller deals in a 2 x 2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {gridItems.map((item) => (
            <Link
              key={item.id}
              to={item.url}
              className="group block rounded-2xl overflow-hidden bg-white border border-gray-200"
            >
              <div className="w-full overflow-hidden">
                <div className="aspect-[16/9]">
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
              </div>

              <div className="p-3">
                <h4 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-indigo-700">
                  {item.title}
                </h4>
                <p className="mt-2 text-xs text-gray-500">
                  {new Date(item.publishedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
