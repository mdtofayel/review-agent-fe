// src/features/roundup/RoundupPage.tsx
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { API } from "../../api";
import type { RoundupArticle } from "../../api/types";
import Layout from "../../components/Layout";

// helper so we never call new Date on undefined
function formatDate(value?: string): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString();
}

export default function RoundupPage() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: article,
    isLoading,
    isError,
    error,
  } = useQuery<RoundupArticle, Error>({
    queryKey: ["roundup", slug],
    enabled: Boolean(slug),
    queryFn: () => API.getRoundupArticle(slug as string),
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="py-8 text-sm text-slate-600">Loading roundup…</div>
      </Layout>
    );
  }

  if (isError || !article) {
    return (
      <Layout>
        <div className="py-8">
          <p className="text-sm text-rose-600 mb-2">
            Could not load this best list article.
          </p>
          {error && (
            <p className="text-xs text-slate-500 whitespace-pre-wrap">
              {error.message}
            </p>
          )}
        </div>
      </Layout>
    );
  }

  const categorySlug = article.category ?? "smartphones";
  const categoryLabel = categorySlug.toUpperCase();

  const sortedProducts = [...article.products].sort(
    (a, b) => a.rank - b.rank
  );

  const topThree = sortedProducts.slice(0, 3);

  const tocItems = [
    ...sortedProducts.map((p) => ({
      id: `product-${p.rank}`,
      label: `${p.rank}. ${p.title}`,
    })),
    { id: "buying-guide", label: "How to choose" },
    { id: "testing-methodology", label: "How we test" },
    { id: "faq", label: "Frequently asked questions" },
    { id: "conclusion", label: "Conclusion" },
  ];

  const updatedLabel = formatDate(article.updated_at) || "recently";

  return (
    <Layout>
      {/* breadcrumbs */}
      <nav className="text-sm text-slate-600 mb-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">»</span>
        <Link
          to={`/best?category=${encodeURIComponent(categorySlug)}`}
          className="hover:underline"
        >
          Best lists
        </Link>
        <span className="mx-2">»</span>
        <span className="font-medium">{article.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* main column */}
        <article className="lg:col-span-2">
          {/* hero and header */}
          <header className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
            <p className="text-sm text-slate-500">
              Last updated {updatedLabel}
            </p>
          </header>

          {/* table of contents */}
          <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold mb-2">
              In this best list
            </h2>
            <ul className="space-y-1 text-sm text-indigo-700">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="hover:underline"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* intro markdown */}
          {article.intro_md && (
            <section className="mb-8 prose max-w-none prose-sm sm:prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.intro_md}
              </ReactMarkdown>
            </section>
          )}

          {/* product blocks */}
          {sortedProducts.map((p) => (
            <section
              key={p.id}
              id={`product-${p.rank}`}
              className="mb-10 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {p.image && (
                  <div className="relative">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-600 text-white">
                      {categoryLabel}
                    </div>
                  </div>
                )}

                <div className="p-5 flex flex-col gap-3">
                  <div className="text-xs text-slate-500 mb-1">
                    Rank {p.rank}
                  </div>
                  <h2 className="text-lg font-semibold">
                    {p.rank}. {p.title}
                  </h2>
                  {p.brand && (
                    <p className="text-xs text-slate-500">
                      Brand {p.brand}
                    </p>
                  )}

                  {/* verdict box */}
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {typeof p.rating === "number" && (
                          <span className="font-semibold">
                            {p.rating.toFixed(1)} out of five
                          </span>
                        )}
                        {p.votes != null && (
                          <span className="text-xs text-slate-500">
                            based on {p.votes} votes
                          </span>
                        )}
                      </div>
                      {p.price != null && p.currency && (
                        <span className="font-semibold">
                          {p.price.toFixed(2)} {p.currency}
                        </span>
                      )}
                    </div>
                    {p.blurb && (
                      <p className="text-slate-700 mb-2">{p.blurb}</p>
                    )}
                    {p.verdict && (
                      <p className="text-xs text-slate-600">
                        Verdict {p.verdict}
                      </p>
                    )}
                  </div>

                  {/* affiliate style buttons */}
                  <div className="flex flex-wrap gap-3 mt-2">
                    <a
                      href="#"
                      className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                      Check price
                    </a>
                    <Link
                      to={`/p/${p.slug}`}
                      className="inline-flex items-center justify-center rounded-full border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                    >
                      Read full review
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          ))}

          {/* buying guide */}
          <section id="buying-guide" className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">
              How to choose in this category
            </h2>
            {article.buying_guide_md ? (
              <div className="prose max-w-none prose-sm sm:prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {article.buying_guide_md}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-slate-700">
                This section explains what buyers should look for, for
                example performance, display, battery life and camera
                quality.
              </p>
            )}
          </section>

          {/* testing methodology */}
          <section id="testing-methodology" className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">
              How we test products
            </h2>
            <p className="text-sm text-slate-700 mb-2">
              For this best list every product goes through the same
              repeatable test procedure. We measure real world
              performance, battery usage, display quality and build
              quality. We also live with each product for a period of
              time to understand reliability and software behaviour.
            </p>
            <p className="text-sm text-slate-700">
              Scores are compared with previous reviews so that the
              ranking stays consistent when new products arrive.
            </p>
          </section>

          {/* faq */}
          <section id="faq" className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">
              Frequently asked questions
            </h2>
            {article.faqs && article.faqs.length > 0 ? (
              <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                {article.faqs.map((f, idx) => (
                  <details key={idx} className="p-4 group">
                    <summary className="cursor-pointer text-sm font-medium flex items-center justify-between">
                      <span>{f.question}</span>
                      <span className="text-xs text-slate-400 group-open:hidden">
                        plus
                      </span>
                      <span className="text-xs text-slate-400 hidden group-open:inline">
                        minus
                      </span>
                    </summary>
                    <div className="mt-2 text-sm text-slate-700">
                      {f.answer}
                    </div>
                  </details>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-700">
                Common questions and answers will appear here.
              </p>
            )}
          </section>

          {/* conclusion */}
          <section id="conclusion" className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">
              Conclusion
            </h2>
            {article.conclusion_md ? (
              <div className="prose max-w-none prose-sm sm:prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {article.conclusion_md}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-slate-700">
                This section summarises the key picks and who each
                model is for, so that readers can choose quickly.
              </p>
            )}
          </section>

          {/* affiliate disclaimer */}
          <p className="text-xs text-slate-500">
            ReviewHub may earn a small commission when you buy through
            links on our pages. This never affects which products we
            recommend.
          </p>
        </article>

        {/* sidebar on desktop */}
        <aside className="lg:col-span-1 space-y-6">
          {/* quick buy */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sticky top-24">
            <h2 className="text-sm font-semibold mb-3">
              Quick buy picks
            </h2>
            <ul className="space-y-3 text-sm">
              {topThree.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-3 border-b last:border-b-0 pb-3 last:pb-0"
                >
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-14 h-14 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 text-xs line-clamp-2">
                      {p.title}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      {p.price != null && p.currency && (
                        <span className="text-xs font-semibold">
                          {p.price.toFixed(2)} {p.currency}
                        </span>
                      )}
                      <a
                        href="#"
                        className="text-xs font-semibold text-emerald-700 hover:underline"
                      >
                        Check price
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* newsletter */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold mb-2">
              Stay in touch
            </h2>
            <p className="text-xs text-slate-600 mb-3">
              Get more buying guides and product reviews in your inbox.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full rounded border border-slate-300 px-3 py-2 text-xs"
              />
              <button
                type="submit"
                className="w-full rounded bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700"
              >
                Sign up
              </button>
            </form>
          </section>

          {/* related articles placeholder */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold mb-2">
              Related guides
            </h2>
            <ul className="space-y-1 text-xs text-indigo-700">
              <li>
                <Link to="/best?category=budget" className="hover:underline">
                  Best budget phones
                </Link>
              </li>
              <li>
                <Link to="/best?category=flagship" className="hover:underline">
                  Best flagship phones
                </Link>
              </li>
              <li>
                <Link to="/best?category=android" className="hover:underline">
                  Best Android phones
                </Link>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </Layout>
  );
}
