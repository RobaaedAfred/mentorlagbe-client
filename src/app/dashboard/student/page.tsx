"use client";

import Link from "next/link";
import { CheckCircle2, Clock, Crown, Send } from "lucide-react";
import { PageHeader, StatCard, StatGrid, StatsSkeleton } from "@/components/dashboard/widgets";
import { ErrorState } from "@/components/ui";
import { useAuth } from "@/components/providers/AuthProvider";
import { useFetch } from "@/lib/use-fetch";

export default function StudentOverview() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch<{ total: number; accepted: number; pending: number; saved: number; plan: string }>("/student/stats", true);

  return (
    <>
      <PageHeader title={`Welcome, ${user?.name.split(" ")[0]} 👋`} subtitle="Here is a snapshot of your learning journey." action={<Link href="/tuitions" className="btn btn-primary btn-sm">Find tuitions</Link>} />
      {loading ? <StatsSkeleton /> : error ? <ErrorState message={error} onRetry={reload} /> : data && (
        <StatGrid>
          <StatCard label="Total Applied Tuitions" value={data.total} icon={Send} tone="primary" />
          <StatCard label="Accepted Applications" value={data.accepted} icon={CheckCircle2} tone="success" />
          <StatCard label="Pending Applications" value={data.pending} icon={Clock} tone="secondary" />
          <StatCard label="Current Plan" value={data.plan} icon={Crown} tone="info" hint={data.plan === "free" ? "Upgrade for priority booking" : "Priority booking active"} />
        </StatGrid>
      )}
      {data?.plan === "free" && (
        <div className="card-surface mt-8 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
          <div>
            <h2 className="text-xl font-bold">Go Pro for priority booking</h2>
            <p className="mt-1 text-sm text-base-content/70">One-time $10 payment through Stripe.</p>
          </div>
          <Link href="/pricing" className="btn btn-secondary">Upgrade now</Link>
        </div>
      )}
    </>
  );
}