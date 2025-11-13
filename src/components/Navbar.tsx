import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const [q, setQ] = useState(sp.get("q") || "");
  useEffect(() => setQ(sp.get("q") || ""), [sp]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    nav(`/search?q=${encodeURIComponent(q.trim())}`);
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
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, e.g., iPhone case"
            className="w-full rounded-lg bg-white/95 text-slate-900 placeholder-slate-500
                       border border-white/20 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
        </form>

        <nav className="hidden sm:flex gap-4 text-sm">
        <Link to="/search?category=Phones" className="hover:underline">Phones</Link>
        <Link to="/search?category=Laptops" className="hover:underline">Laptops</Link>
        <Link to="/search?category=Audio" className="hover:underline">Audio</Link>

        {import.meta.env.DEV && (
            <Link to="/admin" className="font-medium text-blue-600 hover:underline">Admin</Link>
        )}
        </nav>

      </div>
    </header>
  );
}
