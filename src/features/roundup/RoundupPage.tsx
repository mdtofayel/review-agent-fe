import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "../../components/Layout";
import SEO from "../../components/SEO";
import ProductListTable from "../../components/ProductListTable";
import MiniReviewCard from "../../components/MiniReviewCard";
import FAQList from "../../components/FAQ";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { API } from "../../api";
import type { RoundupArticle } from "../../api/types";
import JSONLD from "../../components/JSONLD";


export default function RoundupPage() {
  const { slug = "" } = useParams();
  const { data: art, isLoading, error } = useQuery<RoundupArticle>({
    queryKey: ["roundup", slug],
    queryFn: () => API.getRoundupArticle(slug),
  });

  if (isLoading) return <Layout><div className="h-64 animate-pulse bg-gray-200 rounded-2xl"/></Layout>;
  if (error || !art) return <Layout><p className="p-4 rounded border bg-white">Article not found.</p></Layout>;
  // Base URL for product links in the list
const origin =
  typeof window !== "undefined" ? window.location.origin : "";

// 2) ItemList (Top picks)
const itemListLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: art.title,
  itemListElement: art.products.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${origin}/p/${p.slug}`,
    name: p.title,
  })),
};

// 5) FAQPage (only if you have FAQs)
const faqLd = art.faqs?.length
  ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: art.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a_md },
      })),
    }
  : null;

  return (
    <Layout>
      <SEO title={art.seo?.metaTitle || art.title} description={art.seo?.metaDescription} />
        <JSONLD data={itemListLd} />
    {faqLd && <JSONLD data={faqLd} />}
      <div className="grid md:grid-cols-[220px_minmax(0,1fr)] gap-6">
        <aside className="hidden md:block"><TOC /></aside>

        <article className="space-y-8">
          {/* 1) Introduction */}
          <section id="intro" className="rounded-2xl border bg-white p-6">
            <h1 className="text-2xl font-semibold mb-2">{art.title}</h1>
            <p className="text-xs text-gray-500">Updated {new Date(art.updatedAt).toLocaleDateString()}</p>
            <div className="prose max-w-none mt-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{art.intro_md}</ReactMarkdown>
            </div>
          </section>

          {/* 2) Top list */}
          <section id="toplist" className="space-y-3">
            <h2 className="text-lg font-semibold">Top picks at a glance</h2>
            <ProductListTable items={art.products} />
          </section>

          {/* 3) Mini-reviews */}
          <section id="minireviews" className="space-y-3">
            <h2 className="text-lg font-semibold">Mini-reviews</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {art.products.map((p) => <MiniReviewCard key={p.id} p={p} />)}
            </div>
          </section>

          {/* 4) Buying guidelines */}
          <section id="buying" className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-semibold mb-3">Buying guidelines</h2>
            <div className="prose max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{art.buying_guide_md}</ReactMarkdown>
            </div>
          </section>

          {/* 5) FAQs */}
          <section id="faqs" className="space-y-3">
            <h2 className="text-lg font-semibold">FAQs</h2>
            <FAQList items={art.faqs} />
          </section>

          {/* 6) Conclusion */}
          <section id="conclusion" className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-semibold mb-3">Conclusion</h2>
            <div className="prose max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{art.conclusion_md}</ReactMarkdown>
            </div>
          </section>
        </article>
      </div>
    </Layout>
  );
}

function TOC() {
  const items = [
    { id: "intro", label: "Introduction" },
    { id: "toplist", label: "Top picks" },
    { id: "minireviews", label: "Mini-reviews" },
    { id: "buying", label: "Buying guide" },
    { id: "faqs", label: "FAQs" },
    { id: "conclusion", label: "Conclusion" },
  ];
  return (
    <nav className="rounded-xl border bg-white p-4 text-sm sticky top-24">
      <div className="font-medium mb-2">Jump to</div>
      <ul className="space-y-2">
        {items.map(it => (
          <li key={it.id}><a href={`#${it.id}`} className="text-gray-700 hover:text-blue-600">{it.label}</a></li>
        ))}
      </ul>
    </nav>
  );
}


