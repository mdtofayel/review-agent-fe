// src/features/common/SideList.tsx
import { Link } from "react-router-dom";
import type { PostSummary } from "../../api/types";

type SideListProps = {
  title: string;
  items: PostSummary[];
};

export default function SideList({ title, items }: SideListProps) {
  return (
    <section className="text-sm">
      <div className="text-sm font-semibold mb-3 border-b pb-1">
        {title}
      </div>

      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id}>
            <Link to={item.url} className="group block">
              {item.thumbnailUrl && (
                <div className="w-full h-32 rounded-md overflow-hidden bg-gray-200">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}

              <p className="mt-2 text-xs text-gray-500">
                {new Date(item.publishedAt).toLocaleDateString()}
              </p>
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 line-clamp-2">
                {item.title}
              </h3>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
