import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { API } from "../../api";
import type { DealArticle } from "../../api/types";

type ListItem = {
  title: string;
  imageUrl: string;
  date: string;
};

const VERSUS_ITEMS: ListItem[] = [
  {
    title: "Amazon Kindle Colorsoft vs Kindle Paperwhite: Comparing the e-readers",
    imageUrl: "https://picsum.photos/seed/versus1/160/90",
    date: "November 24, 2025",
  },
  {
    title: "Nintendo Switch 2 vs Nintendo Switch: Should you upgrade",
    imageUrl: "https://picsum.photos/seed/versus2/160/90",
    date: "November 24, 2025",
  },
  {
    title: "Kindle Colorsoft vs Kindle Colorsoft Signature Edition: Which should you get",
    imageUrl: "https://picsum.photos/seed/versus3/160/90",
    date: "November 24, 2025",
  },
  {
    title: "OLED vs QLED: Which should you get",
    imageUrl: "https://picsum.photos/seed/versus4/160/90",
    date: "November 18, 2025",
  },
  {
    title: "Samsung Galaxy S vs Samsung Galaxy A: What is the difference",
    imageUrl: "https://picsum.photos/seed/versus5/160/90",
    date: "November 18, 2025",
  },
  {
    title: "Blink vs Ring: The home security systems explained",
    imageUrl: "https://picsum.photos/seed/versus6/160/90",
    date: "November 17, 2025",
  },
  {
    title: "OnePlus 15 vs Oppo Find X9 Pro: Flagships compared",
    imageUrl: "https://picsum.photos/seed/versus7/160/90",
    date: "November 14, 2025",
  },
];

const HOWTO_ITEMS: ListItem[] = [
  {
    title: "How to start a Jam on Spotify",
    imageUrl: "https://picsum.photos/seed/howto1/160/90",
    date: "November 13, 2025",
  },
  {
    title: "How to return a game on Steam",
    imageUrl: "https://picsum.photos/seed/howto2/160/90",
    date: "November 11, 2025",
  },
  {
    title: "How to recover deleted messages from Instagram",
    imageUrl: "https://picsum.photos/seed/howto3/160/90",
    date: "November 11, 2025",
  },
  {
    title: "How to turn your SIM into an eSIM on an iPhone",
    imageUrl: "https://picsum.photos/seed/howto4/160/90",
    date: "September 24, 2025",
  },
  {
    title: "How to download and install iOS 26",
    imageUrl: "https://picsum.photos/seed/howto5/160/90",
    date: "September 16, 2025",
  },
  {
    title: "How to make your iPhone app icons clear in iOS 26",
    imageUrl: "https://picsum.photos/seed/howto6/160/90",
    date: "September 16, 2025",
  },
  {
    title: "How to see how long your iPhone will take to charge in iOS 26",
    imageUrl: "https://picsum.photos/seed/howto7/160/90",
    date: "September 16, 2025",
  },
];

export default function VersusHowToSection() {
  // fetch featured deal once to get a valid slug for links
  const { data: featuredDeal } = useQuery<DealArticle>({
    queryKey: ["featured-deal-for-versus-howto"],
    queryFn: () => API.getFeaturedDeal(),
    retry: false,
  });

  const dealSlug = featuredDeal?.slug;
  const linkTarget = dealSlug ? `/deals/${dealSlug}` : "#";

  return (
    <section className="max-w-6xl mx-auto px-4 mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Versus column */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-semibold">Versus</h2>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <div className="divide-y divide-gray-200">
            {VERSUS_ITEMS.map((item, index) => (
              <Link
                key={index}
                to={linkTarget}
                className="flex gap-4 py-4 group"
              >
                <div className="w-20 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold leading-snug group-hover:text-indigo-700 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">{item.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* How to column */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-semibold">How to</h2>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <div className="divide-y divide-gray-200">
            {HOWTO_ITEMS.map((item, index) => (
              <Link
                key={index}
                to={linkTarget}
                className="flex gap-4 py-4 group"
              >
                <div className="w-20 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold leading-snug group-hover:text-indigo-700 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">{item.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
