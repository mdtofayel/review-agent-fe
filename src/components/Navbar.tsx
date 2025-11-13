import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API } from "../api";

export default function Navbar() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const [q, setQ] = useState(sp.get("q") || "");

  // keep search box in sync with url
  useEffect(() => setQ(sp.get("q") || ""), [sp]);

  // load categories from backend
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => API.getCategories(),
    staleTime: 5 * 60 * 1000,
  });

  // dropdown state
  const [openCat, setOpenCat] = useState(false);
  const [catFilter, setCatFilter] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    nav(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  function labelFromCategory(cat: string) {
    if (!cat) return "";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  }

  const filteredCategories =
    categories?.filter((c) =>
      c.toLowerCase().includes(catFilter.toLowerCase())
    ) ?? [];

  return (
    <header className="sticky top-0 z-40 bg-indigo-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="font-bold text-xl tracking-tight">
          <span className="text-white">Review</span>
          <span className="text-yellow-300">Hub</span>
        </Link>

        <form onSubmit={onSubmit} className="flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, e.g., iPhone case"
            className="w-full rounded-lg bg-white/95 text-slate-900 placeholder-slate-500
                       border border-white/20 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
        </form>

        <nav className="hidden sm:flex items-center gap-4 text-sm relative">
          {/* category dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenCat((v) => !v)}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
            >
              Categories
            </button>

            {openCat && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white text-slate-900 shadow-lg border border-slate-200">
                <div className="p-2 border-b border-slate-200">
                  <input
                    value={catFilter}
                    onChange={(e) => setCatFilter(e.target.value)}
                    placeholder="Search category"
                    className="w-full rounded-md border border-slate-200 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="max-h-64 overflow-auto">
                  {filteredCategories.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-slate-500">
                      No category found
                    </div>
                  ) : (
                    filteredCategories.map((cat) => (
                      <Link
                        key={cat}
                        to={`/search?category=${encodeURIComponent(cat)}`}
                        className="block px-3 py-2 text-sm hover:bg-indigo-50"
                        onClick={() => {
                          setOpenCat(false);
                          setCatFilter("");
                        }}
                      >
                        {labelFromCategory(cat)}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {import.meta.env.DEV && (
            <Link
              to="/admin"
              className="font-medium text-blue-100 hover:underline"
            >
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
