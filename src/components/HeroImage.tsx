import { Link } from "react-router-dom";

type HeroImageProps = {
  imageUrl: string;
  title: string;
  label?: string;
  to?: string;
};

export default function HeroImage({
  imageUrl,
  title,
  label,
  to,
}: HeroImageProps) {
  const content = (
    <>
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover aspect-[16/9] group-hover:scale-[1.02] transition-transform"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6">
        {label && (
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold uppercase tracking-wide bg-indigo-500 text-white rounded">
            {label}
          </span>
        )}
        <h1 className="mt-3 text-2xl md:text-3xl font-semibold text-white leading-tight">
          {title}
        </h1>
      </div>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="block group rounded-2xl overflow-hidden bg-black relative"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="block group rounded-2xl overflow-hidden bg-black relative">
      {content}
    </div>
  );
}
