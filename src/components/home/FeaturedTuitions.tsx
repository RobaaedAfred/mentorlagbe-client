"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TuitionCard from "../TuitionCard";
import { CardSkeletonGrid, EmptyState, ErrorState } from "../ui";
import { useFetch } from "@/lib/use-fetch";
import type { Tuition } from "@/lib/types";

export default function FeaturedTuitions() {
  const { data, loading, error, reload } = useFetch<Tuition[]>("/tuitions/featured");

  return (
    <section className="container-page py-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Fresh listings</p>
          <h2 className="section-title mt-2">Featured Tuitions</h2>
          <p className="section-sub">The latest admin-approved batches and 1-on-1 mentorships, ready for enrollment.</p>
        </div>
        <Link href="/tuitions" className="btn btn-outline btn-primary">View all <ArrowRight size={16} /></Link>
      </div>
      {loading ? (
        <CardSkeletonGrid />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data && data.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((t) => <TuitionCard key={t._id} t={t} />)}
        </div>
      ) : (
        <EmptyState title="No tuitions yet" text="Approved tuitions will appear here." />
      )}
    </section>
  );
}