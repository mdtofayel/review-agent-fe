export function SkeletonCard() {
  return (
    <div className="rounded-2xl border bg-white overflow-hidden animate-pulse">
      <div className="aspect-[3/2] bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 w-3/4 rounded" />
        <div className="h-3 bg-gray-200 w-full rounded" />
        <div className="h-3 bg-gray-200 w-2/3 rounded" />
      </div>
    </div>
  );
}
