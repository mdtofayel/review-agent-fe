export default function SortBar({ sort, setSort }: { sort: string; setSort: (s:string)=>void }) {
  return (
    <div className="flex items-center justify-end gap-2 text-sm">
      <span className="text-gray-600">Sort</span>
      <select className="border rounded px-2 py-1" value={sort} onChange={e=>setSort(e.target.value)}>
        <option value="relevance">Relevance</option>
        <option value="rating_desc">Rating</option>
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low → High</option>
        <option value="price_desc">Price: High → Low</option>
      </select>
    </div>
  );
}
