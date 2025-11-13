export default function Pagination({ page, size, total, onPage }: { page: number; size: number; total: number; onPage: (p:number)=>void }) {
  const pages = Math.max(1, Math.ceil(total / size));
  return (
    <div className="flex justify-center gap-2 mt-6">
      <button className="px-3 py-1 border rounded disabled:opacity-50" disabled={page<=1} onClick={()=>onPage(page-1)}>Prev</button>
      <span className="text-sm px-2">Page {page} / {pages}</span>
      <button className="px-3 py-1 border rounded disabled:opacity-50" disabled={page>=pages} onClick={()=>onPage(page+1)}>Next</button>
    </div>
  );
}
