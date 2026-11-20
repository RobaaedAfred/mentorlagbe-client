import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1);
  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-1.5" aria-label="Pagination">
      <button className="btn btn-sm btn-outline" disabled={page === 1} onClick={() => onChange(page - 1)}><ChevronLeft size={16} /> Previous</button>
      {nums.map((n, i) => (
        <span key={n} className="flex items-center gap-1.5">
          {i > 0 && nums[i - 1] !== n - 1 && <span className="px-1 text-base-content/40">…</span>}
          <button onClick={() => onChange(n)} className={`btn btn-sm ${n === page ? "btn-primary" : "btn-ghost"}`}>{n}</button>
        </span>
      ))}
      <button className="btn btn-sm btn-outline" disabled={page === pages} onClick={() => onChange(page + 1)}>Next <ChevronRight size={16} /></button>
    </nav>
  );
}
