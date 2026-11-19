"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Search } from "lucide-react";
import TuitionCard from "./TuitionCard";
import BookmarkButton from "./BookmarkButton";
import Pagination from "./Pagination";
import { CardSkeletonGrid, EmptyState, ErrorState } from "./ui";
import { useFetch } from "@/lib/use-fetch";
import type { TuitionList } from "@/lib/types";

const LIMIT = 9;

export default function BrowseTuitions() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [search, setSearch] = useState(sp.get("search") ?? "");
  const [debounced, setDebounced] = useState(search);
  const subject = sp.get("subject") ?? "";
  const classLevel = sp.get("classLevel") ?? "";
  const mode = sp.get("mode") ?? "";
  const sort = sp.get("sort") ?? "newest";
  const page = Math.max(1, Number(sp.get("page") ?? 1) || 1);

  const meta = useFetch<{ subjects: string[]; classLevels: string[] }>("/tuitions/meta");

  // Debounce typing, then push the term into the URL (resets to page 1).
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const update = (patch: Record<string, string>, keepPage = false) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!keepPage) next.delete("page");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  useEffect(() => {
    if (debounced !== (sp.get("search") ?? "")) update({ search: debounced });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const query = useMemo(() => {
    const q = new URLSearchParams({ page: String(page), limit: String(LIMIT), sort });
    const s = sp.get("search");
    if (s) q.set("search", s);
    if (subject) q.set("subject", subject);
    if (classLevel) q.set("classLevel", classLevel);
    if (mode) q.set("mode", mode);
    return q.toString();
  }, [sp, page, sort, subject, classLevel, mode]);

  const { data, loading, error, reload } = useFetch<TuitionList>(`/tuitions?${query}`);

  const hasFilters = !!(sp.get("search") || subject || classLevel || mode);
  const reset = () => {
    setSearch("");
    setDebounced("");
    router.replace(pathname, { scroll: false });
  };

  const select = "select select-bordered w-full bg-base-100";

  return (
    <div className="container-page py-12">
      <div className="mb-8">
        <p className="eyebrow">Browse</p>
        <h1 className="section-title mt-2">Find the right tuition</h1>
        <p className="section-sub">Search by title or subject, then narrow down by class level and mode.</p>
      </div>

      <div className="card-surface mb-8 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
        <label className="relative sm:col-span-2 lg:col-span-2">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title or subject..." className="input input-bordered w-full bg-base-100 pl-10" />
        </label>
        <select className={select} value={subject} onChange={(e) => update({ subject: e.target.value })} aria-label="Subject">
          <option value="">All subjects</option>
          {meta.data?.subjects.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className={select} value={classLevel} onChange={(e) => update({ classLevel: e.target.value })} aria-label="Class level">
          <option value="">All class levels</option>
          {meta.data?.classLevels.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className={select} value={mode} onChange={(e) => update({ mode: e.target.value })} aria-label="Mode">
          <option value="">Online & Offline</option>
          <option>Online</option>
          <option>Offline</option>
        </select>
        <select className={select} value={sort} onChange={(e) => update({ sort: e.target.value === "newest" ? "" : e.target.value })} aria-label="Sort">
          <option value="newest">Newest first</option>
          <option value="fee-asc">Fee: low to high</option>
          <option value="fee-desc">Fee: high to low</option>
        </select>
      </div>

      <div className="mb-5 flex items-center justify-between text-sm text-base-content/60">
        <span>{data ? `${data.total} tuition${data.total === 1 ? "" : "s"} found` : " "}</span>
        {hasFilters && <button onClick={reset} className="btn btn-ghost btn-xs gap-1"><RotateCcw size={13} /> Reset filters</button>}
      </div>

      {loading ? (
        <CardSkeletonGrid count={LIMIT} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data && data.items.length ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((t) => <TuitionCard key={t._id} t={t} action={<BookmarkButton tuitionId={t._id} />} />)}
          </div>
          <Pagination page={data.page} pages={data.pages} onChange={(p) => { update({ page: String(p) }, true); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        </>
      ) : (
        <EmptyState title="No tuitions match your search" text="Try a different keyword or clear some filters." action={<button onClick={reset} className="btn btn-primary btn-sm">Clear filters</button>} />
      )}
    </div>
  );
}