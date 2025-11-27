// src/features/home/TechNewsSection.tsx
import { Link } from "react-router-dom";

type TechNewsItem = {
  slug: string;
  title: string;
  imageUrl: string;
  author: string;
  date: string;
  excerpt: string;
};

const TECH_NEWS_ITEMS: TechNewsItem[] = [
  {
    slug: "ultrahuman-home-coughs-snores",
    title: "Ultrahuman Home can monitor your coughs and snores as you sleep",
    imageUrl: "https://picsum.photos/seed/technews-1/1200/675",
    author: "Diane Templado",
    date: "November 25, 2025",
    excerpt:
      "Ultrahuman is taking another big swing at sleep tech, moving far beyond simple noise alerts in the bedroom.",
  },
  {
    slug: "oneplus-15r-christmas-treat",
    title: "The OnePlus 15R will be an early Christmas treat",
    imageUrl: "https://picsum.photos/seed/technews-2/1200/675",
    author: "Diane Templado",
    date: "November 25, 2025",
    excerpt:
      "OnePlus is ending the year with a packed December launch, and the headline act is the new OnePlus 15R.",
  },
  {
    slug: "galaxy-s25-camera-upgrade",
    title: "Samsung Galaxy S25 leak teases a major camera upgrade",
    imageUrl: "https://picsum.photos/seed/technews-3/1200/675",
    author: "Lewis Painter",
    date: "November 24, 2025",
    excerpt:
      "Early leaks suggest a larger sensor and smarter processing for the main camera on Samsung’s next flagship.",
  },
  {
    slug: "sony-alpha-9iii-review",
    title: "Sony Alpha 9 III brings stacked sensor magic to sports shooters",
    imageUrl: "https://picsum.photos/seed/technews-4/1200/675",
    author: "Kob Monney",
    date: "November 23, 2025",
    excerpt:
      "Sony’s latest mirrorless body targets professionals who need blistering speed without sacrificing image quality.",
  },
];

export default function TechNewsSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 mt-12">
      {/* heading and subtle subtitle */}
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold">Tech News</h2>
        <div className="flex-grow border-t border-gray-300" />
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Fresh headlines, product launches and industry stories. News detail
        pages will later follow the same layout as the deals page.
      </p>

      {/* cards grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {TECH_NEWS_ITEMS.map((item) => (
          <Link
            key={item.slug}
            // news detail route, backend will come later
            to={`/news/${item.slug}`}
            className="group block"
          >
            <div className="rounded-2xl overflow-hidden bg-gray-200">
              <div className="aspect-[16/9]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            </div>

            <h3 className="mt-4 text-lg font-semibold leading-snug group-hover:text-indigo-700">
              {item.title}
            </h3>

            <p className="mt-2 text-xs text-gray-500">
              {item.author}
              <span className="mx-1">•</span>
              {item.date}
            </p>

            <p className="mt-3 text-sm text-gray-700">
              {item.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
