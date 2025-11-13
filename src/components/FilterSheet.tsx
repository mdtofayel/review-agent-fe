export default function FilterSheet({
  open, onClose, minRating, setMinRating
}:{
  open: boolean; onClose: ()=>void; minRating: number; setMinRating: (v:number)=>void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}/>
      <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          <button className="text-sm underline" onClick={onClose}>Close</button>
        </div>
        <div>
          <label className="text-sm text-gray-600">Minimum rating</label>
          <input type="range" min={0} max={5} step={0.5} value={minRating} onChange={e=>setMinRating(Number(e.target.value))} className="w-full"/>
          <div className="text-sm">≥ {minRating.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
}
