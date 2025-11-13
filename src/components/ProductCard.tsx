import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";
// ⬇ type-only import
import type { Product } from "../api/types";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link to={`/p/${p.slug}`} className="group rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="aspect-[3/2] overflow-hidden bg-gray-100">
        <img src={p.image} alt={p.title} className="h-full w-full object-cover group-hover:scale-[1.02] transition" loading="lazy"/>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-medium line-clamp-1">{p.title}</h3>
          {p.badges?.length ? <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{p.badges[0]}</span> : null}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{p.highlight}</p>
        <div className="flex items-center justify-between">
          <div><RatingStars value={p.rating}/> <span className="text-xs text-gray-500 ml-1">({p.votes ?? 0})</span></div>
          {p.price != null && <div className="font-semibold">{p.price}{p.currency}</div>}
        </div>
      </div>
    </Link>
  );
}
