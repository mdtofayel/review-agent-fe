// src/components/DealProductsRail.tsx
import type { DealProduct } from "../api/types";

type Props = {
  title: string;
  items: DealProduct[];
};

export default function DealProductsRail({ title, items }: Props) {
  if (!items.length) return null;

  return (
    <section className="mt-8">
      {/* dark title bar */}
      <div className="bg-[#17152A] text-white text-sm font-semibold px-4 py-2 rounded-t-md">
        {title}
      </div>

      {/* horizontal scroll of cards */}
      <div className="overflow-x-auto border border-gray-200 border-t-0 rounded-b-md bg-white">
        <div className="flex gap-4 px-4 py-4 min-w-[320px]">
          {items.map((p) => (
            <a
              key={p.id}
              href={p.targetUrl}
              target="_blank"
              rel="noreferrer"
              className="w-56 flex-shrink-0 border border-gray-200 rounded-md flex flex-col items-center bg-white hover:shadow-sm transition-shadow"
            >
              {/* image */}
              <div className="w-full h-40 flex items-center justify-center border-b bg-white">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="max-h-32 object-contain"
                />
              </div>

              {/* title */}
              <div className="px-3 pt-3 pb-2 text-center text-xs text-gray-800 line-clamp-3">
                {p.title}
              </div>

              {/* merchant + green button row */}
              <div className="w-full px-3 pb-3 flex items-center justify-between text-[11px]">
                <span className="text-gray-500">{p.merchant}</span>
                <span className="bg-[#46B44B] text-white px-2 py-1 rounded-full font-semibold">
                  {p.priceLabel}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
