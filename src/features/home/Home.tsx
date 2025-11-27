// src/features/home/Home.tsx
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import PageTemplate from "../../components/PageTemplate";
import HeroImage from "../../components/HeroImage";
import ProductCard from "../../components/ProductCard";
import { SkeletonCard } from "../../components/Skeletons";
import { API } from "../../api";
import type { Product, DealArticle } from "../../api/types";
import LatestReviews from "./LatestReviews";
import OpinionSection  from "./OpinionSection";
import BestListSection from "./BestListSection";
import ExplainersSection from "./ExplainersSection";
import DealsSection from "./DealsSection";
import TechNewsSection from "./TechNewsSection";

import VersusHowToSection from "./VersusHowToSection";






export default function Home() {
  // featured products, used for latest list and fallback hero
  const {
    data: products,
    isLoading: isLoadingProducts,
  } = useQuery<Product[]>({
    queryKey: ["featured"],
    queryFn: () => API.getFeaturedProducts(12),
  });

  // featured deal for hero
  const { data: featuredDeal } = useQuery<DealArticle>({
    queryKey: ["featured-deal"],
    queryFn: () => API.getFeaturedDeal(),
    retry: false, // do not spam when there is simply no deal
  });

  const latest = products ? products.slice(0, 3) : [];

  // decide what to show in the big hero
  let hero;
  // where to start taking products for the two small cards
  let secondaryStartIndex = 0;

  if (featuredDeal) {
    hero = (
      <HeroImage
        imageUrl={featuredDeal.heroImageUrl}
        title={featuredDeal.title}
        label={featuredDeal.label ?? "Deals"}
        to={`/deals/${featuredDeal.slug}`}
      />
    );
    // we can start from the very first product for the small cards
    secondaryStartIndex = 0;
  } else if (!products || isLoadingProducts || products.length === 0) {
    hero = (
      <div className="rounded-2xl bg-gray-200 h-[260px] md:h-[340px] animate-pulse" />
    );
    secondaryStartIndex = 0;
  } else {
    // no deal, so use newest or first product as hero, goes to product page
    const p = products[0];
    hero = (
      <HeroImage
        imageUrl={p.image}
        title={p.title}
        label="Review"
        to={`/p/${p.slug}`}
      />
    );
    // skip the product that is already used as hero
    secondaryStartIndex = 1;
  }

  const secondaryProducts =
    products && products.length > secondaryStartIndex
      ? products.slice(secondaryStartIndex, secondaryStartIndex + 2)
      : [];

  return (
    <Layout>
      {/* blue Black Friday strip */}
      <div className="w-full bg-blue-500 text-white rounded-md mb-6">
        <div className="max-w-6xl mx-auto px-4 py-3 text-center text-sm font-medium">
          <Link
            to="/live/black-friday-2025"
            className="underline decoration-white/70 underline-offset-2"
          >
            Black Friday live blog
          </Link>
        </div>
      </div>

      {/* hero plus sidebar */}
      <PageTemplate
        sidebar={
          <div>
            <h2 className="text-lg font-semibold mb-4">Latest</h2>
            <div className="space-y-4">
              {isLoadingProducts && (
                <>
                  <div className="h-24 rounded-lg bg-gray-200 animate-pulse" />
                  <div className="h-24 rounded-lg bg-gray-200 animate-pulse" />
                  <div className="h-24 rounded-lg bg-gray-200 animate-pulse" />
                </>
              )}

              {!isLoadingProducts &&
                latest.map((p) => (
                  <Link
                    key={p.id}
                    // this is the real product route, not /product
                    to={`/p/${p.slug}`}
                    className="flex gap-3 group"
                  >
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-200">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Review</p>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 line-clamp-2">
                        {p.title}
                      </h3>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          {hero}

          {/* two small cards under the hero, same total width as hero */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoadingProducts || !products ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              secondaryProducts.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))
            )}
          </div>
        </div>
      </PageTemplate>

      

      <LatestReviews />
      <OpinionSection />
      <BestListSection /> 
      <ExplainersSection />
      <DealsSection />
      <ExplainersSection />
      <TechNewsSection />
      <VersusHowToSection />
      
      
    </Layout>
  );
}
