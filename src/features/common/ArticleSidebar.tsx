// src/features/common/ArticleSidebar.tsx
import { useQuery } from "@tanstack/react-query";
import { API } from "../../api";
import type { PostSummary } from "../../api/types";
import SideList from "./SideList";
import SocialButtons from "../../components/SocialButtons";

export default function ArticleSidebar() {
  const { data: topPosts } = useQuery<PostSummary[]>({
    queryKey: ["top-posts"],
    queryFn: () => API.getTopPosts(),
  });

  const { data: latestReviews } = useQuery<PostSummary[]>({
    queryKey: ["latest-reviews"],
    queryFn: () => API.getLatestReviews(),
  });

  return (
    <aside className="space-y-8 text-sm sticky top-24 self-start">
      <SideList title="Top posts" items={topPosts ?? []} />

      <section>
        <div className="text-sm font-semibold mb-2 border-b pb-1">
          Stay in touch
        </div>
       <SocialButtons />
      </section>

      <SideList title="Latest reviews" items={latestReviews ?? []} />
    </aside>
  );
}
