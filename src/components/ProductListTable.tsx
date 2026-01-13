import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";
import type { RoundupProduct } from "../api/types";

export default function ProductListTable({ items }: { items: RoundupProduct[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="[&>th]:px-4 [&>th]:py-2 text-left text-gray-600">
            <th>#</th><th>Product</th><th>Rating</th><th>Price</th><th className="hidden sm:table-cell">Why it’s here</th>
          </tr>
        </thead>
        
        <tbody>
          {items.map(p => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 font-semibold">{p.rank}</td>
              <td    className="px-4 py-3">
                <Link to={`/p/${p.slug}`} className="font-medium hover:underline">{p.title}</Link>
              </td>
              <td className="px-4 py-3"><RatingStars value={p.rating} /></td>
              <td className="px-4 py-3">{p.price != null ? `${p.price}${p.currency}` : "—"}</td>
              <td className="px-4 py-3 hidden sm:table-cell text-gray-600">{p.blurb}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
