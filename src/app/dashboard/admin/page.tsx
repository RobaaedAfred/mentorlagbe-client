"use client";

import { Clock, DollarSign, GraduationCap, Users } from "lucide-react";
import { PageHeader, StatCard, StatGrid, StatsSkeleton } from "@/components/dashboard/widgets";
import { ErrorState } from "@/components/ui";
import { useFetch } from "@/lib/use-fetch";

interface Stats { totalUsers: number; totalTutors: number; totalStudents: number; pending: number; approved: number; rejected: number; revenue: number }

export default function AdminOverview() {
  const { data, loading, error, reload } = useFetch<Stats>("/admin/stats", true);
  const total = data ? data.pending + data.approved + data.rejected : 0;
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

  return (
    <>
      <PageHeader title="Platform Overview" subtitle="Live statistics across users, tuitions and revenue." />
      {loading ? <StatsSkeleton /> : error ? <ErrorState message={error} onRetry={reload} /> : data && (
        <>
          <StatGrid>
            <StatCard label="Total Users" value={data.totalUsers} icon={Users} tone="primary" hint={`${data.totalStudents} students`} />
            <StatCard label="Total Tutors" value={data.totalTutors} icon={GraduationCap} tone="info" />
            <StatCard label="Pending vs Approved" value={`${data.pending} / ${data.approved}`} icon={Clock} tone="secondary" hint={`${data.rejected} rejected`} />
            <StatCard label="Total Stripe Revenue" value={`$${data.revenue.toLocaleString("en-US")}`} icon={DollarSign} tone="success" />
          </StatGrid>

          <div className="card-surface mt-8 p-6">
            <h2 className="mb-5 text-lg font-bold">Tuition moderation breakdown</h2>
            <div className="space-y-4">
              {[
                { label: "Approved", n: data.approved, bar: "bg-success" },
                { label: "Pending", n: data.pending, bar: "bg-warning" },
                { label: "Rejected", n: data.rejected, bar: "bg-error" },
              ].map((r) => (
                <div key={r.label}>
                  <div className="mb-1.5 flex justify-between text-sm"><span className="font-medium">{r.label}</span><span className="text-base-content/60">{r.n} · {pct(r.n)}%</span></div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-base-300"><div className={`h-full rounded-full ${r.bar} transition-all duration-700`} style={{ width: `${pct(r.n)}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
