// src/features/deals/Deals.tsx
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "../../components/Layout";
import PageTemplate from "../../components/PageTemplate";
import HeroImage from "../../components/HeroImage";
import { API } from "../../api";
import type { DealArticle } from "../../api/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ArticleSidebar from "../common/ArticleSidebar";
import ArticleHeader from "../../components/ArticleHeader";
import TrustJournalism from "../../components/TrustJournalism";
import RelatedPosts from "../../components/RelatedPosts";



export default function DealPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, isError } = useQuery<DealArticle>({
    queryKey: ["deal", slug],
    queryFn: () => API.getDealBySlug(slug!),
    enabled: !!slug,
  });

  if (!data && isLoading) {
    return (
      <Layout>
        <PageTemplate sidebar={<ArticleSidebar />}>
          <div className="space-y-4">
            <div className="h-64 rounded-2xl bg-gray-200 animate-pulse" />
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
        </PageTemplate>
      </Layout>
    );
  }

  if (isError || !data) {
    return (
      <Layout>
        <PageTemplate sidebar={<ArticleSidebar />}>
          <p className="text-red-600">Deal could not be loaded.</p>
        </PageTemplate>
      </Layout>
    );
  }

  const authorName = data.author || "ReviewHub team";
  const published = data.publishedAt
    ? new Date(data.publishedAt).toLocaleDateString()
    : "";

  // simple fallbacks if backend does not give real prev / next
  const prevLabel = data.prevTitle || "Previous article";
  const prevSlug = data.prevSlug || "";
  const nextLabel = data.nextTitle || "Next article";
  const nextSlug = data.nextSlug || "";

  return (
    <Layout>
      <PageTemplate sidebar={<ArticleSidebar />}>
        {/* header section (breadcrumb + title etc) */}
        <ArticleHeader
          categoryLabel={data.label || "Deals"}
          categorySlug="deals"
          title={data.title}
          author={authorName}
          publishedAt={data.publishedAt}
        />



        {/* hero image */}
        <HeroImage
          imageUrl={data.heroImageUrl}
          title={data.title}
          label={data.label ?? "Deals"}
        />

        {/* short meta line under hero */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
          <span>By</span>
          <span className="font-semibold">{authorName}</span>
          {published && (
            <>
              <span>•</span>
              <span>{published}</span>
            </>
          )}
          <span>•</span>
          <span>3 mins read</span>
        </div>

        {/* intro markdown */}
        {data.introMd && (
          <section className="mt-6 prose max-w-none text-[15px] leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {data.introMd}
            </ReactMarkdown>
          </section>
        )}

        {/* body markdown */}
        {data.bodyMd && (
          <section className="mt-6 prose max-w-none text-[15px] leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {data.bodyMd}
            </ReactMarkdown>
          </section>
        )}

        {/* example products slider already added earlier if you want */}

        {/* tag + SHARE row */}
        <section className="mt-10 border-t pt-6 space-y-4">
          {/* tag pill like "blackfriday2025" */}
          <div>
            <button className="inline-flex items-center rounded bg-gray-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">
              {data.tag || "blackfriday2025"}
            </button>
          </div>

          <div>
            <div className="text-xs font-semibold tracking-wide text-gray-600 mb-3">
              SHARE.
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center justify-center w-12 h-10 rounded bg-[#1877F2] text-white text-lg font-semibold">
                F
              </button>
              <button className="flex items-center justify-center w-12 h-10 rounded bg-[#1DA1F2] text-white text-lg font-semibold">
                X
              </button>
              <button className="flex items-center justify-center w-12 h-10 rounded bg-[#E60023] text-white text-lg font-semibold">
                P
              </button>
              <button className="flex items-center justify-center w-12 h-10 rounded bg-[#0A66C2] text-white text-lg font-semibold">
                in
              </button>
              <button className="flex items-center justify-center w-12 h-10 rounded bg-gray-700 text-white text-lg font-semibold">
                t
              </button>
              <button className="flex items-center justify-center w-12 h-10 rounded border text-gray-700">
                @
              </button>
            </div>
          </div>
        </section>

        {/* previous / next article row */}
        <section className="mt-8 border-t pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-sm">
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase text-purple-700 mb-1 flex items-center gap-2">
                <span className="text-base">{"‹"}</span>
                <span>Previous article</span>
              </div>
              <Link
                to={prevSlug ? `/deals/${prevSlug}` : "/best"}
                className="text-gray-900 hover:text-indigo-700"
              >
                {prevLabel}
              </Link>
            </div>

            <div className="flex-1 text-right">
              <div className="text-xs font-semibold uppercase text-purple-700 mb-1 flex items-center gap-2 justify-end">
                <span>Next article</span>
                <span className="text-base">{"›"}</span>
              </div>
              <Link
                to={nextSlug ? `/deals/${nextSlug}` : "/best"}
                className="text-gray-900 hover:text-indigo-700"
              >
                {nextLabel}
              </Link>
            </div>
          </div>
        </section>

        {/* author card */}
        <section className="mt-10 border-t pt-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              {/* simple placeholder avatar */}
              <span className="text-xl font-semibold text-gray-500">
                {authorName.charAt(0)}
              </span>
            </div>
            <div>
              <div className="text-sm font-semibold">{authorName}</div>
              <p className="text-xs text-gray-600 mt-1 max-w-md">
                {authorName} writes about deals and buying advice for
                ReviewHub. This is sample copy for now.
              </p>
            </div>
          </div>
          <TrustJournalism />
           <RelatedPosts />
        </section>
        
      </PageTemplate>
    </Layout>
  );
}
