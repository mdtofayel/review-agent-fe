import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "../../components/Layout";
import ProductCard from "../../components/ProductCard";
import { SkeletonCard } from "../../components/Skeletons";
import Pagination from "../../components/Pagination";
import SortBar from "../../components/SortBar";
import FilterSheet from "../../components/FilterSheet";
import { API } from "../../api";

function useQueryParams() { const s = new URLSearchParams(useLocation().search); return Object.fromEntries(s.entries()); }

export default function Search() {
  const nav = useNavigate();
  const q = useQueryParams();
  const [page, setPage] = useState(Number(q.page ?? 1));
  const [sort, setSort] = useState(q.sort ?? "relevance");
  const [minRating, setMinRating] = useState(Number(q.minRating ?? 0));
  const [openFilters, setOpenFilters] = useState(false);

  useEffect(()=> {
    const params = new URLSearchParams({ ...q, page: String(page), sort, minRating: String(minRating) });
    nav({ search: params.toString() }, { replace: true });
  }, [page, sort, minRating]);

  const { data, isLoading } = useQuery({
    queryKey: ["search", q.q, page, sort, minRating, q.category],
    queryFn: () => API.searchProducts({ q: q.q, category: q.category, page, sort: sort as any, size: 12, minRating }),
  });

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Results {q.q ? `for “${q.q}”` : ""}</h1>
        <div className="flex items-center gap-3">
          <button className="sm:hidden px-3 py-2 border rounded" onClick={()=>setOpenFilters(true)}>Filters</button>
          <SortBar sort={sort} setSort={setSort}/>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {isLoading
          ? Array.from({length:6}).map((_,i)=><SkeletonCard key={i}/>)
          : data?.items.map(p => <ProductCard key={p.id} p={p} />)
        }
      </div>

      <Pagination page={data?.page ?? 1} size={data?.size ?? 12} total={data?.total ?? 0} onPage={setPage} />
      <FilterSheet open={openFilters} onClose={()=>setOpenFilters(false)} minRating={minRating} setMinRating={setMinRating}/>
    </Layout>
  );
}
