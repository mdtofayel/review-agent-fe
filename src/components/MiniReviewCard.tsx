import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";
import type { RoundupProduct } from "../api/types";

export default function MiniReviewCard({ p }: { p: RoundupProduct }) {
  return (
    <article className="rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="aspect-[3/2] bg-gray-100 overflow-hidden">
        <img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy"/>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold line-clamp-1">{p.rank}. {p.title}</h3>
          {!!p.price && <span className="text-sm font-medium">{p.price}{p.currency}</span>}
        </div>
        <div className="flex items-center gap-2">
          <RatingStars value={p.rating} />
          <span className="text-xs text-gray-500">{p.rating.toFixed(1)}/5</span>
        </div>
        {p.verdict && <p className="text-sm text-gray-700">{p.verdict}</p>}
        <Link to={`/p/${p.slug}`} className="inline-flex text-sm text-blue-600 hover:underline">
          Read full review →
        </Link>
      </div>
    </article>
  );
}
