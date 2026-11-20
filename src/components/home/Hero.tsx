"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BadgeCheck, Search, ShieldCheck } from "lucide-react";
import { useFetch } from "@/lib/use-fetch";

const chips = ["Math", "Physics", "IELTS", "Programming"];

export default function Hero() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const { data: stats } = useFetch<{ tutors: number; tuitions: number }>("/stats");

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(q.trim() ? `/tuitions?search=${encodeURIComponent(q.trim())}` : "/tuitions");
  };

  return (
    <section className="relative overflow-hidden bg-base-100">
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
      <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
            <BadgeCheck size={14} /> Every listing is reviewed by our team
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
            Find Your Ideal Tutor or <span className="text-primary">Mentorship Batch</span> Today
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-base-content/70">
            Compare verified tutors by subject, class level and monthly budget. Apply in a minute and follow your application in real time.
          </p>

          <form onSubmit={go} className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-lg sm:flex-row">
            <label className="flex flex-1 items-center gap-2 px-3">
              <Search size={18} className="text-base-content/40" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search subject or tuition title..." className="h-11 w-full bg-transparent text-sm outline-none" />
            </label>
            <button className="btn btn-primary">Find Tutors</button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-base-content/60">
            Popular:
            {chips.map((c) => (
              <Link key={c} href={`/tuitions?search=${c}`} className="rounded-full border border-base-300 px-3 py-1 text-xs font-medium transition hover:border-primary hover:text-primary">{c}</Link>
            ))}
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:150ms]">
          <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
              alt="Students learning together"
              className="h-[420px] w-full object-cover lg:h-[500px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral/50 to-transparent" />
          </div>
          <div className="absolute -left-4 bottom-10 animate-float rounded-2xl border border-base-300 bg-base-100 p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary"><ShieldCheck size={20} /></span>
              <div>
                <p className="text-sm font-bold">Admin-approved</p>
                <p className="text-xs text-base-content/60">every single listing</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-3 top-8 hidden rounded-2xl border border-base-300 bg-base-100 p-4 shadow-xl sm:block">
            <p className="text-2xl font-bold text-primary">{stats ? stats.tuitions : "—"}</p>
            <p className="text-xs text-base-content/60">live tuitions</p>
          </div>
        </div>
      </div>
    </section>
  );
}
