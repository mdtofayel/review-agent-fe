import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import ProductCard from "../../components/ProductCard";
import { SkeletonCard } from "../../components/Skeletons";
import { API } from "../../api";

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["featured"],
    queryFn: () => API.getFeaturedProducts(12),
  });

  return (
    <Layout>
      <section className="rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 border p-6 mb-6">
        <h1 className="text-2xl font-semibold">Find the best product for you</h1>
        <p className="text-gray-600 mt-1">
          Independent reviews with pros and cons and clear verdicts.
        </p>

        {/* link to roundup */}
        <div className="mt-4">
          <Link
            to="/best/best-budget-laptops-2025"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-700 hover:underline"
          >
            View our best budget laptops guide for this year
          </Link>
        </div>
      </section>

      <h2 className="text-lg font-semibold mb-3">Trending picks</h2>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data?.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </Layout>
  );
}
