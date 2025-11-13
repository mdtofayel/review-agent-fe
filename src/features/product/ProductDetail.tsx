import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "../../components/Layout";
import RatingStars from "../../components/RatingStars";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SEO from "../../components/SEO";
import { API } from "../../api";
import JSONLD from "../../components/JSONLD";

import type { Product } from "../../api/types";

function SpecList({ specs }: { specs?: Record<string, string | number> }) {
  if (!specs) return null;
  const entries = Object.entries(specs).slice(0, 6); // show a few; expand later
  if (!entries.length) return null;

  return (
    <div className="rounded-xl border bg-white p-4">
      <h3 className="font-medium mb-3">Quick specs</h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {entries.map(([k, v]) => (
          <div key={k} className="flex items-start gap-2">
            <dt className="text-gray-500 w-28 shrink-0">{k}</dt>
            <dd className="font-medium">{String(v)}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-3">
        <button className="text-xs text-blue-600 hover:underline">
          View full specs
        </button>
      </div>
    </div>
  );
}

function ProsCons({ pros, cons }: { pros?: string[]; cons?: string[] }) {
  if (!pros?.length && !cons?.length) return null;
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {pros?.length ? (
        <div className="rounded-xl border bg-emerald-50/50 p-4">
          <h3 className="font-medium text-emerald-800 mb-2">Pros</h3>
          <ul className="list-disc list-inside text-sm text-emerald-800 space-y-1">
            {pros.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>
      ) : null}
      {cons?.length ? (
        <div className="rounded-xl border bg-rose-50/60 p-4">
          <h3 className="font-medium text-rose-800 mb-2">Cons</h3>
          <ul className="list-disc list-inside text-sm text-rose-800 space-y-1">
            {cons.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default function ProductDetail() {
  const { slug = "" } = useParams();

  const { data: p, isLoading, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => API.getProductBySlug(slug),
  });

  const { data: more } = useQuery({
    queryKey: ["more-like-this"],
    queryFn: () => API.getFeaturedProducts(6),
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
      </Layout>
    );
  }
  if (error || !p) {
    return (
      <Layout>
        <p className="p-4 rounded border bg-white">Sorry, we couldn’t find that product.</p>
      </Layout>
    );
  }
  const productLd = (() => {
  const ld: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    image: [p.image],
    description: p.review?.summary || p.seo?.metaDescription || p.title,
    sku: p.id,
    brand: p.brand ? { "@type": "Brand", name: p.brand } : undefined,
    aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.votes ?? 0 },
  };
  if (p.price != null) {
    ld.offers = {
      "@type": "Offer",
      price: p.price,
      priceCurrency: p.currency || "USD",
      availability: "https://schema.org/InStock",
      url: typeof window !== "undefined" ? window.location.href : undefined,
    };
  }
  // remove undefined keys
  Object.keys(ld).forEach(k => ld[k] === undefined && delete ld[k]);
  return ld;
})();

  return (
    <Layout>
      <SEO title={p.seo?.metaTitle || p.title} description={p.seo?.metaDescription} />
        <JSONLD data={productLd} />
      {/* breadcrumbs */}
      <nav className="text-sm text-gray-600 mb-3">
        <Link to="/" className="hover:underline">Home</Link>
        <span className="mx-2">›</span>
        {p.category ? (
          <>
            <Link to={`/search?category=${encodeURIComponent(p.category)}`} className="hover:underline">
              {p.category}
            </Link>
            <span className="mx-2">›</span>
          </>
        ) : null}
        <span className="text-gray-800">{p.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-6">
        {/* image column with shadow */}
        <div className="rounded-2xl bg-white border shadow-xl overflow-hidden">
          <div className="bg-gray-100">
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-auto object-cover"
              loading="eager"
            />
          </div>
        </div>

        {/* meta column */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight">{p.title}</h1>
            {p.badges?.[0] && (
              <span className="self-start text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full border">
                {p.badges[0]}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <RatingStars value={p.rating} showValue />
            <span className="text-sm text-gray-600">
              {p.votes ?? 0} ratings
            </span>
          </div>

          {p.price != null && (
            <div className="text-2xl font-bold">
              {p.price}{p.currency}
            </div>
          )}

          {p.review?.summary && (
            <div className="rounded-xl border bg-white p-4">
              <h3 className="font-medium mb-2">Quick verdict</h3>
              <p className="text-gray-800">{p.review.summary}</p>
            </div>
          )}

          <ProsCons pros={p.review?.pros} cons={p.review?.cons} />
          <SpecList specs={p.specs} />

          <div className="flex gap-3 pt-2">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-lg bg-black text-white px-4 py-2 text-sm hover:bg-gray-800"
            >
              Go to product
            </a>
            <button
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
              onClick={() => navigator.clipboard.writeText(window.location.href)}
            >
              Share
            </button>
          </div>
        </div>
      </div>

      {/* review body */}
      <section className="mt-8 rounded-2xl border bg-white p-6">
        <div className="text-xs text-gray-500 mb-4">
          By {p.review?.author ?? "Editorial Team"} • Updated{" "}
          {new Date(p.review?.updatedAt || p.createdAt).toLocaleDateString()}
        </div>
        <div className="prose max-w-none prose-headings:scroll-mt-24">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {p.review?.body_md || "No detailed review yet."}
          </ReactMarkdown>
        </div>
      </section>

      {/* related / more like this */}
      {more?.length ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-3">More like this</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {more
              .filter((x) => x.slug !== p.slug)
              .slice(0, 3)
              .map((x) => (
                <Link
                  key={x.id}
                  to={`/p/${x.slug}`}
                  className="group rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  <div className="aspect-[3/2] overflow-hidden bg-gray-100">
                    <img
                      src={x.image}
                      alt={x.title}
                      className="h-full w-full object-cover group-hover:scale-[1.02] transition"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="font-medium line-clamp-1">{x.title}</h3>
                    <div className="text-sm text-gray-600">
                      {x.price != null ? `${x.price}${x.currency}` : "Read review"}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      ) : null}
    </Layout>
  );
}


