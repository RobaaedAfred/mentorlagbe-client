import Link from "next/link";
import { BookOpen, CalendarDays, GraduationCap, MapPin, Wifi } from "lucide-react";
import type { Tuition } from "@/lib/types";
import { money } from "@/lib/utils";

/** Fixed-height card so every grid stays perfectly even. */
export default function TuitionCard({ t, action }: { t: Tuition; action?: React.ReactNode }) {
  return (
    <article className="group card-surface flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-44 w-full overflow-hidden bg-base-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={t.bannerImage} alt={t.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className={`badge absolute left-3 top-3 gap-1 border-0 font-semibold ${t.mode === "Online" ? "bg-info text-white" : "bg-secondary text-secondary-content"}`}>
          {t.mode === "Online" ? <Wifi size={12} /> : <MapPin size={12} />} {t.mode}
        </span>
        {action && <div className="absolute right-3 top-3">{action}</div>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-base-content/60">
          <span className="flex items-center gap-1 text-primary"><BookOpen size={13} /> {t.subject}</span>
          <span className="flex items-center gap-1"><GraduationCap size={13} /> {t.classLevel}</span>
          <span className="flex items-center gap-1"><CalendarDays size={13} /> {t.daysPerWeek}d/week</span>
        </div>
        <h3 className="line-clamp-2 min-h-[3.5rem] font-display text-lg font-semibold leading-snug">{t.title}</h3>
        <p className="mt-1 truncate text-sm text-base-content/60">by {t.tutorName}</p>
        <div className="mt-auto flex items-center justify-between border-t border-base-300 pt-4">
          <p>
            <span className="text-xl font-bold text-primary">{money(t.monthlyFee)}</span>
            <span className="text-xs text-base-content/50"> /month</span>
          </p>
          <Link href={`/tuitions/${t._id}`} className="btn btn-primary btn-sm">View Details</Link>
        </div>
      </div>
    </article>
  );
}
