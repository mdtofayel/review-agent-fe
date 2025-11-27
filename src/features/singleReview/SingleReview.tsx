// src/features/singleReview/SingleReview.tsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Layout from "../../components/Layout";
import PageTemplate from "../../components/PageTemplate";
import ArticleSidebar from "../common/ArticleSidebar";
import ArticleHeader from "../../components/ArticleHeader";
import HeroImage from "../../components/HeroImage";
import RatingStars from "../../components/RatingStars";
import JumpToSection, {
  type JumpSection,
} from "../../components/JumpToSection";
import TrustJournalism from "../../components/TrustJournalism";
import RelatedPosts from "../../components/RelatedPosts";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { API } from "../../api";
import type { Product } from "../../api/types";

// extend Product locally so we can support multiple offers now
type ProductWithOffers = Product & {
  offers?: {
    id?: string;
    merchant: string;
    priceText?: string;
    label?: string;
    url?: string;
  }[];

  // optional per product key features
  keyFeatures?: {
    label: string;        // e.g. "Upgraded camera"
    description: string;  // e.g. "1-inch 12MP CMOS…"
    icon?: string;        // emoji or icon name if you want
  }[];
};


export default function SingleReview() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<ProductWithOffers>({
    queryKey: ["product", slug],
    queryFn: () => API.getProductBySlug(slug!),
    enabled: !!slug,
  });

  useEffect(() => {
    if (product) {
      const metaTitle =
        product.seo?.metaTitle || product.title || "ReviewHub review";
      document.title = metaTitle;
    }
  }, [product]);

  if (!product && isLoading) {
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

  if (isError || !product) {
    return (
      <Layout>
        <PageTemplate sidebar={<ArticleSidebar />}>
          <p className="text-sm text-red-600">
            Product could not be loaded.
          </p>
        </PageTemplate>
      </Layout>
    );
  }

  const review = product.review;
  const authorName = review?.author || "ReviewHub team";
  const updatedAt = review?.updatedAt || product.createdAt;

    // derive an introduction from the first paragraph of body_md
  let introMd: string | undefined;
  let bodyRestMd: string | undefined;

  if (review?.body_md) {
    const parts = review.body_md.split(/\n{2,}/); // split on blank line
    if (parts.length > 1) {
      introMd = parts[0];
      bodyRestMd = parts.slice(1).join("\n\n");
    } else {
      bodyRestMd = review.body_md;
    }
  }


  // offers list: use product.offers if present, otherwise fall back to a single one
  const offers =
    product.offers && product.offers.length > 0
      ? product.offers
      : product.price != null
      ? [
          {
            id: "primary",
            merchant: product.brand || "Main retailer",
            priceText: `${product.price.toFixed(2)} ${
              product.currency || "€"
            }`,
            label: "Check price",
            url: "#",
          },
        ]
      : [];

  // dynamic list for jump menu based on available sections
  const jumpSections: JumpSection[] = [];

  jumpSections.push({ id: "overview", label: "Overview" });

  if (review?.summary) {
    jumpSections.push({ id: "verdict", label: "Verdict" });
  }

  if (
    (review?.pros && review.pros.length > 0) ||
    (review?.cons && review.cons.length > 0)
  ) {
    jumpSections.push({ id: "pros-cons", label: "Pros and cons" });
  }

  if (offers.length > 0) {
    jumpSections.push({ id: "offers", label: "Best deals" });
  }

  if (product.keyFeatures && product.keyFeatures.length > 0) {
    jumpSections.push({ id: "key-features", label: "Key features" });
  }
  if (introMd) {
    jumpSections.push({ id: "introduction", label: "Introduction" });
  }
  if (product.specs && Object.keys(product.specs).length > 0) {
    jumpSections.push({ id: "specs", label: "Full specs" });
  }

  if (review?.body_md) {
    jumpSections.push({ id: "full-review", label: "Full review" });
  }

  return (
    <Layout>
      {/* sticky jump bar */}
      <JumpToSection sections={jumpSections} />

      <PageTemplate sidebar={<ArticleSidebar />}>
        {/* OVERVIEW */}
        <section id="overview">
          <ArticleHeader
            categoryLabel={product.category || "Reviews"}
            categorySlug={(product.category || "reviews").toLowerCase()}
            title={product.title}
            subtitle={review?.summary || product.highlight}
            author={authorName}
            publishedAt={updatedAt}
          />

          <HeroImage
            imageUrl={product.image}
            title={product.title}
            label={product.badges?.[0] || "Review"}
          />

          {/* top meta row under hero */}
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b pb-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <RatingStars
                  value={product.rating}
                  size={20}
                  showValue={false}
                />
                <span className="text-sm font-semibold">
                  {product.rating.toFixed(1)}/5
                </span>
              </div>

              {product.votes != null && (
                <span className="text-xs text-gray-500">
                  {product.votes} votes
                </span>
              )}

              {product.badges && product.badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.badges.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col items-start gap-2 md:items-end">
              {product.price != null && (
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    Price at review time
                  </div>
                  <div className="text-lg font-semibold">
                    {product.price.toFixed(2)} {product.currency || "€"}
                  </div>
                </div>
              )}
              <button className="mt-1 inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                Check price and deals
              </button>
            </div>
          </div>
        </section>

        {/* VERDICT */}
        {review?.summary && (
          <section id="verdict" className="mt-8">
            <div className="rounded-2xl bg-gray-50 p-6 shadow-sm border">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Verdict</h2>
                  <p className="text-sm text-gray-800 whitespace-pre-line">
                    {review.summary}
                  </p>
                </div>

                <div className="flex items-center md:items-start gap-2 md:ml-6">
                  <RatingStars
                    value={product.rating}
                    size={20}
                    className="text-red-500"
                    showValue={false}
                  />
                  <span className="text-sm font-semibold text-gray-800">
                    {product.rating.toFixed(1)}/5
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PROS AND CONS */}
        {(review?.pros?.length || review?.cons?.length) && (
          <section
            id="pros-cons"
            className="mt-8 grid gap-6 md:grid-cols-2"
          >
            {review?.pros && review.pros.length > 0 && (
              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
                <div className="bg-black text-white px-5 py-3 flex items-center gap-2 text-sm font-semibold">
                  <span className="text-base">👍</span>
                  <span>Pros</span>
                </div>
                <div className="p-5">
                  <ul className="space-y-2 text-sm text-gray-800">
                    {review.pros.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="mt-[2px] text-gray-400">›</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {review?.cons && review.cons.length > 0 && (
              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
                <div className="bg-black text-white px-5 py-3 flex items-center gap-2 text-sm font-semibold">
                  <span className="text-base">👎</span>
                  <span>Cons</span>
                </div>
                <div className="p-5">
                  <ul className="space-y-2 text-sm text-gray-800">
                    {review.cons.map((c) => (
                      <li key={c} className="flex gap-2">
                        <span className="mt-[2px] text-gray-400">›</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>
        )}

        {/* OFFERS FROM DIFFERENT MARKETPLACES */}
        {offers.length > 0 && (
          <section id="offers" className="mt-8">
            <div className="rounded-2xl overflow-hidden border bg-white">
              <div className="bg-indigo-900 text-white px-5 py-3 text-sm font-semibold truncate">
                {product.title}
              </div>

              <div className="p-5 space-y-4">
                {offers.map((offer, index) => (
                  <div
                    key={offer.id || `${offer.merchant}-${index}`}
                    className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-t pt-4 first:border-t-0 first:pt-0"
                  >
                    <div className="flex items-center justify-center w-32 h-32 border bg-white">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="flex-1 text-sm text-gray-800 md:px-4">
                      <div className="font-semibold mb-1">
                        {offer.merchant}
                      </div>
                      {offer.priceText && (
                        <div className="text-base font-semibold text-gray-900">
                          {offer.priceText}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        Check price here
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-2">
                      <a
                        href={offer.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700"
                      >
                        {offer.label || "Check price"}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
                {/* KEY FEATURES */}
        {product.keyFeatures && product.keyFeatures.length > 0 && (
          <section id="key-features" className="mt-8">
            <h2 className="text-base font-semibold mb-3">Key features</h2>

            <ul className="space-y-2 text-sm">
              {product.keyFeatures.map((f, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3"
                >
                  {/* simple icon column, can later be replaced with SVGs */}
                  <div className="mt-0.5 text-red-500 text-lg w-5 flex justify-center">
                    {f.icon || "⚡"}
                  </div>

                  <div>
                    <span className="font-semibold">{f.label}</span>
                    {f.description && (
                      <span className="ml-1 text-gray-800">
                        {f.description}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
        
          {/* INTRODUCTION */}
        {introMd && (
          <section id="introduction" className="mt-8">
            <h2 className="text-base font-semibold mb-3">Introduction</h2>
            <div className="prose max-w-none text-[15px] leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {introMd}
              </ReactMarkdown>
              <p>   Nanabhai, hier ist alles fertig: ein vollständiges deutsches Anschreiben + dein CV in deinem gewünschten LaTeX Format, perfekt angepasst auf die Stelle (Junior) Java Developer bei C24 Bank.
Ich habe alle geforderten Skills aus der Ausschreibung integriert: Java, Spring Boot, relational databases, Git, Docker, agile, independent working, cross functional team, interface integration.
Ich habe keine neuen Erfahrungen erfunden und nur das genutzt, was in deinen CV Dateien steht (zitiert aus deinen Dateien ).

✓ Anschreiben in Deutsch (Textform)

Mohamad Tofayel Ahmed
Bremen, Deutschland
E Mail: mtaahmed456@gmail.com

Telefon: 0178 2622456

C24 Bank GmbH
Frankfurt am Main

Bewerbung als (Junior) Java Developer (m/w/d)

Sehr geehrte Frau Yalaza,

mit großer Begeisterung bewerbe ich mich als Junior Java Developer bei der C24 Bank. Die Vision, mobiles Banking mit einer modernen, leistungsfähigen Java Spring Boot Plattform neu zu definieren, spricht mich sowohl fachlich als auch persönlich sehr an. Besonders reizt mich die Möglichkeit, in einem agilen FinTech Umfeld mit kurzen Entscheidungswegen und modernen Technologien mitzuwirken.

Während meiner Tätigkeit als studentische Hilfskraft im Forschungszentrum CRC 1342 der Universität Bremen konnte ich meine praktischen Fähigkeiten in der Backend Entwicklung mit Java und Spring Boot deutlich vertiefen . Zu meinen Aufgaben gehörten die Optimierung komplexer PostgreSQL Abfragen, die Entwicklung von REST Schnittstellen und die Arbeit in einem agilen Team. Durch gezielte Optimierungsmaßnahmen konnte ich die Ladezeit eines Moduls um etwa fünfundzwanzig Prozent reduzieren. Zudem habe ich regelmäßig mit Git, Docker, Maven und relationalen Datenbanken gearbeitet, wodurch ich eine strukturierte und qualitätsbewusste Arbeitsweise entwickelt habe.

Mit Erfahrung in Java Entwicklung, Spring Boot, relationalen Datenbanken und Webtechnologien wie Angular und JSF erfülle ich die wesentlichen Anforderungen Ihrer Stelle. Ich arbeite gern im Team, übernehme Verantwortung und bringe mich aktiv in neue Themen ein. Die Gestaltung einer neuen Plattform für innovative Kontoprodukte, die Integration internationaler Schnittstellen sowie die enge Zusammenarbeit mit Produktmanagement und Entwicklern entsprechen genau meiner beruflichen Ausrichtung.

Besonders überzeugen mich Ihre langfristigen Perspektiven, das moderne technische Umfeld, Ihre vielfältigen Weiterbildungsangebote und die offene Kultur der CHECK24 Gruppe. Ich bin sehr motiviert, mich in Ihrem Team weiterzuentwickeln und mit Engagement und Eigeninitiative zum Erfolg der C24 Bank beizutragen.

Ich freue mich sehr über die Möglichkeit eines persönlichen Gesprächs.</p>
            </div>
          </section>
        )}

        {/* SPECS */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <section id="specs" className="mt-8">
            <h2 className="text-base font-semibold mb-3">
              Full specifications
            </h2>
            <div className="overflow-hidden rounded-2xl border">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <tr key={key} className="even:bg-gray-50">
                      <td className="w-1/3 px-4 py-2 font-medium text-gray-700">
                        {key}
                      </td>
                      <td className="px-4 py-2 text-gray-800">
                        {String(value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* FULL REVIEW BODY */}
        {review?.body_md && (
          <section
            id="full-review"
            className="mt-10 prose max-w-none text-[15px] leading-relaxed"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {review.body_md}
            </ReactMarkdown>
          </section>
        )}

        {/* AUTHOR CARD AND TRUST BLOCKS */}
        <section className="mt-10 border-t pt-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              <span className="text-xl font-semibold text-gray-500">
                {authorName.charAt(0)}
              </span>
            </div>
            <div>
              <div className="text-sm font-semibold">{authorName}</div>
              <p className="text-xs text-gray-600 mt-1 max-w-md">
                {authorName} tests and reviews products for ReviewHub.
                This text is placeholder copy for now.
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
