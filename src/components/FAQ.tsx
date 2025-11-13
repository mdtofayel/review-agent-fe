import type { FAQ } from "../api/types";

export default function FAQList({ items }: { items: FAQ[] }) {
  if (!items?.length) return null;
  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <details key={i} className="rounded-xl border bg-white p-4 open:shadow-sm">
          <summary className="cursor-pointer font-medium">{f.q}</summary>
          <div className="mt-2 text-gray-700 text-sm whitespace-pre-wrap">{f.a_md}</div>
        </details>
      ))}
    </div>
  );
}
