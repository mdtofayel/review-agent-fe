import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "../../components/Layout";
import SEO from "../../components/SEO";
import JSONLD from "../../components/JSONLD";
import RatingStars from "../../components/RatingStars";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { API } from "../../api";
import type { RoundupArticle, RoundupProduct, PostSummary } from "../../api/types";
import { useMemo, useState } from "react";
import PageTemplate from "../../components/PageTemplate";
import ArticleSidebar from "../common/ArticleSidebar";
import ArticleHeader from "../../components/ArticleHeader";




function JumpToSection({
  sections,
}: {
  sections: { id: string; label: string }[];
}) {
  const [value, setValue] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setValue(next);
    if (!next) return;
    const el = document.getElementById(next);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="text-sm font-semibold mb-1">Jump to section</div>
        <select
          value={value}
          onChange={handleChange}
          className="w-full text-sm text-black px-3 py-2 rounded-sm"
        >
          <option value="">Jump to section</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function ProsCons({ item }: { item: RoundupProduct }) {
  const pros = item.pros ?? [];
  const cons = item.cons ?? [];
  if (!pros.length && !cons.length) return null;

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {pros.length ? (
        <div className="border rounded-md overflow-hidden bg-white">
          <div className="bg-black text-white text-sm font-semibold px-4 py-2">
            Pros
          </div>
          <ul className="px-4 py-3 text-sm space-y-1">
            {pros.map((text, index) => (
              <li key={index} className="flex gap-2">
                <span className="mt-1 text-xs">›</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {cons.length ? (
        <div className="border rounded-md overflow-hidden bg-white">
          <div className="bg-black text-white text-sm font-semibold px-4 py-2">
            Cons
          </div>
          <ul className="px-4 py-3 text-sm space-y-1">
            {cons.map((text, index) => (
              <li key={index} className="flex gap-2">
                <span className="mt-1 text-xs">›</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function ProductHeader({ item }: { item: RoundupProduct }) {
  return (
    <header className="mt-10">
      <div className="bg-purple-800 text-white px-4 py-3 rounded-t-md">
        <div className="text-[11px] font-semibold uppercase tracking-wide">
          {`Number ${item.rank}`}
        </div>
        <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-2xl font-semibold">{item.title}</h2>
          {item.rating != null && (
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide">
                Trusted score
              </span>
              <RatingStars value={item.rating} />
            </div>
          )}
        </div>
      </div>

      <div className="border border-t-0 rounded-b-md bg-white px-4 py-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="w-28 h-28 bg-gray-100 flex items-center justify-center overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="max-h-full max-w-full object-contain"
            />
          ) : null}
        </div>
        <div className="flex-1 text-sm">
          {item.snippet ? (
            <div className="font-medium mb-1">{item.snippet}</div>
          ) : null}
          {item.verdict ? (
            <div className="text-xs text-gray-600">{item.verdict}</div>
          ) : null}
        </div>
        {item.price != null && (
          <div className="flex flex-col items-end gap-2">
            <div className="text-lg font-semibold">
              {item.price}
              {item.currency}
            </div>
            {/* first affiliate link as main offer button */}
            {item.affiliateLinks && Object.keys(item.affiliateLinks).length > 0 && (
              <a
                href={item.affiliateLinks[Object.keys(item.affiliateLinks)[0]]}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
              >
                {Object.keys(item.affiliateLinks)[0]}
              </a>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

function AffiliateStrip({ item }: { item: RoundupProduct }) {
  if (!item.affiliateLinks || !Object.keys(item.affiliateLinks).length) {
    return null;
  }
  const entries = Object.entries(item.affiliateLinks);

  if (entries.length <= 1) return null;

  return (
    <section className="mt-6 border rounded-md bg-white p-4">
      <div className="text-sm font-semibold mb-3">
        Where to buy {item.title}
      </div>
      <div className="flex overflow-x-auto gap-4 pb-2">
        {entries.map(([label, url], index) => (
          <div
            key={index}
            className="min-w-[180px] border rounded-sm bg-white flex flex-col items-center text-center text-xs px-2 py-3"
          >
            <div className="mb-2 font-medium">{label}</div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center justify-center px-3 py-1 rounded-sm bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
            >
              Check price
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
function PriceComparison({ item }: { item: RoundupProduct }) {
  if (!item.affiliateLinks || Object.keys(item.affiliateLinks).length === 0) {
    return null;
  }

  const links = Object.entries(item.affiliateLinks);

  return (
    <div className="mt-4 border rounded-md bg-white shadow-sm">
      <div className="bg-black text-white text-sm font-semibold px-4 py-2">
        {item.title} – Best Prices
      </div>

      <div className="px-4 py-4 space-y-4">
        {links.map(([label, url], index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center justify-between border rounded-md p-4 gap-4"
          >
            {/* left: provider logo or name */}
            <div className="flex items-center gap-3">
              {/* Placeholder provider logo */}
              <div className="w-20 h-10 bg-gray-200 flex items-center justify-center rounded-sm">
                <span className="text-xs text-gray-700">{label}</span>
              </div>
            </div>

            {/* middle text */}
            <div className="text-sm text-gray-700">
              Check price from {label}
            </div>

            {/* right: button */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-md bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
            >
              CHECK PRICE
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductBlock({ item }: { item: RoundupProduct }) {
  return (
    <section id={item.slug} className="pt-4">
      <ProductHeader item={item} />
      <PriceComparison item={item} /> 
      <ProsCons item={item} />

      {/* simple text block for this phone, using snippet and verdict */}
      <div className="mt-6 text-sm leading-relaxed space-y-3">
        {item.snippet && <p>{item.snippet}</p>}
        {item.verdict && <p>{item.verdict}</p>}
      </div>

      <AffiliateStrip item={item} />

      {item.reviewSlug && (
        <div className="mt-4 text-xs text-gray-700">
          Full review:{" "}
          <Link
            to={`/p/${item.reviewSlug}`}
            className="text-blue-600 hover:underline"
          >
            {item.title}
          </Link>
        </div>
      )}
    </section>
  );
}

function FAQSection({ faqs }: { faqs?: RoundupArticle["faqs"] }) {
  if (!faqs || !faqs.length) return null;

  return (
    <section id="faq" className="mt-10">
      {faqs.map((f, index) => (
        <details key={index} className="border rounded-md bg-white mb-3 text-sm">
          <summary className="cursor-pointer px-4 py-3 font-semibold">
            {f.q}
          </summary>
          <div className="px-4 pb-4 pt-1 text-sm leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {f.a_md}
            </ReactMarkdown>
          </div>
        </details>
      ))}
    </section>
  );
}

function SideList({ title, items }: { title: string; items?: PostSummary[] }) {
  if (!items || !items.length) return null;
  return (
    <section>
      <div className="text-sm font-semibold mb-2 border-b pb-1">{title}</div>
      <div className="space-y-3">
        {items.map((post) => (
          <Link
            key={post.id}
            to={post.url}
            className="flex gap-3 items-center text-xs hover:text-blue-700"
          >
            {post.thumbnailUrl && (
              <div className="w-16 h-16 rounded-sm overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={post.thumbnailUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <div className="font-medium leading-snug">{post.title}</div>
              <div className="text-gray-500 text-[11px]">
                {new Date(post.publishedAt).toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SupportStrip() {
  return (
    <div className="border-b bg-gray-50 text-xs text-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <span className="font-semibold">ReviewHub</span>{" "}
        is supported by its audience. If you purchase through links on our site,
        we may earn a commission.{" "}
        <button className="text-blue-600 hover:underline">Learn more</button>.
      </div>
    </div>
  );
}
function BestPhonesSlider({ products }: { products: RoundupProduct[] }) {
  const [index, setIndex] = useState(0);

  if (!products || !products.length) return null;

  const visibleCount = 3;

  function getVisible() {
    const result: RoundupProduct[] = [];
    for (let i = 0; i < Math.min(visibleCount, products.length); i++) {
      const idx = (index + i) % products.length;
      result.push(products[idx]);
    }
    return result;
  }

  function handlePrev() {
    setIndex((prev) =>
      (prev - 1 + products.length) % products.length
    );
  }

  function handleNext() {
    setIndex((prev) =>
      (prev + 1) % products.length
    );
  }

  const visible = getVisible();

  return (
    <section className="mt-10 border-t pt-4">
      {/* top bar with arrows */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-1 flex-1 bg-gradient-to-r from-purple-500 to-red-500 rounded-full" />
        <div className="flex ml-4 border border-gray-300 rounded">
          <button
            type="button"
            onClick={handlePrev}
            className="px-3 py-2 text-xl hover:bg-gray-100"
            aria-label="Previous phones"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="px-3 py-2 text-xl hover:bg-gray-100"
            aria-label="Next phones"
          >
            ›
          </button>
        </div>
      </div>

      {/* cards row */}
      <div className="grid gap-6 md:grid-cols-3">
        {visible.map((item) => {
          const pros = item.pros?.slice(0, 4) ?? [];
          const cons = item.cons?.slice(0, 3) ?? [];

          return (
            <article
              key={item.id}
              className="flex flex-col"
            >
              {/* image with badge */}
              <div className="relative rounded-md overflow-hidden bg-gray-100 mb-3">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-52 object-cover"
                  />
                )}

                {item.verdict && (
                  <div className="absolute left-4 bottom-4 inline-flex bg-purple-700 text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                    {item.verdict}
                  </div>
                )}
              </div>

              {/* title */}
              <h3 className="text-lg font-semibold mb-2">
                <a
                  href={`#${item.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(item.slug);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="hover:underline"
                >
                  {item.title}
                </a>
              </h3>

              {/* pros and cons */}
              <div className="grid gap-3 md:grid-cols-2 text-sm mt-2">
                {pros.length > 0 && (
                  <div>
                    <div className="font-semibold mb-1">Pros</div>
                    <ul className="space-y-1">
                      {pros.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {cons.length > 0 && (
                  <div>
                    <div className="font-semibold mb-1">Cons</div>
                    <ul className="space-y-1">
                      {cons.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function RoundupSlider({ items }: { items: RoundupProduct[] }) {
  const [start, setStart] = useState(0);
  const visible = 3;

  if (!items || items.length === 0) return null;

  const maxStart = Math.max(0, items.length - visible);
  const shown = items.slice(start, start + visible);

  function handlePrev() {
    setStart((prev) => Math.max(0, prev - visible));
  }

  function handleNext() {
    setStart((prev) => Math.min(maxStart, prev + visible));
  }

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">
          Our quick picks
        </h2>
        {items.length > visible && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={start === 0}
              className="w-8 h-8 border rounded-full flex items-center justify-center text-sm disabled:opacity-40"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={start === maxStart}
              className="w-8 h-8 border rounded-full flex items-center justify-center text-sm disabled:opacity-40"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-6 overflow-hidden">
        {shown.map((item) => (
          <div
            key={item.id}
            className="min-w-[260px] max-w-xs bg-white border rounded-md shadow-sm flex flex-col"
          >
            {/* image */}
            {item.image && (
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />
                {item.verdict && (
                  <div className="absolute left-3 bottom-3 bg-purple-700 text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                    {item.verdict}
                  </div>
                )}
              </div>
            )}

            {/* title */}
            <div className="px-4 pt-3">
              <Link
                to={`#${item.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(item.slug);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className="text-sm font-semibold hover:text-blue-600"
              >
                {item.title}
              </Link>
            </div>

            {/* pros and cons short lists */}
            <div className="px-4 pb-4 pt-2 text-xs flex flex-col gap-3">
              {item.pros && item.pros.length > 0 && (
                <div>
                  <div className="font-semibold mb-1">Pros</div>
                  <ul className="space-y-1">
                    {item.pros.slice(0, 3).map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {item.cons && item.cons.length > 0 && (
                <div>
                  <div className="font-semibold mb-1">Cons</div>
                  <ul className="space-y-1">
                    {item.cons.slice(0, 3).map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* main price button */}
            {item.affiliateLinks && Object.keys(item.affiliateLinks).length > 0 && (
              <div className="px-4 pb-4 mt-auto">
                <a
                  href={item.affiliateLinks[Object.keys(item.affiliateLinks)[0]]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center text-xs font-semibold bg-emerald-600 text-white rounded-md py-2 hover:bg-emerald-700"
                >
                  Check price
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
  const phoneColumns = [
    "Xiaomi 14T Pro",
    "OnePlus 13R",
    "Google Pixel 9a",
    "Nothing Phone 3a Pro",
    "Poco F7 Ultra",
    "Honor 400 Pro",
    "Apple iPhone 16e",
  ];
  const fullSpecColumns = [
    "Xiaomi 14T Pro Review",
    "OnePlus 13R Review",
    "Google Pixel 9a Review",
    "Nothing Phone 3a Pro Review",
    "Poco F7 Ultra Review",
  ];


export default function RoundupDetailPage() {
  const { slug = "" } = useParams();

  const {
    data: article,
    isLoading,
    error,
  } = useQuery<RoundupArticle>({
    queryKey: ["roundup", slug],
    queryFn: () => API.getRoundupArticle(slug),
  });

  const { data: topPosts } = useQuery<PostSummary[]>({
    queryKey: ["top-posts"],
    queryFn: () => API.getTopPosts(),
  });

  const { data: latestReviews } = useQuery<PostSummary[]>({
    queryKey: ["latest-reviews"],
    queryFn: () => API.getLatestReviews(),
  });

  const sections = useMemo(() => {
    if (!article) return [];
    const list: { id: string; label: string }[] = [];
    list.push({ id: "glance", label: "Best phones at a glance" });
    list.push({ id: "buying-guide", label: "How we test and how to choose" });
    article.products.forEach((p) => {
      list.push({ id: p.slug, label: p.title });
    });
    list.push({ id: "test-data", label: "Test data" });
    list.push({ id: "full-specs", label: "Full specs" });
    if (article.faqs && article.faqs.length) {
      list.push({ id: "faq", label: "Frequently asked questions" });
    }
    return list;
  }, [article]);

  if (isLoading) {
    return (
      <Layout>
        <div className="h-64 animate-pulse bg-gray-200 rounded-md" />
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout>
        <p className="p-4 rounded border bg-white">
          Sorry, we could not load this best list.
        </p>
      </Layout>
    );
  }

  const ldItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: article.title,
    itemListElement: article.products.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: p.title,
    })),
  };
  function linkifyModelNames(text: string, products: RoundupProduct[]) {
  if (!text) return text;

  let updated = text;

  products.forEach((p) => {
    if (!p.title) return;

    // escape special regex characters in model names
    const safeTitle = p.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const pattern = new RegExp(safeTitle, "gi");

    updated = updated.replace(
      pattern,
      `[${p.title}](#${p.slug})`
    );
  });

  return updated;
}


return (
  <Layout>
    <SEO
      title={article.seo?.title || article.title}
      description={article.seo?.description}
    />
    <JSONLD data={ldItemList} />

    <JumpToSection sections={sections} />
    <SupportStrip />

   <main className="max-w-6xl mx-auto px-4 py-6 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
  {/* main article column */}
        <article>
          {/* breadcrumb */}
          <nav className="text-xs text-gray-600 mb-3">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-1">›</span>
            <Link
              to={`/search?category=${encodeURIComponent(
                article.category || "smartphones",
              )}`}
              className="hover:underline"
            >
              {article.category || "Smartphones"}
            </Link>
            <span className="mx-1">›</span>
            <span className="text-gray-800">{article.title}</span>
          </nav>

          {/* header */}
            <ArticleHeader
              categoryLabel={article.category || "Phones"}
              categorySlug={article.category || "phones"}
              title={article.title}
              subtitle={article.subtitle}
              author={article.author}
              publishedAt={article.publishedAt}
            />




          {/* hero image */}
          {article.heroImageUrl && (
            <div className="mt-4 mb-4 bg-gray-100 rounded-md overflow-hidden">
              <img
                src={article.heroImageUrl}
                alt={article.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          
          {/* GLOBAL INTRO BLOCK BELOW HERO IMAGE */}
          {article.introMd && (
            <section className="mb-8">
              <div className="prose max-w-none prose-p:mb-4 text-[15px] leading-relaxed text-gray-800">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {linkifyModelNames(article.introMd, article.products)}
                </ReactMarkdown>
              </div>
            </section>
          )}



          {/* at a glance */}
          <section id="glance" className="mt-6">
            <h2 className="text-xl font-semibold mb-3">
              Best mid range smartphones at a glance
            </h2>
            <ul className="list-disc list-inside text-sm space-y-1 mb-4">
              {article.products.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`#${p.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(p.slug);
                      if (el) {
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    {p.title}
                  </Link>{" "}
                  {p.verdict ? `– ${p.verdict}` : ""}
                </li>
              ))}
            </ul>
          </section>
          <RoundupSlider items={article.products} />
          {/* buying guide and testing method together, like their long text block */}
          <section id="buying-guide" className="mt-10">
            {article.buyingGuideMd && (
              <>
                <h2 className="text-xl font-semibold mb-3">
                  How to choose a mid range phone
                </h2>
                <div className="prose max-w-none text-sm leading-relaxed mb-6">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {article.buyingGuideMd}
                  </ReactMarkdown>
                </div>
              </>
            )}

            {article.testingMethodMd && (
              <>
                <h2 className="text-xl font-semibold mb-3">How we test</h2>
                <div className="prose max-w-none text-sm leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {article.testingMethodMd}
                  </ReactMarkdown>
                </div>
              </>
            )}
          </section>
                        {/* slider row with several phones, like Trusted Reviews */}
          <BestPhonesSlider products={article.products} />

          {/* repeated phone sections */}
          {article.products.map((item) => (
            <ProductBlock key={item.id} item={item} />
          ))}

                    {/* test data section */}
          <section id="test-data" className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Test data</h2>

            {!article.testData || !article.testData.length ? (
              <div className="border rounded-md bg-white text-xs p-4">
                <p>No test data available for this best list yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border rounded-md bg-white text-xs">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left font-semibold px-3 py-2 border-b">
                        Test
                      </th>
                      {phoneColumns.map((name) => (
                        <th
                          key={name}
                          className="text-center font-semibold px-3 py-2 border-b"
                        >
                          {name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {article.testData.map((row) => (
                      <tr key={row.label} className="odd:bg-white even:bg-gray-50/60">
                        <th className="text-left font-medium px-3 py-2 align-top border-b">
                          {row.label}
                        </th>
                        {phoneColumns.map((name) => (
                          <td
                            key={name}
                            className="text-center px-3 py-2 align-top border-b"
                          >
                            {row.values?.[name] ?? "–"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-3 pb-3 pt-1 text-[10px] text-gray-500">
                  Figures are sample values for demonstration.
                </div>
              </div>
            )}
          </section>


          {/* full specs section placeholder */}
                    {/* full specs section */}
          <section id="full-specs" className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Full specs</h2>

            {!article.fullSpecs || !article.fullSpecs.length ? (
              <div className="overflow-x-auto border rounded-md bg-white text-xs p-4">
                <p>No full specification data available for this best list yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border rounded-md bg-white text-xs">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left font-semibold px-3 py-2 border-b">
                        Spec
                      </th>
                      {fullSpecColumns.map((name) => (
                        <th
                          key={name}
                          className="text-center font-semibold px-3 py-2 border-b"
                        >
                          {name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {article.fullSpecs.map((row) => (
                      <tr key={row.label} className="odd:bg-white even:bg-gray-50/60">
                        <th className="text-left font-medium px-3 py-2 align-top border-b">
                          {row.label}
                        </th>
                        {fullSpecColumns.map((name) => (
                          <td
                            key={name}
                            className="text-center px-3 py-2 align-top border-b"
                          >
                            {row.values?.[name] ?? "–"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-3 pb-3 pt-1 text-[10px] text-gray-500">
                  Specs are sample values for demonstration.
                </div>
              </div>
            )}
          </section>


          {/* faq */}
          <FAQSection faqs={article.faqs} />

          {/* conclusion */}
          {article.conclusionMd && (
            <section className="mt-10">
              <div className="prose max-w-none text-sm leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {article.conclusionMd}
                </ReactMarkdown>
              </div>
            </section>
          )}
        </article>      
        <aside>
          <PageTemplate sidebar={<ArticleSidebar />}/>
      </aside>
      </main>
      
    </Layout>
  );
}
