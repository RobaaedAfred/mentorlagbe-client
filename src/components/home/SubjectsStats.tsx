"use client";

import Link from "next/link";
import { Atom, Calculator, Code2, Languages, Quote } from "lucide-react";
import { useFetch } from "@/lib/use-fetch";

const subjects = [
  { name: "Math", icon: Calculator, tone: "bg-primary/10 text-primary" },
  { name: "Physics", icon: Atom, tone: "bg-info/10 text-info" },
  { name: "Programming", icon: Code2, tone: "bg-secondary/20 text-warning" },
  { name: "IELTS", icon: Languages, tone: "bg-accent/10 text-accent" },
];

const testimonials = [
  { name: "Rafi C.", role: "HSC student", text: "I found a Physics batch near me in minutes. Applying and tracking the status was effortless." },
  { name: "Nusrat J.", role: "IELTS tutor", text: "Posting my batch and managing applicants from one dashboard saved me hours every week." },
  { name: "Sajid K.", role: "Student", text: "Clear fees, verified tutors and online options — exactly what I needed to start programming." },
];

export default function SubjectsStats() {
  const { data } = useFetch<{ tutors: number; students: number; tuitions: number; subjects: number }>("/stats");
  const stats = [
    { label: "Registered tutors", value: data?.tutors },
    { label: "Active students", value: data?.students },
    { label: "Live tuitions", value: data?.tuitions },
    { label: "Subjects covered", value: data?.subjects },
  ];

  return (
    <section className="container-page py-20">
      <div className="mb-10 text-center">
        <p className="eyebrow">Explore</p>
        <h2 className="section-title mt-2">Top Subjects</h2>
        <p className="section-sub mx-auto">Jump straight into the most in-demand categories.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {subjects.map((s) => (
          <Link key={s.name} href={`/tuitions?search=${s.name}`} className="card-surface group flex flex-col items-center gap-3 p-7 text-center transition hover:-translate-y-1 hover:shadow-lg">
            <span className={`grid h-14 w-14 place-items-center rounded-2xl ${s.tone}`}><s.icon size={26} /></span>
            <span className="font-semibold">{s.name}</span>
          </Link>
        ))}
      </div>

      <div className="mt-14 grid grid-cols-2 gap-4 rounded-3xl bg-neutral p-8 text-neutral-content lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-4xl font-bold text-secondary">{s.value ?? "—"}</p>
            <p className="mt-1 text-sm text-neutral-content/70">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.name} className="card-surface flex h-full flex-col p-7">
            <Quote className="text-primary/40" size={28} />
            <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-base-content/75">{t.text}</blockquote>
            <figcaption className="mt-5 border-t border-base-300 pt-4 text-sm"><span className="font-semibold">{t.name}</span> · <span className="text-base-content/60">{t.role}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}