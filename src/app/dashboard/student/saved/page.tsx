"use client";

import Link from "next/link";
import { PageHeader } from "@/components/dashboard/widgets";
import BookmarkButton from "@/components/BookmarkButton";
import TuitionCard from "@/components/TuitionCard";
import { useAuth } from "@/components/providers/AuthProvider";
import { CardSkeletonGrid, EmptyState, ErrorState } from "@/components/ui";
import { useFetch } from "@/lib/use-fetch";
import type { Tuition } from "@/lib/types";

export default function SavedTuitions() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch<Tuition[]>("/student/bookmarks", true);
  // Un-saving updates the profile's bookmark list, so hide cards that are no longer saved.
  const items = data?.filter((t) => user?.bookmarks.includes(t._id));

  return (
    <>
      <PageHeader title="Saved Tuitions" subtitle="Your bookmarked listings in one place." />
      {loading ? <CardSkeletonGrid count={3} /> : error ? <ErrorState message={error} onRetry={reload} /> : !items?.length ? (
        <EmptyState title="Nothing saved yet" text="Tap the heart on any tuition to save it here." action={<Link href="/tuitions" className="btn btn-primary btn-sm">Browse Tuitions</Link>} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((t) => <TuitionCard key={t._id} t={t} action={<BookmarkButton tuitionId={t._id} />} />)}
        </div>
      )}
    </>
  );
}
