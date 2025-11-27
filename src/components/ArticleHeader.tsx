// src/components/ArticleHeader.tsx
import { Link } from "react-router-dom";

type ArticleHeaderProps = {
  categoryLabel?: string;        // chip text: PHONES, DEALS, LAPTOPS
  categorySlug?: string;         // used for breadcrumb link
  title: string;
  subtitle?: string;
  author?: string;
  publishedAt?: string;          // ISO
  readTime?: string;             // "3 mins read"
  showShareRow?: boolean;        // allow hiding share row if needed
};

export default function ArticleHeader({
  categoryLabel,
  categorySlug,
  title,
  subtitle,
  author,
  publishedAt,
  readTime = "3 mins read",
  showShareRow = true,
}: ArticleHeaderProps) {
  const label = categoryLabel || "Reviews";
  const slug = categorySlug || "reviews";

  return (
    <>
      {/* breadcrumb */}
      <nav className="text-xs text-gray-600 mb-3">
        <Link to="/" className="hover:underline">
          Home
        </Link>

        <span className="mx-1">›</span>

        {categoryLabel ? (
          categorySlug ? (
            <Link
              to={`/search?category=${encodeURIComponent(slug)}`}
              className="hover:underline"
            >
              {label}
            </Link>
          ) : (
            <span className="text-gray-800">{label}</span>
          )
        ) : null}

        {categoryLabel && <span className="mx-1">›</span>}

        <span className="text-gray-800">{title}</span>
      </nav>

      {/* header block */}
      <header className="mb-4">
        {/* chip above title */}
        {categoryLabel && (
          <div className="inline-flex items-center rounded-full bg-purple-700 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white mb-2">
            {label}
          </div>
        )}

        <h1 className="text-3xl font-semibold leading-tight">{title}</h1>

        {subtitle && (
          <p className="mt-1 text-sm text-gray-700">{subtitle}</p>
        )}

        {/* author row */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
          <div className="w-6 h-6 rounded-full bg-gray-200 mr-1" />

          {author && (
            <>
              <span>By</span>
              <span className="font-semibold">{author}</span>
            </>
          )}

          {publishedAt && (
            <>
              <span>•</span>
              <span>{new Date(publishedAt).toLocaleDateString()}</span>
            </>
          )}

          {readTime && (
            <>
              <span>•</span>
              <span>{readTime}</span>
            </>
          )}
        </div>

        {/* share row */}
        {showShareRow && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {/* Share label */}
            <div className="flex items-center gap-2 text-gray-700 text-sm font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 text-gray-500"
              >
                <path d="M15 8a3 3 0 10-2.83-4H8.83A3.001 3.001 0 106 8c.34 0 .67-.06.98-.17L11 12l-4.02 4.17c-.31-.11-.64-.17-.98-.17a3 3 0 102.83 4h3.34A3.001 3.001 0 1015 12c-.34 0-.67.06-.98.17L10 8l4.02-4.17c.31-.11.64-.17.98-.17z" />
              </svg>
              <span>Share</span>
            </div>

            {/* Facebook */}
            <button className="flex items-center gap-2 px-5 py-2 rounded text-sm font-semibold text-white bg-[#1877F2]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M22 12c0-5.5228-4.4772-10-10-10S2 6.4772 2 12c0 4.9912 3.657 9.1288 8.438 9.8788V15.468H8.078v-3.468h2.36V9.797c0-2.33 1.393-3.622 3.523-3.622.999 0 2.042.177 2.042.177v2.24h-1.151c-1.136 0-1.491.705-1.491 1.427v1.709h2.531l-.404 3.468h-2.127v6.4108C18.343 21.1288 22 16.9912 22 12z" />
              </svg>
              Facebook
            </button>

            {/* Twitter */}
            <button className="flex items-center gap-2 px-5 py-2 rounded text-sm font-semibold text-white bg-[#1DA1F2]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="h-4 w-4"
              >
                <path d="M23.954 4.569a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.996 9.996 0 01-3.127 1.196A4.92 4.92 0 001.78 7.29a13.978 13.978 0 01-10.15-5.15A4.822 4.822 0 003.18 9.72 4.93 4.93 0 01.96 9.1v.06a4.92 4.92 0 003.946 4.81 4.996 4.996 0 01-2.212.08 4.937 4.937 0 004.604 3.417 9.867 9.867 0 01-6.1 2.104c-.39 0-.779-.021-1.17-.067A13.945 13.945 0 007.548 22c9.142 0 14.307-7.721 13.995-14.646a9.935 9.935 0 002.411-2.785z" />
              </svg>
              Twitter
            </button>

            {/* Pinterest */}
            <button className="flex items-center gap-2 px-5 py-2 rounded text-sm font-semibold text-white bg-[#E60023]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12c0 4.991 3.657 9.128 8.438 9.878-.117-.84-.224-2.132.046-3.049.242-.831 1.558-5.3 1.558-5.3s-.398-.796-.398-1.975c0-1.852 1.073-3.232 2.409-3.232 1.136 0 1.686.852 1.686 1.873 0 1.14-.728 2.846-1.103 4.428-.312 1.317.663 2.392 1.963 2.392 2.356 0 3.948-3.018 3.948-6.589 0-2.716-1.829-4.748-5.161-4.748-3.76 0-6.105 2.804-6.105 5.931 0 1.082.414 2.244.931 2.873.103.126.118.236.087.362-.095.398-.31 1.265-.352 1.442-.055.232-.18.281-.416.17-1.559-.727-2.533-3.01-2.533-4.843 0-3.943 2.868-7.565 8.269-7.565 4.344 0 7.733 3.093 7.733 7.22 0 4.318-2.723 7.792-6.505 7.792-1.27 0-2.466-.661-2.874-1.441l-.783 2.979c-.283 1.079-1.05 2.429-1.567 3.255A12.004 12.004 0 1012 0z" />
              </svg>
              Pinterest
            </button>

            {/* LinkedIn */}
            <button className="flex items-center gap-2 px-5 py-2 rounded text-sm font-semibold text-white bg-[#0A66C2]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="white"
                viewBox="0 0 448 512"
              >
                <path d="M100.28 448H7.4V148.9h92.88zm-46.49-341a53.79 53.79 0 1153.79 53.8 53.8 53.8 0 01-53.8-53.76zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.25-79.2-48.3 0-55.72 37.7-55.72 76.7V448h-92.78V148.9h89.12v40.8h1.28c12.41-23.5 42.72-48.25 87.88-48.25 94 0 111.28 61.9 111.28 142.3z" />
              </svg>
              LinkedIn
            </button>

            {/* simple icon button */}
            <button className="w-10 h-10 flex items-center justify-center border rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 12h9m0 0l-3.75-3.75M16.5 12l-3.75 3.75"
                />
              </svg>
            </button>
          </div>
        )}
      </header>
    </>
  );
}
