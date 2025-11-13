import { useId } from "react";

type RatingStarsProps = {
  value: number;                 // current rating, e.g. 4.5
  outOf?: number;                // default 5
  size?: number;                 // px, default 18
  className?: string;            // tailwind color classes
  showValue?: boolean;           // show "4.5/5" text
  readOnly?: boolean;            // if false + onChange set -> interactive
  onChange?: (v: number) => void;
};

export default function RatingStars({
  value,
  outOf = 5,
  size = 18,
  className = "text-yellow-500",
  showValue = false,
  readOnly = true,
  onChange,
}: RatingStarsProps) {
  const safeVal = clamp(value, 0, outOf);
  const gid = useId(); // unique id for half-fill gradients

  const stars = Array.from({ length: outOf }, (_, i) => {
    const diff = safeVal - i;
    const state: "empty" | "half" | "full" =
      diff >= 1 ? "full" : diff >= 0.5 ? "half" : "empty";
    const gradientId = `${gid}-half-${i}`;

    const StarSVG = (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="inline-block align-[-2px]"
      >
        {state === "half" && (
          <defs>
            <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
        )}
        <path
          d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.336 24 12 19.896 4.664 24 6 15.596 0 9.748l8.332-1.73z"
          fill={
            state === "full"
              ? "currentColor"
              : state === "half"
              ? `url(#${gradientId})`
              : "none"
          }
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    );

    // interactive mode (optional)
    if (!readOnly && onChange) {
      return (
        <button
          key={i}
          type="button"
          className={`p-0.5 ${className}`}
          aria-label={`Set rating to ${i + 1}`}
          onClick={(e) => {
            const rect = (e.currentTarget.firstChild as SVGElement).getBoundingClientRect();
            const isHalf = e.clientX - rect.left < rect.width / 2;
            const newVal = i + 1 - (isHalf ? 0.5 : 0);
            onChange(clamp(newVal, 0, outOf));
          }}
        >
          {StarSVG}
        </button>
      );
    }

    return (
      <span key={i} className={`p-0.5 ${className}`} aria-hidden="true">
        {StarSVG}
      </span>
    );
  });

  return (
    <span className="inline-flex items-center gap-1">
      <span role={readOnly ? "img" : "group"} aria-label={`Rating ${safeVal} out of ${outOf}`}>
        {stars}
      </span>
      {showValue && (
        <span className="text-xs text-gray-600 align-middle">
          {safeVal.toFixed(1)}/{outOf}
        </span>
      )}
    </span>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
