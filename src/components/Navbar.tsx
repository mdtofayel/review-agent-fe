// src/components/Navbar.tsx
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { API } from "../api";
import type { NavCategory } from "../api/types";

const MAX_VISIBLE_ROOTS = 5;

export default function Navbar() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const [q, setQ] = useState(sp.get("q") || "");

  useEffect(() => {
    setQ(sp.get("q") || "");
  }, [sp]);

  const { data: navItems } = useQuery<NavCategory[]>({
    queryKey: ["nav"],
    queryFn: () => API.getNav(),
    staleTime: 5 * 60 * 1000,
  });

  const [openRootId, setOpenRootId] = useState<number | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  const { visibleRoots, overflowRoots } = useMemo(() => {
    if (!navItems || navItems.length === 0) {
      return {
        visibleRoots: [] as NavCategory[],
        overflowRoots: [] as NavCategory[],
      };
    }
    return {
      visibleRoots: navItems.slice(0, MAX_VISIBLE_ROOTS),
      overflowRoots: navItems.slice(MAX_VISIBLE_ROOTS),
    };
  }, [navItems]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (trimmed.length === 0) return;
    nav(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function toggleRoot(id: number) {
    setOpenRootId(prev => (prev === id ? null : id));
    setMoreOpen(false);
  }

  function closeAllMenus() {
    setOpenRootId(null);
    setMoreOpen(false);
  }

  function toggleMore() {
    setMoreOpen(prev => !prev);
    setOpenRootId(null);
  }

  // helper to decide which base path a root uses
  function getSectionPath(root: NavCategory): string {
    // special handling for our Reviews menu
    if (root.name.toLowerCase() === "reviews") {
      return "/reviews";
    }

    // otherwise prefer explicit path from backend, then slug
    if (root.path && root.path.trim().length > 0) {
      return root.path.startsWith("/") ? root.path : `/${root.path}`;
    }
    return `/${root.slug}`;
  }

  function renderRootItem(root: NavCategory) {
    const hasChildren =
      Array.isArray(root.children) && root.children.length > 0;

    const sectionPath = getSectionPath(root); // base path for this root

    if (!hasChildren) {
      return (
        <Link
          key={root.id}
          to={sectionPath}
          className="px-3 py-2 rounded-lg text-sm hover:bg-white/10"
        >
          {root.name}
        </Link>
      );
    }

    const isOpen = openRootId === root.id;

    return (
      <div key={root.id} className="relative">
        <button
          type="button"
          className="px-3 py-2 rounded-lg text-sm hover:bg-white/10 flex items-center gap-1"
          onClick={() => toggleRoot(root.id)}
        >
          <span>{root.name}</span>
          <span className="text-xs opacity-80">▾</span>
        </button>

        {isOpen && (
          <div
            className="absolute left-0 mt-2 min-w-[240px] rounded-xl bg-white text-slate-900
                       shadow-lg border border-slate-200 max-h-80 overflow-y-auto"
          >
            <div className="py-2">
              {(root.children ?? []).map(child => {
                const childTarget =
                  child.path ||
                  `${sectionPath}?category=${encodeURIComponent(child.slug)}`;

                return (
                  <Link
                    key={child.id}
                    to={childTarget}
                    className="block px-4 py-2 text-sm hover:bg-indigo-50"
                    onClick={closeAllMenus}
                  >
                    {child.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

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
            onChange={e => setQ(e.target.value)}
            placeholder="Search products, for example iPhone case"
            className="w-full rounded-lg bg-white/95 text-slate-900 placeholder-slate-500
                       border border-white/20 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
        </form>

        <nav className="hidden sm:flex items-center gap-4 text-sm relative">
          {/* navigation roots from admin */}
          {visibleRoots.map(root => renderRootItem(root))}

          {/* overflow menu */}
          {overflowRoots.length > 0 && (
            <div className="relative">
              <button
                type="button"
                className="px-3 py-2 rounded-lg text-sm hover:bg-white/10 flex items-center gap-1"
                onClick={toggleMore}
              >
                <span>More</span>
                <span className="text-xs opacity-80">▾</span>
              </button>

              {moreOpen && (
                <div
                  className="absolute right-0 mt-2 min-w-[220px] rounded-xl bg-white text-slate-900
                             shadow-lg border border-slate-200 max-h-80 overflow-y-auto"
                >
                  <div className="py-2">
                    {overflowRoots.map(root => {
                      const path = getSectionPath(root);
                      return (
                        <Link
                          key={root.id}
                          to={path}
                          className="block px-4 py-2 text-sm hover:bg-indigo-50"
                          onClick={closeAllMenus}
                        >
                          {root.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

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
