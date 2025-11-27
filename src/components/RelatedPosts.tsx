// src/components/RelatedPosts.tsx
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { API } from "../api";
import type { PostSummary } from "../api/types";

export default function RelatedPosts() {
  const { data, isLoading } = useQuery<PostSummary[]>({
    queryKey: ["related-posts"],
    queryFn: () => API.getTopPosts(),
  });

  if (isLoading || !data || data.length === 0) {
    return null;
  }

  // first try to use only deal posts
  const dealPosts = data.filter((p) => p.url.startsWith("/deals/"));

  // if there are no deals, fall back to whatever came from the backend
  const items = (dealPosts.length > 0 ? dealPosts : data).slice(0, 3);

  return (
    <section className="mt-10 pt-8 border-t">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">
          Related <span className="text-indigo-600">Posts</span>
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((post) => (
            <Link
              key={post.id}
              to={post.url}
              className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* image */}
              <div className="aspect-[16/9] overflow-hidden bg-gray-200">
                {post.thumbnailUrl && (
                  <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                )}
              </div>

              {/* title and date */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-2 text-xs text-gray-500">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
