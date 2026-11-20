"use client";

import Link from "next/link";
import { BadgeCheck, Crown, LibraryBig, Users } from "lucide-react";
import { PageHeader, StatCard, StatGrid, StatsSkeleton } from "@/components/dashboard/widgets";
import { ErrorState } from "@/components/ui";
import { useAuth } from "@/components/providers/AuthProvider";
import { useFetch } from "@/lib/use-fetch";

export default function TutorOverview() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch<{ total: number; activeApproved: number; applicants: number; plan: string; limit: number | null }>("/tutor/stats", true);

  return (
    <>
      <PageHeader title={`Welcome, ${user?.name.split(" ")[0]} 👋`} subtitle="Manage your tuitions and applicants." action={<Link href="/dashboard/tutor/post-tuition" className="btn btn-primary btn-sm">Post a tuition</Link>} />
      {loading ? <StatsSkeleton /> : error ? <ErrorState message={error} onRetry={reload} /> : data && (
        <StatGrid>
          <StatCard label="Total Tuitions Posted" value={data.total} icon={LibraryBig} tone="primary" hint={data.limit ? `${data.total}/${data.limit} free posts used` : "Unlimited posts"} />
          <StatCard label="Active / Approved" value={data.activeApproved} icon={BadgeCheck} tone="success" />
          <StatCard label="Applicants Received" value={data.applicants} icon={Users} tone="info" />
          <StatCard label="Current Plan" value={data.plan} icon={Crown} tone="secondary" hint={data.plan === "pro" ? "Verified badge active" : "Upgrade for unlimited posts"} />
        </StatGrid>
      )}
      {data?.plan === "free" && (
        <div className="card-surface mt-8 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
          <div>
            <h2 className="text-xl font-bold">Go Pro — unlimited posts & verified badge</h2>
            <p className="mt-1 text-sm text-base-content/70">Free tutors can post up to 2 tuitions. One-time $15 via Stripe.</p>
          </div>
          <Link href="/pricing" className="btn btn-secondary">Upgrade now</Link>
        </div>
      )}
    </>
  );
}
