"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BadgeCheck, BookOpen, CalendarDays, GraduationCap, Info, MapPin, Wifi } from "lucide-react";
import { useAuth } from "./providers/AuthProvider";
import ApplyModal from "./ApplyModal";
import BookmarkButton from "./BookmarkButton";
import { Avatar, ErrorState, PageLoader, StatusBadge } from "./ui";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/use-fetch";
import { formatDate, money } from "@/lib/utils";
import type { ApplicationStatus, TuitionDetails as Details } from "@/lib/types";

export default function TuitionDetails({ id }: { id: string }) {
  const { user, loading: authLoading } = useAuth();
  const { data: t, loading, error, reload } = useFetch<Details>(`/tuitions/${id}`);
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState<{ applied: boolean; status: ApplicationStatus | null } | null>(null);

  const isStudent = user?.role === "student";

  const checkApplied = () => {
    api<{ applied: boolean; status: ApplicationStatus | null }>(`/student/applications/check/${id}`, { auth: true })
      .then(setApplied)
      .catch(() => setApplied(null));
  };

  useEffect(() => {
    if (isStudent) checkApplied();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStudent, id]);

  if (loading) return <PageLoader label="Loading tuition..." />;
  if (error || !t)
    return (
      <div className="container-page py-20">
        <ErrorState message={error ?? "Tuition not found"} onRetry={reload} />
        <div className="mt-6 text-center"><Link href="/tuitions" className="btn btn-primary btn-sm">Back to tuitions</Link></div>
      </div>
    );

  const unavailable = !t.isActive;

  const applyBox = () => {
    if (authLoading) return <button className="btn btn-primary w-full" disabled>Loading...</button>;
    if (!user)
      return (
        <>
          <Link href={`/sign-in?redirect=/tuitions/${id}`} className="btn btn-primary w-full">Sign in to apply</Link>
          <p className="mt-3 text-center text-xs text-base-content/60">Only student accounts can apply.</p>
        </>
      );
    if (!isStudent)
      return (
        <>
          <button className="btn w-full" disabled>Apply Now</button>
          <p className="mt-3 flex items-start gap-2 rounded-lg bg-warning/10 p-3 text-xs text-base-content/70">
            <Info size={15} className="mt-0.5 shrink-0 text-warning" /> Only students can apply for tuitions. You are signed in as a {user.role}.
          </p>
        </>
      );
    if (unavailable) return <button className="btn w-full" disabled>Applications closed</button>;
    if (applied?.applied)
      return (
        <div className="rounded-xl bg-success/10 p-4 text-center">
          <p className="text-sm font-semibold text-success">You have already applied</p>
          {applied.status && <div className="mt-2"><StatusBadge status={applied.status} /></div>}
          <Link href="/dashboard/student/my-applications" className="mt-3 inline-block text-xs font-semibold text-primary hover:underline">View my applications</Link>
        </div>
      );
    return <button className="btn btn-primary w-full" onClick={() => setOpen(true)}>Apply Now</button>;
  };

  return (
    <div className="container-page py-10">
      <Link href="/tuitions" className="text-sm font-medium text-primary hover:underline">← Back to all tuitions</Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="relative overflow-hidden rounded-3xl bg-base-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.bannerImage} alt={t.title} className="h-64 w-full object-cover sm:h-96" />
            <div className="absolute right-4 top-4"><BookmarkButton tuitionId={t._id} /></div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="badge badge-primary gap-1"><BookOpen size={12} /> {t.subject}</span>
            <span className="badge badge-outline gap-1"><GraduationCap size={12} /> {t.classLevel}</span>
            <span className="badge badge-outline gap-1">{t.mode === "Online" ? <Wifi size={12} /> : <MapPin size={12} />} {t.mode}</span>
            {unavailable && <span className="badge badge-error">Closed</span>}
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">{t.title}</h1>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Monthly fee", value: money(t.monthlyFee) },
              { label: "Schedule", value: `${t.daysPerWeek} days / week` },
              { label: "Location", value: t.location },
              { label: "Posted", value: formatDate(t.createdAt) },
            ].map((i) => (
              <div key={i.label} className="card-surface p-4">
                <p className="text-xs text-base-content/50">{i.label}</p>
                <p className="mt-1 break-words text-sm font-semibold">{i.value}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-2xl font-bold">About this tuition</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-base-content/75">{t.description}</p>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="card-surface p-6">
            <p className="text-sm text-base-content/60">Monthly fee</p>
            <p className="mb-5 font-display text-4xl font-bold text-primary">{money(t.monthlyFee)}</p>
            {applyBox()}
          </div>

          <div className="card-surface p-6">
            <h3 className="mb-4 font-sans text-sm font-bold uppercase tracking-wider text-base-content/60">Your tutor</h3>
            <div className="flex items-center gap-3">
              <Avatar name={t.tutor?.name ?? t.tutorName} src={t.tutor?.image} size={56} />
              <div>
                <p className="flex items-center gap-1.5 font-semibold">{t.tutor?.name ?? t.tutorName}
                  {t.tutor?.verified && <BadgeCheck size={17} className="text-primary" aria-label="Verified" />}</p>
                <p className="flex items-center gap-1 text-xs text-base-content/60"><CalendarDays size={12} /> Member since {t.tutor ? formatDate(t.tutor.joinedAt) : "—"}</p>
              </div>
            </div>
            {t.tutor?.bio && <p className="mt-4 text-sm leading-relaxed text-base-content/70">{t.tutor.bio}</p>}
            {t.tutor && <p className="mt-4 text-xs text-base-content/50">{t.tutor.activeTuitions} active tuition{t.tutor.activeTuitions === 1 ? "" : "s"}</p>}
          </div>
        </aside>
      </div>

      {open && <ApplyModal tuitionId={t._id} title={t.title} onClose={() => setOpen(false)} onApplied={checkApplied} />}
    </div>
  );
}